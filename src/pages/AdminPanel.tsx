import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import type { PlanPurchase, PaymentScanner, UserProfile, Transaction } from '../lib/supabase'
import {
    ChevronLeft, CreditCard, QrCode, Users, Zap, MessageCircle,
    Smartphone, Check, X, ToggleLeft, ToggleRight, Upload, RefreshCw, BookOpen, Trash2
} from 'lucide-react'

type Tab = 'purchases' | 'scanners' | 'users' | 'transactions' | 'support' | 'devices' | 'team' | 'notifications' | 'settings' | 'templates'
type SupportMsg = { id: string; user_id: string; message: string; is_support: boolean; created_at: string; users?: { display_name?: string } }
type Device = { id: string; user_id: string; device_name: string; last_ping: string | null; is_active: boolean; permissions_granted: { sms: boolean; notifications: boolean } }

const TABS: { id: Tab; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'purchases', label: 'Purchases', icon: <CreditCard size={16} />, color: '#22c55e' },
    { id: 'scanners', label: 'Scanners', icon: <QrCode size={16} />, color: '#3b82f6' },
    { id: 'users', label: 'Users', icon: <Users size={16} />, color: '#a855f7' },
    { id: 'transactions', label: 'Alerts', icon: <Zap size={16} />, color: '#f59e0b' },
    { id: 'support', label: 'Support', icon: <MessageCircle size={16} />, color: '#f97316' },
    { id: 'devices', label: 'Devices', icon: <Smartphone size={16} />, color: '#6b7280' },
    { id: 'team', label: 'Team', icon: <Users size={16} />, color: '#06b6d4' },
    { id: 'notifications', label: 'Notifs', icon: <Zap size={16} />, color: '#f43f5e' },
    { id: 'settings', label: 'Settings', icon: <RefreshCw size={16} />, color: '#a855f7' },
    { id: 'templates', label: 'Templates', icon: <BookOpen size={16} />, color: '#10b981' },
]

// Which tabs each team role can access
const ROLE_TABS: Record<string, Tab[]> = {
    support:    ['support'],
    operations: ['purchases', 'scanners', 'transactions', 'devices'],
    moderator:  ['users', 'transactions', 'support', 'notifications'],
    finance:    ['purchases', 'transactions', 'settings'],
}

const S = {
    card: { background: '#1a1a24', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '14px 16px' } as React.CSSProperties,
    label: { fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: 1 } as React.CSSProperties,
    val: { fontSize: 14, fontWeight: 600, color: '#fff', marginTop: 3 } as React.CSSProperties,
    row: { display: 'flex', flexDirection: 'column', gap: 10 } as React.CSSProperties,
}

