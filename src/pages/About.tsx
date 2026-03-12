import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Heart, Star, Zap, Globe, Shield, Users } from 'lucide-react'

export default function About() {
    const navigate = useNavigate()

    const features = [
        { icon: <Zap size={16} />, color: '#f59e0b', title: 'Real-time UPI Alerts', desc: 'Instant donation notifications on your stream' },
        { icon: <Globe size={16} />, color: '#3b82f6', title: 'OBS Integration', desc: 'Browser source overlay for any streaming software' },
        { icon: <Shield size={16} />, color: '#22c55e', title: 'Secure & Private', desc: 'Your data stays safe. We never store UPI credentials.' },
        { icon: <Users size={16} />, color: '#a855f7', title: 'Made for India', desc: 'Supports all major UPI apps — PhonePe, GPay, Paytm' },
        { icon: <Star size={16} />, color: '#f97316', title: 'Premium Templates', desc: 'Beautiful animated alert templates for your brand' },
        { icon: <Heart size={16} />, color: '#ef4444', title: 'Community First', desc: 'Built by streamers, for streamers across India' },
    ]

    const team = [
        {
            name: 'Anish Mitharwal',
            role: 'Founder & CEO',
            emoji: '👨‍💻',
            gradient: 'linear-gradient(135deg,#22c55e,#3b82f6)',
            note: 'Built UPIAlert Live from scratch to solve a real problem for Indian streamers.',
        },
        {
            name: 'Mohika',
            role: 'Co-Founder',
            emoji: '👩‍🎨',
            gradient: 'linear-gradient(135deg,#a855f7,#f97316)',
            note: 'Leads design and community growth. The creative mind behind UPIAlert\'s look and feel.',
        },
    ]

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'var(--font-inter)', paddingBottom: 40 }}>

            {/* Header */}
            <div style={{ padding: '20px 16px 16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <button onClick={() => navigate('/dashboard')} style={{ background: 'rgba(255,255,255,0.07)', border: 'none', borderRadius: 8, padding: '8px', color: '#fff', cursor: 'pointer', display: 'flex' }}>
                    <ChevronLeft size={20} />
                </button>
                <div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>About UPIAlert</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Made with ❤️ in India</div>
                </div>
            </div>

            <div style={{ padding: '24px 16px' }}>

                {/* App Hero */}
                <div style={{ textAlign: 'center', marginBottom: 28 }}>
                    <div style={{ width: 72, height: 72, borderRadius: 20, background: 'linear-gradient(135deg,#22c55e,#a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, margin: '0 auto 14px' }}>
                        ⚡
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 4 }}>UPIAlert Live</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>Real-time donation alerts for Indian streamers</div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 20, padding: '6px 14px' }}>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Version</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#22c55e' }}>1.0.0</span>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>·</span>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>By Mohi Tech</span>
                    </div>
                </div>

                {/* Mission */}
                <div style={{ background: 'linear-gradient(135deg,rgba(34,197,94,0.08),rgba(168,85,247,0.06))', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 16, padding: '18px 16px', marginBottom: 20 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Our Mission 🎯</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.75 }}>
                        UPIAlert Live was built to solve a simple problem — Indian streamers had no easy way to show donation alerts when their viewers would send UPI payments. We built the simplest, most reliable solution so creators can focus on streaming while we handle the tech.
                    </div>
                </div>

                {/* Features */}
                <div style={{ marginBottom: 24 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 12 }}>What We Offer</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        {features.map((f, i) => (
                            <div key={i} style={{ background: '#1a1a24', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '14px 12px' }}>
                                <div style={{ color: f.color, marginBottom: 8 }}>{f.icon}</div>
                                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{f.title}</div>
                                <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5 }}>{f.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Team */}
                <div style={{ marginBottom: 24 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 12 }}>The Team</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {team.map((m, i) => (
                            <div key={i} style={{ background: '#1a1a24', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '18px 16px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                                <div style={{ width: 50, height: 50, borderRadius: 14, background: m.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                                    {m.emoji}
                                </div>
                                <div>
                                    <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{m.name}</div>
                                    <div style={{ fontSize: 12, color: '#a855f7', fontWeight: 600, marginBottom: 6 }}>{m.role}</div>
                                    <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>{m.note}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mohi Tech */}
                <div style={{ background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: 16, padding: '18px 16px', textAlign: 'center', marginBottom: 20 }}>
                    <div style={{ fontSize: 20, marginBottom: 8 }}>🏢</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Mohi Tech</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.65 }}>
                        Mohi Tech is an indie tech studio based in India, building tools for the next generation of Indian content creators. UPIAlert Live is our flagship product.
                    </div>
                </div>

                {/* Footer links */}
                <div style={{ display: 'flex', gap: 10 }}>
                    <button style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '12px', fontSize: 12, color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 600 }}>
                        Privacy Policy
                    </button>
                    <button style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '12px', fontSize: 12, color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 600 }}>
                        Terms of Service
                    </button>
                </div>
            </div>
        </div>
    )
}
