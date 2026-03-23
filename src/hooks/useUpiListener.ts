import { useEffect, useRef } from 'react'
import { Capacitor } from '@capacitor/core'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string

/**
 * useUpiListener — React hook that:
 * 1. On Android native: loads UpiListener plugin, starts SMS + notification listening,
 *    gets the device token, registers the device in Supabase, and forwards parsed
 *    payments to the parse-upi-sms Edge Function which then triggers the OBS overlay.
 * 2. On web: does nothing (graceful no-op).
 */
export function useUpiListener() {
    const { profile } = useAuth()
    const started = useRef(false)

    useEffect(() => {
        if (!Capacitor.isNativePlatform()) return   // web — skip
        if (!profile?.id) return
        if (started.current) return
        started.current = true

        let cleanup: (() => void) | null = null

        const init = async () => {
            // Dynamic import so web bundle never loads the native plugin
            const { UpiListener } = await import('../plugins/UpiListener/index')

            // 1. Get / generate device token
            const { token } = await UpiListener.getDeviceToken()

            // 2. Register device in Supabase
            await supabase.from('device_connections').upsert({
                user_id: profile.id,
                device_token: token,
                last_ping: new Date().toISOString(),
                is_active: true,
            }, { onConflict: 'device_token' })

            // Ping interval to keep device online in Admin Panel
            const pingInterval = setInterval(async () => {
                try {
                    await supabase.from('device_connections')
                        .update({ last_ping: new Date().toISOString() })
                        .eq('device_token', token)
                } catch (e) {
                    console.error('Ping error:', e)
                }
            }, 60 * 1000)

            const perms = await UpiListener.checkPermissions()
            // Note: PermissionGuard explicitly handles requesting permissions before the app loads.
            // If we reach here without permissions, it means the user manually revoked them via settings while the app was running.
            // We just log it; the next app reload will block them via PermissionGuard.
            if (!perms.sms || !perms.notifications) {
                console.warn("UpiListener started but missing permissions. This shouldn't happen during normal flow.")
            }

            // 3. Start native listeners
            await UpiListener.startListening()

            // 4. Listen for detected UPI payments
            const handle = await UpiListener.addListener('upiPaymentDetected', async (data) => {
                console.log('[UpiListener] upiPaymentDetected:', JSON.stringify(data))
                try {
                    // Send to Edge Function which parses + saves + triggers overlay
                    const res = await fetch(`${SUPABASE_URL}/functions/v1/parse-upi-sms`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'x-device-token': token },
                        body: JSON.stringify({
                            sms_text: data.raw_text,
                            device_token: token,
                            pre_parsed: data,
                        }),
                    })

                    const resBody = await res.json().catch(() => ({}))
                    if (!res.ok) {
                        console.error('[UpiListener] Edge function error:', res.status, JSON.stringify(resBody))
                    } else {
                        console.log('[UpiListener] Edge function success:', JSON.stringify(resBody))
                    }

                    // Update last_ping
                    await supabase.from('device_connections')
                        .update({ last_ping: new Date().toISOString() })
                        .eq('device_token', token)
                } catch (e) {
                    console.error('[UpiListener] Send error:', e)
                }
            })

            cleanup = () => {
                clearInterval(pingInterval)
                handle.remove()
                UpiListener.stopListening()
            }
        }

        init().catch(console.error)

        return () => { cleanup?.() }
    }, [profile?.id])
}
