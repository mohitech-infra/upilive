import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Copy, Check, ExternalLink, Smartphone, Wifi, WifiOff, Download, Radio } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

type Device = {
    id: string
    device_name: string
    last_ping: string | null
    is_active: boolean
    permissions_granted: { sms: boolean; notifications: boolean }
}

export default function GoLive() {
    const { profile, refreshProfile } = useAuth()
    const navigate = useNavigate()
    const [isLive, setIsLive] = useState(profile?.is_live ?? false)
    const [copiedOverlay, setCopiedOverlay] = useState(false)
    const [toggling, setToggling] = useState(false)
    const [device, setDevice] = useState<Device | null>(null)
    const [loadingDevice, setLoadingDevice] = useState(true)

    const overlayToken = profile?.overlay_token ?? ''
    const overlayUrl = overlayToken ? `${window.location.origin}/overlay/${overlayToken}` : ''

    useEffect(() => {
        if (!profile) return
        const fetchDevice = async () => {
            const { data } = await supabase
                .from('device_connections')
                .select('*')
                .eq('user_id', profile.id)
                .eq('is_active', true)
                .order('last_ping', { ascending: false })
                .limit(1)
                .single()
            if (data) setDevice(data as Device)
            setLoadingDevice(false)
        }
        fetchDevice()
    }, [profile])

    const copyOverlay = () => {
        if (!overlayUrl) return
        navigator.clipboard.writeText(overlayUrl)
        setCopiedOverlay(true)
        setTimeout(() => setCopiedOverlay(false), 2000)
    }

    const toggleLive = async () => {
        if (!profile) return
        setToggling(true)
        const newVal = !isLive
        const { error } = await supabase.from('users').update({ is_live: newVal }).eq('id', profile.id)
        if (!error) { setIsLive(newVal); await refreshProfile() }
        setToggling(false)
    }

    // Is device recently active? (last_ping within 5 minutes)
    const isDeviceOnline = device?.last_ping
        ? (Date.now() - new Date(device.last_ping).getTime()) < 5 * 60 * 1000
        : false

    const obsSteps = [
        { n: '1', title: 'Copy your OBS Overlay URL below', color: '#22c55e' },
        { n: '2', title: 'Open OBS Studio on your PC', color: '#3b82f6' },
        { n: '3', title: 'Sources → + → Browser Source → paste URL', color: '#a855f7' },
        { n: '4', title: 'Width: 800 · Height: 200 · Uncheck "Shutdown when hidden"', color: '#f59e0b' },
        { n: '5', title: 'Drag the overlay to bottom of your scene', color: '#ef4444' },
    ]

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'var(--font-inter)', paddingBottom: 40 }}>

            {/* Header */}
            <div style={{ padding: '20px 16px 16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <button onClick={() => navigate('/dashboard')} style={{ background: 'rgba(255,255,255,0.07)', border: 'none', borderRadius: 8, padding: '8px', color: '#fff', cursor: 'pointer', display: 'flex' }}>
                    <ChevronLeft size={20} />
                </button>
                <div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>Go Live</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>OBS overlay & device setup</div>
                </div>
            </div>

            <div style={{ padding: '20px 16px' }}>

                {/* Live Toggle */}
                <div style={{ background: isLive ? 'linear-gradient(135deg,rgba(239,68,68,0.15),rgba(239,68,68,0.05))' : 'linear-gradient(135deg,rgba(34,197,94,0.12),rgba(34,197,94,0.03))', border: `1px solid ${isLive ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)'}`, borderRadius: 16, padding: '20px 18px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            {isLive && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />}
                            <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{isLive ? '🔴 You are LIVE' : '⚫ Offline'}</div>
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{isLive ? 'Alerts will play on your OBS overlay' : 'Toggle to enable stream alerts'}</div>
                    </div>
                    <button
                        onClick={toggleLive}
                        disabled={toggling}
                        style={{ background: isLive ? 'rgba(239,68,68,0.2)' : 'linear-gradient(135deg,#22c55e,#16a34a)', border: isLive ? '1px solid rgba(239,68,68,0.4)' : 'none', borderRadius: 12, padding: '10px 18px', fontSize: 14, fontWeight: 700, color: isLive ? '#ef4444' : '#000', cursor: 'pointer' }}
                    >
                        {toggling ? '...' : isLive ? 'Stop' : 'Go Live!'}
                    </button>
                </div>

                {/* Device Status */}
                <div style={{ background: '#1a1a24', border: `1px solid ${isDeviceOnline ? 'rgba(34,197,94,0.25)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 16, padding: '18px', marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                        <Smartphone size={16} color={isDeviceOnline ? '#22c55e' : 'var(--text-muted)'} />
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Android Device</div>
                        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
                            {isDeviceOnline
                                ? <><Wifi size={14} color="#22c55e" /><span style={{ fontSize: 12, color: '#22c55e', fontWeight: 600 }}>Connected</span></>
                                : <><WifiOff size={14} color="var(--text-muted)" /><span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Not connected</span></>}
                        </div>
                    </div>

                    {loadingDevice ? (
                        <div style={{ textAlign: 'center', padding: '8px 0' }}><div className="spinner" style={{ width: 18, height: 18 }} /></div>
                    ) : device ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <div style={{ fontSize: 14, color: '#fff', fontWeight: 600 }}>{device.device_name}</div>
                            <div style={{ display: 'flex', gap: 10 }}>
                                <div style={{ flex: 1, background: `${device.permissions_granted?.sms ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.08)'}`, border: `1px solid ${device.permissions_granted?.sms ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.2)'}`, borderRadius: 8, padding: '8px 10px', textAlign: 'center' }}>
                                    <div style={{ fontSize: 11, color: device.permissions_granted?.sms ? '#22c55e' : '#ef4444', fontWeight: 700 }}>{device.permissions_granted?.sms ? '✓ SMS' : '✗ SMS'}</div>
                                </div>
                                <div style={{ flex: 1, background: `${device.permissions_granted?.notifications ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.08)'}`, border: `1px solid ${device.permissions_granted?.notifications ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.2)'}`, borderRadius: 8, padding: '8px 10px', textAlign: 'center' }}>
                                    <div style={{ fontSize: 11, color: device.permissions_granted?.notifications ? '#22c55e' : '#ef4444', fontWeight: 700 }}>{device.permissions_granted?.notifications ? '✓ Notifications' : '✗ Notifications'}</div>
                                </div>
                            </div>
                            {device.last_ping && (
                                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                                    Last active: {new Date(device.last_ping).toLocaleString('en-IN')}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12, lineHeight: 1.6 }}>
                                No device connected yet. Install the UPIAlert app on your Android phone to start receiving automatic alerts.
                            </div>
                            <a
                                href="/download/upialert.apk"
                                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg,#22c55e,#16a34a)', borderRadius: 10, padding: '10px 18px', fontSize: 13, fontWeight: 700, color: '#000', textDecoration: 'none' }}
                            >
                                <Download size={14} /> Download UPIAlert App
                            </a>
                        </div>
                    )}
                </div>

                {/* OBS Overlay URL */}
                <div style={{ background: '#1a1a24', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '18px', marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                        <Radio size={16} color="#a855f7" />
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>OBS Overlay URL</div>
                    </div>
                    {overlayUrl ? (
                        <>
                            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '12px 14px', fontSize: 12, color: 'var(--text-muted)', wordBreak: 'break-all', lineHeight: 1.6, marginBottom: 12 }}>
                                {overlayUrl}
                            </div>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <button onClick={copyOverlay} style={{ flex: 1, background: copiedOverlay ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.07)', border: copiedOverlay ? '1px solid rgba(34,197,94,0.4)' : '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '11px', fontSize: 13, fontWeight: 700, color: copiedOverlay ? '#22c55e' : '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                                    {copiedOverlay ? <Check size={14} /> : <Copy size={14} />} {copiedOverlay ? 'Copied!' : 'Copy URL'}
                                </button>
                                <button onClick={() => window.open(`${overlayUrl}?preview=true`, '_blank')} style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 10, padding: '11px', color: '#3b82f6', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                    <ExternalLink size={14} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', padding: '12px 0' }}>⚠️ No overlay token. Contact support.</div>
                    )}
                </div>

                {/* OBS Setup Quick Steps */}
                <div style={{ background: '#1a1a24', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '16px 18px' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 12 }}>Quick OBS Setup</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {obsSteps.map(s => (
                            <div key={s.n} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                                <div style={{ width: 24, height: 24, borderRadius: 7, background: `${s.color}20`, border: `1px solid ${s.color}50`, color: s.color, fontSize: 11, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>{s.n}</div>
                                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{s.title}</div>
                            </div>
                        ))}
                    </div>
                    <button onClick={() => navigate('/setup-guide')} style={{ marginTop: 14, width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '10px', fontSize: 12, color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 600 }}>
                        Full Setup Guide →
                    </button>
                </div>

            </div>
        </div>
    )
}
