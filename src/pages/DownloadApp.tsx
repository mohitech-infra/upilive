import { Download, ShieldCheck, Zap, Smartphone } from 'lucide-react'

export default function DownloadApp() {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg)',
            color: '#fff',
            fontFamily: 'var(--font-inter)',
            padding: '40px 20px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div className="noise-bg" />
            <div className="grid-bg" />
            
            <div className="glow-blob" style={{ width: 600, height: 600, background: '#22c55e', top: -300, left: -200, opacity: 0.1 }} />
            <div className="glow-blob" style={{ width: 500, height: 500, background: '#a855f7', bottom: -200, right: -200, opacity: 0.1 }} />

            <div style={{ maxWidth: 600, width: '100%', position: 'relative', zIndex: 10, textAlign: 'center' }}>
                {/* Logo Area */}
                <div style={{
                    width: 80, height: 80,
                    borderRadius: 24,
                    background: 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(168,85,247,0.2))',
                    border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 30px',
                    boxShadow: '0 0 40px rgba(34,197,94,0.15)'
                }}>
                    <Zap size={40} color="#22c55e" />
                </div>

                <h1 style={{ fontFamily: 'var(--font-orbitron)', fontSize: '2.5rem', fontWeight: 900, marginBottom: 16, background: 'linear-gradient(135deg, #fff, #a1a1aa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    UPIAlert <span style={{ color: '#22c55e', WebkitTextFillColor: '#22c55e' }}>Live</span>
                </h1>
                
                <div style={{ display: 'inline-block', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e', padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 700, letterSpacing: 0.5, marginBottom: 24 }}>
                    🏆 INDIA'S FIRST APP FOR STREAMERS
                </div>

                <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: 40, lineHeight: 1.6 }}>
                    The ultimate real-time UPI donation alert system for Indian streamers. Free, zero-latency, and custom overlays for OBS.
                </p>

                {/* Features Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 40, textAlign: 'left' }}>
                    {[
                        { icon: <Zap size={20} color="#f59e0b" />, title: 'Real-time Alerts', desc: 'Instant popup on stream within 1s of payment.' },
                        { icon: <ShieldCheck size={20} color="#22c55e" />, title: '100% Secure', desc: 'Uses official Android notifications. No middleman.' },
                        { icon: <Smartphone size={20} color="#3b82f6" />, title: 'Android Native', desc: 'Runs silently in background to catch PhonePe & GPay.' },
                        { icon: <Smartphone size={20} color="#a855f7" />, title: 'Refer & Earn', desc: 'Earn 25% commission on direct referrals, and 10% on their referrals!' },
                    ].map((f, i) => (
                        <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '20px' }}>
                            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                                {f.icon}
                            </div>
                            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6, color: '#fff' }}>{f.title}</h3>
                            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>{f.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Download Action */}
                <div style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 24, padding: '40px 20px', marginBottom: 40 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#22c55e', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
                        Current Version: 1.0.0
                    </div>
                    
                    <a href="/UPIAlert_Live.apk" download style={{ textDecoration: 'none' }}>
                        <button className="btn btn-primary" style={{ padding: '16px 36px', fontSize: 18, borderRadius: 16, display: 'inline-flex', alignItems: 'center', gap: 12 }}>
                            <Download size={24} />
                            Download APK for Android
                        </button>
                    </a>
                    
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 20 }}>
                        Requires Android 10+. Needs Notification & SMS permissions to function.
                    </div>
                </div>

                {/* Installation Guide */}
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: '30px 20px', textAlign: 'left', marginBottom: 60 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <ShieldCheck size={20} color="#f59e0b" /> Installation Guide
                    </h3>
                    <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
                        Since you are downloading this app directly from our website and not from the Google Play Store, your phone will show a standard <strong>"Unsafe App Blocked"</strong> or <strong>"Play Protect"</strong> warning. This is normal for all downloaded APKs.
                    </p>
                    <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 12, padding: '16px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                        <ol style={{ margin: 0, paddingLeft: 20, fontSize: 14, color: '#fff', lineHeight: 1.8 }}>
                            <li>Click the downloaded <strong>UPIAlert_Live.apk</strong> file.</li>
                            <li>If prompted, go to Settings and enable <strong>"Install from Unknown Sources"</strong>.</li>
                            <li>When the Google Play Protect warning appears, click <strong>"More Details"</strong>.</li>
                            <li>Click <strong>"Install Anyway"</strong>.</li>
                        </ol>
                    </div>
                </div>
            </div>
            
            <div style={{ position: 'absolute', bottom: 30, fontSize: 14, fontWeight: 600, color: 'var(--text-muted)', textAlign: 'center' }}>
                <div style={{ marginBottom: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                     Proudly Made in India <img src="https://flagcdn.com/24x18/in.png" alt="India Flag" style={{ borderRadius: 2 }} />
                </div>
                <div style={{ fontSize: 12, fontWeight: 400, opacity: 0.6 }}>© {new Date().getFullYear()} UPIAlert Live. All rights reserved.</div>
            </div>
        </div>
    )
}
