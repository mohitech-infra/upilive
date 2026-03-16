import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import type { Referral, WithdrawalRequest } from '../lib/supabase'
import { Copy, Check, Share2 } from 'lucide-react'

export default function ReferEarn() {
    const { profile } = useAuth()
    const [referrals, setReferrals] = useState<Referral[]>([])
    const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([])
    const [copied, setCopied] = useState(false)
    const [copiedLink, setCopiedLink] = useState(false)
    const [withdrawOpen, setWithdrawOpen] = useState(false)
    const [withdrawAmount, setWithdrawAmount] = useState('')
    const [withdrawUpi, setWithdrawUpi] = useState('')
    const [withdrawLoading, setWithdrawLoading] = useState(false)
    const [withdrawMsg, setWithdrawMsg] = useState('')
    const [commissionPct, setCommissionPct] = useState(25)
    const [discountPct, setDiscountPct] = useState(10)

    useEffect(() => {
        if (!profile?.id) return
        const fetchData = async () => {
            const { data: r } = await supabase.from('referrals').select('*, referee:users!referrals_referee_id_fkey(display_name, email, avatar_url)').eq('referrer_id', profile.id).order('created_at', { ascending: false })
            if (r) setReferrals(r as any[])
            const { data: w } = await supabase.from('withdrawal_requests').select('*').eq('user_id', profile.id).order('created_at', { ascending: false })
            if (w) setWithdrawals(w as WithdrawalRequest[])
            // Fetch dynamic settings
            const { data: settings } = await supabase.from('app_settings').select('key, value')
            if (settings) {
                settings.forEach((s: { key: string; value: string }) => {
                    if (s.key === 'referral_commission_percent') setCommissionPct(Number(s.value))
                    if (s.key === 'referral_discount_percent') setDiscountPct(Number(s.value))
                })
            }

        }
        fetchData()
    }, [profile])

    const BASE_URL = ['localhost', '127.0.0.1', 'capacitor://'].some(sub => window.location.origin.includes(sub)) ? 'https://upialertlive.netlify.app' : window.location.origin
    const referralLink = profile ? `${BASE_URL}/login?ref=${profile.referral_code}` : ''
    const referralCode = profile?.referral_code ?? '--------'

    const copyCode = () => {
        navigator.clipboard.writeText(referralCode)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const copyLink = () => {
        navigator.clipboard.writeText(referralLink)
        setCopiedLink(true)
        setTimeout(() => setCopiedLink(false), 2000)
    }

    const shareLink = () => {
        if (navigator.share) {
            navigator.share({ title: 'UPIAlert Live', text: 'Join UPIAlert Live with my referral link!', url: referralLink })
        } else {
            copyLink()
        }
    }

    const approvedEarnings = referrals.filter(r => r.status === 'approved').reduce((s, r) => s + Number(r.commission_amount), 0)
    const paidEarnings = referrals.filter(r => r.status === 'paid').reduce((s, r) => s + Number(r.commission_amount), 0)
    const totalEarned = approvedEarnings + paidEarnings
    const withdrawableAmount = approvedEarnings - withdrawals.filter(w => w.status !== 'rejected').reduce((s, w) => s + Number(w.amount), 0)

    const handleWithdraw = async () => {
        if (!profile || !withdrawAmount || parseFloat(withdrawAmount) < 100) return
        setWithdrawLoading(true)
        setWithdrawMsg('')
        const { error } = await supabase.from('withdrawal_requests').insert({
            user_id: profile.id,
            amount: parseFloat(withdrawAmount),
            upi_id: withdrawUpi || profile.upi_id || '',
        })
        setWithdrawLoading(false)
        if (error) { setWithdrawMsg('Error: ' + error.message) }
        else {
            setWithdrawMsg('Withdrawal request submitted! Payout within 48 hours.')
            setWithdrawAmount('')
            setWithdrawUpi('')
            setTimeout(() => setWithdrawOpen(false), 2000)
        }
    }

    const statusActive = referrals.length > 0 ? 'Active' : 'Inactive'
    const avatarColors = ['#a855f7', '#22c55e', '#3b82f6', '#f59e0b', '#ef4444']

    return (
        <div style={{ padding: '0 0 32px', fontFamily: 'var(--font-inter)', background: 'var(--bg)', minHeight: '100vh' }}>

            {/* Header */}
            <div style={{ padding: '20px 16px 4px' }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 2 }}>Refer & Earn</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Earn {commissionPct}% commission on every referral · {discountPct}% discount for your referees</div>
            </div>

            {/* Big Commission Card */}
            <div style={{ margin: '16px 16px', background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 16, padding: '24px 20px' }}>
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                    <div style={{ fontSize: 56, fontWeight: 900, color: '#22c55e', lineHeight: 1, fontFamily: 'var(--font-orbitron)' }}>{commissionPct}%</div>
                    <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 4, fontWeight: 500 }}>Commission Rate</div>
                </div>

                {/* Stats Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>{referrals.length}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Referred</div>
                    </div>
                    <div style={{ textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.1)', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
                        <div style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>₹{totalEarned.toLocaleString('en-IN')}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Earned</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 20, fontWeight: 700, color: '#22c55e' }}>{statusActive}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Status</div>
                    </div>
                </div>
            </div>

            {/* How It Works */}
            <div style={{ padding: '0 16px', marginBottom: 20 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 12 }}>How It Works</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[
                        { icon: '🔗', text: 'Share your referral link or code with other streamers' },
                        { icon: '👤', text: 'They sign up and purchase any paid plan' },
                        { icon: '💰', text: `You instantly earn ${commissionPct}% commission on their purchase` },
                    ].map((step, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, background: '#1a1a24', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '14px' }}>
                            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>
                                {i + 1}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <span style={{ fontSize: 18 }}>{step.icon}</span>
                                <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{step.text}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Referral Code */}
            <div style={{ padding: '0 16px', marginBottom: 20 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 12 }}>Your Referral Code</div>
                <div style={{ background: '#111318', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '20px 18px', marginBottom: 10 }}>
                    <div style={{ fontFamily: 'var(--font-orbitron)', fontWeight: 700, fontSize: 22, color: '#fff', letterSpacing: 4, textAlign: 'center', marginBottom: 2 }}>
                        {referralCode}
                    </div>
                </div>
                <button
                    onClick={copyCode}
                    style={{ width: '100%', background: copied ? '#22c55e' : 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 12, padding: '14px', fontSize: 14, fontWeight: 700, color: copied ? '#000' : '#22c55e', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s' }}
                >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? 'Copied!' : 'Copy Code'}
                </button>
            </div>

            {/* Referral Link */}
            <div style={{ padding: '0 16px', marginBottom: 20 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 12 }}>Referral Link</div>
                <div style={{ background: '#111318', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '12px 14px', marginBottom: 10, overflow: 'hidden' }}>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {referralLink || 'https://stream-alert-live--anish.app/join?ref=...'}
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button
                        onClick={copyLink}
                        style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px', fontSize: 13, fontWeight: 600, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                    >
                        <Copy size={14} /> {copiedLink ? 'Copied' : 'Copy'}
                    </button>
                    <button
                        onClick={shareLink}
                        style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px', fontSize: 13, fontWeight: 600, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                    >
                        <Share2 size={14} /> Share
                    </button>
                </div>
            </div>

            {/* Commission Breakdown */}
            <div style={{ padding: '0 16px', marginBottom: 20 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 12 }}>Commission Breakdown</div>
                <div style={{ background: '#1a1a24', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, overflow: 'hidden' }}>
                    {[
                        { plan: '₹299/Month', price: 299 },
                        { plan: '₹599/3 Month', price: 599 },
                        { plan: '₹799/8 Month', price: 799 },
                        { plan: '₹1499/Year', price: 1499 },
                        { plan: '₹5999/Lifetime', price: 5999 },
                    ].map((row, i, arr) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                            <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{row.plan}</span>
                            <span style={{
                                fontSize: 14,
                                fontWeight: 700,
                                color: i === 4 ? '#f97316' : '#22c55e',
                                background: i === 4 ? 'rgba(249,115,22,0.12)' : 'rgba(34,197,94,0.12)',
                                padding: '4px 12px',
                                borderRadius: 8,
                            }}>
                                ₹{(row.price * commissionPct / 100).toFixed(0)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Referral History */}
            {referrals.length > 0 && (
                <div style={{ padding: '0 16px', marginBottom: 20 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 12 }}>Referral History</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {referrals.map((r: any, i) => {
                            const refereeName = r.referee?.display_name || 'User'
                            const initial = refereeName.charAt(0).toUpperCase()
                            return (
                                <div key={r.id} style={{ background: '#1a1a24', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ width: 36, height: 36, borderRadius: 10, background: `${avatarColors[i % avatarColors.length]}22`, color: avatarColors[i % avatarColors.length], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, flexShrink: 0 }}>
                                        {r.referee?.avatar_url ? (
                                            <img src={r.referee.avatar_url} alt={refereeName} style={{ width: '100%', height: '100%', borderRadius: 10, objectFit: 'cover' }} />
                                        ) : initial}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 2 }}>
                                            {refereeName}
                                        </div>
                                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                                            {new Date(r.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} · {r.plan_id ? `${r.plan_id}` : 'Signed up'}
                                        </div>
                                    </div>
                                    <div style={{ fontSize: 15, fontWeight: 700, color: '#22c55e' }}>
                                        +₹{Number(r.commission_amount).toLocaleString('en-IN')}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Note */}
            <div style={{ padding: '0 16px', fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6, display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                <span style={{ fontSize: 14, flexShrink: 0 }}>ⓘ</span>
                <span>Commissions are paid out monthly via UPI. Minimum withdrawal: ₹100</span>
            </div>

            {/* Withdraw Modal */}
            {withdrawOpen && (
                <div className="modal-backdrop" onClick={() => setWithdrawOpen(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 20 }}>Withdraw Earnings</div>
                        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>Available: ₹{Math.max(0, withdrawableAmount).toLocaleString('en-IN')}</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <div className="input-group">
                                <label className="input-label">Amount (Min ₹100)</label>
                                <input className="input" type="number" min="100" max={withdrawableAmount} placeholder="₹100" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Your UPI ID</label>
                                <input className="input" placeholder="yourname@upi" value={withdrawUpi} onChange={e => setWithdrawUpi(e.target.value)} />
                            </div>
                            {withdrawMsg && <div style={{ padding: '12px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 8, fontSize: 13, color: '#22c55e' }}>{withdrawMsg}</div>}
                            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                                <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setWithdrawOpen(false)}>Cancel</button>
                                <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleWithdraw} disabled={withdrawLoading || parseFloat(withdrawAmount) < 100 || !withdrawUpi.trim()}>
                                    {withdrawLoading ? <div className="spinner" /> : 'Request Payout'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
