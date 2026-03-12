import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronDown, ChevronUp } from 'lucide-react'

const SECTIONS = [
    {
        emoji: '🚀',
        title: 'Getting Started',
        color: '#22c55e',
        content: `Welcome to UPIAlert Live! This app lets Indian streamers show real-time donation alerts on their streams whenever someone sends them money via UPI (PhonePe, Google Pay, Paytm, etc.).\n\nSign up or log in with your Google or Facebook account. Once logged in, you land on the Dashboard where you can see your stats, connect your Android device, and see your OBS overlay URL.\n\nChoose a plan that fits your streaming frequency. The Free plan gives basic alerts, while Starter and above unlock more daily alerts, premium templates, and priority support.`,
    },
    {
        emoji: '📲',
        title: 'Install UPIAlert on Your Phone',
        color: '#22c55e',
        content: `The UPIAlert Android app is the heart of the system — it automatically reads your UPI payment SMS and notifications, so you never have to manually enter anything.\n\n1. Download the UPIAlert APK from upialert.live/download (or from the Go Live page).\n2. Install the APK on your Android phone (allow installation from unknown sources if required).\n3. Open the app and log in with the same Google/Facebook account you use on the web dashboard.\n4. Grant the two permissions when prompted:\n   • "Read SMS" — so the app can detect incoming payment messages\n   • "Notification Access" — so the app can read payment notifications from PhonePe, GPay, Paytm etc.\n5. That's it! Your phone is now connected. You can see the connection status on your Dashboard and Go Live page.`,
    },
    {
        emoji: '📱',
        title: 'How Automatic Detection Works',
        color: '#3b82f6',
        content: `Once the UPIAlert app is installed and permissions are granted, it runs a background service that listens for payment messages automatically.\n\nSupported sources:\n• PhonePe SMS and notifications\n• Google Pay (GPay) notifications\n• Paytm SMS and notifications\n• BHIM UPI SMS\n• Bank SMS (HDFC, SBI, Axis, ICICI, Kotak, etc.)\n\nWhen a payment arrives, UPIAlert reads the text, extracts:\n— The donation amount (₹)\n— The donor's name\n— The UPI reference number\n\nThis data is instantly sent to your OBS overlay and appears as an animated alert. The entire process takes less than 3 seconds from payment to alert.`,
    },
    {
        emoji: '🎬',
        title: 'Setting Up OBS Overlay',
        color: '#a855f7',
        content: `Your OBS Overlay is a webpage that lives inside OBS and plays the donation animation.\n\n1. Copy your Overlay URL from the Go Live page on the dashboard.\n2. Open OBS Studio on your PC.\n3. In your Scene, click + in Sources → Browser Source.\n4. Give it a name like "UPI Alerts" and paste your overlay URL.\n5. Set Width: 800 and Height: 200 (or adjust to your preference).\n6. Uncheck "Shutdown source when not visible".\n7. Click OK and drag the source to the bottom of your scene.\n\nThe alert box is transparent by default — only the animation appears when a donation comes in. Test it with the "Send Test Alert" button on your Dashboard!`,
    },
    {
        emoji: '🏆',
        title: 'Alert Templates',
        color: '#f59e0b',
        content: `Alert templates control how donation alerts look on stream. Go to the Templates page to browse and activate a template.\n\nFree templates are available to all users. Premium templates (marked with a crown 👑) require a Starter plan or above.\n\nEach template has a unique animation — from a simple slide-in to an explosive neon effect. Preview any template before activating.\n\nYou can change your active template at any time, even mid-stream. Changes take effect immediately.`,
    },
    {
        emoji: '❓',
        title: 'Troubleshooting',
        color: '#6b7280',
        content: `Alerts not showing on OBS?\n• Make sure you are set to "Live" on the Dashboard.\n• Check that the Overlay URL is correctly pasted in OBS Browser Source.\n• Click "Refresh" inside OBS Browser Source settings.\n• Make sure the UPIAlert app is running in the background on your phone.\n\nPhone not showing as connected?\n• Open the UPIAlert app on your phone and check that both permissions (SMS + Notification) are granted.\n• Make sure your phone and PC are on the internet.\n• Try force-closing and reopening the UPIAlert app.\n\nPayments not being detected?\n• Make sure UPIAlert has Notification Access enabled: Settings → Apps → UPIAlert → Notifications.\n• For SMS: Settings → Apps → UPIAlert → Permissions → SMS.\n\nStill stuck? Tap Contact Support in the menu — we reply within 24 hours.`,
    },
]

export default function SetupGuide() {
    const navigate = useNavigate()
    const [open, setOpen] = useState<number | null>(0)

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'var(--font-inter)', paddingBottom: 40 }}>

            {/* Header */}
            <div style={{ padding: '20px 16px 16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <button onClick={() => navigate('/dashboard')} style={{ background: 'rgba(255,255,255,0.07)', border: 'none', borderRadius: 8, padding: '8px', color: '#fff', cursor: 'pointer', display: 'flex' }}>
                    <ChevronLeft size={20} />
                </button>
                <div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>Setup Guide</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Get from signup to live alerts in 10 minutes</div>
                </div>
            </div>

            <div style={{ padding: '20px 16px' }}>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 20, background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 12, padding: '14px 16px' }}>
                    🇮🇳 <strong style={{ color: '#fff' }}>No Tasker. No MacroDroid. No webhooks.</strong> UPIAlert has its own built-in notification reader — just install the app, grant permissions, and it works automatically.
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {SECTIONS.map((s, i) => (
                        <div key={i} style={{ background: '#1a1a24', border: `1px solid ${open === i ? s.color + '40' : 'rgba(255,255,255,0.06)'}`, borderRadius: 16, overflow: 'hidden', transition: 'border-color 0.2s' }}>
                            <button
                                onClick={() => setOpen(open === i ? null : i)}
                                style={{ width: '100%', background: 'transparent', border: 'none', padding: '16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', textAlign: 'left' }}
                            >
                                <div style={{ width: 40, height: 40, borderRadius: 12, background: `${s.color}18`, border: `1px solid ${s.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                                    {s.emoji}
                                </div>
                                <div style={{ flex: 1, fontSize: 14, fontWeight: 700, color: '#fff' }}>{s.title}</div>
                                {open === i ? <ChevronUp size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
                            </button>
                            {open === i && (
                                <div style={{ padding: '0 16px 18px', borderTop: `1px solid ${s.color}20` }}>
                                    {s.content.split('\n').map((line, j) => (
                                        <p key={j} style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.75, margin: j === 0 ? '14px 0 0' : '6px 0 0' }}>
                                            {line || <br />}
                                        </p>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
