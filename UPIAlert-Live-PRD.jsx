import { useState } from "react";

const sections = [
  { id: "overview", label: "📋 Overview", icon: "📋" },
  { id: "problem", label: "🎯 Problem & Goals", icon: "🎯" },
  { id: "users", label: "👤 Users", icon: "👤" },
  { id: "features", label: "⚡ Features", icon: "⚡" },
  { id: "technical", label: "🔧 Technical", icon: "🔧" },
  { id: "pricing", label: "💰 Pricing", icon: "💰" },
  { id: "referral", label: "🔗 Referral", icon: "🔗" },
  { id: "ui", label: "🎨 UI Design", icon: "🎨" },
  { id: "admin", label: "🛡️ Admin Panel", icon: "🛡️" },
  { id: "roadmap", label: "🗺️ Roadmap", icon: "🗺️" },
];

const pricingPlans = [
  { name: "Free", price: "₹0", period: "Forever", alerts: "30/day", templates: "1 Basic", color: "#6b7280", badge: null },
  { name: "Starter", price: "₹299", period: "1 Month", alerts: "150/day", templates: "1 Basic + 3 Premium", color: "#22c55e", badge: "Popular" },
  { name: "Growth", price: "₹599", period: "3 Months", alerts: "350/day", templates: "1 Basic + 5 Premium", color: "#a855f7", badge: null },
  { name: "Pro", price: "₹799", period: "6 Months", alerts: "Unlimited", templates: "1 Basic + 10 Premium", color: "#22c55e", badge: "Best Value" },
  { name: "Annual", price: "₹1499", period: "1 Year", alerts: "Unlimited", templates: "All Premium + Early Access", color: "#a855f7", badge: "🔥 Hot" },
  { name: "Lifetime", price: "₹5999", period: "Lifetime", alerts: "Unlimited", templates: "All Premium + Early Access", color: "#f59e0b", badge: "⭐ Elite" },
];

const features = [
  {
    category: "Notification Engine",
    items: [
      "Read payment notifications from PhonePe, Google Pay, Paytm in real-time",
      "Read SMS from banks to extract payment details",
      "Parse donor name and amount from notification/SMS payload",
      "Filter and ignore non-payment notifications",
      "Queue alerts with delay control (streamer can set 0–10s delay)",
      "Per-day alert cap based on pricing plan",
    ],
  },
  {
    category: "Overlay System",
    items: [
      "Generate unique browser-source URL per streamer",
      "OBS Studio & Prism Live Studio compatible (browser source)",
      "Animated overlay showing donor name + amount + custom message",
      "Multiple overlay templates (locked by plan)",
      "Custom sound alerts per template",
      "Overlay preview in app before going live",
      "Streamer can customize text, font, animation speed",
    ],
  },
  {
    category: "Authentication",
    items: [
      "Google OAuth login",
      "Facebook OAuth login",
      "Email + Password with email verification",
      "Mobile Number + OTP (SMS-based)",
      "Auto dark-mode enforced app-wide",
    ],
  },
  {
    category: "Dashboard (Home Tab)",
    items: [
      "Total earnings lifetime & today",
      "Top donors leaderboard",
      "Recent transactions list",
      "Alerts sent today vs plan limit",
      "Live session toggle (activate/deactivate overlay)",
      "Quick copy overlay URL button",
    ],
  },
  {
    category: "Templates Tab",
    items: [
      "Gallery of all overlay templates",
      "Locked premium templates shown with plan badge",
      "Live preview of selected template",
      "One-click activate template",
      "Custom color/text settings per template",
    ],
  },
  {
    category: "Refer & Earn Tab",
    items: [
      "Unique referral code & shareable link per user",
      "25% commission on every paid plan purchase via referral",
      "Earnings dashboard: pending, approved, withdrawn",
      "Minimum withdrawal threshold: ₹200",
      "Payout via UPI",
    ],
  },
];

