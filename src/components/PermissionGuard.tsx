import { useEffect, useState } from 'react'
import { Capacitor } from '@capacitor/core'

interface PermissionGuardProps {
    children: React.ReactNode
}

export default function PermissionGuard({ children }: PermissionGuardProps) {
    const [hasPermissions, setHasPermissions] = useState<boolean>(true)
    const [checking, setChecking] = useState<boolean>(true)
    const [needsSms, setNeedsSms] = useState<boolean>(false)
    const [needsNotif, setNeedsNotif] = useState<boolean>(false)
    const [needsPush, setNeedsPush] = useState<boolean>(false)

    const checkPerms = async () => {
        if (!Capacitor.isNativePlatform()) {
            setHasPermissions(true)
            setChecking(false)
            return
        }

        try {
            const { UpiListener } = await import('../plugins/UpiListener/index')
            const perms = await UpiListener.checkPermissions()
            
            const smsOk = !!perms.sms
            const notifOk = !!perms.notifications
            const pushOk = !!perms.push
            
            setNeedsSms(!smsOk)
            setNeedsNotif(!notifOk)
            setNeedsPush(!pushOk)
            
            // We require SMS, Notification Listener, AND Push Notifications to proceed fully
            setHasPermissions(smsOk && notifOk && pushOk)
        } catch (error) {
            console.error('Failed to check permissions:', error)
            // Fallback to true so we don't permanently brick the app if the plugin fails
            setHasPermissions(true)
        } finally {
            setChecking(false)
        }
    }

    // Check on mount
    useEffect(() => {
        checkPerms()
    }, [])

    // Check periodically if we are missing permissions (in case user grants them in settings and returns to the app)
    useEffect(() => {
        if (hasPermissions || checking) return

        const interval = setInterval(() => {
            checkPerms()
        }, 1500) // check every 1.5s while waiting

        return () => clearInterval(interval)
    }, [hasPermissions, checking])

    const handleGrantPermissions = async () => {
        try {
            const { UpiListener } = await import('../plugins/UpiListener/index')
            
            // requestPermissions in the native plugin now requests BOTH SMS and Push Notifications
            if (needsSms || needsPush) {
                await UpiListener.requestPermissions()
                await checkPerms()
            }
            
            if (needsNotif) {
                // If we still need notif access after potentially granting SMS/Push
                alert("UPIAlert Live needs Notification Access to read payments from GPay, Paytm, PhonePe, etc.\n\nPlease allow UPIAlert Live on the next screen.")
                await UpiListener.openNotificationSettings()
            }
        } catch (e) {
            console.error("Error requesting permissions", e)
        }
    }

    if (checking) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg)' }}>
                <div className="spinner spinner-lg"></div>
            </div>
        )
    }

    if (!hasPermissions) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                height: '100vh',
                background: 'var(--bg)',
                padding: '24px',
                textAlign: 'center'
            }}>
                <div style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    padding: '32px 24px',
                    maxWidth: '400px',
                    width: '100%',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
                }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 24px auto',
                        border: '1px solid rgba(239, 68, 68, 0.2)'
                    }}>
                        {/* Lock Icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                    </div>

                    <h2 style={{
                        fontFamily: 'var(--font-orbitron)',
                        fontSize: '20px',
                        color: 'var(--text-primary)',
                        marginBottom: '12px'
                    }}>
                        Permissions Required
                    </h2>

                    <p style={{
                        color: 'var(--text-secondary)',
                        fontSize: '14px',
                        lineHeight: '1.5',
                        marginBottom: '24px'
                    }}>
                        UPIAlert Live needs access to your <b>SMS</b> and <b>Notifications</b> in order to detect payments from apps like PhonePe, Google Pay, and Paytm, as well as <b>Push Notifications</b> so you can receive alerts from the Admin Panel.
                        <br /><br />
                        You cannot use the application without granting these permissions.
                    </p>

                    <button
                        onClick={handleGrantPermissions}
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                    >
                        Grant Permissions
                    </button>
                    
                    <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '16px' }}>
                        Missing: {[needsSms && "SMS", needsPush && "Push", needsNotif && "Notification Access"].filter(Boolean).join(" & ")}
                    </p>
                </div>
            </div>
        )
    }

    return <>{children}</>
}
