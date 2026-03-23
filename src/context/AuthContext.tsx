import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import type { UserProfile } from '../lib/supabase'

type AuthContextType = {
    user: User | null
    profile: UserProfile | null
    loading: boolean
    signOut: () => Promise<void>
    refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    profile: null,
    loading: true,
    signOut: async () => { },
    refreshProfile: async () => { },
})

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchProfile = async (authUser: User) => {
        const { data } = await supabase
            .from('users')
            .select('*')
            .eq('id', authUser.id)
            .single()
        if (data) {
            // Check for plan expiration
            if (data.plan_expires_at && new Date(data.plan_expires_at) < new Date()) {
                // Plan expired! Auto-downgrade to free
                await supabase.from('users').update({ plan_id: 'free', plan_expires_at: null }).eq('id', authUser.id)
                data.plan_id = 'free'
                data.plan_expires_at = null
            }

            // Enrich display_name from OAuth metadata if the DB row has none
            if (!data.display_name || data.display_name.trim() === '') {
                const meta = authUser.user_metadata ?? {}
                // Google / Facebook / GitHub provide full_name or name
                const name = meta.full_name || meta.name || meta.user_name || ''
                // Email fallback — use the part before @
                const emailPrefix = (authUser.email ?? '').split('@')[0]
                data.display_name = name || emailPrefix || 'User'
            }
            setProfile(data as UserProfile)
        }
    }

    const refreshProfile = async () => {
        if (user) await fetchProfile(user)
    }

    // ── Referral code processing on new signup ──────────────────────────────
    const processReferral = async (authUser: User) => {
        const refCode = localStorage.getItem('ref_code')
        if (!refCode) return
        try {
            // Look up the referrer by their referral_code
            const { data: referrer } = await supabase
                .from('users')
                .select('id')
                .eq('referral_code', refCode)
                .single()
            if (!referrer || referrer.id === authUser.id) return

            // Set referred_by on this new user
            await supabase
                .from('users')
                .update({ referred_by: referrer.id })
                .eq('id', authUser.id)

            // Create pending referral row (commission set when plan is approved)
            await supabase.from('referrals').upsert({
                referrer_id: referrer.id,
                referee_id: authUser.id,
                status: 'pending',
                commission_amount: 0,
            }, { onConflict: 'referee_id' })

            localStorage.removeItem('ref_code')
        } catch { /* ignore */ }
    }

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
            if (session?.user) fetchProfile(session.user)
            setLoading(false)
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null)
            if (session?.user) {
                fetchProfile(session.user)
                // Only process referral on fresh sign-in (not page refreshes)
                if (event === 'SIGNED_IN') {
                    processReferral(session.user)
                }
            } else {
                setProfile(null)
            }
            setLoading(false)
        })

        return () => subscription.unsubscribe()
    }, [])


    const signOut = async () => {
        await supabase.auth.signOut()
        setUser(null)
        setProfile(null)
    }

    return (
        <AuthContext.Provider value={{ user, profile, loading, signOut, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
