import { useEffect } from 'react'
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
import { useNavigate } from 'react-router-dom'

function AppRoutes() {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  useUpiListener()   // auto-starts native SMS/notification listener on Android

  // Listen for custom scheme deep links (like com.upialert.live://login-callback)
  useEffect(() => {
    // ── Emergency Web Fallback ──
    // If Supabase redirected to the Netlify Site URL instead of the app schema,
    // we detect it running in Android mobile browser and manually push them back to the app.
    if (!Capacitor.isNativePlatform() && window.location.hash.includes('access_token=')) {
      const isAndroid = /android/i.test(navigator.userAgent || navigator.vendor || (window as any).opera)
      if (isAndroid) {
        window.location.replace(`com.upialert.live://login-callback${window.location.hash}`)
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

          // Parse the access_token and refresh_token from the hash
          if (urlStr.includes('#')) {
            const hashParams = new URLSearchParams(urlStr.split('#')[1])
            const access_token = hashParams.get('access_token')
            const refresh_token = hashParams.get('refresh_token')
            
            if (access_token && refresh_token) {
              await supabase.auth.setSession({
                access_token,
                refresh_token,
              })
            }
          }
          // Navigate to dashboard after login callback
          navigate('/dashboard', { replace: true })
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

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PermissionGuard>
          <AppRoutes />
        </PermissionGuard>
      </AuthProvider>
    </BrowserRouter>
  )
}