export default function AdminPanel() {
    const { profile } = useAuth()
    const navigate = useNavigate()

    const isOwner = profile?.email === 'anishhhog@gmail.com'
    const teamRole = profile?.team_role ?? null
    // Tabs this user is allowed to see
    const allowedTabs: Tab[] = isOwner
        ? TABS.map(t => t.id)
        : teamRole && ROLE_TABS[teamRole]
            ? ROLE_TABS[teamRole]
            : TABS.map(t => t.id) // fallback: all tabs for generic admins
    const visibleTabs = TABS.filter(t => allowedTabs.includes(t.id))

    const [tab, setTab] = useState<Tab>(() => allowedTabs[0] ?? 'purchases')
    const [purchases, setPurchases] = useState<(PlanPurchase & { users?: { display_name?: string; email?: string } })[]>([])
    const [scanners, setScanners] = useState<PaymentScanner[]>([])
    const [users, setUsers] = useState<UserProfile[]>([])
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [supportMsgs, setSupportMsgs] = useState<SupportMsg[]>([])
    const [devices, setDevices] = useState<Device[]>([])
    const [loading, setLoading] = useState(false)
    const [scannerName, setScannerName] = useState('')
    const [scannerUpi, setScannerUpi] = useState('')
    const [scannerFile, setScannerFile] = useState<File | null>(null)
    const [uploadLoading, setUploadLoading] = useState(false)
    const [uploadMsg, setUploadMsg] = useState('')
    const [replyText, setReplyText] = useState<Record<string, string>>({})
    const fileRef = useRef<HTMLInputElement>(null)
    // Team
    const [teamEmail, setTeamEmail] = useState('')
    const [teamPassword, setTeamPassword] = useState('')
    const [teamName, setTeamName] = useState('')
    const [newMemberRole, setNewMemberRole] = useState('support')
    const [teamLoading, setTeamLoading] = useState(false)
    const [teamMsg, setTeamMsg] = useState('')
    const [teamMembers, setTeamMembers] = useState<UserProfile[]>([])
    const [userSearch, setUserSearch] = useState('')
    // Notifications
    const [notifTitle, setNotifTitle] = useState('')
    const [notifMessage, setNotifMessage] = useState('')
    const [notifType, setNotifType] = useState('info')
    const [notifLoading, setNotifLoading] = useState(false)
    const [notifMsg, setNotifMsg] = useState('')
    const [notifications, setNotifications] = useState<{ id: string; title: string; message: string; type: string; is_active: boolean; created_at: string }[]>([])
    // Settings
    const [commissionPct, setCommissionPct] = useState('25')
    const [discountPct, setDiscountPct] = useState('10')
    const [settingsLoading, setSettingsLoading] = useState(false)
    const [settingsMsg, setSettingsMsg] = useState('')
    // Templates
    type OvTemplate = { id: string; name: string; description: string; preview_url: string | null; is_premium: boolean; is_active: boolean; gradient: string; full_code: string; sort_order: number }
    const [templatesList, setTemplatesList] = useState<OvTemplate[]>([])


    useEffect(() => {
        loadTab(tab)

        let interval: ReturnType<typeof setInterval>
        if (tab === 'support') {
            interval = setInterval(() => loadTab(tab, true), 3000)
        }
        return () => clearInterval(interval)
    }, [tab])

    const loadTab = async (t: Tab, silent = false) => {
        if (!silent) setLoading(true)
        try {
            if (t === 'purchases') {
                const { data } = await supabase.from('plan_purchases').select('*, users(display_name, email)').order('created_at', { ascending: false }).limit(80)
                if (data) setPurchases(data as typeof purchases)
            } else if (t === 'scanners') {
                const { data } = await supabase.from('payment_scanners').select('*').order('created_at', { ascending: false })
                if (data) setScanners(data as PaymentScanner[])
            } else if (t === 'users') {
                const { data } = await supabase.from('users').select('*').order('created_at', { ascending: false }).limit(100)
                if (data) setUsers(data as UserProfile[])
            } else if (t === 'transactions') {
                const { data } = await supabase.from('transactions').select('*').order('triggered_at', { ascending: false }).limit(100)
                if (data) setTransactions(data as Transaction[])
            } else if (t === 'support') {
                const { data } = await supabase.from('support_messages').select('*, users(display_name)').order('created_at', { ascending: false }).limit(100)
                if (data) {
                    setSupportMsgs(prev => {
                        if (silent && prev.length === data.length && prev[0]?.id === data[0]?.id) return prev
                        return data as SupportMsg[]
                    })
                }
            } else if (t === 'devices') {
                const { data } = await supabase.from('device_connections').select('*').order('last_ping', { ascending: false }).limit(100)
                if (data) setDevices(data as Device[])
            } else if (t === 'team') {
                const { data } = await supabase.from('users').select('*').eq('is_admin', true).neq('email', 'anishhhog@gmail.com')
                if (data) setTeamMembers(data as UserProfile[])
            } else if (t === 'notifications') {
                const { data } = await supabase.from('app_notifications').select('*').order('created_at', { ascending: false })
                if (data) setNotifications(data)
            } else if (t === 'settings') {
                const { data } = await supabase.from('app_settings').select('*')
                if (data) {
                    data.forEach((row: { key: string; value: string }) => {
                        if (row.key === 'referral_commission_percent') setCommissionPct(row.value)
                        if (row.key === 'referral_discount_percent') setDiscountPct(row.value)
                    })
                }
            } else if (t === 'templates') {
                const { data } = await supabase.from('overlay_templates').select('*').order('sort_order', { ascending: true })
                if (data) setTemplatesList(data as OvTemplate[])
            }
        } catch { }
        if (!silent) setLoading(false)
    }

    const approvePurchase = async (id: string, userId: string, planId: string) => {
        await supabase.from('plan_purchases').update({ status: 'approved' }).eq('id', id)
        await supabase.from('users').update({ plan_id: planId }).eq('id', userId)
        loadTab('purchases')
    }

    const rejectPurchase = async (id: string) => {
        await supabase.from('plan_purchases').update({ status: 'rejected' }).eq('id', id)
        loadTab('purchases')
    }

    const deletePurchase = async (id: string, screenshotUrl: string | null) => {
        if (!window.confirm('Are you sure you want to delete this purchase record?')) return
        if (screenshotUrl) {
            try {
                const pathUrl = screenshotUrl.split('/payment-screenshots/')[1]
                if (pathUrl) await supabase.storage.from('payment-screenshots').remove([pathUrl])
            } catch (e) {
                console.error('Failed to delete screenshot', e)
            }
        }
        await supabase.from('plan_purchases').delete().eq('id', id)
        loadTab('purchases')
    }

    const toggleScanner = async (id: string, isActive: boolean) => {
        if (isActive) await supabase.from('payment_scanners').update({ is_active: false }).neq('id', '__none__')
        await supabase.from('payment_scanners').update({ is_active: isActive }).eq('id', id)
        loadTab('scanners')
    }

    const deleteScanner = async (id: string, imageUrl: string) => {
        if (!window.confirm('Are you sure you want to delete this scanner?')) return
        try {
            const pathUrl = imageUrl.split('/payment-qr/')[1]
            if (pathUrl) {
                await supabase.storage.from('payment-qr').remove([pathUrl])
            }
        } catch (e) {
            console.error('Failed to delete image', e)
        }
        await supabase.from('payment_scanners').delete().eq('id', id)
        loadTab('scanners')
    }

    const uploadScanner = async () => {
        if (!scannerFile || !scannerName || !scannerUpi) { setUploadMsg('Fill all fields'); return }
        setUploadLoading(true); setUploadMsg('')
        const ext = scannerFile.name.split('.').pop()
        const path = `scanners/${Date.now()}.${ext}`
        const { error: upErr } = await supabase.storage.from('payment-qr').upload(path, scannerFile, { upsert: true })
        if (upErr) { setUploadMsg('Upload failed: ' + upErr.message); setUploadLoading(false); return }
        const { data: { publicUrl } } = supabase.storage.from('payment-qr').getPublicUrl(path)
        const { error: dbErr } = await supabase.from('payment_scanners').insert({ name: scannerName, upi_id: scannerUpi, qr_image_url: publicUrl, is_active: false })
        if (dbErr) setUploadMsg('DB error: ' + dbErr.message)
        else { setUploadMsg('✓ Scanner added!'); setScannerName(''); setScannerUpi(''); setScannerFile(null); loadTab('scanners') }
        setUploadLoading(false)
    }

    const [deleteChatConfirmId, setDeleteChatConfirmId] = useState<string | null>(null)

    const sendReply = async (userId: string, msgKey: string) => {
        const text = replyText[msgKey]?.trim()
        if (!text) return
        await supabase.from('support_messages').insert({ user_id: userId, message: text, is_support: true })
        setReplyText(prev => ({ ...prev, [msgKey]: '' }))
        loadTab('support')
    }

    const deleteConversation = async (userId: string) => {
        await supabase.from('support_messages').delete().eq('user_id', userId)
        setDeleteChatConfirmId(null)
        loadTab('support')
    }

    const upgradeUser = async (userId: string, planId: string) => {
        await supabase.from('users').update({ plan_id: planId }).eq('id', userId)
        loadTab('users')
    }

    const toggleAdminUser = async (userId: string, currentIsAdmin: boolean) => {
        await supabase.from('users').update({ is_admin: !currentIsAdmin }).eq('id', userId)
        loadTab('users')
    }

    const toggleBlockUser = async (userId: string, currentIsBlocked: boolean) => {
        await supabase.from('users').update({ is_blocked: !currentIsBlocked }).eq('id', userId)
        loadTab('users')
    }

    const fmtTime = (iso: string) => new Date(iso).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })

    const statusColor = (s: string) => s === 'approved' ? '#22c55e' : s === 'rejected' ? '#ef4444' : '#f59e0b'

    const badge = (text: string, color: string) => (
        <span style={{ background: `${color}18`, border: `1px solid ${color}40`, borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700, color }}>{text.toUpperCase()}</span>
    )

    // Group support messages by user
    const supportByUser = supportMsgs.reduce<Record<string, SupportMsg[]>>((acc, m) => {
        if (!acc[m.user_id]) acc[m.user_id] = []
        acc[m.user_id].push(m)
        return acc
    }, {})

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'var(--font-inter)', paddingBottom: 40 }}>

            {/* Header */}
            <div style={{ padding: '20px 16px 16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, background: 'var(--bg)', zIndex: 10 }}>
                <button onClick={() => navigate('/dashboard')} style={{ background: 'rgba(255,255,255,0.07)', border: 'none', borderRadius: 8, padding: '8px', color: '#fff', cursor: 'pointer', display: 'flex' }}>
                    <ChevronLeft size={20} />
                </button>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>🛡️ Admin Panel</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{profile?.email}</div>
                </div>
                <button onClick={() => loadTab(tab)} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 8, padding: '8px', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}>
                    <RefreshCw size={16} />
                </button>
            </div>

            {/* Tab Bar — horizontal scroll */}
            <div style={{ overflowX: 'auto', display: 'flex', gap: 8, padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', scrollbarWidth: 'none' }}>
                {visibleTabs.map(t => (
                    <button
                        key={t.id}
                        onClick={() => setTab(t.id)}
                        style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', border: tab === t.id ? `1px solid ${t.color}50` : '1px solid rgba(255,255,255,0.06)', background: tab === t.id ? `${t.color}18` : 'transparent', color: tab === t.id ? t.color : 'var(--text-muted)', transition: 'all 0.15s', whiteSpace: 'nowrap' }}
                    >
                        {t.icon} {t.label}
                    </button>
                ))}
            </div>

            <div style={{ padding: '16px' }}>
                {loading && (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
                        <div className="spinner spinner-lg" />
                    </div>
                )}

                {/* ── PURCHASES ── */}
                {!loading && tab === 'purchases' && (
                    <div style={S.row}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>
                            {purchases.filter(p => p.status === 'pending').length} PENDING · {purchases.length} TOTAL
                        </div>
                        {purchases.length === 0 && <div style={{ ...S.card, textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>No purchases yet</div>}
                        {purchases.map(p => (
                            <div key={p.id} style={{ ...S.card, borderLeft: `3px solid ${statusColor(p.status)}` }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                                    <div>
                                        <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>
                                            {(p.users as any)?.display_name ?? (p.users as any)?.email?.split('@')[0] ?? 'User'}
                                        </div>
                                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                                            {(p.users as any)?.email ?? ''}
                                        </div>
                                    </div>
                                    {badge(p.status, statusColor(p.status))}
                                </div>
                                <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
                                    <div>
                                        <div style={S.label}>PLAN</div>
                                        <div style={{ ...S.val, color: '#22c55e' }}>{p.plan_id?.toUpperCase()}</div>
                                    </div>
                                    <div>
                                        <div style={S.label}>AMOUNT</div>
                                        <div style={{ ...S.val, color: '#22c55e' }}>₹{Number(p.amount).toLocaleString('en-IN')}</div>
                                    </div>
                                    <div>
                                        <div style={S.label}>DATE</div>
                                        <div style={S.val}>{new Date(p.created_at).toLocaleDateString('en-IN')}</div>
                                    </div>
                                </div>
                                <div style={{ marginBottom: p.status === 'pending' ? 12 : 0 }}>
                                    <div style={S.label}>UTR / REFERENCE</div>
                                    <div style={{ ...S.val, fontFamily: 'monospace', fontSize: 13, letterSpacing: 0.5, color: '#a855f7' }}>{p.utr_number || '—'}</div>
                                </div>
                                {p.status === 'pending' && (
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button
                                            onClick={() => approvePurchase(p.id, p.user_id, p.plan_id)}
                                            style={{ flex: 1, background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.35)', borderRadius: 10, padding: '11px', fontSize: 13, fontWeight: 700, color: '#22c55e', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                                        >
                                            <Check size={14} /> Approve
                                        </button>
                                        <button
                                            onClick={() => rejectPurchase(p.id)}
                                            style={{ flex: 1, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '11px', fontSize: 13, fontWeight: 700, color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                                        >
                                            <X size={14} /> Reject
                                        </button>
                                    </div>
                                )}
                                {p.status !== 'pending' && (
                                    <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                                        <button
                                            onClick={() => deletePurchase(p.id, p.payment_screenshot_url)}
                                            style={{ flex: 1, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '11px', fontSize: 13, fontWeight: 700, color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                                        >
                                            <Trash2 size={14} /> Delete Record
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* ── SCANNERS ── */}
                {!loading && tab === 'scanners' && (
                    <div style={S.row}>
                        {/* Upload */}
                        <div style={S.card}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: '#3b82f6', marginBottom: 14 }}>+ Add New Scanner</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {[
                                    { val: scannerName, set: setScannerName, placeholder: 'Scanner name (e.g. Main PhonePe QR)' },
                                    { val: scannerUpi, set: setScannerUpi, placeholder: 'UPI ID (e.g. yourname@upi)' },
                                ].map((f, i) => (
                                    <input key={i} value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.placeholder}
                                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '12px 14px', color: '#fff', fontSize: 14, fontFamily: 'var(--font-inter)', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
                                ))}
                                <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => setScannerFile(e.target.files?.[0] ?? null)} />
                                <button onClick={() => fileRef.current?.click()} style={{ background: 'rgba(255,255,255,0.05)', border: '1px dashed rgba(255,255,255,0.15)', borderRadius: 10, padding: '14px', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 13 }}>
                                    {scannerFile ? `📷 ${scannerFile.name}` : '📷 Choose QR Code Image'}
                                </button>
                                {uploadMsg && <div style={{ fontSize: 13, color: uploadMsg.startsWith('✓') ? '#22c55e' : '#ef4444', padding: '8px 0' }}>{uploadMsg}</div>}
                                <button onClick={uploadScanner} disabled={uploadLoading} style={{ background: 'linear-gradient(135deg,#3b82f6,#2563eb)', border: 'none', borderRadius: 10, padding: '14px', fontSize: 14, fontWeight: 700, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                    {uploadLoading ? <div className="spinner" /> : <><Upload size={15} /> Upload Scanner</>}
                                </button>
                            </div>
                        </div>

                        {/* List */}
                        {scanners.map(s => (
                            <div key={s.id} style={{ ...S.card, display: 'flex', gap: 14, alignItems: 'center' }}>
                                <img src={s.qr_image_url} alt={s.name} style={{ width: 56, height: 56, borderRadius: 10, objectFit: 'cover', background: '#fff', flexShrink: 0 }} />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{s.name}</div>
                                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{s.upi_id}</div>
                                </div>
                                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                    <button onClick={() => deleteScanner(s.id, s.qr_image_url)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '6px', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Delete Scanner">
                                        <Trash2 size={16} />
                                    </button>
                                    <button onClick={() => toggleScanner(s.id, !s.is_active)} style={{ flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer', color: s.is_active ? '#22c55e' : 'var(--text-muted)' }}>
                                        {s.is_active ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                                    </button>
                                </div>
                            </div>
                        ))}
                        {scanners.length === 0 && <div style={{ ...S.card, textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>No scanners yet</div>}
                    </div>
                )}

                {/* ── USERS ── */}
                {!loading && tab === 'users' && (
                    <div style={S.row}>
                        {/* Search bar */}
                        <div style={{ position: 'relative' }}>
                            <input
                                value={userSearch}
                                onChange={e => setUserSearch(e.target.value)}
                                placeholder="Search by name or email..."
                                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '11px 14px 11px 38px', color: '#fff', fontSize: 14, fontFamily: 'var(--font-inter)', outline: 'none', boxSizing: 'border-box' }}
                            />
                            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 15, opacity: 0.5 }}>🔍</span>
                            {userSearch && (
                                <button onClick={() => setUserSearch('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>✕</button>
                            )}
                        </div>
                        {/* Count */}
                        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>
                            {userSearch
                                ? `${users.filter(u => (u.display_name ?? '').toLowerCase().includes(userSearch.toLowerCase()) || (u.email ?? '').toLowerCase().includes(userSearch.toLowerCase())).length} of ${users.length} USERS`
                                : `${users.length} USERS`
                            }
                        </div>
                        {users
                            .filter(u => !userSearch || (u.display_name ?? '').toLowerCase().includes(userSearch.toLowerCase()) || (u.email ?? '').toLowerCase().includes(userSearch.toLowerCase()))
                            .map(u => (
                                <div key={u.id} style={S.card}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                                        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#22c55e,#a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                                            {(u.display_name ?? 'U').charAt(0).toUpperCase()}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.display_name ?? '—'}</div>
                                            <div style={{ fontSize: 11, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email ?? '—'}</div>
                                        </div>
                                        {u.is_live && badge('Live', '#ef4444')}
                                        {u.is_admin && badge('Admin', '#a855f7')}
                                        {u.is_blocked && badge('Blocked', '#ef4444')}
                                    </div>
                                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                                        {badge(u.plan_id ?? 'free', '#f59e0b')}
                                        <div style={{ fontSize: 11, color: 'var(--text-muted)', flex: 1 }}>
                                            Joined {new Date(u.created_at).toLocaleDateString('en-IN')}
                                        </div>
                                    </div>
                                    {/* Plan change + admin toggle — hidden for owner account */}
                                    {u.email !== 'anishhhog@gmail.com' && (
                                        <div style={{ display: 'flex', gap: 8, marginTop: 10, alignItems: 'center' }}>
                                            <select
                                                defaultValue={u.plan_id ?? 'free'}
                                                onChange={e => upgradeUser(u.id, e.target.value)}
                                                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '8px 10px', color: '#fff', fontSize: 12, cursor: 'pointer', flex: 1, appearance: 'none' }}
                                            >
                                                {['free', 'starter', 'pro', 'ultra', 'annual', 'lifetime'].map(p => <option key={p} value={p} style={{ background: '#1a1a24', color: '#fff' }}>{p}</option>)}
                                            </select>
                                            <button
                                                onClick={() => toggleAdminUser(u.id, !!u.is_admin)}
                                                style={{ flexShrink: 0, padding: '8px 12px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer', border: u.is_admin ? '1px solid rgba(239,68,68,0.35)' : '1px solid rgba(168,85,247,0.35)', background: u.is_admin ? 'rgba(239,68,68,0.1)' : 'rgba(168,85,247,0.1)', color: u.is_admin ? '#ef4444' : '#a855f7' }}
                                            >
                                                {u.is_admin ? '✕ Remove Admin' : '🛡 Make Admin'}
                                            </button>
                                            <button
                                                onClick={() => toggleBlockUser(u.id, !!u.is_blocked)}
                                                style={{ flexShrink: 0, padding: '8px 12px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer', border: u.is_blocked ? '1px solid rgba(239,68,68,0.35)' : '1px solid rgba(168,85,247,0.35)', background: u.is_blocked ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.05)', color: u.is_blocked ? '#ef4444' : '#fff' }}
                                            >
                                                {u.is_blocked ? '✓ Unblock' : '🚫 Block'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                    </div>
                )}

                {/* ── TRANSACTIONS ── */}
                {!loading && tab === 'transactions' && (
                    <div style={S.row}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>{transactions.length} RECENT ALERTS</div>
                        {transactions.map(tx => (
                            <div key={tx.id} style={{ ...S.card, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{tx.donor_name}</div>
                                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{fmtTime(tx.triggered_at)} · via {tx.source}</div>
                                </div>
                                <div style={{ fontSize: 18, fontWeight: 800, color: '#22c55e' }}>₹{Number(tx.amount).toLocaleString('en-IN')}</div>
                            </div>
                        ))}
                        {transactions.length === 0 && <div style={{ ...S.card, textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>No transactions yet</div>}
                    </div>
                )}

                {/* ── SUPPORT ── */}
                {!loading && tab === 'support' && (
                    <div style={S.row}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>{Object.keys(supportByUser).length} CONVERSATIONS</div>
                        {Object.entries(supportByUser).map(([userId, msgs]) => {
                            const latest = msgs[0]
                            const userName = (latest as any).users?.display_name ?? userId.slice(0, 8)
                            return (
                                <div key={userId} style={{ ...S.card, position: 'relative' }}>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 10 }}>👤 {userName}</div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 200, overflowY: 'auto', marginBottom: 12 }}>
                                        {[...msgs].reverse().map(m => (
                                            <div key={m.id} style={{ display: 'flex', flexDirection: m.is_support ? 'row-reverse' : 'row', gap: 8 }}>
                                                <div style={{ maxWidth: '80%', background: m.is_support ? 'rgba(168,85,247,0.15)' : 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '8px 12px', fontSize: 12, color: m.is_support ? '#a855f7' : 'var(--text-secondary)', lineHeight: 1.6 }}>
                                                    {m.message}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <input
                                            value={replyText[userId] ?? ''}
                                            onChange={e => setReplyText(prev => ({ ...prev, [userId]: e.target.value }))}
                                            placeholder="Reply to user..."
                                            onKeyDown={e => e.key === 'Enter' && sendReply(userId, userId)}
                                            style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '10px 12px', color: '#fff', fontSize: 13, fontFamily: 'var(--font-inter)', outline: 'none' }}
                                        />
                                        <button onClick={() => sendReply(userId, userId)} style={{ background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: 8, padding: '10px 14px', color: '#a855f7', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>Send</button>
                                        <button onClick={() => setDeleteChatConfirmId(userId)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 14px', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Delete Conversation">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    
                                    {/* Custom Delete Confirmation Modal */}
                                    {deleteChatConfirmId === userId && (
                                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 14, zIndex: 10 }}>
                                            <div style={{ background: '#1a1a24', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: 20, width: '90%', maxWidth: 320, textAlign: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
                                                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', margin: '0 auto 16px' }}>
                                                    <Trash2 size={24} />
                                                </div>
                                                <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Delete Conversation?</div>
                                                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.5 }}>
                                                    Are you sure you want to permanently delete all messages with this user? This cannot be undone.
                                                </div>
                                                <div style={{ display: 'flex', gap: 10 }}>
                                                    <button onClick={() => setDeleteChatConfirmId(null)} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Cancel</button>
                                                    <button onClick={() => deleteConversation(userId)} style={{ flex: 1, background: '#ef4444', border: 'none', borderRadius: 8, padding: '10px', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>Delete Chat</button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                        {Object.keys(supportByUser).length === 0 && <div style={{ ...S.card, textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>No support messages yet</div>}
                    </div>
                )}

                {/* ── DEVICES ── */}
                {!loading && tab === 'devices' && (
                    <div style={S.row}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>{devices.length} CONNECTED DEVICES</div>
                        {devices.map(d => {
                            const online = d.last_ping && (Date.now() - new Date(d.last_ping).getTime()) < 5 * 60 * 1000
                            return (
                                <div key={d.id} style={{ ...S.card, display: 'flex', gap: 12, alignItems: 'center' }}>
                                    <div style={{ width: 42, height: 42, borderRadius: 12, background: online ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.05)', border: `1px solid ${online ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.08)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: online ? '#22c55e' : 'var(--text-muted)', flexShrink: 0 }}>
                                        <Smartphone size={20} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{d.device_name}</div>
                                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                                            {d.last_ping ? fmtTime(d.last_ping) : 'Never connected'}
                                        </div>
                                        <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                                            <span style={{ fontSize: 10, fontWeight: 700, color: d.permissions_granted?.sms ? '#22c55e' : '#ef4444' }}>{d.permissions_granted?.sms ? '✓ SMS' : '✗ SMS'}</span>
                                            <span style={{ fontSize: 10, fontWeight: 700, color: d.permissions_granted?.notifications ? '#22c55e' : '#ef4444' }}>{d.permissions_granted?.notifications ? '✓ Notifs' : '✗ Notifs'}</span>
                                        </div>
                                    </div>
                                    {online ? badge('Online', '#22c55e') : badge('Offline', '#6b7280')}
                                </div>
                            )
                        })}
                        {devices.length === 0 && <div style={{ ...S.card, textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>No Android devices connected yet</div>}
                    </div>
                )}

                {/* ── TEAM ── */}
                {!loading && tab === 'team' && (
                    <div style={S.row}>
                        {profile?.email !== 'anishhhog@gmail.com' && (
                            <div style={{ ...S.card, textAlign: 'center', color: '#ef4444', padding: 24 }}>Owner-only section</div>
                        )}
                        {profile?.email === 'anishhhog@gmail.com' && (<>
                            {/* Create team member */}
                            <div style={S.card}>
                                <div style={{ fontSize: 13, fontWeight: 700, color: '#06b6d4', marginBottom: 14 }}>+ Add Team Member</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    {[
                                        { val: teamName, set: setTeamName, placeholder: 'Full name (e.g. Mohika)' },
                                        { val: teamEmail, set: setTeamEmail, placeholder: 'Email address', type: 'email' },
                                        { val: teamPassword, set: setTeamPassword, placeholder: 'Password (min 8 chars)', type: 'password' },
                                    ].map((f, i) => (
                                        <input key={i} value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.placeholder} type={(f as any).type || 'text'}
                                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '12px 14px', color: '#fff', fontSize: 14, fontFamily: 'var(--font-inter)', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
                                    ))}
                                    <select value={newMemberRole} onChange={e => setNewMemberRole(e.target.value)}
                                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '12px 14px', color: '#fff', fontSize: 14, fontFamily: 'var(--font-inter)', outline: 'none' }}>
                                        {['support', 'operations', 'moderator', 'finance'].map(r => <option key={r} value={r} style={{ background: '#1a1a24' }}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                                    </select>
                                    {teamMsg && <div style={{ fontSize: 13, color: teamMsg.startsWith('✓') ? '#22c55e' : '#ef4444', padding: '8px 0' }}>{teamMsg}</div>}
                                    <button onClick={async () => {
                                        if (!teamEmail || !teamPassword) { setTeamMsg('Email and password required'); return }
                                        setTeamLoading(true); setTeamMsg('')
                                        try {
                                            const { data: { session } } = await supabase.auth.getSession()
                                            const res = await fetch(`https://gryucxlpgebaeqxagyoa.supabase.co/functions/v1/create-team-member`, {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token}` },
                                                body: JSON.stringify({ email: teamEmail, password: teamPassword, name: teamName, role: newMemberRole })
                                            })
                                            const json = await res.json()
                                            if (json.error) setTeamMsg('Error: ' + json.error)
                                            else { setTeamMsg('✓ Team member created! They can now log in.'); setTeamEmail(''); setTeamPassword(''); setTeamName(''); loadTab('team') }
                                        } catch (e) { setTeamMsg('Network error') }
                                        setTeamLoading(false)
                                    }} disabled={teamLoading} style={{ background: 'linear-gradient(135deg,#06b6d4,#0891b2)', border: 'none', borderRadius: 10, padding: '14px', fontSize: 14, fontWeight: 700, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                        {teamLoading ? <div className="spinner" /> : '+ Create Team Member'}
                                    </button>
                                </div>
                            </div>
                            {/* Team member list */}
                            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>{teamMembers.length} TEAM MEMBERS</div>
                            {teamMembers.map(m => (
                                <div key={m.id} style={{ ...S.card, display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(6,182,212,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, color: '#06b6d4', flexShrink: 0 }}>
                                        {(m.display_name ?? 'T').charAt(0).toUpperCase()}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{m.display_name ?? '—'}</div>
                                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{m.email}</div>
                                        {(m as any).team_role && <div style={{ fontSize: 10, fontWeight: 700, color: '#06b6d4', marginTop: 3 }}>{((m as any).team_role as string).toUpperCase()}</div>}
                                    </div>
                                    <button onClick={async () => { await supabase.from('users').update({ is_admin: false }).eq('id', m.id); loadTab('team') }}
                                        style={{ flexShrink: 0, padding: '8px 12px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer', border: '1px solid rgba(239,68,68,0.35)', background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
                                        Remove
                                    </button>
                                </div>
                            ))}
                            {teamMembers.length === 0 && <div style={{ ...S.card, textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>No team members yet. Add one above.</div>}
                        </>)}
                    </div>
                )}

                {/* ── NOTIFICATIONS ── */}
                {!loading && tab === 'notifications' && (
                    <div style={S.row}>
                        {/* Compose */}
                        <div style={S.card}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: '#f43f5e', marginBottom: 14 }}>📢 Push Notification</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                <input value={notifTitle} onChange={e => setNotifTitle(e.target.value)} placeholder="Title (e.g. New Feature Available!)" maxLength={80}
                                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '12px 14px', color: '#fff', fontSize: 14, fontFamily: 'var(--font-inter)', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
                                <textarea value={notifMessage} onChange={e => setNotifMessage(e.target.value)} placeholder="Message body..." rows={3} maxLength={300}
                                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '12px 14px', color: '#fff', fontSize: 14, fontFamily: 'var(--font-inter)', outline: 'none', width: '100%', boxSizing: 'border-box', resize: 'vertical' }} />
                                <select value={notifType} onChange={e => setNotifType(e.target.value)}
                                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '12px 14px', color: '#fff', fontSize: 14, fontFamily: 'var(--font-inter)', outline: 'none' }}>
                                    {[{ v: 'info', l: 'ℹ️ Info' }, { v: 'offer', l: '🎁 Offer' }, { v: 'update', l: '🔄 Update' }, { v: 'alert', l: '🚨 Alert' }].map(t => <option key={t.v} value={t.v} style={{ background: '#1a1a24' }}>{t.l}</option>)}
                                </select>
                                {notifMsg && <div style={{ fontSize: 13, color: notifMsg.startsWith('✓') ? '#22c55e' : '#ef4444' }}>{notifMsg}</div>}
                                <button onClick={async () => {
                                    if (!notifTitle.trim() || !notifMessage.trim()) { setNotifMsg('Title and message required'); return }
                                    setNotifLoading(true); setNotifMsg('')
                                    const { error } = await supabase.from('app_notifications').insert({ title: notifTitle.trim(), message: notifMessage.trim(), type: notifType, created_by: profile?.id })
                                    if (error) setNotifMsg('Error: ' + error.message)
                                    else { setNotifMsg('✓ Notification sent to all users!'); setNotifTitle(''); setNotifMessage(''); loadTab('notifications') }
                                    setNotifLoading(false)
                                }} disabled={notifLoading} style={{ background: 'linear-gradient(135deg,#f43f5e,#e11d48)', border: 'none', borderRadius: 10, padding: '14px', fontSize: 14, fontWeight: 700, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                    {notifLoading ? <div className="spinner" /> : '📢 Send to All Users'}
                                </button>
                            </div>
                        </div>
                        {/* Past notifications */}
                        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>{notifications.length} SENT NOTIFICATIONS</div>
                        {notifications.map(n => {
                            const typeColor = n.type === 'offer' ? '#22c55e' : n.type === 'alert' ? '#ef4444' : n.type === 'update' ? '#3b82f6' : '#6b7280'
                            const typeEmoji = n.type === 'offer' ? '🎁' : n.type === 'alert' ? '🚨' : n.type === 'update' ? '🔄' : 'ℹ️'
                            return (
                                <div key={n.id} style={{ ...S.card, opacity: n.is_active ? 1 : 0.5 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <span style={{ fontSize: 14 }}>{typeEmoji}</span>
                                            <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{n.title}</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            <button onClick={async () => { await supabase.from('app_notifications').update({ is_active: !n.is_active }).eq('id', n.id); loadTab('notifications') }}
                                                style={{ padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer', border: n.is_active ? '1px solid rgba(239,68,68,0.35)' : '1px solid rgba(34,197,94,0.35)', background: n.is_active ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)', color: n.is_active ? '#ef4444' : '#22c55e' }}>
                                                {n.is_active ? 'Hide' : 'Show'}
                                            </button>
                                            <button onClick={async () => { await supabase.from('app_notifications').delete().eq('id', n.id); loadTab('notifications') }}
                                                style={{ padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)', color: '#ef4444' }}>Del</button>
                                        </div>
                                    </div>
                                    <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>{n.message}</div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                                        {badge(n.type, typeColor)}
                                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{fmtTime(n.created_at)}</span>
                                    </div>
                                </div>
                            )
                        })}
                        {notifications.length === 0 && <div style={{ ...S.card, textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>No notifications sent yet</div>}
                    </div>
                )}

                {/* ── SETTINGS ── */}
                {!loading && tab === 'settings' && (
                    <div style={S.row}>
                        {/* Referral Settings */}
                        <div style={S.card}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: '#a855f7', marginBottom: 4 }}>⚙️ Referral Settings</div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 18 }}>
                                These values are applied when a plan purchase is approved.
                            </div>

                            {/* Commission % */}
                            <div style={{ marginBottom: 20 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <div>
                                        <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Referrer Commission</div>
                                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>% earned by the referrer on each plan sale</div>
                                    </div>
                                    <div style={{ fontSize: 28, fontWeight: 900, color: '#22c55e', fontFamily: 'var(--font-orbitron)' }}>{commissionPct}%</div>
                                </div>
                                <input type="range" min="1" max="50" value={commissionPct}
                                    onChange={e => setCommissionPct(e.target.value)}
                                    style={{ width: '100%', accentColor: '#22c55e', cursor: 'pointer' }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>
                                    <span>1%</span><span>25%</span><span>50%</span>
                                </div>
                            </div>

                            {/* Discount % */}
                            <div style={{ marginBottom: 20 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <div>
                                        <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Referee Discount</div>
                                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>% discount shown to new users who sign up via referral</div>
                                    </div>
                                    <div style={{ fontSize: 28, fontWeight: 900, color: '#f59e0b', fontFamily: 'var(--font-orbitron)' }}>{discountPct}%</div>
                                </div>
                                <input type="range" min="0" max="30" value={discountPct}
                                    onChange={e => setDiscountPct(e.target.value)}
                                    style={{ width: '100%', accentColor: '#f59e0b', cursor: 'pointer' }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>
                                    <span>0%</span><span>15%</span><span>30%</span>
                                </div>
                            </div>

                            {/* Preview */}
                            <div style={{ background: 'rgba(168,85,247,0.07)', border: '1px solid rgba(168,85,247,0.18)', borderRadius: 10, padding: '12px 14px', marginBottom: 16 }}>
                                <div style={{ fontSize: 12, color: '#a855f7', fontWeight: 700, marginBottom: 6 }}>Live Preview</div>
                                <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                                    • New user gets <span style={{ color: '#f59e0b', fontWeight: 700 }}>{discountPct}% discount</span> on their plan<br />
                                    • Referrer earns <span style={{ color: '#22c55e', fontWeight: 700 }}>{commissionPct}% commission</span> when their plan is approved<br />
                                    • e.g. ₹299 plan → referrer earns ₹{(299 * Number(commissionPct) / 100).toFixed(0)}
                                </div>
                            </div>

                            {settingsMsg && <div style={{ fontSize: 13, color: settingsMsg.startsWith('✓') ? '#22c55e' : '#ef4444', marginBottom: 12 }}>{settingsMsg}</div>}
                            <button
                                disabled={settingsLoading}
                                onClick={async () => {
                                    setSettingsLoading(true); setSettingsMsg('')
                                    const updates = [
                                        supabase.from('app_settings').upsert({ key: 'referral_commission_percent', value: commissionPct, updated_at: new Date().toISOString() }),
                                        supabase.from('app_settings').upsert({ key: 'referral_discount_percent', value: discountPct, updated_at: new Date().toISOString() }),
                                    ]
                                    const results = await Promise.all(updates)
                                    const err = results.find(r => r.error)
                                    setSettingsMsg(err ? 'Error: ' + err.error?.message : '✓ Settings saved!')
                                    setSettingsLoading(false)
                                }}
                                style={{ width: '100%', background: 'linear-gradient(135deg,#a855f7,#7c3aed)', border: 'none', borderRadius: 10, padding: '14px', fontSize: 14, fontWeight: 700, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                            >
                                {settingsLoading ? <div className="spinner" /> : '💾 Save Settings'}
                            </button>
                        </div>
                    </div>
                )}

                {/* ── TEMPLATES ── */}
                {!loading && tab === 'templates' && (
                    <div style={S.row}>
                        {/* Add Template Form */}
                        <div style={S.card}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                                <div style={{ fontSize: 13, fontWeight: 700, color: '#10b981' }}>📐 Add New Template</div>
                                <button onClick={() => navigate('/admin/template-designer')} style={{ background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: 8, padding: '6px 12px', color: '#a855f7', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <BookOpen size={14} /> Open Pro Designer
                                </button>
                            </div>

                        </div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)' }}>{templatesList.length} TEMPLATES</div>
                        {templatesList.map(t => (
                            <div key={t.id} style={{ ...S.card, opacity: t.is_active ? 1 : 0.5 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ width: 80, height: 80, borderRadius: 12, background: t.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden', position: 'relative' }}>
                                        {t.full_code ? (
                                            <div style={{ width: 400, height: 400, transform: 'scale(0.20)', transformOrigin: 'top left', pointerEvents: 'none', position: 'absolute', top: 0, left: 0 }}>
                                                <iframe srcDoc={t.full_code.replace(/setTimeout\(\(\) => \{[\s\S]*?opacity = '0'[\s\S]*?\}, 4000\)/g, '')} style={{ width: '100%', height: '100%', border: 'none' }} sandbox="allow-scripts allow-same-origin" />
                                            </div>
                                        ) : t.preview_url ? (
                                            <img src={t.preview_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <span style={{ fontSize: 24, position: 'relative', zIndex: 1, color: 'rgba(255,255,255,0.2)' }}>🎨</span>
                                        )}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{t.name}</div>
                                            {t.is_premium && <span style={{ fontSize: 10, fontWeight: 800, background: 'rgba(245,158,11,0.2)', color: '#f59e0b', padding: '1px 6px', borderRadius: 4 }}>PRO</span>}
                                            {!t.is_active && <span style={{ fontSize: 10, fontWeight: 800, background: 'rgba(255,255,255,0.07)', color: 'var(--text-muted)', padding: '1px 6px', borderRadius: 4 }}>HIDDEN</span>}
                                        </div>
                                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{t.description}</div>
                                        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 2, fontFamily: 'monospace' }}>{t.id}</div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
                                        <button onClick={() => navigate(`/admin/template-designer?id=${t.id}`)}
                                            style={{ padding: '5px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer', border: '1px solid rgba(59,130,246,0.35)', background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}>
                                            Edit
                                        </button>
                                        <button onClick={async () => { await supabase.from('overlay_templates').update({ is_active: !t.is_active }).eq('id', t.id); loadTab('templates') }}
                                            style={{ padding: '5px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer', border: t.is_active ? '1px solid rgba(239,68,68,0.35)' : '1px solid rgba(34,197,94,0.35)', background: t.is_active ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)', color: t.is_active ? '#ef4444' : '#22c55e' }}>
                                            {t.is_active ? 'Hide' : 'Show'}
                                        </button>
                                        <button onClick={async () => { await supabase.from('overlay_templates').delete().eq('id', t.id); loadTab('templates') }}
                                            style={{ padding: '5px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)', color: '#ef4444' }}>Del</button>
                                    </div>
                                </div>
                                {t.preview_url && <img src={t.preview_url} alt={t.name} style={{ width: '100%', borderRadius: 8, marginTop: 10, objectFit: 'cover', maxHeight: 120 }} />}
                            </div>
                        ))}
                        {templatesList.length === 0 && <div style={{ ...S.card, textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>No templates yet</div>}
                    </div>
                )}
            </div>
        </div>
    )
}
