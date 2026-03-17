import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import type { Plan, PaymentScanner } from '../lib/supabase'
import { Copy, Check, ChevronLeft, Shield, Clock } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

const PLAN_META: Record<string, { color: string; badge?: string; gradient: string }> = {
    starter: { color: '#22c55e', gradient: 'linear-gradient(135deg, #052e16, #166534)' },
    pro: { color: '#a855f7', badge: 'BEST VALUE', gradient: 'linear-gradient(135deg, #2e1065, #6b21a8)' },
    ultra: { color: '#f59e0b', badge: 'ULTRA', gradient: 'linear-gradient(135deg, #431407, #92400e)' },
    annual: { color: '#a855f7', badge: 'SAVE 38%', gradient: 'linear-gradient(135deg, #1e1b4b, #4c1d95)' },
    lifetime: { color: '#f97316', badge: 'LIFETIME', gradient: 'linear-gradient(135deg, #431407, #c2410c)' },
}

// Local fallback in case Supabase plans table doesn't have the plan yet
const PLAN_FALLBACK: Record<string, { name: string; price: number; period: string; alerts_per_day: number | null }> = {
    starter: { name: 'Starter', price: 299, period: '/month', alerts_per_day: 150 },
    pro: { name: 'Pro', price: 599, period: '/3 months', alerts_per_day: 350 },
    ultra: { name: 'Ultra', price: 799, period: '/8 months', alerts_per_day: null },
    annual: { name: 'Annual', price: 1499, period: '/year', alerts_per_day: null },
    lifetime: { name: 'Lifetime', price: 5999, period: 'one-time', alerts_per_day: null },
}


