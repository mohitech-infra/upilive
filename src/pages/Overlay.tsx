import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { Transaction } from '../lib/supabase'

type AlertItem = Transaction & { exiting: boolean }

const ANIMATIONS: Record<string, string> = {
    slide: 'slideIn',
    pulse: 'pulseIn',
    shimmer: 'shimmerIn',
    grid: 'gridIn',
    fire: 'fireIn',
    wave: 'waveIn',
    gold: 'goldIn',
    arc: 'arcIn',
    vortex: 'vortexIn',
    crystal: 'crystalIn',
    quantum: 'quantumIn',
}

// ─── IFRAME ALERT COMPONENT ─────────────────────────────
function IframeAlert({ tx, templateCode }: { tx: Transaction, templateCode: string }) {
    const [html, setHtml] = useState('')
    const [exiting, setExiting] = useState(false)

    useEffect(() => {
        const parsed = templateCode
            .replace(/\{\{donor_name\}\}/g, tx.donor_name)
            .replace(/\{\{amount\}\}/g, tx.amount.toLocaleString('en-IN'))
            .replace(/\{\{message\}\}/g, tx.message || '')
            .replace(/\{\{source\}\}/g, 'UPI')
            .replace(/\{\{utr\}\}/g, (tx as any).utr || '')
        setHtml(parsed)

        // Give it 4.5s before we unmount it
        const t = setTimeout(() => setExiting(true), 4500)
        return () => clearTimeout(t)
    }, [tx, templateCode])

    if (exiting) return null

    return (
        <iframe
            srcDoc={html}
            style={{
                width: 600, height: 400, border: 'none',
                overflow: 'hidden', background: 'transparent'
            }}
            sandbox="allow-scripts allow-same-origin"
        />
    )
}