const techStack = [
  { layer: "Mobile App", tech: "Flutter (Android First)", note: "Notification listener service + SMS reader" },
  { layer: "Backend API", tech: "Node.js + Express / Firebase Functions", note: "Auth, alerts, plans, referrals" },
  { layer: "Database", tech: "Firebase Firestore / PostgreSQL", note: "Users, transactions, templates" },
  { layer: "Auth", tech: "Firebase Auth", note: "Google, Facebook, Email, Phone OTP" },
  { layer: "Overlay Server", tech: "WebSocket (Socket.io)", note: "Real-time push to browser source URL" },
  { layer: "Overlay Frontend", tech: "HTML/CSS/JS (served via CDN)", note: "OBS browser source compatible" },
  { layer: "Payments", tech: "Razorpay / Cashfree", note: "Subscription & one-time plans" },
  { layer: "SMS Parsing", tech: "Android SMS Listener API", note: "Bank SMS regex parsing" },
  { layer: "Notifications", tech: "NotificationListenerService (Android)", note: "PhonePe / GPay / Paytm" },
  { layer: "Admin Panel", tech: "React + Tailwind (Web)", note: "Separate secure web portal" },
];

const adminFeatures = [
  { module: "User Management", desc: "View all users, plan status, ban/unban, manual plan assignment" },
  { module: "Transaction Logs", desc: "All alerts triggered, timestamps, donor names, amounts per user" },
  { module: "Revenue Dashboard", desc: "Total revenue, MRR, ARR, plan-wise breakdown, churn rate" },
  { module: "Referral Management", desc: "Track all referrals, commissions earned, payout requests, approve/reject" },
  { module: "Template Manager", desc: "Upload new overlay templates, assign to plans, enable/disable" },
  { module: "Notification Logs", desc: "Which apps triggered alerts, error logs for failed parses" },
  { module: "Plan & Pricing Editor", desc: "Update plan prices, limits, descriptions without code deploy" },
  { module: "Broadcast", desc: "Send push notifications to all users or specific segments" },
  { module: "Support Tickets", desc: "In-app support ticket view and response system" },
  { module: "Analytics", desc: "DAU, MAU, retention curves, top streamers, overlay usage stats" },
];

const roadmap = [
  { phase: "Phase 1 — MVP", duration: "0–8 weeks", tasks: ["Android app with notification + SMS reader", "Basic overlay (1 template)", "Firebase auth (Google + Phone OTP)", "Free plan enforcement", "OBS browser source URL generation", "Simple dashboard"] },
  { phase: "Phase 2 — Monetization", duration: "8–14 weeks", tasks: ["Razorpay payment integration", "All 6 plans live", "Template gallery (5 templates)", "Plan-based template locking", "Referral system v1", "Admin panel v1"] },
  { phase: "Phase 3 — Growth", duration: "14–20 weeks", tasks: ["Facebook + Email auth", "10+ overlay templates", "Custom sound alerts", "Refer & earn payouts (UPI)", "Advanced dashboard analytics", "Admin panel v2 (full)"] },
  { phase: "Phase 4 — Scale", duration: "20–28 weeks", tasks: ["iOS app", "API for 3rd party integrations", "AI-suggested donor messages", "Clip highlights integration", "Multi-language support (Hindi, Tamil, Telugu)"] },
];

