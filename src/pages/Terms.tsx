import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Terms() {
    const navigate = useNavigate()

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'var(--font-inter)', paddingBottom: 60 }}>
            {/* Header */}
            <div style={{ padding: '20px 16px 16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, background: 'rgba(8,11,14,0.8)', backdropFilter: 'blur(10px)', zIndex: 10 }}>
                <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.07)', border: 'none', borderRadius: 8, padding: '8px', color: '#fff', cursor: 'pointer', display: 'flex' }}>
                    <ChevronLeft size={20} />
                </button>
                <div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>Terms of Service</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>UPIAlert Live Legal Information</div>
                </div>
            </div>

            <div style={{ padding: '24px 20px', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 16, marginTop: 0 }}>1. Acceptance of Terms</h2>
                <p style={{ marginBottom: 24 }}>
                    By accessing and using UPIAlert Live ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
                </p>

                <h2 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 16 }}>2. Description of Service</h2>
                <p style={{ marginBottom: 24 }}>
                    UPIAlert Live provides a real-time donation alert overlay for streamers. To function, the Service requires access to your device's SMS and Notification listeners. The Service processes this data automatically to trigger visual alerts on your stream.
                </p>

                <h2 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 16 }}>3. User Conduct and Responsibilities</h2>
                <p style={{ marginBottom: 24 }}>
                    You are solely responsible for maintaining the confidentiality of your login information and for all activities that occur under your account. You agree to use the Service only for lawful purposes and in a way that does not infringe the rights of, restrict or inhibit anyone else's use and enjoyment of the Service.
                </p>

                <h2 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 16 }}>4. Subscription and Payments</h2>
                <p style={{ marginBottom: 24 }}>
                    Certain features of the Service are subject to a paid subscription or lifetime plan. All payments are non-refundable unless otherwise explicitly stated. We reserve the right to change our pricing upon reasonable notice to you.
                </p>

                <h2 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 16 }}>5. Limitation of Liability</h2>
                <p style={{ marginBottom: 24 }}>
                    UPIAlert Live is provided "as is" without any representations or warranties, express or implied. In no event shall UPIAlert Live or its developers be liable for any indirect, special, incidental, or consequential damages arising out of any use of or reliance on the Service, including but not limited to loss of donations, stream interruptions, or data leaks.
                </p>

                <h2 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 16 }}>6. Modifications to the Service</h2>
                <p style={{ marginBottom: 24 }}>
                    We reserve the right to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice. You agree that UPIAlert Live shall not be liable to you or to any third party for any modification, suspension or discontinuance of the Service.
                </p>

                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 40, textAlign: 'center' }}>
                    Last updated: {new Date().toLocaleDateString()}
                </p>
            </div>
        </div>
    )
}
