import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Templates from './pages/Templates'
import Pricing from './pages/Pricing'
import Payment from './pages/Payment'
import ReferEarn from './pages/ReferEarn'
import Overlay from './pages/Overlay'
import AdminPanel from './pages/AdminPanel'
import TemplateDesigner from './pages/TemplateDesigner'
import Profile from './pages/Profile'
import VoiceSettings from './pages/VoiceSettings'
import GoLive from './pages/GoLive'
import SetupGuide from './pages/SetupGuide'
import Support from './pages/Support'
import About from './pages/About'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import { useUpiListener } from './hooks/useUpiListener'
import { useLiveNotifications } from './hooks/useLiveNotifications'
import PermissionGuard from './components/PermissionGuard'
import DownloadApp from './pages/DownloadApp'
import { supabase } from './lib/supabase'
import './index.css'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div className="spinner spinner-lg" />
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { profile, loading, refreshProfile } = useAuth()
  useEffect(() => { refreshProfile() }, [])
  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}><div className="spinner spinner-lg" /></div>
  const isAuthorized = profile?.is_admin
  if (!isAuthorized) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: 16 }}>
      <div style={{ fontSize: 40 }}>🔒</div>
      <div style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>Admin Access Required</div>
      <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>Your account does not have admin privileges.</div>
      <button onClick={() => { refreshProfile().then(() => window.location.reload()) }} style={{ background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: 10, padding: '10px 20px', color: '#a855f7', fontSize: 14, fontWeight: 700, cursor: 'pointer', marginTop: 8 }}>
        Retry
      </button>
    </div>
  )
  return <>{children}</>
}

import { App as CapacitorApp } from '@capacitor/app'
import { Capacitor } from '@capacitor/core'
import { Clipboard } from '@capacitor/clipboard'
import { useNavigate } from 'react-router-dom'

function AppRoutes() {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  useUpiListener()   // auto-starts native SMS/notification listener on Android
  useLiveNotifications() // auto-starts native Supabase Push listeners on Android

  // Listen for custom scheme deep links (like com.upialert.live://login-callback)
  useEffect(() => {
    // ── Check Clipboard for Referral Link ──
    const checkClipboardForReferral = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          const { type, value } = await Clipboard.read()
          if (type === 'text/plain' && value && value.startsWith('UPIALERT-REF:')) {
            const refCode = value.split(':')[1]
            if (refCode && !localStorage.getItem('ref_code')) {
              localStorage.setItem('ref_code', refCode)
              await Clipboard.write({ string: '' })
            }
          }
        } catch (e) {
          console.log('Clipboard read skipped or failed', e)
        }
      }
    }
    checkClipboardForReferral()

    // ── Emergency Web Fallback for OAuth Redirects ──
    // If Supabase falls back to the Web URL (Netlify) instead of `com.upialert.live://`,
    // the user gets stuck in a browser tab. We detect the auth params on web and redirect to the deep link.
    if (!Capacitor.isNativePlatform() && (window.location.hash.includes('access_token=') || window.location.search.includes('code='))) {
      const isAndroid = /android/i.test(navigator.userAgent || navigator.vendor || (window as any).opera)
      if (isAndroid) {
        window.location.replace(`com.upialert.live://login-callback${window.location.search}${window.location.hash}`)
        return
      }
    }

    if (Capacitor.isNativePlatform()) {
      CapacitorApp.addListener('appUrlOpen', async (data) => {
        const urlStr = data.url
        if (urlStr.includes('com.upialert.live://')) {
          const { Browser } = await import('@capacitor/browser')
          // Close the Chrome Custom Tab that was opened by Login.tsx
          await Browser.close()

          try {
            // Handle PKCE flow (?code=...)
            if (urlStr.includes('?')) {
              const qs = urlStr.split('?')[1].split('#')[0]
              const queryParams = new URLSearchParams(qs)
              const code = queryParams.get('code')
              if (code) {
                await supabase.auth.exchangeCodeForSession(code)
              }
            }

            // Parse the access_token and refresh_token from the hash (Implicit flow)
            if (urlStr.includes('#')) {
              const hashParams = new URLSearchParams(urlStr.split('#')[1])
              const access_token = hashParams.get('access_token')
              const refresh_token = hashParams.get('refresh_token')
              
              if (access_token && refresh_token) {
                 await supabase.auth.setSession({ access_token, refresh_token })
              }
            }
          } catch (e) {
             console.error('Session injection failed', e)
          }

          // Force a slight delay to ensure session is saved to local storage before navigating
          setTimeout(() => {
              navigate('/dashboard', { replace: true })
          }, 300)
        }
      })
    }
  }, [navigate])

  return (
    <Routes>
      {/* Always serve the OBS overlay regardless of platform */}
      <Route path="/overlay/:token" element={<Overlay />} />
      
      {/* Route Web Traffic to Download Page */}
      {!Capacitor.isNativePlatform() ? (
        <>
           <Route path="/" element={<DownloadApp />} />
           <Route path="*" element={<Navigate to="/" replace />} />
        </>
      ) : (
        <>
          {/* Route Native App Traffic to the Dashboard */}
          <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="templates" element={<Templates />} />
            <Route path="voice-settings" element={<VoiceSettings />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="payment/:planId" element={<Payment />} />
            <Route path="refer" element={<ReferEarn />} />
            <Route path="profile" element={<Profile />} />
            <Route path="go-live" element={<GoLive />} />
            <Route path="setup-guide" element={<SetupGuide />} />
            <Route path="support" element={<Support />} />
            <Route path="about" element={<About />} />
            <Route path="terms" element={<Terms />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
            <Route path="admin/template-designer" element={<AdminRoute><TemplateDesigner /></AdminRoute>} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </>
      )}
    </Routes>
  )
}

function AppUpdateChecker() {
  const [update, setUpdate] = useState<any>(null)

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return
    
    const checkForUpdates = async () => {
      try {
        const info = await CapacitorApp.getInfo()
        // Some plugins might use build as the version code
        const currentVersionCode = parseInt(info.build || '0')
        
        const { data } = await supabase
          .from('app_updates')
          .select('*')
          .order('version_code', { ascending: false })
          .limit(1)
          .single()
          
        if (data && data.version_code > currentVersionCode) {
          setUpdate(data)
        }
      } catch (e) {
        console.error('Update check failed', e)
      }
    }
    
    checkForUpdates()
  }, [])

  if (!update) return null

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: '#1a1a24', borderRadius: 20, padding: 24, width: '100%', maxWidth: 400, border: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ fontSize: 40, textAlign: 'center', marginBottom: 16 }}>🚀</div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', textAlign: 'center', marginBottom: 8, marginTop: 0 }}>Update Available</h2>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', fontSize: 14, marginBottom: 20, marginTop: 0 }}>Version {update.version_name} is now available.</p>
        
        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 16, marginBottom: 20, maxHeight: 150, overflowY: 'auto' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Release Notes:</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', whiteSpace: 'pre-line', lineHeight: 1.5 }}>{update.release_notes || 'No release notes.'}</div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          {!update.is_mandatory && (
            <button onClick={() => setUpdate(null)} style={{ flex: 1, padding: 14, borderRadius: 12, background: 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
              Later
            </button>
          )}
          <button onClick={async () => {
             const { Browser } = await import('@capacitor/browser')
             await Browser.open({ url: update.apk_url })
          }} style={{ flex: 1, padding: 14, borderRadius: 12, background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
            Download & Install
          </button>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PermissionGuard>
          <AppRoutes />
          <AppUpdateChecker />
        </PermissionGuard>
      </AuthProvider>
    </BrowserRouter>
  )
}
