import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import type { Transaction } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'
import { LogOut, Copy, ExternalLink, BookOpen, Zap, Menu, X, User, HeadphonesIcon, Info, Shield, FileText, Gift, ChevronRight, Flame, Bell } from 'lucide-react'

type TopDonor = { donor_name: string; total: number }

export default function Dashboard() {
    const { profile, refreshProfile, signOut } = useAuth()
    const navigate = useNavigate()
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [todayCount, setTodayCount] = useState(0)
    const [isLive, setIsLive] = useState(false)
    const [copiedOverlay, setCopiedOverlay] = useState(false)
    const [sendOpen, setSendOpen] = useState(false)
    const [testLoading, setTestLoading] = useState(false)
    const [testForm, setTestForm] = useState({ donor_name: '', amount: '', message: '' })
    const [menuOpen, setMenuOpen] = useState(false)
    const [bellOpen, setBellOpen] = useState(false)
    const [selectedApp, setSelectedApp] = useState<'obs' | 'streamlabs_desktop' | 'streamlabs' | 'prisma' | null>(null)
    const [appNotifs, setAppNotifs] = useState<{ id: string; title: string; message: string; type: string; created_at: string }[]>([])
    const [userNotifs, setUserNotifs] = useState<{ id: string; title: string; message: string; type: string; created_at: string }[]>([])
    const [refCode, setRefCode] = useState('')
    const [refLoading, setRefLoading] = useState(false)
    const [refMsg, setRefMsg] = useState('')
    const [refDismissed, setRefDismissed] = useState(() => !!localStorage.getItem('ref_dismissed'))

    useEffect(() => {
        if (!profile) return
        setIsLive(profile.is_live)
        // Fetch broadcast notifications
        supabase.from('app_notifications').select('id,title,message,type,created_at').eq('is_active', true).order('created_at', { ascending: false })
            .then(({ data }) => { if (data) setAppNotifs(data) })
        // Fetch personal unread notifications (welcome etc.) — only last 24 hrs
        const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        supabase.from('user_notifications').select('id,title,message,type,created_at').eq('user_id', profile.id).eq('is_read', false).gte('created_at', since24h).order('created_at', { ascending: false })
            .then(({ data }) => { if (data) setUserNotifs(data) })
        const fetchData = async () => {
            // ... profile fetch logic remains ...
            const { error } = await supabase.from('users').select('*, tts_enabled, tts_voice').eq('id', profile.id).single()
            if (error) console.error("Error fetching updated profile:", error)

            // Fetch live alerts (excluding tests)
            const { data: txs } = await supabase
                .from('transactions')
                .select('*')
                .eq('user_id', profile.id)
                .neq('source', 'Test Alert')
                .order('triggered_at', { ascending: false })
                .limit(50) // Increased limit to make top donors/earnings slightly more accurate

            if (txs) setTransactions(txs as Transaction[])

            // Fetch today's real alerts count directly instead of relying on daily_alert_counts table
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            const todayIso = today.toISOString()

            const { count } = await supabase
                .from('transactions')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', profile.id)
                .neq('source', 'Test Alert')
                .gte('triggered_at', todayIso)

            if (count !== null) setTodayCount(count)
        }
        fetchData()
    }, [profile])

    const toggleLive = async () => {
        if (!profile) return
        const newVal = !isLive
        setIsLive(newVal)
        await supabase.from('users').update({ is_live: newVal }).eq('id', profile.id)
        await refreshProfile()
    }

    const copyOverlayUrl = () => {
        if (!profile) return
        navigator.clipboard.writeText(overlayUrl)
        setCopiedOverlay(true)
        setTimeout(() => setCopiedOverlay(false), 2000)
    }


    const sendTestAlert = async () => {
        if (!profile || !testForm.donor_name || !testForm.amount) return
        setTestLoading(true)
        try {
            // Insert only the columns that exist in the transactions table
            const payload = {
                id: crypto.randomUUID(),
                user_id: profile.id,
                overlay_token: profile.overlay_token,
                donor_name: testForm.donor_name,
                amount: parseFloat(testForm.amount),
                message: testForm.message || null,
                source: 'Test Alert',
                triggered_at: new Date().toISOString()
            }

            const { error: insertError } = await supabase.from('transactions').insert([payload])
            if (insertError) console.error('Test alert insert error:', insertError)

            setTestForm({ donor_name: '', amount: '', message: '' })
            setSendOpen(false)

            // Also test TTS locally on the dashboard if enabled
            if (profile?.tts_enabled) {
                // Short delay to let the overlay pop first
                setTimeout(() => {
                    const text = `${payload.donor_name} paid ₹${payload.amount}${payload.message ? ` and said ${payload.message}` : ''}`
                    const utterance = new SpeechSynthesisUtterance(text)

                    const voices = window.speechSynthesis.getVoices()
                    const ttsVoice = profile?.tts_voice || 'en-US-Standard-A'
                    const selectedVoice = voices.find(v => v.name === ttsVoice)
                    if (selectedVoice) {
                        utterance.voice = selectedVoice
                    }

                    utterance.rate = 1.0;
                    utterance.pitch = 1.1;
                    window.speechSynthesis.speak(utterance)
                }, 500)
            }
        } catch (e) {
            console.error("Error sending test alert:", e)
        }
        setTestLoading(false)
        await refreshProfile()
    }

    const submitReferralCode = async () => {
        if (!refCode.trim() || !profile) return
        setRefLoading(true); setRefMsg('')
        const { data: referrer } = await supabase.from('users').select('id').eq('referral_code', refCode.trim().toUpperCase()).single()
        if (!referrer || referrer.id === profile.id) { setRefMsg('Invalid referral code.'); setRefLoading(false); return }
        if (profile.referred_by) { setRefMsg('You already have a referral applied.'); setRefLoading(false); return }
        await supabase.from('users').update({ referred_by: referrer.id }).eq('id', profile.id)
        await supabase.from('referrals').upsert({ referrer_id: referrer.id, referee_id: profile.id, status: 'pending', commission_amount: 0 }, { onConflict: 'referee_id' })
        setRefMsg('✓ Referral applied! Your friend earns 10% on your plan upgrade.')
        setRefLoading(false)
        setTimeout(() => { localStorage.setItem('ref_dismissed', '1'); setRefDismissed(true) }, 2500)
    }

    const overlayUrl = profile ? `${['localhost', '127.0.0.1', 'capacitor://'].some(sub => window.location.origin.includes(sub)) ? 'https://upialert.live' : window.location.origin}/overlay/${profile.overlay_token}` : ''


    const totalEarned = transactions.reduce((s, t) => s + Number(t.amount), 0)
    const donorMap: Record<string, number> = {}
    transactions.forEach(t => { donorMap[t.donor_name] = (donorMap[t.donor_name] || 0) + Number(t.amount) })
    const topDonors: TopDonor[] = Object.entries(donorMap)
        .map(([donor_name, total]) => ({ donor_name, total }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 5)

    const getSourceIcon = (source: string | null) => {
        const s = (source || '').toLowerCase()
        if (s.includes('phonepe')) return { initial: 'P', color: '#a855f7', bg: 'rgba(168,85,247,0.15)' }
        if (s.includes('google pay') || s.includes('gpay')) return { initial: 'G', color: '#3b82f6', bg: 'rgba(59,130,246,0.15)' }
        if (s.includes('paytm')) return { initial: 'T', color: '#0ea5e9', bg: 'rgba(14,165,233,0.15)' }
        return { initial: 'U', color: '#22c55e', bg: 'rgba(34,197,94,0.15)' }
    }

    const formatTimeAgo = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime()
        const hours = Math.floor(diff / 3600000)
        if (hours < 24) return `${hours}h ago`
        const days = Math.floor(hours / 24)
        return `${days}d ago`
    }

    const avatarColors = ['#22c55e', '#a855f7', '#f59e0b', '#3b82f6', '#ef4444']

    return (
        <div style={{ padding: '0', maxWidth: 480, margin: '0 auto', fontFamily: 'var(--font-inter)', background: 'var(--bg)', minHeight: '100vh' }}>

            {/* Header */}
            <div style={{ padding: '16px 16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: 1 }}>DASHBOARD</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginTop: 2 }}>
                        {profile?.display_name ?? 'User'}
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                    <div style={{
                        padding: '4px 10px', borderRadius: 6,
                        background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)',
                        color: '#f59e0b', fontSize: 11, fontWeight: 700, letterSpacing: 0.5
                    }}>
                        {(profile?.plan_id ?? 'free').toUpperCase()}
                    </div>
                    {/* Bell icon */}
                    <div style={{ position: 'relative' }}>
                        <button
                            onClick={async () => {
                                const opening = !bellOpen
                                setBellOpen(opening)
                                // Mark personal notifications as read when opening
                                if (opening && userNotifs.length > 0 && profile) {
                                    const ids = userNotifs.map(n => n.id)
                                    await supabase.from('user_notifications').update({ is_read: true }).in('id', ids)
                                    setTimeout(() => setUserNotifs([]), 3000)
                                }
                            }}
                            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '7px 9px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}
                        >
                            <Bell size={18} />
                            {(appNotifs.length + userNotifs.length) > 0 && (
                                <span style={{ position: 'absolute', top: -4, right: -4, width: 16, height: 16, borderRadius: '50%', background: '#ef4444', fontSize: 9, fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--bg)' }}>
                                    {(appNotifs.length + userNotifs.length) > 9 ? '9+' : (appNotifs.length + userNotifs.length)}
                                </span>
                            )}
                        </button>
                        {/* Notification dropdown */}
                        {bellOpen && (
                            <>
                                <div onClick={() => setBellOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 98 }} />
                                <div style={{ position: 'absolute', right: 0, top: 44, width: 300, maxWidth: '90vw', background: '#0f1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, zIndex: 99, boxShadow: '0 20px 60px rgba(0,0,0,0.6)', overflow: 'hidden', animation: 'fadeInDown 0.2s ease' }}>
                                    <style>{`@keyframes fadeInDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }`}</style>
                                    <div style={{ padding: '14px 16px 10px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>🔔 Notifications</div>
                                        <button onClick={() => setBellOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}><X size={16} /></button>
                                    </div>
                                    <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                                        {appNotifs.length === 0 && userNotifs.length === 0 && (
                                            <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>No notifications</div>
                                        )}
                                        {/* Personal notifications — disappear after seen */}
                                        {userNotifs.map(n => (
                                            <div key={n.id} style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', gap: 10, alignItems: 'flex-start', background: 'rgba(168,85,247,0.05)' }}>
                                                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(168,85,247,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>👋</div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                                                        <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{n.title}</div>
                                                        <span style={{ fontSize: 9, fontWeight: 800, background: '#a855f7', color: '#fff', padding: '1px 5px', borderRadius: 4 }}>NEW</span>
                                                    </div>
                                                    <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>{n.message}</div>
                                                </div>
                                            </div>
                                        ))}
                                        {/* Broadcast notifications */}
                                        {appNotifs.map(n => {
                                            const emoji = n.type === 'offer' ? '🎁' : n.type === 'alert' ? '🚨' : n.type === 'update' ? '🔄' : 'ℹ️'
                                            const color = n.type === 'offer' ? '#22c55e' : n.type === 'alert' ? '#ef4444' : n.type === 'update' ? '#3b82f6' : '#6b7280'
                                            return (
                                                <div key={n.id} style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                                                    <div style={{ width: 32, height: 32, borderRadius: 8, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{emoji}</div>
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{n.title}</div>
                                                        <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>{n.message}</div>
                                                        <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4, opacity: 0.6 }}>{new Date(n.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    <button
                        onClick={() => setMenuOpen(true)}
                        style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '7px 9px', color: '#fff', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}
                    >
                        <Menu size={18} />
                    </button>
                </div>
            </div>

            {/* Slide-in Menu Drawer */}
            {menuOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        onClick={() => setMenuOpen(false)}
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100, backdropFilter: 'blur(2px)' }}
                    />

                    {/* Drawer */}
                    <div style={{
                        position: 'fixed', top: 0, right: 0, bottom: 0,
                        width: 300, maxWidth: '85vw',
                        background: '#0f1117',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRight: 'none',
                        borderRadius: '20px 0 0 20px',
                        zIndex: 101,
                        display: 'flex', flexDirection: 'column',
                        boxShadow: '-20px 0 60px rgba(0,0,0,0.5)',
                        animation: 'slideInRight 0.25s cubic-bezier(0.16,1,0.3,1)',
                        overflowY: 'auto',
                    }}>
                        <style>{`@keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>

                        {/* Drawer Header */}
                        <div style={{ padding: '20px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>Menu</div>
                            <button onClick={() => setMenuOpen(false)} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 8, padding: 7, color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}>
                                <X size={18} />
                            </button>
                        </div>

                        {/* Profile Card */}
                        <div style={{ margin: '0 16px 20px', background: 'linear-gradient(135deg, rgba(34,197,94,0.1), rgba(168,85,247,0.08))', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 16, padding: '18px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, #22c55e, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                                    {(profile?.display_name ?? 'U').charAt(0).toUpperCase()}
                                </div>
                                <div style={{ minWidth: 0 }}>
                                    <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {profile?.display_name ?? 'User'}
                                    </div>
                                    <div style={{ fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2 }}>
                                        {profile?.upi_id ?? 'No UPI ID set'}
                                    </div>
                                </div>
                            </div>
                            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 6, padding: '3px 10px', fontSize: 11, fontWeight: 700, color: '#f59e0b' }}>
                                    {(profile?.plan_id ?? 'free').toUpperCase()} PLAN
                                </div>
                                {profile?.plan_id !== 'lifetime' && (
                                    <button
                                        onClick={() => { setMenuOpen(false); navigate('/pricing') }}
                                        style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 8, padding: '5px 10px', fontSize: 12, fontWeight: 700, color: '#22c55e', cursor: 'pointer' }}
                                    >
                                        Upgrade ↑
                                    </button>
                                )}
                                <button
                                    onClick={signOut}
                                    style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 8, padding: '5px 12px', fontSize: 12, fontWeight: 700, color: '#ef4444', cursor: 'pointer' }}
                                >
                                    <LogOut size={13} /> Log Out
                                </button>
                            </div>
                        </div>

                        {/* Menu Items */}
                        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
                            {[
                                { icon: <User size={18} />, color: '#22c55e', label: 'My Profile', sub: 'View account details', action: () => { setMenuOpen(false); navigate('/profile') } },
                                { icon: <Flame size={18} />, color: '#f97316', label: 'Go Live', sub: isLive ? 'Currently live 🔴' : 'Start streaming', action: () => { setMenuOpen(false); navigate('/go-live') } },
                                { icon: <Gift size={18} />, color: '#a855f7', label: 'Refer & Earn', sub: 'Earn 25% commission', action: () => { setMenuOpen(false); navigate('/refer') } },
                                { icon: <BookOpen size={18} />, color: '#3b82f6', label: 'Setup Guide', sub: 'OBS & Tasker tutorial', action: () => { setMenuOpen(false); navigate('/setup-guide') } },
                                { icon: <HeadphonesIcon size={18} />, color: '#22c55e', label: 'Contact Support', sub: 'We reply within 24 hrs', action: () => { setMenuOpen(false); navigate('/support') } },
                                { icon: <Info size={18} />, color: '#f59e0b', label: 'About UPIAlert', sub: 'Version 1.0 · Made in India 🇮🇳', action: () => { setMenuOpen(false); navigate('/about') } },
                                { icon: <Shield size={18} />, color: '#6b7280', label: 'Privacy Policy', sub: 'How we handle your data', action: () => { setMenuOpen(false); navigate('/privacy') } },
                                { icon: <FileText size={18} />, color: '#6b7280', label: 'Terms of Service', sub: 'Usage terms & conditions', action: () => { setMenuOpen(false); navigate('/terms') } },
                            ].map((item, i) => (
                                <button
                                    key={i}
                                    onClick={item.action}
                                    style={{ width: '100%', background: 'transparent', border: 'none', borderRadius: 12, padding: '12px 12px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s' }}
                                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                >
                                    <div style={{ width: 38, height: 38, borderRadius: 10, background: `${item.color}15`, border: `1px solid ${item.color}30`, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        {item.icon}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{item.label}</div>
                                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{item.sub}</div>
                                    </div>
                                    <ChevronRight size={14} color="rgba(255,255,255,0.2)" />
                                </button>
                            ))}
                        </div>

                        {/* Sign Out */}
                        <div style={{ padding: '16px' }}>
                            <button
                                onClick={signOut}
                                style={{ width: '100%', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#ef4444', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
                            >
                                <LogOut size={16} /> Sign Out
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, padding: '16px' }}>
                <div style={{ background: '#1a1a24', borderRadius: 12, padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>Total Earned</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>
                        {totalEarned >= 1000 ? `₹${(totalEarned / 1000).toFixed(1)}K` : `₹${totalEarned}`}
                    </div>
                    <div style={{ fontSize: 10, color: '#4ade80' }}>↑ trend</div>
                </div>
                <div style={{ background: '#1a1a24', borderRadius: 12, padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>Today Alerts</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>{todayCount}</div>
                    <div style={{ fontSize: 10, color: 'var(--purple)' }}>🔔 daily</div>
                </div>
                <div style={{ background: '#1a1a24', borderRadius: 12, padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>Donors</div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>{Object.keys(donorMap).length}</div>
                    <div style={{ fontSize: 10, color: '#f59e0b' }}>👥 unique</div>
                </div>
            </div>

            {/* LIVE Status bar */}
            <div style={{ margin: '0 16px 16px', background: isLive ? 'rgba(34,197,94,0.08)' : '#1a1a24', border: `1px solid ${isLive ? 'rgba(34,197,94,0.25)' : 'rgba(255,255,255,0.06)'}`, borderRadius: 12, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: isLive ? '#22c55e' : '#6b7280', boxShadow: isLive ? '0 0 8px #22c55e' : 'none' }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: isLive ? '#22c55e' : 'var(--text-muted)' }}>{isLive ? 'LIVE' : 'OFFLINE'}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        {isLive ? 'Receiving UPI alerts in real-time' : 'Click to go live'}
                    </span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button
                        onClick={toggleLive}
                        style={{ background: isLive ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)', border: `1px solid ${isLive ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)'}`, color: isLive ? '#ef4444' : '#22c55e', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                    >
                        {isLive ? 'Stop' : 'Go Live'}
                    </button>
                    <button
                        onClick={() => setSendOpen(true)}
                        style={{ background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)', color: '#a855f7', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                    >
                        + Test
                    </button>
                </div>
            </div>

            {/* Optional Referral Code Card — shown only if user has no referrer and hasn't dismissed */}
            {!profile?.referred_by && !refDismissed && (
                <div style={{ margin: '0 16px 12px', background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: 14, padding: '14px 16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#a855f7' }}>🎁 Have a referral code?</div>
                        <button onClick={() => { localStorage.setItem('ref_dismissed', '1'); setRefDismissed(true) }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>✕</button>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>Enter a referral code to get 10% extra discount on your plan purchase.</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <input
                            value={refCode}
                            onChange={e => setRefCode(e.target.value.toUpperCase())}
                            placeholder="e.g. ANISHHHOG"
                            maxLength={20}
                            style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(168,85,247,0.25)', borderRadius: 10, padding: '10px 12px', color: '#fff', fontSize: 13, fontFamily: 'var(--font-inter)', outline: 'none', letterSpacing: 1 }}
                        />
                        <button
                            onClick={submitReferralCode}
                            disabled={refLoading || !refCode.trim()}
                            style={{ flexShrink: 0, background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.35)', borderRadius: 10, padding: '10px 16px', fontSize: 13, fontWeight: 700, color: '#a855f7', cursor: 'pointer' }}
                        >
                            {refLoading ? '...' : 'Apply'}
                        </button>
                    </div>
                    {refMsg && <div style={{ marginTop: 8, fontSize: 12, color: refMsg.startsWith('✓') ? '#22c55e' : '#ef4444' }}>{refMsg}</div>}
                </div>
            )}

            {/* Streaming Apps & Overlay */}
            <div style={{ margin: '0 16px 12px', background: '#1a1a24', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e' }} />
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#22c55e', letterSpacing: 1 }}>STREAMING SOFTWARE</span>
                    </div>
                </div>

                {/* App Selector */}
                <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: selectedApp ? 12 : 0, marginBottom: selectedApp ? 8 : 0, scrollbarWidth: 'none' }}>
                    {[
                        { id: 'obs', name: 'OBS Studio', icon: '🎥' },
                        { id: 'streamlabs_desktop', name: 'Streamlabs Desktop', icon: '🖥️' },
                        { id: 'streamlabs', name: 'Streamlabs', icon: '💧' },
                        { id: 'prisma', name: 'Prisma Live Studio', icon: '✨' },
                    ].map(app => (
                        <button
                            key={app.id}
                            onClick={() => setSelectedApp(app.id as any)}
                            style={{
                                flexShrink: 0,
                                background: selectedApp === app.id ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.03)',
                                border: selectedApp === app.id ? '1px solid rgba(34,197,94,0.4)' : '1px solid rgba(255,255,255,0.05)',
                                borderRadius: 10,
                                padding: '8px 12px',
                                color: selectedApp === app.id ? '#22c55e' : '#fff',
                                fontSize: 12,
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: 6,
                                transition: 'all 0.2s'
                            }}
                        >
                            <span>{app.icon}</span> {app.name}
                        </button>
                    ))}
                </div>

                {selectedApp && (
                    <div style={{ animation: 'fadeIn 0.3s ease' }}>
                        <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }`}</style>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, marginTop: 12 }}>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Browser Source URL</div>
                            <button style={{ background: 'transparent', border: 'none', color: '#3b82f6', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', fontWeight: 600 }}>
                                <BookOpen size={12} /> {selectedApp === 'obs' ? 'OBS Guide' : selectedApp === 'prisma' ? 'Prisma Guide' : 'Streamlabs Guide'}
                            </button>
                        </div>

                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)', marginBottom: 10 }}>
                            <div style={{ fontSize: 12, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {overlayUrl || 'https://stream-alert.live/overlay/...'}
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button onClick={copyOverlayUrl} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '9px', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                                <Copy size={14} /> {copiedOverlay ? 'Copied!' : 'Copy URL'}
                            </button>
                            <button onClick={() => window.open(`${overlayUrl}?preview=true`, '_blank')} style={{ flex: 1, background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: 8, padding: '9px', color: '#a855f7', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                                <ExternalLink size={14} /> Preview
                            </button>
                        </div>

                        <button onClick={() => window.location.href = '/voice-settings'} style={{ width: '100%', marginTop: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                            🔊 Configure AI Voice Model Settings
                        </button>
                    </div>
                )}
            </div>


            {/* Top Donors */}
            <div style={{ padding: '0 16px', marginBottom: 24 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                    🏆 Top Donors
                </div>

                {topDonors.length === 0 ? (
                    <div style={{ background: '#1a1a24', borderRadius: 12, padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
                        No donors yet. Share your overlay link to start receiving alerts!
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, background: '#1a1a24', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                        {topDonors.map((d, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '14px 16px', borderBottom: i !== topDonors.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                                <span style={{ fontSize: 12, fontWeight: 700, color: '#f59e0b', width: 28, flexShrink: 0 }}>#{i + 1}</span>
                                <div style={{ width: 34, height: 34, borderRadius: 8, background: `${avatarColors[i]}22`, color: avatarColors[i], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, marginRight: 12, flexShrink: 0 }}>
                                    {d.donor_name.charAt(0).toUpperCase()}
                                </div>
                                <div style={{ flex: 1, fontSize: 14, fontWeight: 600, color: '#fff' }}>{d.donor_name}</div>
                                <div style={{ fontSize: 15, fontWeight: 700, color: '#22c55e' }}>₹{d.total.toLocaleString('en-IN')}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Live Alerts */}
            <div style={{ padding: '0 16px', marginBottom: 32 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Zap size={18} color="#22c55e" /> Live Alerts
                </div>

                {transactions.length === 0 ? (
                    <div style={{ background: '#1a1a24', borderRadius: 12, padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
                        No alerts yet. Test your overlay to see them here!
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {transactions.map((tx, idx) => {
                            const sInfo = getSourceIcon(tx.source)
                            return (
                                <div key={tx.id || idx} style={{ background: '#1a1a24', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                                    {/* Left color bar */}
                                    <div style={{ width: 3, height: 36, background: sInfo.color, borderRadius: 4, flexShrink: 0 }} />

                                    {/* Source App Icon */}
                                    <div style={{ width: 28, height: 28, borderRadius: 6, background: sInfo.bg, color: sInfo.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                                        {sInfo.initial}
                                    </div>

                                    {/* Info */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{tx.donor_name}</div>
                                        <div style={{ fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {tx.message ? `${tx.message}` : (tx.source || 'UPI')} · {formatTimeAgo(tx.triggered_at)}
                                        </div>
                                    </div>

                                    {/* Amount badge */}
                                    <div style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 8, padding: '6px 12px', color: '#22c55e', fontSize: 14, fontWeight: 700, flexShrink: 0 }}>
                                        ₹{Number(tx.amount).toLocaleString('en-IN')}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Test Alert Modal */}
            {sendOpen && (
                <div className="modal-backdrop" onClick={() => setSendOpen(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div style={{ fontSize: 16, fontWeight: 700, color: '#22c55e', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Zap size={18} /> Send Test Alert
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <div className="input-group">
                                <label className="input-label">Donor Name</label>
                                <input className="input" placeholder="e.g. Rahul Kumar" value={testForm.donor_name}
                                    onChange={e => setTestForm(f => ({ ...f, donor_name: e.target.value }))} />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Amount (₹)</label>
                                <input className="input" type="number" placeholder="e.g. 100" value={testForm.amount}
                                    onChange={e => setTestForm(f => ({ ...f, amount: e.target.value }))} />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Message (optional)</label>
                                <input className="input" placeholder="e.g. Keep it up!" value={testForm.message}
                                    onChange={e => setTestForm(f => ({ ...f, message: e.target.value }))} />
                            </div>
                            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                                <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setSendOpen(false)}>Cancel</button>
                                <button className="btn btn-primary" style={{ flex: 1 }} onClick={sendTestAlert} disabled={testLoading || !testForm.donor_name || !testForm.amount}>
                                    {testLoading ? <div className="spinner" /> : 'Send Alert'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
