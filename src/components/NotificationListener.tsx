import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import type { Transaction } from '../lib/supabase'

type Toast = { id: string; donor_name: string; amount: number; source: string }

export default function NotificationListener() {
    const { profile } = useAuth()
    const [toasts, setToasts] = useState<Toast[]>([])

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }, [])

    const addToast = useCallback((tx: Transaction) => {
        const id = tx.id
        setToasts(prev => [...prev, { id, donor_name: tx.donor_name, amount: tx.amount, source: tx.source }])
        // Play alert sound
        try {
            const ctx = new AudioContext()
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            osc.connect(gain)
            gain.connect(ctx.destination)
            osc.frequency.setValueAtTime(880, ctx.currentTime)
            osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1)
            gain.gain.setValueAtTime(0.3, ctx.currentTime)
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)
            osc.start(); osc.stop(ctx.currentTime + 0.4)
        } catch { }
        setTimeout(() => removeToast(id), 5000)
    }, [removeToast])

    useEffect(() => {
        if (!profile?.id) return

        const channel = supabase
            .channel(`notifications:${profile.id}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'transactions',
                filter: `user_id=eq.${profile.id}`,
            }, payload => {
                addToast(payload.new as Transaction)
            })
            .subscribe()

        return () => { supabase.removeChannel(channel) }
    }, [profile?.id, addToast])

    if (toasts.length === 0) return null

    return (
        <div className="toast-container">
            {toasts.map(t => (
                <div key={t.id} className="toast" onClick={() => removeToast(t.id)} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 8px var(--green)', flexShrink: 0 }} />
                        <span style={{ fontFamily: 'var(--font-orbitron)', fontSize: 10, color: 'var(--green)', letterSpacing: 2 }}>NEW DONATION</span>
                    </div>
                    <div style={{ fontFamily: 'var(--font-rajdhani)', fontWeight: 700, fontSize: 18, color: 'var(--text-primary)' }}>
                        {t.donor_name}
                    </div>
                    <div style={{ fontFamily: 'var(--font-orbitron)', fontWeight: 900, fontSize: 22, color: 'var(--green)' }}>
                        ₹{t.amount.toLocaleString('en-IN')}
                    </div>
                    <div style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                        via {t.source} · click to dismiss
                    </div>
                </div>
            ))}
        </div>
    )
}
