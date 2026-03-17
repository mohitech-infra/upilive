import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { ArrowLeft, Save, Play, Loader2 } from 'lucide-react'
import { Capacitor } from '@capacitor/core'
import { TextToSpeech } from '@capacitor-community/text-to-speech'

export default function VoiceSettings() {
    const { profile, refreshProfile } = useAuth()
    const navigate = useNavigate()

    const [form, setForm] = useState({
        tts_enabled: false,
        tts_voice: 'hi-IN', // simplified string format for settings
    })
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [error, setError] = useState('')
    const [playing, setPlaying] = useState(false)
    const [availableVoices, setAvailableVoices] = useState<any[]>([])

    useEffect(() => {
        if (profile) {
            setForm({
                tts_enabled: profile.tts_enabled ?? false,
                tts_voice: profile.tts_voice ?? 'hi-IN',
            })
        }
    }, [profile])

    useEffect(() => {
        if (Capacitor.isNativePlatform()) {
            TextToSpeech.getSupportedVoices().then(res => {
                // Filter for Hindi/English or just return all prioritizing Google/Samsung standard models
                setAvailableVoices(res.voices.filter(v => v.lang.includes('hi') || v.lang.includes('en-IN') || v.name.toLowerCase().includes('hindi')))
            }).catch(e => console.log('TTS init error:', e))
        }
    }, [])

    const handleSave = async () => {
        if (!profile) return
        setSaving(true)
        setError('')
        setSaved(false)
        try {
            const { error: err } = await supabase.from('users').update({
                tts_enabled: form.tts_enabled,
                tts_voice: form.tts_voice,
            }).eq('id', profile.id)
            if (err) throw err
            await refreshProfile()
            setSaved(true)
            setTimeout(() => setSaved(false), 2000)
        } catch (e: any) {
            setError(e.message)
        }
        setSaving(false)
    }

    const playPreview = async () => {
        setPlaying(true)
        setError('')
        try {
            const sampleText = 'यह एक ध्वनि परीक्षण है, धन्यवाद।'
            
            if (Capacitor.isNativePlatform()) {
                await TextToSpeech.speak({
                    text: sampleText,
                    lang: 'hi-IN', // fallbacks to Hindi if voice cannot be matched
                    rate: 1.0,
                    pitch: 1.0,
                    volume: 1.0,
                    // If the user picked a specific native voice by name
                    voice: availableVoices.findIndex(v => v.name === form.tts_voice) >= 0 
                        ? availableVoices.findIndex(v => v.name === form.tts_voice) 
                        : undefined
                })
                setPlaying(false)
            } else {
                // Web Fallback
                if (window.speechSynthesis) {
                    const voices = window.speechSynthesis.getVoices()
                    const exactMatch = voices.find(v => v.voiceURI === form.tts_voice || v.name === form.tts_voice)

                    window.speechSynthesis.cancel()
                    const utterance = new SpeechSynthesisUtterance(sampleText)
                    utterance.lang = 'hi-IN'
                    if (exactMatch) {
                        utterance.voice = exactMatch
                    }

                    utterance.onend = () => setPlaying(false)
                    utterance.onerror = (e) => {
                        console.error('SpeechSynthesis Error', e)
                        setError('Error playing speech synthesis.')
                        setPlaying(false)
                    }

                    window.speechSynthesis.speak(utterance)
                } else {
                    setError('Your browser does not support text to speech API.')
                    setPlaying(false)
                }
            }
        } catch (err: any) {
            setError('Could not play preview: ' + err.message)
            setPlaying(false)
        }
    }

    return (
        <div style={{ padding: '0', maxWidth: 480, margin: '0 auto', fontFamily: 'var(--font-inter)', background: 'var(--bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer' }}>
                    <ArrowLeft size={18} />
                </button>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>AI Voice Settings</div>
            </div>

            <div style={{ padding: '24px 16px', flex: 1 }}>
                <div style={{ background: '#1a1a24', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 2 }}>🔊 AI Voice Announcements</div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Read out donor name, amount, and message</div>
                        </div>
                        <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                            <div style={{ position: 'relative', width: 44, height: 24, borderRadius: 12, background: form.tts_enabled ? '#22c55e' : 'rgba(255,255,255,0.1)', transition: 'background 0.3s' }}>
                                <div style={{ position: 'absolute', top: 2, left: form.tts_enabled ? 22 : 2, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} />
                            </div>
                            <input type="checkbox" checked={form.tts_enabled} onChange={e => setForm(prev => ({ ...prev, tts_enabled: e.target.checked }))} style={{ display: 'none' }} />
                        </label>
                    </div>

                    {form.tts_enabled && (
                        <div style={{ marginTop: 20, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 20, animation: 'fadeIn 0.3s ease' }}>
                            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 10, fontWeight: 600 }}>Select Voice Model</div>
                            <div style={{ display: 'flex', gap: 10 }}>
                                <select
                                    value={form.tts_voice}
                                    onChange={e => setForm(prev => ({ ...prev, tts_voice: e.target.value }))}
                                    style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px 14px', color: '#fff', fontSize: 14, outline: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                                >
                                    <option value="hi-IN" style={{ color: '#000' }}>Default OS Hindi Voice</option>
                                    <option value="en-IN" style={{ color: '#000' }}>Default OS Indian English</option>
                                    {availableVoices.map((v, i) => (
                                        <option key={i} value={v.name} style={{ color: '#000' }}>
                                            {v.name.replace(/([a-z])([A-Z])/g, '$1 $2')} ({v.lang})
                                        </option>
                                    ))}
                                    {/* Web Fallbacks */}
                                    {availableVoices.length === 0 && (
                                        <>
                                            <option value="hi-IN-Standard-A" style={{ color: '#000' }}>Google Hindi (Standard A)</option>
                                            <option value="hi-IN-Standard-B" style={{ color: '#000' }}>Google Hindi (Standard B)</option>
                                            <option value="Microsoft Swara Online (Natural) - Hindi (India)" style={{ color: '#000' }}>Microsoft Swara (Hindi Female)</option>
                                            <option value="Microsoft Madhur Online (Natural) - Hindi (India)" style={{ color: '#000' }}>Microsoft Madhur (Hindi Male)</option>
                                        </>
                                    )}
                                </select>
                                <button
                                    onClick={playPreview}
                                    disabled={playing}
                                    style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', color: '#3b82f6', width: 44, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: playing ? 'not-allowed' : 'pointer', opacity: playing ? 0.7 : 1 }}
                                    title="Play Preview"
                                >
                                    {playing ? <Loader2 size={18} className="spinner" /> : <Play size={18} />}
                                </button>
                            </div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 12, opacity: 0.7, lineHeight: 1.5 }}>
                                Note: High quality models attempt to use your browser's native capabilities. If the specific voice isn't installed locally, a standard cloud Hindi voice will automatically be streamed instead so you always have audio.
                            </div>
                        </div>
                    )}
                </div>

                {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '12px 14px', fontSize: 13, color: '#ef4444', marginTop: 16 }}>{error}</div>}

                {/* Save */}
                <button
                    onClick={handleSave}
                    disabled={saving}
                    style={{ width: '100%', marginTop: 24, background: saved ? 'linear-gradient(135deg,#22c55e,#16a34a)' : 'linear-gradient(135deg,#a855f7,#7c3aed)', border: 'none', borderRadius: 14, padding: '16px', fontSize: 16, fontWeight: 700, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.3s' }}
                >
                    {saving ? <><div className="spinner" /> Saving...</> : saved ? <>✓ Saved!</> : <><Save size={18} /> Save Settings</>}
                </button>
            </div>
        </div>
    )
}
