import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Privacy() {
    const navigate = useNavigate()

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'var(--font-inter)', paddingBottom: 60 }}>
            {/* Header */}
            <div style={{ padding: '20px 16px 16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, background: 'rgba(8,11,14,0.8)', backdropFilter: 'blur(10px)', zIndex: 10 }}>
                <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.07)', border: 'none', borderRadius: 8, padding: '8px', color: '#fff', cursor: 'pointer', display: 'flex' }}>
                    <ChevronLeft size={20} />
                </button>
                <div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>Privacy Policy</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>How we protect your data</div>
                </div>
            </div>

            <div style={{ padding: '24px 20px', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 16, marginTop: 0 }}>1. Information We Collect</h2>
                <p style={{ marginBottom: 24 }}>
                    <strong>Personal Information:</strong> When you sign up, we collect your email address, name, and profile picture provided by Google/Facebook via Supabase Authentication.
                </p>
                <p style={{ marginBottom: 24 }}>
                    <strong>Device Data:</strong> The Android application requests permission to read SMS and Notifications. This is strictly required to intercept payment alerts from apps like Google Pay, PhonePe, Paytm, and your Bank. 
                </p>

                <h2 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 16 }}>2. How We Use Your Data</h2>
                <p style={{ marginBottom: 24 }}>
                    The Android application parses SMS and Notification data LOCALLY on your device. Only the extracted information (Donor Name, Amount, Source App, and Reference Number) is uploaded to our servers as a "Transaction" record.
                    <br /><br />
                    We NEVER upload, read, or store your personal messages, OTPs, or non-payment related notifications. The app uses strict RegEx patterns to only identify incoming financial credits.
                </p>

                <h2 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 16 }}>3. Data Storage and Security</h2>
                <p style={{ marginBottom: 24 }}>
                    Your data is securely stored in our Supabase PostgreSQL database, protected with Row-Level Security (RLS). You are the only person who can view your transaction history and profile details.
                </p>

                <h2 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 16 }}>4. Data Deletion</h2>
                <p style={{ marginBottom: 24 }}>
                    You have the right to request deletion of your account and all associated data at any time. If you wish to delete your data, please contact our support team. Upon deletion, all your transactions, profiles, and active webhook links will be permanently erased.
                </p>

                <h2 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 16 }}>5. Third Party Services</h2>
                <p style={{ marginBottom: 24 }}>
                    We use third-party tools like Supabase (Authentication and Database) and Vercel (Hosting). These services have their own Privacy Policies regarding how they handle data.
                </p>

                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 40, textAlign: 'center' }}>
                    Last updated: {new Date().toLocaleDateString()}
                </p>
            </div>
        </div>
    )
}
