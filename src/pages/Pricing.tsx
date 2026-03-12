import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Check, Tag } from 'lucide-react'

interface PlanConfig {
    id: string
    label: string
    badge?: string
    badgeColor?: string
    price: string
    priceNum: number
    period: string
    color: string
    borderColor: string
    features: string[]
    cta: string
}

const PLANS: PlanConfig[] = [
    {
        id: 'free',
        label: 'Free',
        price: '₹0',
        priceNum: 0,
        period: 'forever',
        color: '#ffffff',
        borderColor: 'rgba(255,255,255,0.1)',
        features: [
            '30 alerts/day',
            '5 Basic Templates',
            'Overlay link for OBS',
            'UPI notification reading',
        ],
        cta: 'Current Plan',
    },
    {
        id: 'starter',
        label: 'Starter',
        badge: 'POPULAR',
        badgeColor: '#22c55e',
        price: '₹299',
        priceNum: 299,
        period: '/month',
        color: '#22c55e',
        borderColor: 'rgba(34,197,94,0.3)',
        features: [
            '150 alerts/day',
            '20 Templates (5 Basic + 15 Premium)',
            'Priority alert delivery',
            'Custom alert sounds',
            'Donor leaderboard',
        ],
        cta: 'Upgrade to Starter',
    },
    {
        id: 'pro',
        label: 'Pro',
        badge: 'BEST VALUE',
        badgeColor: '#a855f7',
        price: '₹599',
        priceNum: 599,
        period: '/3 months',
        color: '#a855f7',
        borderColor: 'rgba(168,85,247,0.35)',
        features: [
            '350 alerts/day',
            '30 Templates (5 Basic + 25 Premium)',
            'Alert animations',
            'Custom branding',
            'Analytics dashboard',
            'Priority support',
        ],
        cta: 'Upgrade to Pro',
    },
    {
        id: 'ultra',
        label: 'Ultra',
        badge: 'ULTRA',
        badgeColor: '#f59e0b',
        price: '₹799',
        priceNum: 799,
        period: '/8 months',
        color: '#f59e0b',
        borderColor: 'rgba(245,158,11,0.3)',
        features: [
            'Unlimited alerts',
            'All 60 Templates Included',
            'All animations & effects',
            'Multi-stream support',
            'Custom domain overlay',
            'Dedicated support',
        ],
        cta: 'Upgrade to Ultra',
    },
    {
        id: 'annual',
        label: 'Annual',
        badge: 'SAVE 38%',
        badgeColor: '#22c55e',
        price: '₹1499',
        priceNum: 1499,
        period: '/year',
        color: '#a855f7',
        borderColor: 'rgba(168,85,247,0.3)',
        features: [
            'Unlimited alerts',
            'All 60 Templates Included',
            'Custom sub-domain overlays',
            'Save 38% vs monthly',
            'VIP support',
        ],
        cta: 'Upgrade to Annual',
    },
    {
        id: 'lifetime',
        label: 'Lifetime',
        badge: 'CURRENT',
        badgeColor: '#f97316',
        price: '₹5999',
        priceNum: 5999,
        period: 'one-time',
        color: '#f97316',
        borderColor: 'rgba(249,115,22,0.3)',
        features: [
            'Unlimited alerts forever',
            'Current + future templates (60+)',
            'Lifetime updates',
            'First access to new features',
            'Priority beta features',
            'Lifetime dedicated support',
        ],
        cta: '✓ Your Current Plan',
    },
]