export default function PRD() {
  const [active, setActive] = useState("overview");
  const [expandedFeature, setExpandedFeature] = useState(null);

  const scrollTo = (id) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div style={{
      fontFamily: "'Rajdhani', 'Orbitron', sans-serif",
      background: "#050508",
      minHeight: "100vh",
      color: "#e2e8f0",
      display: "flex",
      position: "relative",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Orbitron:wght@400;700;900&family=Inter:wght@300;400;500&display=swap');
        
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0a0f; }
        ::-webkit-scrollbar-thumb { background: #22c55e44; border-radius: 2px; }

        .glass {
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(34,197,94,0.15);
        }
        .glass-purple {
          background: rgba(168,85,247,0.06);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(168,85,247,0.2);
        }
        .glass-green {
          background: rgba(34,197,94,0.06);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(34,197,94,0.25);
        }
        .nav-item {
          cursor: pointer;
          padding: 10px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.5px;
          transition: all 0.2s;
          border: 1px solid transparent;
          margin-bottom: 4px;
          color: #94a3b8;
          font-family: 'Rajdhani', sans-serif;
        }
        .nav-item:hover { background: rgba(34,197,94,0.08); color: #22c55e; border-color: rgba(34,197,94,0.2); }
        .nav-item.active { background: rgba(34,197,94,0.12); color: #22c55e; border-color: rgba(34,197,94,0.35); }
        
        .section-heading {
          font-family: 'Orbitron', monospace;
          font-weight: 700;
          font-size: 22px;
          letter-spacing: 2px;
          background: linear-gradient(135deg, #22c55e, #a855f7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 24px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(34,197,94,0.15);
        }
        .tag {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
          font-family: 'Rajdhani', sans-serif;
        }
        .card {
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 16px;
          position: relative;
          overflow: hidden;
        }
        .glow-green { box-shadow: 0 0 30px rgba(34,197,94,0.08); }
        .glow-purple { box-shadow: 0 0 30px rgba(168,85,247,0.08); }
        
        .noise-bg {
          position: fixed;
          inset: 0;
          opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
        }
        .grid-bg {
          position: fixed;
          inset: 0;
          background-image: linear-gradient(rgba(34,197,94,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.04) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
          z-index: 0;
        }
        .content-area { position: relative; z-index: 1; }
        
        .plan-card {
          border-radius: 14px;
          padding: 20px;
          margin-bottom: 12px;
          transition: transform 0.2s;
          position: relative;
          overflow: hidden;
        }
        .plan-card:hover { transform: translateY(-2px); }
        
        .feature-cat {
          border-radius: 10px;
          margin-bottom: 12px;
          overflow: hidden;
        }
        .feature-header {
          padding: 14px 18px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(34,197,94,0.06);
          border: 1px solid rgba(34,197,94,0.15);
          border-radius: 10px;
          transition: all 0.2s;
        }
        .feature-header:hover { background: rgba(34,197,94,0.1); }
        .feature-body {
          background: rgba(0,0,0,0.3);
          border: 1px solid rgba(34,197,94,0.1);
          border-top: none;
          padding: 16px 18px;
          border-radius: 0 0 10px 10px;
        }
        
        .tech-row {
          display: grid;
          grid-template-columns: 160px 200px 1fr;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 8px;
          align-items: center;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          transition: all 0.2s;
          font-family: 'Inter', sans-serif;
        }
        .tech-row:hover { background: rgba(34,197,94,0.05); border-color: rgba(34,197,94,0.15); }
        
        .phase-card {
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 14px;
        }
        .admin-row {
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 16px;
          padding: 14px 16px;
          border-radius: 8px;
          margin-bottom: 8px;
          background: rgba(168,85,247,0.04);
          border: 1px solid rgba(168,85,247,0.12);
          font-family: 'Inter', sans-serif;
          transition: all 0.2s;
        }
        .admin-row:hover { background: rgba(168,85,247,0.08); border-color: rgba(168,85,247,0.25); }

        @media (max-width: 768px) {
          .tech-row { grid-template-columns: 1fr; }
          .admin-row { grid-template-columns: 1fr; }
          .sidebar { display: none; }
        }
      `}</style>

      <div className="noise-bg" />
      <div className="grid-bg" />

      {/* Sidebar */}
      <div className="sidebar content-area" style={{
        width: 200,
        flexShrink: 0,
        position: "sticky",
        top: 0,
        height: "100vh",
        overflowY: "auto",
        padding: "24px 12px",
        borderRight: "1px solid rgba(34,197,94,0.1)",
        background: "rgba(5,5,8,0.9)",
        backdropFilter: "blur(20px)",
      }}>
        <div style={{ marginBottom: 28, paddingLeft: 6 }}>
          <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 13, fontWeight: 900, color: "#22c55e", letterSpacing: 2 }}>UPIAlert</div>
          <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 10, color: "#a855f7", letterSpacing: 3 }}>LIVE</div>
          <div style={{ fontSize: 10, color: "#475569", marginTop: 4, fontFamily: "'Inter', sans-serif", letterSpacing: 1 }}>PRD v1.0</div>
        </div>
        {sections.map(s => (
          <div key={s.id} className={`nav-item ${active === s.id ? "active" : ""}`} onClick={() => scrollTo(s.id)}>
            {s.label}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="content-area" style={{ flex: 1, padding: "40px 48px", overflowY: "auto", maxWidth: 900 }}>

        {/* Hero */}
        <div style={{ marginBottom: 48, textAlign: "center", padding: "40px 20px" }}>
          <div style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: 42,
            fontWeight: 900,
            letterSpacing: 4,
            background: "linear-gradient(135deg, #22c55e 0%, #a855f7 50%, #22c55e 100%)",
            backgroundSize: "200%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: 8,
          }}>UPIAlert Live</div>
          <div style={{ fontSize: 14, color: "#64748b", letterSpacing: 6, fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, marginBottom: 20 }}>PRODUCT REQUIREMENTS DOCUMENT</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            {[["Version", "1.0"], ["Status", "Draft"], ["Platform", "Android"], ["Category", "Streamer Tools"]].map(([k, v]) => (
              <div key={k} className="glass" style={{ padding: "6px 16px", borderRadius: 8, fontSize: 12, fontFamily: "'Inter', sans-serif" }}>
                <span style={{ color: "#64748b" }}>{k}: </span>
                <span style={{ color: "#22c55e", fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* OVERVIEW */}
        <section id="overview" style={{ marginBottom: 56 }}>
          <div className="section-heading">01 — PRODUCT OVERVIEW</div>
          <div className="card glass glow-green" style={{ padding: 28 }}>
            <p style={{ fontFamily: "'Inter', sans-serif", lineHeight: 1.8, fontSize: 15, color: "#cbd5e1", marginBottom: 20 }}>
              <strong style={{ color: "#22c55e" }}>UPIAlert Live</strong> is an Android application designed for content creators and live streamers in India who receive donations through UPI payment apps. The app monitors incoming payment notifications and SMS messages in real-time, extracts donor name and amount, then displays them as beautiful animated overlays on the streamer's live broadcast via OBS Studio or any streaming software that supports browser sources.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              {[
                { label: "Target Market", value: "Indian Live Streamers", icon: "🇮🇳" },
                { label: "Platform", value: "Android App", icon: "📱" },
                { label: "Revenue Model", value: "Freemium + Subscriptions", icon: "💸" },
                { label: "Core Value", value: "Real-time UPI Alerts", icon: "⚡" },
                { label: "Integration", value: "OBS / Prism Live", icon: "🎮" },
                { label: "Monetization", value: "6 Plan Tiers", icon: "💎" },
              ].map(item => (
                <div key={item.label} className="glass-green" style={{ padding: "14px 16px", borderRadius: 10 }}>
                  <div style={{ fontSize: 20, marginBottom: 6 }}>{item.icon}</div>
                  <div style={{ fontSize: 11, color: "#64748b", fontFamily: "'Inter', sans-serif", letterSpacing: 1, marginBottom: 4 }}>{item.label.toUpperCase()}</div>
                  <div style={{ fontSize: 13, color: "#e2e8f0", fontWeight: 600, fontFamily: "'Rajdhani', sans-serif" }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PROBLEM & GOALS */}
        <section id="problem" style={{ marginBottom: 56 }}>
          <div className="section-heading">02 — PROBLEM STATEMENT & GOALS</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="card glass-purple glow-purple">
              <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 12, color: "#a855f7", letterSpacing: 2, marginBottom: 16 }}>THE PROBLEM</div>
              {[
                "Indian streamers receive UPI donations but have no way to display them as on-screen alerts",
                "Existing alert tools (StreamElements, StreamLabs) don't support UPI payments",
                "Streamers manually read out donations — breaks immersion and causes missed donations",
                "No dedicated tool exists for the Indian streaming market's dominant payment method",
              ].map((p, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 12, fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>
                  <span style={{ color: "#a855f7", flexShrink: 0 }}>✗</span> {p}
                </div>
              ))}
            </div>
            <div className="card glass-green glow-green">
              <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 12, color: "#22c55e", letterSpacing: 2, marginBottom: 16 }}>OUR SOLUTION</div>
              {[
                "Automatically reads UPI payment notifications & bank SMS",
                "Instantly triggers beautiful animated on-screen alerts",
                "Works with OBS, Prism, or any software via browser source",
                "Supports all major UPI apps — PhonePe, Google Pay, Paytm",
                "Tiered plans to serve casual streamers and professional creators",
              ].map((p, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 12, fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>
                  <span style={{ color: "#22c55e", flexShrink: 0 }}>✓</span> {p}
                </div>
              ))}
            </div>
          </div>

          <div className="card glass" style={{ marginTop: 4 }}>
            <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 12, color: "#22c55e", letterSpacing: 2, marginBottom: 16 }}>SUCCESS METRICS</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
              {[["1,000", "Users Month 1"], ["10,000", "Users Month 6"], ["15%", "Paid Conversion"], ["₹3L+", "MRR at 6 Months"]].map(([val, label]) => (
                <div key={label} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 24, fontWeight: 900, color: "#22c55e" }}>{val}</div>
                  <div style={{ fontSize: 11, color: "#64748b", fontFamily: "'Inter', sans-serif", marginTop: 4 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* USERS */}
        <section id="users" style={{ marginBottom: 56 }}>
          <div className="section-heading">03 — USER PERSONAS</div>
          {[
            { name: "Casual Streamer", age: "18–24", desc: "Streams mobile games on YouTube/Instagram. Receives occasional UPI donations. Wants simple alerts without technical setup.", pain: "No way to show donor names on stream", plan: "Free / Starter", emoji: "🎮" },
            { name: "Growing Creator", age: "20–28", desc: "100–1000 live viewers regularly. Streams on YouTube or Facebook. Donations are a meaningful income source.", pain: "Misses donations mid-game, loses engagement opportunity", plan: "Growth / Pro", emoji: "📈" },
            { name: "Professional Streamer", age: "22–32", desc: "Full-time streamer with dedicated fanbase. High daily donation volume. Wants premium, branded overlays.", pain: "Needs reliable, high-volume alert system with custom branding", plan: "Annual / Lifetime", emoji: "⭐" },
          ].map(p => (
            <div key={p.name} className="card glass" style={{ display: "flex", gap: 20, marginBottom: 12 }}>
              <div style={{ fontSize: 36 }}>{p.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: 17, color: "#e2e8f0" }}>{p.name}</span>
                  <span className="tag" style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.2)" }}>Age {p.age}</span>
                  <span className="tag" style={{ background: "rgba(168,85,247,0.12)", color: "#a855f7", border: "1px solid rgba(168,85,247,0.2)" }}>{p.plan}</span>
                </div>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#94a3b8", marginBottom: 8, lineHeight: 1.6 }}>{p.desc}</p>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#f87171" }}>⚠ Pain: {p.pain}</div>
              </div>
            </div>
          ))}
        </section>

        {/* FEATURES */}
        <section id="features" style={{ marginBottom: 56 }}>
          <div className="section-heading">04 — FEATURE SPECIFICATIONS</div>
          {features.map((cat, i) => (
            <div key={cat.category} className="feature-cat">
              <div className="feature-header" onClick={() => setExpandedFeature(expandedFeature === i ? null : i)}>
                <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: 15, color: "#e2e8f0" }}>{cat.category}</span>
                <span style={{ color: expandedFeature === i ? "#22c55e" : "#475569", fontSize: 18 }}>{expandedFeature === i ? "−" : "+"}</span>
              </div>
              {expandedFeature === i && (
                <div className="feature-body">
                  {cat.items.map((item, j) => (
                    <div key={j} style={{ display: "flex", gap: 10, marginBottom: 10, fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>
                      <span style={{ color: "#22c55e", flexShrink: 0 }}>→</span> {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>

        {/* TECHNICAL */}
        <section id="technical" style={{ marginBottom: 56 }}>
          <div className="section-heading">05 — TECHNICAL ARCHITECTURE</div>

          <div className="card glass" style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 12, color: "#22c55e", letterSpacing: 2, marginBottom: 16 }}>CORE FLOW</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", fontFamily: "'Rajdhani', sans-serif", fontSize: 13 }}>
              {["UPI Payment Received", "PhonePe/GPay/Paytm Notification OR Bank SMS", "Android Listener Service", "Name + Amount Extracted", "Sent to Backend via WebSocket", "Overlay URL Updates in Real-time", "OBS Shows Alert on Stream"].map((step, i, arr) => (
                <span key={step} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ padding: "6px 12px", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 6, color: "#e2e8f0", fontSize: 12 }}>{step}</span>
                  {i < arr.length - 1 && <span style={{ color: "#22c55e" }}>→</span>}
                </span>
              ))}
            </div>
          </div>

          <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 11, color: "#64748b", letterSpacing: 2, marginBottom: 12 }}>TECH STACK</div>
          {techStack.map(row => (
            <div key={row.layer} className="tech-row">
              <span style={{ color: "#22c55e", fontWeight: 600, fontSize: 13 }}>{row.layer}</span>
              <span style={{ color: "#e2e8f0", fontSize: 13 }}>{row.tech}</span>
              <span style={{ color: "#64748b", fontSize: 12 }}>{row.note}</span>
            </div>
          ))}

          <div className="card glass-purple" style={{ marginTop: 20 }}>
            <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 12, color: "#a855f7", letterSpacing: 2, marginBottom: 14 }}>PERMISSIONS REQUIRED (ANDROID)</div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {["RECEIVE_SMS", "READ_SMS", "BIND_NOTIFICATION_LISTENER_SERVICE", "INTERNET", "FOREGROUND_SERVICE", "SYSTEM_ALERT_WINDOW (Overlay)"].map(p => (
                <span key={p} className="tag" style={{ background: "rgba(168,85,247,0.1)", color: "#a855f7", border: "1px solid rgba(168,85,247,0.2)", padding: "5px 12px", fontSize: 11 }}>{p}</span>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" style={{ marginBottom: 56 }}>
          <div className="section-heading">06 — PRICING PLANS</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {pricingPlans.map(plan => (
              <div key={plan.name} className="plan-card glass" style={{ borderColor: `${plan.color}30`, boxShadow: `0 0 20px ${plan.color}10` }}>
                {plan.badge && (
                  <div style={{ position: "absolute", top: 12, right: 12 }}>
                    <span className="tag" style={{ background: `${plan.color}22`, color: plan.color, border: `1px solid ${plan.color}40`, padding: "4px 10px" }}>{plan.badge}</span>
                  </div>
                )}
                <div style={{ display: "flex", alignItems: "flex-end", gap: 6, marginBottom: 4 }}>
                  <span style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 26, color: plan.color }}>{plan.price}</span>
                  <span style={{ fontSize: 12, color: "#64748b", fontFamily: "'Inter', sans-serif", paddingBottom: 4 }}>/ {plan.period}</span>
                </div>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: 16, color: "#e2e8f0", marginBottom: 12 }}>{plan.name}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#94a3b8" }}>
                    <span style={{ color: plan.color }}>⚡</span> {plan.alerts} alerts
                  </div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#94a3b8" }}>
                    <span style={{ color: plan.color }}>🎨</span> {plan.templates}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* REFERRAL */}
        <section id="referral" style={{ marginBottom: 56 }}>
          <div className="section-heading">07 — REFER & EARN SYSTEM</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="card glass-green">
              <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 12, color: "#22c55e", letterSpacing: 2, marginBottom: 16 }}>HOW IT WORKS</div>
              {[
                "User gets unique referral code + shareable link",
                "Friend signs up using referral code",
                "Friend purchases any paid plan",
                "Referrer earns 25% commission instantly",
                "Commission tracked in Refer & Earn tab",
                "Minimum ₹200 to withdraw via UPI",
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#94a3b8" }}>
                  <span style={{ color: "#22c55e", fontWeight: 700 }}>{i + 1}.</span> {s}
                </div>
              ))}
            </div>
            <div className="card glass-purple">
              <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 12, color: "#a855f7", letterSpacing: 2, marginBottom: 16 }}>COMMISSION TABLE</div>
              {pricingPlans.slice(1).map(plan => {
                const price = parseInt(plan.price.replace("₹", "").replace(",", ""));
                const commission = Math.round(price * 0.25);
                return (
                  <div key={plan.name} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(168,85,247,0.1)", fontFamily: "'Rajdhani', sans-serif", fontSize: 14 }}>
                    <span style={{ color: "#94a3b8" }}>{plan.name} ({plan.period})</span>
                    <span style={{ color: "#a855f7", fontWeight: 700 }}>₹{commission} / referral</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* UI DESIGN */}
        <section id="ui" style={{ marginBottom: 56 }}>
          <div className="section-heading">08 — UI / UX DESIGN SYSTEM</div>

          <div className="card glass" style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 12, color: "#22c55e", letterSpacing: 2, marginBottom: 16 }}>COLOR PALETTE</div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {[
                { name: "Background", hex: "#050508", note: "Textured dark base" },
                { name: "Green Primary", hex: "#22c55e", note: "CTAs, active states, buttons" },
                { name: "Purple Accent", hex: "#a855f7", note: "Fades, badges, secondary" },
                { name: "Surface", hex: "#0a0a12", note: "Cards, modals" },
                { name: "Border", hex: "#22c55e26", note: "Glass borders" },
              ].map(c => (
                <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: c.hex, border: "1px solid rgba(255,255,255,0.1)" }} />
                  <div>
                    <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: 13, color: "#e2e8f0" }}>{c.name}</div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#64748b" }}>{c.hex} · {c.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="card glass">
              <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 12, color: "#22c55e", letterSpacing: 2, marginBottom: 14 }}>APP STRUCTURE</div>
              {[
                { tab: "🏠 Home", desc: "Dashboard — earnings, donors, live toggle" },
                { tab: "🎨 Templates", desc: "Overlay gallery, preview, plan-locked" },
                { tab: "💰 Pricing", desc: "Plan comparison, upgrade CTA" },
                { tab: "🔗 Refer & Earn", desc: "Code, commissions, withdrawal" },
              ].map(t => (
                <div key={t.tab} style={{ padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", fontFamily: "'Inter', sans-serif" }}>
                  <span style={{ fontSize: 13, color: "#e2e8f0" }}>{t.tab}</span>
                  <span style={{ fontSize: 12, color: "#64748b", marginLeft: 10 }}>{t.desc}</span>
                </div>
              ))}
            </div>
            <div className="card glass">
              <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 12, color: "#a855f7", letterSpacing: 2, marginBottom: 14 }}>DESIGN LANGUAGE</div>
              {[
                "Glassmorphism cards with blur + border",
                "Neon green glow on active/hover states",
                "Subtle noise texture on background",
                "Grid line overlay (very faint)",
                "Orbitron / Rajdhani typography",
                "Animated gradient text for headings",
                "Smooth slide-up transitions on alerts",
              ].map((d, i) => (
                <div key={i} style={{ display: "flex", gap: 8, padding: "6px 0", fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#94a3b8" }}>
                  <span style={{ color: "#a855f7" }}>◆</span> {d}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ADMIN */}
        <section id="admin" style={{ marginBottom: 56 }}>
          <div className="section-heading">09 — ADMIN PANEL</div>
          <div className="card glass-purple" style={{ marginBottom: 16 }}>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "#94a3b8", lineHeight: 1.7 }}>
              Separate secure web portal (React + Tailwind, dark theme matching app) accessible only by Anthropic/admin team. Hosted on admin subdomain with IP whitelist + 2FA.
            </p>
          </div>
          {adminFeatures.map(f => (
            <div key={f.module} className="admin-row">
              <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: 14, color: "#a855f7" }}>{f.module}</span>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#94a3b8" }}>{f.desc}</span>
            </div>
          ))}
        </section>

        {/* ROADMAP */}
        <section id="roadmap" style={{ marginBottom: 56 }}>
          <div className="section-heading">10 — DEVELOPMENT ROADMAP</div>
          {roadmap.map((phase, i) => (
            <div key={phase.phase} className="phase-card glass" style={{ borderLeft: `3px solid ${i % 2 === 0 ? "#22c55e" : "#a855f7"}`, borderRadius: "0 12px 12px 0", marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: 16, color: "#e2e8f0" }}>{phase.phase}</span>
                <span className="tag" style={{ background: "rgba(255,255,255,0.05)", color: "#64748b", border: "1px solid rgba(255,255,255,0.08)" }}>{phase.duration}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {phase.tasks.map((t, j) => (
                  <div key={j} style={{ display: "flex", gap: 8, fontFamily: "'Inter', sans-serif", fontSize: 12, color: "#94a3b8" }}>
                    <span style={{ color: i % 2 === 0 ? "#22c55e" : "#a855f7", flexShrink: 0 }}>✦</span> {t}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Footer */}
        <div style={{ textAlign: "center", padding: "40px 0 20px", borderTop: "1px solid rgba(34,197,94,0.1)" }}>
          <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 10, color: "#334155", letterSpacing: 3 }}>UPIAlert Live — Product Requirements Document v1.0 — Confidential</div>
        </div>

      </div>
    </div>
  );
}
