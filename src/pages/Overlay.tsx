import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { Transaction } from '../lib/supabase'
import { Capacitor } from '@capacitor/core'
import { TextToSpeech } from '@capacitor-community/text-to-speech'

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
    const [exiting, setExiting] = useState(false)

    useEffect(() => {
        // Give it 4.5s before we unmount it
        const t = setTimeout(() => setExiting(true), 4500)
        return () => clearTimeout(t)
    }, [tx, templateCode])

    if (exiting) return null

    const parsedHtml = templateCode
        .replace(/\{\{donor_name\}\}/g, tx.donor_name)
        .replace(/\{\{amount\}\}/g, tx.amount.toLocaleString('en-IN'))
        .replace(/\{\{message\}\}/g, tx.message || '')
        .replace(/\{\{source\}\}/g, 'UPI')
        .replace(/\{\{utr\}\}/g, (tx as any).utr || '')

    return (
        <iframe
            srcDoc={parsedHtml}
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
    const [ttsVoice, setTtsVoice] = useState('hi-IN')
    const [alerts, setAlerts] = useState<AlertItem[]>([])

    useEffect(() => {
        // Force fully transparent overlay (overrides global index.css body background)
        document.documentElement.style.background = 'transparent'
        document.body.style.background = 'transparent'
        const rootNode = document.getElementById('root')
        if (rootNode) rootNode.style.background = 'transparent'

        return () => {
             // Revert on unmount (only matters if navigating away in same browser tab)
             document.documentElement.style.background = ''
             document.body.style.background = ''
             if (rootNode) rootNode.style.background = ''
        }
    }, [])

    useEffect(() => {
        if (!token) return

        const init = async () => {
            // Get user's TTS settings and active template from users table
            const { data: user, error: userErr } = await supabase
                .from('users')
                .select('id, tts_enabled, tts_voice, active_template')
                .eq('overlay_token', token)
                .single()

            if (userErr || !user) {
                console.error('Overlay: failed to fetch user by token', userErr)
                return
            }
            setTtsEnabled(user.tts_enabled || false)
            if (user.tts_voice) setTtsVoice(user.tts_voice)

            // Try to load the selected active_template from overlay_templates
            if (user.active_template) {
                const { data: ovTmpl } = await supabase
                    .from('overlay_templates')
                    .select('*')
                    .eq('id', user.active_template)
                    .maybeSingle()
                if (ovTmpl) {
                    setActiveTemplate(ovTmpl as OvTemplate)
                }
            }

            // Realtime listener for user settings (TTS, active template)
            supabase.channel(`user-updates:${user.id}`)
                .on('postgres_changes', {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'users',
                    filter: `id=eq.${user.id}`,
                }, async (payload) => {
                    const newUser = payload.new
                    if (newUser.active_template !== user.active_template) {
                        const { data: newTmpl } = await supabase
                            .from('overlay_templates')
                            .select('*')
                            .eq('id', newUser.active_template)
                            .maybeSingle()
                        if (newTmpl) setActiveTemplate(newTmpl as OvTemplate)
                    }
                    if (newUser.tts_enabled !== undefined) setTtsEnabled(newUser.tts_enabled)
                    if (newUser.tts_voice) setTtsVoice(newUser.tts_voice)
                })
                .subscribe()
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
                triggerAlert(tx)
            })
            .subscribe()

        const triggerAlert = (tx: Partial<Transaction>) => {
            const item = { ...tx, exiting: false } as AlertItem

            // TTS Announcement
            if (ttsEnabled) {
                const text = `${tx.donor_name} paid ₹${tx.amount}${tx.message ? ` and said ${tx.message}` : ''}`

                const speakTts = async () => {
                    try {
                        if (Capacitor.isNativePlatform()) {
                            // Find matching voice object index to explicitly pass into native options
                            let targetVoiceIndex: number | undefined = undefined
                            const { voices } = await TextToSpeech.getSupportedVoices()
                            const matchingVoiceIdx = voices.findIndex(v => v.name === ttsVoice)
                            if (matchingVoiceIdx >= 0) targetVoiceIndex = matchingVoiceIdx

                            await TextToSpeech.speak({
                                text,
                                lang: 'hi-IN', // base locale fallback
                                pitch: 1.0,
                                rate: 1.0,
                                volume: 1.0,
                                voice: targetVoiceIndex
                            })
                        } else {
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
                        }
                    } catch (e) {
                        console.error("TTS Error:", e)
                    }
                }
                speakTts()
            }

            setAlerts(prev => [...prev, item])

            setTimeout(() => {
                setAlerts(prev => prev.map(a => a.id === item.id ? { ...a, exiting: true } : a))
            }, 4500)
            setTimeout(() => {
                setAlerts(prev => prev.filter(a => a.id !== item.id))
            }, 5000)
        }

        let previewInterval: any = null
        const params = new URLSearchParams(window.location.search)
        if (params.get('preview') === 'true') {
            const testTx = {
                id: `preview-tx-${Date.now()}`,
                donor_name: 'Preview User',
                amount: 500,
                message: "This is a test alert! Overlays are working.",
                source: 'UPI',
                triggered_at: new Date().toISOString()
            }
            
            // Trigger one immediately after templates load
            setTimeout(() => triggerAlert(testTx), 1000)
            
            // And trigger repeatedly every 6 seconds
            previewInterval = setInterval(() => {
                triggerAlert({ ...testTx, id: `preview-tx-${Date.now()}` })
            }, 6000)
        }

        return () => { 
            supabase.removeChannel(channel) 
            if (previewInterval) clearInterval(previewInterval)
        }
    }, [token, ttsEnabled, ttsVoice])

    const animKey = ANIMATIONS[activeTemplate?.animation_type ?? 'slide'] ?? 'slideIn'

    return (
        <div style={{ background: 'transparent', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '40px', gap: 12 }}>
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

