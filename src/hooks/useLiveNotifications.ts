import { useEffect, useRef } from 'react'
import { Capacitor } from '@capacitor/core'
import { LocalNotifications } from '@capacitor/local-notifications'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export function useLiveNotifications() {
    const { profile } = useAuth()
    const isSubscribed = useRef(false)

    useEffect(() => {
        if (!profile?.id) return
        
        const initNotifications = async () => {
            // Only request and configure native notifications if we are on a native device
            if (Capacitor.isNativePlatform()) {
                const p = await LocalNotifications.checkPermissions()
                if (p.display !== 'granted') {
                    await LocalNotifications.requestPermissions()
                }
                
                // Create Android channels if needed
                await LocalNotifications.createChannel({
                    id: 'payments',
                    name: 'Payment Alerts',
                    description: 'Alerts for payment approvals and requests',
                    importance: 5,
                    visibility: 1,
                    vibration: true
                })
            }
        }

        initNotifications()

        if (isSubscribed.current) return
        isSubscribed.current = true

        const triggerNotification = async (title: string, body: string) => {
            if (Capacitor.isNativePlatform()) {
                await LocalNotifications.schedule({
                    notifications: [
                        {
                            title,
                            body,
                            id: new Date().getTime(),
                            schedule: { at: new Date(Date.now() + 100) },
                            channelId: 'payments'
                        }
                    ]
                })
            } else {
                console.log('Push Notification:', title, '-', body)
            }
        }

        // Setup Realtime Listener on `plan_purchases`
        const subscription = supabase.channel('plan_purchases_channel')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'plan_purchases' },
                (payload) => {
                    const newRow = payload.new as any
                    
                    if (payload.eventType === 'INSERT') {
                        // Admin Alert: Someone bought a plan or submitted a screenshot
                        // We only want to notify admins
                        if (profile.is_admin && newRow.status === 'pending') {
                            triggerNotification(
                                'New Payment Request',
                                `A user submitted an approval request for the ${newRow.plan_id.toUpperCase()} plan.`
                            )
                        }
                    } else if (payload.eventType === 'UPDATE') {
                        // User Alert: Admin approved or rejected their purchase
                        // We only want to notify the specific user
                        if (newRow.user_id === profile.id) {
                            if (newRow.status === 'approved') {
                                triggerNotification(
                                    '🎉 Payment Approved!',
                                    `Your payment for the ${newRow.plan_id.toUpperCase()} plan was approved. Enjoy premium features!`
                                )
                            } else if (newRow.status === 'rejected') {
                                triggerNotification(
                                    'Payment Rejected',
                                    `There was an issue approving your payment for the ${newRow.plan_id.toUpperCase()} plan.`
                                )
                            }
                        }
                    }
                }
            )
            .subscribe()

        return () => {
            subscription.unsubscribe()
        }
    }, [profile?.id, profile?.is_admin])
}
