import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Save, Camera } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

export default function Profile() {
    const { profile, refreshProfile } = useAuth()
    const navigate = useNavigate()
    const [form, setForm] = useState({
        display_name: profile?.display_name ?? '',
        dob: (profile as any)?.dob ?? '',
        upi_id: profile?.upi_id ?? '',
        phone: (profile as any)?.phone ?? '',
        city: (profile as any)?.city ?? '',
        tts_enabled: (profile as any)?.tts_enabled ?? false,
        tts_voice: (profile as any)?.tts_voice ?? 'en-US-Standard-A',
    })
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [error, setError] = useState('')

    const handleSave = async () => {
        if (!profile) return
        setSaving(true)
        setError('')
        try {
            const { error: err } = await supabase.from('users').update({
                display_name: form.display_name.trim(),
                upi_id: form.upi_id.trim(),
                ...(form.dob ? { dob: form.dob } : {}),
                ...(form.phone ? { phone: form.phone.trim() } : {}),
                ...(form.city ? { city: form.city.trim() } : {}),
                tts_enabled: form.tts_enabled,
                tts_voice: form.tts_voice,
            }).eq('id', profile.id)
            if (err) throw err
            await refreshProfile()
            setSaved(true)
            setTimeout(() => setSaved(false), 2500)
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Failed to save. Try again.')
        } finally {
            setSaving(false)
        }
    }

    const fields = [
        { key: 'display_name', label: 'Display Name', type: 'text', placeholder: 'Your streamer name', icon: '👤' },
        { key: 'dob', label: 'Date of Birth', type: 'date', placeholder: '', icon: '🎂' },
        { key: 'upi_id', label: 'UPI ID', type: 'text', placeholder: 'yourname@upi', icon: '💳' },
        { key: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+91 9876543210', icon: '📱' },
        { key: 'city', label: 'City', type: 'text', placeholder: 'e.g. Mumbai', icon: '🏙️' },
    ]

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'var(--font-inter)', paddingBottom: 40 }}>

            {/* Header */}
            <div style={{ padding: '20px 16px 16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <button onClick={() => navigate('/dashboard')} style={{ background: 'rgba(255,255,255,0.07)', border: 'none', borderRadius: 8, padding: '8px', color: '#fff', cursor: 'pointer', display: 'flex' }}>
                    <ChevronLeft size={20} />
                </button>
                <div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>My Profile</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Edit your account info</div>
                </div>
            </div>

            <div style={{ padding: '24px 16px' }}>
                {/* Avatar */}
                <div style={{ textAlign: 'center', marginBottom: 28 }}>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        <div style={{ width: 88, height: 88, borderRadius: 24, background: 'linear-gradient(135deg,#22c55e,#a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, fontWeight: 800, color: '#fff' }}>
                            {(form.display_name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div style={{ position: 'absolute', bottom: -4, right: -4, width: 28, height: 28, borderRadius: '50%', background: '#1a1a24', border: '2px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                            <Camera size={13} color="var(--text-muted)" />
                        </div>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginTop: 12 }}>{form.display_name || 'Your Name'}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{profile?.plan_id?.toUpperCase() ?? 'FREE'} Plan</div>
                </div>

                {/* Fields */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {fields.map(f => (
                        <div key={f.key} style={{ background: '#1a1a24', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '14px 16px' }}>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: 0.5, marginBottom: 8 }}>{f.icon} {f.label.toUpperCase()}</div>
                            <input
                                type={f.type}
                                value={(form as any)[f.key]}
                                onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                                placeholder={f.placeholder}
                                style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: 15, fontWeight: 500, fontFamily: 'var(--font-inter)', colorScheme: 'dark', boxSizing: 'border-box' }}
                            />
                        </div>
                    ))}
                </div>



                {/* Plan badge */}
                <div style={{ background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: 14, padding: '14px 16px', marginTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 2 }}>Current Plan</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{profile?.plan_id?.toUpperCase() ?? 'FREE'}</div>
                    </div>
                    <button onClick={() => navigate('/pricing')} style={{ background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: 8, padding: '8px 14px', color: '#a855f7', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                        Upgrade
                    </button>
                </div>

                {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '12px 14px', fontSize: 13, color: '#ef4444', marginTop: 14 }}>{error}</div>}

                {/* Save */}
                <button
                    onClick={handleSave}
                    disabled={saving}
                    style={{ width: '100%', marginTop: 22, background: saved ? 'linear-gradient(135deg,#22c55e,#16a34a)' : 'linear-gradient(135deg,#a855f7,#7c3aed)', border: 'none', borderRadius: 14, padding: '16px', fontSize: 15, fontWeight: 700, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.3s' }}
                >
                    {saving ? <><div className="spinner" /> Saving...</> : saved ? <>✓ Saved!</> : <><Save size={16} /> Save Changes</>}
                </button>
            </div>
        </div>
    )
}
