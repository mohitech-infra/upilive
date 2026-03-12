import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Mail, Smartphone, ChevronRight } from 'lucide-react'

type Screen = 'main' | 'email' | 'otp'
type AuthMode = 'login' | 'signup'

export default function Login() {
    const [screen, setScreen] = useState<Screen>('main')
    const [authMode, setAuthMode] = useState<AuthMode>('login')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [phone, setPhone] = useState('')
    const [otp, setOtp] = useState('')
    const [otpSent, setOtpSent] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [refApplied, setRefApplied] = useState(false)

    // Capture ?ref= referral code from URL, persist across OAuth redirect
    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const ref = params.get('ref')
        if (ref) { localStorage.setItem('ref_code', ref); setRefApplied(true) }
        else if (localStorage.getItem('ref_code')) setRefApplied(true)
    }, [])

    const handleOAuth = async (provider: 'google' | 'facebook') => {
        setLoading(true)
        setError('')
        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: { redirectTo: `${window.location.origin}/dashboard` }
        })
        if (error) { setError(error.message); setLoading(false) }
    }

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setMessage('')
        try {
            if (authMode === 'signup') {
                const { error } = await supabase.auth.signUp({ email, password })
                if (error) throw error
                setMessage('Check your email to confirm your account!')
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password })
                if (error) throw error
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Authentication failed')
        } finally {
            setLoading(false)
        }
    }

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        const formatted = phone.startsWith('+') ? phone : `+91${phone}`
        const { error } = await supabase.auth.signInWithOtp({ phone: formatted })
        setLoading(false)
        if (error) setError(error.message)
        else setOtpSent(true)
    }

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        const formatted = phone.startsWith('+') ? phone : `+91${phone}`
        const { error } = await supabase.auth.verifyOtp({ phone: formatted, token: otp, type: 'sms' })
        setLoading(false)
        if (error) setError(error.message)
    }

    // BG blobs style
    const BG = (
        <>
            <div style={{ position: 'fixed', inset: 0, background: '#080b0e', zIndex: 0 }} />
            {/* Green top-left blob */}
            <div style={{ position: 'fixed', top: -60, left: -80, width: 280, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, rgba(22,163,74,0.6) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: 0 }} />
            {/* Purple bottom-right blob */}
            <div style={{ position: 'fixed', bottom: '30%', right: -60, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(109,40,217,0.5) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: 0 }} />
        </>
    )

    // --- Email/Password screen ---
    if (screen === 'email') {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', fontFamily: 'var(--font-inter)' }}>
                {BG}
                <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', padding: '24px 20px' }}>
                    <button onClick={() => setScreen('main')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 14, marginBottom: 24, textAlign: 'left' }}>
                        ← Back
                    </button>

                    {/* Tab switcher */}
                    <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: 4, marginBottom: 28 }}>
                        {(['login', 'signup'] as AuthMode[]).map(m => (
                            <button key={m} onClick={() => { setAuthMode(m); setError(''); setMessage('') }}
                                style={{
                                    flex: 1, padding: '10px 0', border: 'none', borderRadius: 7, cursor: 'pointer',
                                    fontWeight: 700, fontSize: 14, transition: 'all 0.2s',
                                    background: authMode === m ? 'rgba(34,197,94,0.15)' : 'transparent',
                                    color: authMode === m ? '#22c55e' : 'var(--text-muted)',
                                    boxShadow: authMode === m ? 'inset 0 0 0 1px rgba(34,197,94,0.3)' : 'none',
                                }}>
                                {m === 'login' ? 'Sign In' : 'Create Account'}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleEmailAuth} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div className="input-group">
                            <label className="input-label">Email Address</label>
                            <input className="input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Password</label>
                            <input className="input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
                        </div>
                        {error && <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 8, fontSize: 13, color: '#ef4444' }}>{error}</div>}
                        {message && <div style={{ padding: '10px 14px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 8, fontSize: 13, color: '#22c55e' }}>{message}</div>}
                        <button className="btn btn-primary btn-full btn-lg" type="submit" disabled={loading} style={{ marginTop: 8 }}>
                            {loading ? <div className="spinner" /> : authMode === 'login' ? 'Sign In' : 'Create Account'}
                        </button>
                    </form>
                </div>
            </div>
        )
    }

    // --- OTP screen ---
    if (screen === 'otp') {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', fontFamily: 'var(--font-inter)' }}>
                {BG}
                <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', padding: '24px 20px' }}>
                    <button onClick={() => { setScreen('main'); setOtpSent(false); setPhone(''); setOtp('') }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 14, marginBottom: 24, textAlign: 'left' }}>
                        ← Back
                    </button>

                    <div style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 6 }}>Mobile Number & OTP</div>
                    <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 28 }}>We'll send a one-time password to your number.</div>

                    {!otpSent ? (
                        <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <div className="input-group">
                                <label className="input-label">Mobile Number</label>
                                <input className="input" type="tel" placeholder="+91 98765 43210" value={phone} onChange={e => setPhone(e.target.value)} required />
                            </div>
                            {error && <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 8, fontSize: 13, color: '#ef4444' }}>{error}</div>}
                            <button className="btn btn-primary btn-full btn-lg" type="submit" disabled={loading}>
                                {loading ? <div className="spinner" /> : 'Send OTP'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 8 }}>OTP sent to {phone}</div>
                            <div className="input-group">
                                <label className="input-label">Enter OTP</label>
                                <input className="input" type="text" inputMode="numeric" pattern="[0-9]*" maxLength={6} placeholder="123456" value={otp} onChange={e => setOtp(e.target.value)} required />
                            </div>
                            {error && <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 8, fontSize: 13, color: '#ef4444' }}>{error}</div>}
                            <button className="btn btn-primary btn-full btn-lg" type="submit" disabled={loading}>
                                {loading ? <div className="spinner" /> : 'Verify OTP'}
                            </button>
                            <button type="button" style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 13, cursor: 'pointer' }} onClick={() => setOtpSent(false)}>
                                Resend OTP
                            </button>
                        </form>
                    )}
                </div>
            </div>
        )
    }

    // --- Main screen ---
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', fontFamily: 'var(--font-inter)' }}>
            {BG}

            <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 20px 32px' }}>

                {/* QR Icon */}
                <div style={{
                    width: 72, height: 72, borderRadius: 20,
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 20,
                    boxShadow: '0 0 40px rgba(34,197,94,0.4)'
                }}>
                    <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="7" height="7" rx="1" />
                        <rect x="14" y="3" width="7" height="7" rx="1" />
                        <rect x="3" y="14" width="7" height="7" rx="1" />
                        <rect x="14" y="14" width="3" height="3" />
                        <rect x="18" y="14" width="3" height="3" />
                        <rect x="14" y="18" width="3" height="3" />
                        <rect x="18" y="18" width="3" height="3" />
                        <rect x="5" y="5" width="3" height="3" fill="#000" />
                        <rect x="16" y="5" width="3" height="3" fill="#000" />
                        <rect x="5" y="16" width="3" height="3" fill="#000" />
                    </svg>
                </div>

                {/* Title */}
                <div style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 8, letterSpacing: -0.5 }}>
                    UPIAlert Live
                </div>
                <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: refApplied ? 16 : 48, textAlign: 'center' }}>
                    Real-time donation alerts for streamers
                </div>

                {/* Referral code applied banner */}
                {refApplied && (
                    <div style={{ width: '100%', maxWidth: 420, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 10, padding: '10px 16px', marginBottom: 20, fontSize: 13, color: '#22c55e', display: 'flex', alignItems: 'center', gap: 8 }}>
                        🎁 Referral code applied! You'll get 25% off on signup.
                    </div>
                )}

                {/* Card */}
                <div style={{ width: '100%', maxWidth: 420, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '28px 24px' }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Welcome, Streamer</div>
                    <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>Sign in to get started</div>

                    {/* Google + Facebook side by side */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
                        <button
                            onClick={() => handleOAuth('google')}
                            disabled={loading}
                            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '14px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', color: '#fff', fontSize: 14, fontWeight: 600 }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Google
                        </button>
                        <button
                            onClick={() => handleOAuth('facebook')}
                            disabled={loading}
                            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '14px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', color: '#fff', fontSize: 14, fontWeight: 600 }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                            Facebook
                        </button>
                    </div>

                    {/* Divider */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>or continue with</span>
                        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
                    </div>

                    {error && <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 8, fontSize: 13, color: '#ef4444', marginBottom: 12 }}>{error}</div>}

                    {/* Email option */}
                    <button
                        onClick={() => setScreen('email')}
                        style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', marginBottom: 10, textAlign: 'left' }}
                    >
                        <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(34,197,94,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Mail size={18} color="#22c55e" />
                        </div>
                        <span style={{ flex: 1, fontSize: 15, fontWeight: 600, color: '#fff' }}>Email & Password</span>
                        <ChevronRight size={18} color="var(--text-muted)" />
                    </button>

                    {/* OTP option */}
                    <button
                        onClick={() => setScreen('otp')}
                        style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', textAlign: 'left' }}
                    >
                        <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(168,85,247,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Smartphone size={18} color="#a855f7" />
                        </div>
                        <span style={{ flex: 1, fontSize: 15, fontWeight: 600, color: '#fff' }}>Mobile Number & OTP</span>
                        <ChevronRight size={18} color="var(--text-muted)" />
                    </button>
                </div>

                {/* Footer */}
                <div style={{ marginTop: 'auto', paddingTop: 32, textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    By continuing, you agree to our{' '}
                    <span style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'underline', cursor: 'pointer' }}>Terms of Service</span>
                    {' '}& {' '}
                    <span style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'underline', cursor: 'pointer' }}>Privacy Policy</span>
                </div>
            </div>
        </div>
    )
}