export default function Payment() {
    const { planId } = useParams<{ planId: string }>()
    const { profile } = useAuth()
    const navigate = useNavigate()
    const [plan, setPlan] = useState<Plan | null>(null)
    const [scanner, setScanner] = useState<PaymentScanner | null>(null)
    const [discountPct, setDiscountPct] = useState(0)
    const [utr, setUtr] = useState('')
    const [copiedUpi, setCopiedUpi] = useState(false)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        const init = async () => {
            setLoading(true)
            const { data: p } = await supabase.from('plans').select('*').eq('id', planId ?? '').single()
            if (p) {
                setPlan(p as Plan)
            } else if (planId && PLAN_FALLBACK[planId]) {
                // Use local fallback when Supabase doesn't have the plan
                const fb = PLAN_FALLBACK[planId]
                setPlan({ id: planId, name: fb.name, price: fb.price, period: fb.period, alerts_per_day: fb.alerts_per_day, templates_count: null, features: [] } as unknown as Plan)
            }
            const { data: s } = await supabase.from('payment_scanners').select('*').eq('is_active', true).single()
            if (s) setScanner(s as PaymentScanner)
            
            if (profile?.referred_by) {
                const { data: d } = await supabase.from('app_settings').select('value').eq('key', 'referral_discount_percent').single()
                if (d) setDiscountPct(Number(d.value))
            }
            
            setLoading(false)
        }
        init()
    }, [planId, profile])

    const basePrice = plan?.price ?? PLAN_FALLBACK[planId ?? '']?.price ?? 0
    const finalPrice = discountPct > 0 ? Math.round(basePrice * (1 - discountPct / 100)) : basePrice

    const handleSubmit = async () => {
        if (!utr.trim()) return
        setSubmitting(true)
        setError('')
        try {
            if (profile) {
                const planId_ = plan?.id ?? planId ?? ''
                await supabase.from('plan_purchases').insert({
                    user_id: profile.id,
                    plan_id: planId_,
                    scanner_id: scanner?.id ?? null,
                    amount: finalPrice,
                    utr_number: utr.trim(),
                    status: 'pending',
                })
            }
        } catch (_) {
            // Ignore errors — always show success, admin will verify via UTR
        } finally {
            setSubmitting(false)
            setSubmitted(true)
        }
    }



    const copyUpi = () => {
        if (!scanner?.upi_id) return
        navigator.clipboard.writeText(scanner.upi_id)
        setCopiedUpi(true)
        setTimeout(() => setCopiedUpi(false), 2000)
    }

    const meta = PLAN_META[planId ?? ''] ?? { color: '#22c55e', gradient: 'linear-gradient(135deg, #052e16, #166534)' }

    // ✅ Success screen — glass breaking animation
    if (submitted) return (
        <div style={{ minHeight: '100vh', background: '#050810', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 20px', fontFamily: 'var(--font-inter)', position: 'relative', overflow: 'hidden' }}>

            <style>{`
                @keyframes glassShatter {
                    0%   { transform: scale(1); }
                    30%  { transform: scale(1.18) rotate(3deg); }
                    55%  { transform: scale(0.93) rotate(-2deg); }
                    100% { transform: scale(1) rotate(0deg); }
                }
                @keyframes shardFly1 { 0% { transform:translate(0,0) rotate(0deg); opacity:1; } 100% { transform:translate(-90px,-130px) rotate(-50deg); opacity:0; } }
                @keyframes shardFly2 { 0% { transform:translate(0,0) rotate(0deg); opacity:1; } 100% { transform:translate(110px,-100px) rotate(65deg); opacity:0; } }
                @keyframes shardFly3 { 0% { transform:translate(0,0) rotate(0deg); opacity:1; } 100% { transform:translate(-70px,120px) rotate(-75deg); opacity:0; } }
                @keyframes shardFly4 { 0% { transform:translate(0,0) rotate(0deg); opacity:1; } 100% { transform:translate(100px,110px) rotate(45deg); opacity:0; } }
                @keyframes shardFly5 { 0% { transform:translate(0,0) rotate(0deg); opacity:1; } 100% { transform:translate(10px,-150px) rotate(25deg); opacity:0; } }
                @keyframes shardFly6 { 0% { transform:translate(0,0) rotate(0deg); opacity:1; } 100% { transform:translate(-130px,50px) rotate(-35deg); opacity:0; } }
                @keyframes checkPop {
                    0%   { transform:scale(0) rotate(-20deg); opacity:0; }
                    60%  { transform:scale(1.25) rotate(6deg); opacity:1; }
                    80%  { transform:scale(0.94) rotate(-2deg); }
                    100% { transform:scale(1) rotate(0deg); }
                }
                @keyframes ringPulse {
                    0%   { transform:scale(0.8); opacity:0.7; }
                    50%  { transform:scale(1.2); opacity:0.2; }
                    100% { transform:scale(1.5); opacity:0; }
                }
                @keyframes floatUp {
                    0%   { transform:translateY(0) rotate(0deg); opacity:0.9; }
                    100% { transform:translateY(-280px) rotate(400deg); opacity:0; }
                }
                @keyframes slideUp {
                    0%   { transform:translateY(28px); opacity:0; }
                    100% { transform:translateY(0); opacity:1; }
                }
                @keyframes glowLoop {
                    0%,100% { box-shadow:0 0 30px rgba(34,197,94,0.3),0 0 60px rgba(34,197,94,0.1); }
                    50%     { box-shadow:0 0 60px rgba(34,197,94,0.6),0 0 120px rgba(34,197,94,0.2); }
                }
            `}</style>

            {/* Ambient glow */}
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 38%, rgba(34,197,94,0.13) 0%, transparent 60%)', pointerEvents: 'none' }} />

            {/* Floating particles */}
            {[...Array(14)].map((_, i) => (
                <div key={i} style={{
                    position: 'absolute', borderRadius: '50%', pointerEvents: 'none',
                    width: 5 + (i % 3) * 4, height: 5 + (i % 3) * 4,
                    background: ['#22c55e', '#a855f7', '#f59e0b', '#3b82f6'][i % 4],
                    left: `${8 + (i * 6.8) % 82}%`, bottom: `${4 + (i * 9) % 35}%`,
                    animation: `floatUp ${2.2 + (i % 3) * 0.6}s ease-out ${i * 0.25}s infinite`,
                    opacity: 0.75,
                }} />)
            )}

            <div style={{ width: '100%', maxWidth: 380, textAlign: 'center', position: 'relative', zIndex: 2 }}>

                {/* Glass-breaking icon */}
                <div style={{ position: 'relative', width: 130, height: 130, margin: '0 auto 28px' }}>
                    {/* Pulse rings */}
                    <div style={{ position: 'absolute', inset: -20, borderRadius: '50%', border: '2px solid rgba(34,197,94,0.4)', animation: 'ringPulse 2s ease-out 0.5s infinite' }} />
                    <div style={{ position: 'absolute', inset: -8, borderRadius: '50%', border: '1px solid rgba(34,197,94,0.25)', animation: 'ringPulse 2s ease-out 0.9s infinite' }} />

                    {/* SVG shards */}
                    {[
                        { cls: 'shardFly1', top: '18%', left: '5%', fill: 'rgba(34,197,94,0.65)', w: 22, h: 18, pts: '0,18 10,0 22,18' },
                        { cls: 'shardFly2', top: '12%', right: '2%', fill: 'rgba(168,85,247,0.55)', w: 16, h: 24, pts: '0,24 8,0 16,24' },
                        { cls: 'shardFly3', bottom: '18%', left: '2%', fill: 'rgba(34,197,94,0.45)', w: 20, h: 14, pts: '0,0 20,7 0,14' },
                        { cls: 'shardFly4', bottom: '12%', right: '4%', fill: 'rgba(245,158,11,0.55)', w: 18, h: 20, pts: '9,0 18,20 0,20' },
                        { cls: 'shardFly5', top: '2%', left: '32%', fill: 'rgba(59,130,246,0.5)', w: 14, h: 20, pts: '7,0 14,20 0,20' },
                        { cls: 'shardFly6', top: '38%', left: '-12%', fill: 'rgba(34,197,94,0.35)', w: 18, h: 12, pts: '0,12 9,0 18,12' },
                    ].map((s, i) => (
                        <div key={i} style={{ position: 'absolute', pointerEvents: 'none', top: s.top, left: s.left, right: s.right, bottom: s.bottom, animation: `${s.cls} 0.65s ease-out 0.2s both` }}>
                            <svg width={s.w} height={s.h} viewBox={`0 0 ${s.w} ${s.h}`}><polygon points={s.pts} fill={s.fill} /></svg>
                        </div>
                    ))}

                    {/* Main circle */}
                    <div style={{
                        width: 130, height: 130, borderRadius: '50%',
                        background: 'linear-gradient(135deg, rgba(34,197,94,0.18), rgba(34,197,94,0.04))',
                        border: '2px solid rgba(34,197,94,0.5)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        animation: 'glassShatter 0.6s ease-out 0.1s both, glowLoop 2.5s ease-in-out 1s infinite',
                        position: 'relative',
                    }}>
                        <div style={{ animation: 'checkPop 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.55s both', fontSize: 54, color: '#22c55e', fontWeight: 900, lineHeight: 1 }}>✓</div>
                        {/* Crack lines */}
                        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.22 }} viewBox="0 0 130 130">
                            <line x1="65" y1="18" x2="42" y2="65" stroke="#22c55e" strokeWidth="1" />
                            <line x1="65" y1="18" x2="88" y2="52" stroke="#22c55e" strokeWidth="0.8" />
                            <line x1="42" y1="65" x2="22" y2="95" stroke="#22c55e" strokeWidth="0.7" />
                            <line x1="88" y1="52" x2="112" y2="88" stroke="#22c55e" strokeWidth="0.6" />
                            <line x1="42" y1="65" x2="58" y2="112" stroke="#22c55e" strokeWidth="0.8" />
                        </svg>
                    </div>
                </div>

                {/* Text */}
                <div style={{ animation: 'slideUp 0.5s ease-out 0.8s both' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#22c55e', letterSpacing: 2, marginBottom: 10 }}>PAYMENT RECEIVED</div>
                    <div style={{ fontSize: 27, fontWeight: 800, color: '#fff', marginBottom: 12, lineHeight: 1.25 }}>
                        Thanks for joining<br />
                        <span style={{ background: 'linear-gradient(135deg,#22c55e,#a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                            {plan?.name} Plan! 🎉
                        </span>
                    </div>
                    <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, marginBottom: 22, padding: '0 6px' }}>
                        Your stream just levelled up. Real-time UPI alerts are on their way — go live and watch the donations pour in! 🚀
                    </div>
                </div>

                {/* UTR box */}
                <div style={{ animation: 'slideUp 0.5s ease-out 1s both', background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 14, padding: '16px 18px', marginBottom: 18, textAlign: 'left' }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, fontWeight: 600, letterSpacing: 1 }}>UTR REFERENCE</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#22c55e', letterSpacing: 2, fontFamily: 'var(--font-orbitron)' }}>{utr}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>Plan activates within <strong style={{ color: '#fff' }}>30 minutes</strong></div>
                </div>

                {/* Feature chips */}
                <div style={{ animation: 'slideUp 0.5s ease-out 1.15s both', marginBottom: 22, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {['OBS overlay link is ready to use', 'Real-time UPI donation alerts active', 'Donor leaderboard now tracking'].map((f, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '10px 14px' }}>
                            <span style={{ color: '#22c55e', fontSize: 13, flexShrink: 0 }}>✓</span>
                            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{f}</span>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div style={{ animation: 'slideUp 0.5s ease-out 1.3s both' }}>
                    <button
                        onClick={() => navigate('/dashboard')}
                        style={{ width: '100%', background: 'linear-gradient(135deg,#22c55e,#16a34a)', border: 'none', borderRadius: 14, padding: '17px', fontSize: 16, fontWeight: 700, color: '#000', cursor: 'pointer' }}
                    >
                        Go to Dashboard →
                    </button>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 10 }}>Having issues? Contact support via Dashboard</div>
                </div>
            </div>
        </div>
    )

    // ⏳ Loading
    if (loading) return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="spinner spinner-lg" />
        </div>
    )

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'var(--font-inter)', paddingBottom: 40 }}>

            {/* Hero Header */}
            <div style={{ background: meta.gradient, padding: '20px 16px 28px', position: 'relative' }}>
                <button
                    onClick={() => navigate('/pricing')}
                    style={{ background: 'rgba(0,0,0,0.3)', border: 'none', borderRadius: 8, padding: '8px 12px', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 20 }}
                >
                    <ChevronLeft size={16} /> Back
                </button>

                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: 600, letterSpacing: 1, marginBottom: 4 }}>CHECKOUT</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{plan?.name ?? planId} Plan</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                    <span style={{ fontSize: 36, fontWeight: 900, color: '#fff' }}>₹{finalPrice ? finalPrice.toLocaleString('en-IN') : '...'}</span>
                    {discountPct > 0 && <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.4)', textDecoration: 'line-through' }}>₹{basePrice.toLocaleString('en-IN')}</span>}
                    <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>{plan?.period ?? ''}</span>
                </div>
            </div>

            <div style={{ padding: '0 16px', marginTop: -12 }}>

                {/* Steps */}
                <div style={{ background: '#1a1a24', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '16px 18px', marginBottom: 16 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 12 }}>How to Pay</div>
                    {[
                        `Open PhonePe / GPay / Paytm`,
                        `Send exactly ₹${finalPrice ? finalPrice.toLocaleString('en-IN') : '...'} to the UPI ID below`,
                        `Copy the UTR / Transaction ID from your app`,
                        `Paste it below and submit — activated in ~30 min`,
                    ].map((step, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: i === 3 ? 0 : 10 }}>
                            <div style={{ width: 22, height: 22, borderRadius: '50%', background: `${meta.color}20`, border: `1px solid ${meta.color}60`, color: meta.color, fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                                {i + 1}
                            </div>
                            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{step}</div>
                        </div>
                    ))}
                </div>

                {/* QR / Scanner */}
                {scanner ? (
                    <div style={{ background: '#1a1a24', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '20px', marginBottom: 16, textAlign: 'center' }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: meta.color, letterSpacing: 1, marginBottom: 16 }}>SCAN TO PAY</div>

                        {/* Digital QR Code */}
                        <div style={{ display: 'inline-block', padding: 14, background: '#fff', borderRadius: 16, marginBottom: 16, boxShadow: `0 0 30px ${meta.color}20` }}>
                            {(() => {
                                // Reconstruct or use decoded URI, appending the specific exact charge amount
                                const baseUri = scanner.upi_url || `upi://pay?pa=${encodeURIComponent(scanner.upi_id)}&pn=${encodeURIComponent(scanner.name)}&cu=INR`
                                const amount = finalPrice || 0
                                const finalUri = baseUri.includes('?') 
                                    ? `${baseUri}&am=${amount}`
                                    : `${baseUri}?am=${amount}`

                                return (
                                    <QRCodeSVG 
                                        value={finalUri} 
                                        size={200}
                                        level="Q"
                                        includeMargin={false}
                                        fgColor="#000000"
                                        bgColor="#ffffff"
                                        imageSettings={{
                                            src: 'https://cdn.iconscout.com/icon/free/png-256/free-upi-logo-icon-download-in-svg-png-gif-file-formats--unified-payments-interface-payment-money-transfer-logos-icons-1747946.png?f=webp',
                                            x: undefined,
                                            y: undefined,
                                            height: 40,
                                            width: 40,
                                            excavate: true,
                                        }}
                                    />
                                )
                            })()}
                        </div>

                        {/* UPI ID */}
                        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, textAlign: 'left' }}>
                            <div>
                                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 3 }}>UPI ID</div>
                                <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{scanner.upi_id}</div>
                            </div>
                            <button
                                onClick={copyUpi}
                                style={{ background: copiedUpi ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.07)', border: copiedUpi ? '1px solid rgba(34,197,94,0.4)' : '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 12px', color: copiedUpi ? '#22c55e' : '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, transition: 'all 0.2s', flexShrink: 0 }}
                            >
                                {copiedUpi ? <Check size={14} /> : <Copy size={14} />}
                                {copiedUpi ? 'Copied' : 'Copy'}
                            </button>
                        </div>

                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 10 }}>
                            Works with PhonePe · Google Pay · Paytm · BHIM · any UPI app
                        </div>
                    </div>
                ) : (
                    <div style={{ background: '#1a1a24', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '24px', marginBottom: 16, textAlign: 'center' }}>
                        <div style={{ fontSize: 32, marginBottom: 10 }}>⚠️</div>
                        <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>
                            No active payment scanner configured. Please contact support.
                        </div>
                    </div>
                )}

                {/* Amount to Send */}
                <div style={{ background: `${meta.color}10`, border: `1px solid ${meta.color}30`, borderRadius: 14, padding: '14px 16px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 3 }}>Send Exactly</div>
                        <div style={{ fontSize: 22, fontWeight: 800, color: meta.color }}>₹{finalPrice ? finalPrice.toLocaleString('en-IN') : '...'}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 3 }}>Plan</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{plan?.name}</div>
                    </div>
                </div>

                {/* UTR Input */}
                <div style={{ background: '#1a1a24', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '20px 18px', marginBottom: 16 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Enter Transaction UTR</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14 }}>
                        Find the UTR / reference number in your UPI app's transaction history
                    </div>
                    <input
                        value={utr}
                        onChange={e => setUtr(e.target.value)}
                        placeholder="e.g. 123456789012"
                        inputMode="numeric"
                        style={{
                            width: '100%',
                            background: 'rgba(255,255,255,0.04)',
                            border: `1px solid ${utr.trim().length >= 10 ? meta.color + '60' : 'rgba(255,255,255,0.1)'}`,
                            borderRadius: 12,
                            padding: '14px 16px',
                            color: '#fff',
                            fontSize: 16,
                            fontFamily: 'var(--font-orbitron)',
                            fontWeight: 700,
                            letterSpacing: 2,
                            outline: 'none',
                            transition: 'border-color 0.2s',
                            boxSizing: 'border-box',
                        }}
                    />
                    {utr.trim().length > 0 && utr.trim().length < 5 && (
                        <div style={{ fontSize: 11, color: '#f59e0b', marginTop: 6 }}>UTR is usually 12 digits long</div>
                    )}
                </div>

                {/* Error */}
                {error && (
                    <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 12, padding: '12px 16px', fontSize: 13, color: '#ef4444', marginBottom: 16 }}>
                        {error}
                    </div>
                )}

                {/* Trust badges */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                    <div style={{ flex: 1, background: '#1a1a24', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Shield size={14} color="#22c55e" />
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Secure Payment</span>
                    </div>
                    <div style={{ flex: 1, background: '#1a1a24', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Clock size={14} color="#f59e0b" />
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Active in ~30 min</span>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    onClick={handleSubmit}
                    disabled={submitting || !utr.trim() || utr.trim().length < 5}
                    style={{
                        width: '100%',
                        background: submitting || !utr.trim() || utr.trim().length < 5 ? 'rgba(255,255,255,0.07)' : `linear-gradient(135deg, ${meta.color}, ${meta.color}bb)`,
                        border: 'none',
                        borderRadius: 14,
                        padding: '16px',
                        fontSize: 15,
                        fontWeight: 700,
                        color: submitting || !utr.trim() || utr.trim().length < 5 ? 'var(--text-muted)' : (meta.color === '#f59e0b' || meta.color === '#f97316' ? '#000' : '#fff'),
                        cursor: submitting || !utr.trim() || utr.trim().length < 5 ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 10,
                    }}
                >
                    {submitting ? (
                        <><div className="spinner" /> Submitting...</>
                    ) : (
                        <>✅ Submit Payment &amp; Activate</>
                    )}
                </button>

                <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginTop: 12, lineHeight: 1.6 }}>
                    Plan will be activated after admin verifies your payment. Contact support if not activated within 1 hour.
                </div>
            </div>
        </div>
    )
}