export default function Pricing() {
    const { profile } = useAuth()
    const navigate = useNavigate()
    const currentPlan = profile?.plan_id ?? 'free'
    const hasReferral = !!(profile?.referred_by)
    const [discountPct, setDiscountPct] = useState(0)

    useEffect(() => {
        if (!hasReferral) return
        supabase.from('app_settings').select('value').eq('key', 'referral_discount_percent').single()
            .then(({ data }) => { if (data) setDiscountPct(Number(data.value)) })
    }, [hasReferral])

    const discountedPrice = (num: number) => Math.round(num * (1 - discountPct / 100))

    const handleUpgrade = (planId: string) => {
        navigate(`/payment/${planId}`)
    }

    return (
        <div style={{ padding: '0 0 32px', fontFamily: 'var(--font-inter)', background: 'var(--bg)', minHeight: '100vh' }}>

            {/* Header */}
            <div style={{ padding: '20px 16px 20px' }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Choose Your Plan</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Scale your streaming alerts</div>
            </div>

            {/* Referral Discount Banner */}
            {hasReferral && discountPct > 0 && (
                <div style={{ margin: '0 16px 16px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Tag size={16} color="#22c55e" />
                    <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#22c55e' }}>Referral Discount Applied! 🎉</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>You get {discountPct}% off on all paid plans</div>
                    </div>
                </div>
            )}

            {/* Plan Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '0 16px' }}>
                {PLANS.map(plan => {
                    const isCurrentPlan = currentPlan === plan.id
                    return (
                        <div
                            key={plan.id}
                            style={{
                                background: isCurrentPlan ? `rgba(${plan.id === 'lifetime' ? '249,115,22' : '34,197,94'},0.06)` : '#1a1a24',
                                border: `1px solid ${isCurrentPlan ? plan.borderColor : 'rgba(255,255,255,0.07)'}`,
                                borderRadius: 16,
                                padding: '20px 18px',
                            }}
                        >
                            {/* Plan header row */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                                <div>
                                    <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>{plan.label}</div>
                                </div>
                                {plan.badge && (
                                    <div style={{ background: `${plan.badgeColor}20`, border: `1px solid ${plan.badgeColor}50`, color: plan.badgeColor, fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 6, letterSpacing: 0.5 }}>
                                        {plan.badge}
                                    </div>
                                )}
                            </div>

                            {/* Price */}
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
                                {hasReferral && discountPct > 0 && plan.priceNum > 0 ? (<>
                                    <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-muted)', textDecoration: 'line-through', opacity: 0.6 }}>{plan.price}</span>
                                    <span style={{ fontSize: 32, fontWeight: 800, color: '#22c55e' }}>₹{discountedPrice(plan.priceNum)}</span>
                                    <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>{plan.period}</span>
                                    <span style={{ fontSize: 10, fontWeight: 800, color: '#22c55e', background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', padding: '2px 8px', borderRadius: 6, letterSpacing: 0.5 }}>-{discountPct}% OFF</span>
                                </>) : (<>
                                    <span style={{ fontSize: 32, fontWeight: 800, color: plan.color }}>{plan.price}</span>
                                    <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>{plan.period}</span>
                                </>)}
                            </div>

                            {/* Features */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                                {plan.features.map((f, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                                        <Check size={14} color={plan.color} style={{ marginTop: 1, flexShrink: 0 }} />
                                        {f}
                                    </div>
                                ))}
                            </div>

                            {/* CTA Button */}
                            {isCurrentPlan ? (
                                <div style={{ background: `${plan.color}15`, border: `1px solid ${plan.color}40`, borderRadius: 10, padding: '12px', textAlign: 'center', fontSize: 14, fontWeight: 700, color: plan.color }}>
                                    {plan.cta}
                                </div>
                            ) : (
                                <button
                                    onClick={() => handleUpgrade(plan.id)}
                                    style={{ width: '100%', background: `linear-gradient(135deg, ${plan.color}, ${plan.color}cc)`, border: 'none', borderRadius: 10, padding: '13px', fontSize: 14, fontWeight: 700, color: plan.id === 'free' ? '#000' : plan.color === '#ffffff' ? '#000' : '#fff', cursor: 'pointer', }}
                                >
                                    {plan.cta}
                                </button>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Note */}
            <div style={{ padding: '16px 16px 0', fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6, textAlign: 'center' }}>
                All plans include UPI notification reading from PhonePe, Google Pay and Paytm. SMS reading from registered bank numbers is included on all paid plans.
            </div>
        </div>
    )
}
