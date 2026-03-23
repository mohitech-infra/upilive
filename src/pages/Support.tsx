import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Send, Headphones, Mail, MessageCircle, Trash2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

type Msg = { id: string; user_id: string; message: string; is_support: boolean; created_at: string }

export default function Support() {
    const { profile } = useAuth()
    const navigate = useNavigate()
    const [messages, setMessages] = useState<Msg[]>([])
    const [text, setText] = useState('')
    const [sending, setSending] = useState(false)
    const [loading, setLoading] = useState(true)
    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!profile) return
        const load = async (silent = false) => {
            if (!silent) setLoading(true)
            const { data } = await supabase
                .from('support_messages')
                .select('*')
                .eq('user_id', profile.id)
                .order('created_at', { ascending: true })
            if (data) {
                // Only update if length changed or we want to do a deep check, but for simplicity we can just replace
                // Actually to avoid scroll jumping, maybe only set if different?
                // For a simple chat, usually setting identical data is fine if keys don't change.
                setMessages(prev => {
                    if (prev.length === data.length) return prev // optimization to avoid re-renders if no new messages
                    return data as Msg[]
                })
            }
            if (!silent) setLoading(false)
        }
        load()

        // Auto-refresh every 3 seconds
        const interval = setInterval(() => load(true), 3000)

        // Real-time subscription (fallback/immediate)
        const channel = supabase
            .channel('support_' + profile.id)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'support_messages', filter: `user_id=eq.${profile.id}` },
                (payload) => setMessages(prev => {
                    if (prev.find(m => m.id === payload.new.id)) return prev
                    return [...prev, payload.new as Msg]
                })
            )
            .subscribe()
        return () => {
            clearInterval(interval)
            supabase.removeChannel(channel)
        }
    }, [profile])

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const sendMessage = async () => {
        if (!text.trim() || !profile) return
        setSending(true)
        const msg = text.trim()
        setText('')
        try {
            await supabase.from('support_messages').insert({
                user_id: profile.id,
                message: msg,
                is_support: false,
            })
        } catch (err) { 
            console.error('Support message submission failed:', err)
        }
        setSending(false)
    }

    const fmt = (iso: string) => {
        const d = new Date(iso)
        return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
    }

        const clearChat = async () => {
            if (!profile || messages.length === 0) return
            if (!window.confirm('Are you sure you want to clear this entire conversation?')) return
            setLoading(true)
            await supabase.from('support_messages').delete().eq('user_id', profile.id)
            setMessages([])
            setLoading(false)
        }

        return (
            <div style={{ height: '100vh', background: 'var(--bg)', fontFamily: 'var(--font-inter)', display: 'flex', flexDirection: 'column' }}>

                {/* Header */}
                <div style={{ padding: '20px 16px 16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
                    <button onClick={() => navigate('/dashboard')} style={{ background: 'rgba(255,255,255,0.07)', border: 'none', borderRadius: 8, padding: '8px', color: '#fff', cursor: 'pointer', display: 'flex' }}>
                        <ChevronLeft size={20} />
                    </button>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Headphones size={18} color="#22c55e" />
                    </div>
                    <div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>Support Chat</div>
                        <div style={{ fontSize: 11, color: '#22c55e', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} /> Usually responds in 24 hrs
                        </div>
                    </div>
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                        <button onClick={clearChat} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 8, padding: '7px', display: 'flex', color: '#ef4444', cursor: 'pointer' }} title="Clear Conversation">
                            <Trash2 size={15} />
                        </button>
                        <a href="mailto:support@upialert.live" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: 8, padding: '7px', display: 'flex', color: '#3b82f6' }}>
                            <Mail size={15} />
                        </a>
                        <a href="https://wa.me/91XXXXXXXXXX" target="_blank" rel="noreferrer" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 8, padding: '7px', display: 'flex', color: '#22c55e' }}>
                            <MessageCircle size={15} />
                        </a>
                    </div>
                </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
                {/* Welcome message */}
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                    <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.04)', borderRadius: 20, padding: '8px 16px', fontSize: 12, color: 'var(--text-muted)' }}>
                        👋 Chat with UPIAlert Support
                    </div>
                </div>

                {/* Auto welcome bubble */}
                <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg,#22c55e,#a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>🎧</div>
                    <div style={{ maxWidth: '75%' }}>
                        <div style={{ background: '#1a1a24', borderRadius: '12px 12px 12px 4px', padding: '12px 14px', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                            Hi! 👋 I'm the UPIAlert support team. Send us any question about setup, billing, or technical issues and we'll reply within 24 hours.
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4, marginLeft: 4 }}>UPIAlert Support</div>
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: 20 }}><div className="spinner" /></div>
                ) : (
                    messages.map(m => (
                        <div key={m.id} style={{ display: 'flex', flexDirection: m.is_support ? 'row' : 'row-reverse', gap: 10, marginBottom: 14 }}>
                            {m.is_support && (
                                <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg,#22c55e,#a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>🎧</div>
                            )}
                            <div style={{ maxWidth: '75%' }}>
                                <div style={{
                                    background: m.is_support ? '#1a1a24' : 'linear-gradient(135deg,#22c55e,#16a34a)',
                                    borderRadius: m.is_support ? '12px 12px 12px 4px' : '12px 12px 4px 12px',
                                    padding: '12px 14px', fontSize: 13,
                                    color: m.is_support ? 'var(--text-secondary)' : '#000',
                                    lineHeight: 1.65,
                                }}>
                                    {m.message}
                                </div>
                                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4, textAlign: m.is_support ? 'left' : 'right', padding: '0 4px' }}>
                                    {fmt(m.created_at)}
                                </div>
                            </div>
                        </div>
                    ))
                )}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div style={{ padding: '12px 16px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', flexShrink: 0, display: 'flex', gap: 10 }}>
                <input
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                    placeholder="Type your message..."
                    style={{ flex: 1, background: '#1a1a24', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '13px 16px', color: '#fff', fontSize: 14, fontFamily: 'var(--font-inter)', outline: 'none' }}
                />
                <button
                    onClick={sendMessage}
                    disabled={sending || !text.trim()}
                    style={{ width: 48, height: 48, borderRadius: 12, background: text.trim() ? 'linear-gradient(135deg,#22c55e,#16a34a)' : 'rgba(255,255,255,0.07)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: text.trim() ? 'pointer' : 'not-allowed', flexShrink: 0 }}
                >
                    <Send size={18} color={text.trim() ? '#000' : 'var(--text-muted)'} />
                </button>
            </div>
        </div>
    )
}
