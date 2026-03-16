import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import NotificationListener from './NotificationListener'
import { Home, LayoutGrid, Users, ShieldAlert } from 'lucide-react'

// Custom ₹ icon for Pricing tab
const RupeeIcon = ({ size = 24, strokeWidth = 2 }: { size?: number; strokeWidth?: number }) => (
    <span style={{ fontSize: size * 0.75, fontWeight: strokeWidth >= 2.5 ? 800 : 700, lineHeight: 1, fontFamily: 'system-ui, sans-serif' }}>₹</span>
)

// Bottom Nav configuration based on the design
const NAV = [
    { to: '/dashboard', Icon: Home, label: 'Dashboard' },
    { to: '/templates', Icon: LayoutGrid, label: 'Templates' },
    { to: '/pricing', Icon: RupeeIcon, label: 'Pricing' },
    { to: '/refer', Icon: Users, label: 'Refer' },
]

export default function Layout() {
    const { profile } = useAuth()

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: 'var(--bg)', paddingTop: 'env(safe-area-inset-top)' }}>
            <div className="noise-bg" />

            {/* Background Glows based on design */}
            <div className="glow-blob" style={{ width: 400, height: 400, background: '#22c55e', top: -100, left: -100 }} />
            <div className="glow-blob" style={{ width: 400, height: 400, background: '#a855f7', bottom: '20%', right: -150 }} />

            {/* MAIN CONTENT */}
            {/* Padding bottom added so content is not hidden behind the fixed bottom nav */}
            <main style={{
                flex: 1,
                overflowY: 'auto',
                position: 'relative',
                zIndex: 1,
                paddingBottom: 'calc(var(--nav-height) + env(safe-area-inset-bottom))'
            }}>
                <Outlet />
            </main>

            {/* BOTTOM NAV */}
            <nav className="bottom-nav">
                {NAV.filter(n => {
                    // Hide Pricing tab for lifetime plan users
                    if (n.to === '/pricing' && profile?.plan_id === 'lifetime') return false
                    return true
                }).map((n) => (
                    <NavLink
                        key={n.to}
                        to={n.to}
                        className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
                    >
                        {({ isActive }) => (
                            <>
                                <n.Icon
                                    className="bottom-nav-icon"
                                    size={24}
                                    strokeWidth={isActive ? 2.5 : 2}
                                />
                                <span>{n.label}</span>
                                {/* Small green indicator block when active */}
                                {isActive && (
                                    <div style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        width: '40%',
                                        height: 3,
                                        background: 'var(--green)',
                                        borderTopLeftRadius: 4,
                                        borderTopRightRadius: 4
                                    }} />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}

                {/* Admin Nav — visible to all admin users including team members */}
                {profile?.is_admin && (
                    <NavLink
                        to="/admin"
                        className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
                    >
                        {({ isActive }) => (
                            <>
                                <ShieldAlert
                                    className="bottom-nav-icon"
                                    size={24}
                                    strokeWidth={isActive ? 2.5 : 2}
                                />
                                <span>Admin</span>
                            </>
                        )}
                    </NavLink>
                )}
            </nav>

            <NotificationListener />
        </div>
    )
}