export default function Overlay() {
    const { token } = useParams<{ token: string }>()
    // We now use overlay_templates table type:
    type OvTemplate = { id: string; name: string; full_code?: string; gradient: string; icon: string; animation_type?: string }
    const [activeTemplate, setActiveTemplate] = useState<OvTemplate | null>(null)
    const [ttsEnabled, setTtsEnabled] = useState(false)
    const [ttsVoice, setTtsVoice] = useState('en-US-Standard-A')
    const [alerts, setAlerts] = useState<AlertItem[]>([])

    useEffect(() => {
        if (!token) return

        const init = async () => {
            // Get user's TTS settings from users table (active_template is NOT a column on users)
            const { data: user, error: userErr } = await supabase
                .from('users')
                .select('id, tts_enabled, tts_voice')
                .eq('overlay_token', token)
                .single()

            if (userErr || !user) {
                console.error('Overlay: failed to fetch user by token', userErr)
                return
            }
            setTtsEnabled(user.tts_enabled || false)
            if (user.tts_voice) setTtsVoice(user.tts_voice)

            // Fetch the user's active template from user_templates (maybeSingle = no crash if empty)
            const { data: userTemplate } = await supabase
                .from('user_templates')
                .select('template_id')
                .eq('user_id', user.id)
                .maybeSingle()

            if (userTemplate?.template_id) {
                // Try overlay_templates (custom full-code templates)
                const { data: ovTmpl } = await supabase
                    .from('overlay_templates')
                    .select('*')
                    .eq('id', userTemplate.template_id)
                    .maybeSingle()
                if (ovTmpl) {
                    setActiveTemplate(ovTmpl as OvTemplate)
                }
            }
            // If no active template found, overlay still works with built-in default animation
        }
        init()

        const channel = supabase
            .channel(`overlay:${token}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'transactions',
                filter: `overlay_token=eq.${token}`,
            }, (payload) => {
                const tx = payload.new as Transaction
                const item: AlertItem = { ...tx, exiting: false }

                // TTS Announcement
                if (ttsEnabled) {
                    const text = `${tx.donor_name} paid ₹${tx.amount}${tx.message ? ` and said ${tx.message}` : ''}`

                    try {
                        if (window.speechSynthesis) {
                            const voices = window.speechSynthesis.getVoices()
                            const exactMatch = voices.find(v => v.name === ttsVoice || v.voiceURI === ttsVoice)
                            const utterance = new SpeechSynthesisUtterance(text)
                            if (exactMatch) {
                                utterance.voice = exactMatch
                            }
                            utterance.lang = 'hi-IN'
                            utterance.rate = 1.0
                            window.speechSynthesis.speak(utterance)
                        }
                    } catch (e) {
                        console.error("TTS Error:", e)
                    }
                }

                // For custom HTML templates, we let IframeAlert handle its own lifecycle.
                // But for React fallbacks, we manage exiting state.
                setAlerts(prev => [...prev, item])

                setTimeout(() => {
                    setAlerts(prev => prev.map(a => a.id === item.id ? { ...a, exiting: true } : a))
                }, 4500)
                setTimeout(() => {
                    setAlerts(prev => prev.filter(a => a.id !== item.id))
                }, 5000)
            })
            .subscribe()

        return () => { supabase.removeChannel(channel) }
    }, [token, ttsEnabled, ttsVoice])

    const animKey = ANIMATIONS[activeTemplate?.animation_type ?? 'slide'] ?? 'slideIn'

    return (
        <div style={{ background: 'transparent', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-start', padding: '40px', gap: 12 }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Rajdhani:wght@700&display=swap');
        @keyframes slideIn { from { transform: translateY(60px) scale(0.9); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
        @keyframes slideOut { from { transform: translateY(0) scale(1); opacity: 1; } to { transform: translateY(-40px) scale(0.95); opacity: 0; } }
        /* Fallback animations... */
        @keyframes pulseIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes neon-pulse { 0%, 100% { box-shadow: 0 0 20px #22c55e55, 0 0 60px #22c55e22; } 50% { box-shadow: 0 0 40px #22c55e99, 0 0 80px #22c55e44; } }
      `}</style>

            {alerts.map(alert => {
                // If it's a custom code template
                if (activeTemplate?.full_code) {
                    // IframeAlert handles its own unmount
                    if (alert.exiting) return null
                    return <IframeAlert key={alert.id} tx={alert} templateCode={activeTemplate.full_code} />
                }

                // Fallback React Template
                return (
                    <div key={alert.id} style={{
                        display: 'flex', alignItems: 'center', gap: 16,
                        background: 'rgba(5,5,8,0.92)',
                        border: '1px solid rgba(34,197,94,0.5)',
                        borderImage: activeTemplate?.gradient ? `${activeTemplate.gradient} 1` : undefined,
                        borderRadius: 14,
                        padding: '16px 24px',
                        backdropFilter: 'blur(20px)',
                        animation: `${alert.exiting ? 'slideOut' : animKey} 0.5s cubic-bezier(0.34,1.56,0.64,1) both`,
                        animationDuration: alert.exiting ? '0.4s' : '0.5s',
                        minWidth: 320,
                        maxWidth: 480,
                        boxShadow: '0 0 40px rgba(34,197,94,0.2)',
                    }} className={alert.exiting ? '' : 'neon-pulse'}>
                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#22c55e', flexShrink: 0 }} />
                        <div>
                            <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 13, color: 'rgba(34,197,94,0.8)', letterSpacing: 2, marginBottom: 2 }}>
                                UPI DONATION
                            </div>
                            <div style={{ fontFamily: 'Orbitron, monospace', fontWeight: 900, fontSize: 22, color: '#fff', letterSpacing: 1 }}>
                                {alert.donor_name}
                            </div>
                            {alert.message && (
                                <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>
                                    "{alert.message}"
                                </div>
                            )}
                        </div>
                        <div style={{
                            marginLeft: 'auto',
                            fontFamily: 'Orbitron, monospace', fontWeight: 900, fontSize: 28,
                            background: activeTemplate?.gradient || 'linear-gradient(135deg, #22c55e, #a855f7)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                            letterSpacing: 1,
                            flexShrink: 0,
                        }}>
                            ₹{alert.amount.toLocaleString('en-IN')}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

