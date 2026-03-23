import { useState, useRef, useCallback, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import { supabase } from '../lib/supabase'
import { Save, Eye, Code2, Sliders, BookOpen, Play, Copy, ArrowLeft, Wand2 } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'

// ─── Library CDN catalogue ────────────────────────────────────────────────────
const LIBRARIES = [
    { id: 'gsap', name: 'GSAP', desc: 'Pro animation library', color: '#88cc00', cdn: 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js', extra: '' },
    { id: 'gsap-text', name: 'GSAP TextPlugin', desc: 'Typewriter & text effects', color: '#88cc00', cdn: 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/TextPlugin.min.js', extra: '' },
    { id: 'gsap-scroll', name: 'GSAP ScrollTrigger', desc: 'Scroll-based animations', color: '#88cc00', cdn: 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js', extra: '' },
    { id: 'animejs', name: 'Anime.js', desc: 'Lightweight JS animations', color: '#ff6b6b', cdn: 'https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js', extra: '' },
    { id: 'confetti', name: 'Canvas Confetti', desc: 'Confetti particle effects', color: '#f59e0b', cdn: 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js', extra: '' },
    { id: 'particles', name: 'Particles.js', desc: 'Particle background system', color: '#3b82f6', cdn: 'https://cdnjs.cloudflare.com/ajax/libs/particlesjs/2.2.3/particles.min.js', extra: '' },
    { id: 'aos', name: 'AOS', desc: 'Animate on scroll', color: '#a855f7', cdn: 'https://unpkg.com/aos@2.3.4/dist/aos.js', extra: '<link rel="stylesheet" href="https://unpkg.com/aos@2.3.4/dist/aos.css"/>' },
    { id: 'three', name: 'Three.js', desc: '3D WebGL graphics', color: '#0ea5e9', cdn: 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', extra: '' },
    { id: 'typed', name: 'Typed.js', desc: 'Typing animation', color: '#22c55e', cdn: 'https://cdn.jsdelivr.net/npm/typed.js@2.1.0/dist/typed.umd.js', extra: '' },
    { id: 'lottie', name: 'Lottie Web', desc: 'After Effects animations', color: '#f97316', cdn: 'https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie.min.js', extra: '' },
]

const FONTS = [
    'Inter', 'Roboto', 'Poppins', 'Montserrat', 'Bebas Neue', 'Oswald',
    'Rajdhani', 'Press Start 2P', 'Orbitron', 'Exo 2', 'Audiowide', 'Share Tech Mono',
]

// ─── Starter templates for quick start ───────────────────────────────────────
const STARTERS: Record<string, { html: string; css: string; js: string }> = {
    blank: {
        html: `<div class="alert-box">
  <div class="donor">{{donor_name}}</div>
  <div class="amount">₹{{amount}}</div>
  <div class="message">{{message}}</div>
</div>`,
        css: `* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: transparent; display: flex; align-items: center; justify-content: center; height: 100vh; font-family: 'Inter', sans-serif; }
.alert-box { background: rgba(0,0,0,0.85); border: 2px solid #22c55e; border-radius: 16px; padding: 24px 32px; text-align: center; animation: slideIn 0.5s ease; }
.donor { font-size: 22px; font-weight: 800; color: #22c55e; }
.amount { font-size: 36px; font-weight: 900; color: #fff; margin: 8px 0; }
.message { font-size: 14px; color: rgba(255,255,255,0.7); }
@keyframes slideIn { from { transform: translateY(-40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`,
        js: `// Auto-hide after 5 seconds
setTimeout(() => {
  document.querySelector('.alert-box').style.animation = 'slideOut 0.5s ease forwards';
}, 5000);
// Add slideOut to injected style
const style = document.createElement('style');
style.textContent = '@keyframes slideOut { to { transform: translateY(-40px); opacity: 0; } }';
document.head.appendChild(style);`,
    },
    neon: {
        html: `<div class="wrap">
  <div class="glow-ring"></div>
  <div class="content">
    <span class="label">DONATION ALERT</span>
    <div class="donor">{{donor_name}}</div>
    <div class="amount">₹{{amount}}</div>
    <div class="msg">{{message}}</div>
  </div>
</div>`,
        css: `* { margin:0; padding:0; box-sizing:border-box; }
body { background: transparent; display:flex; align-items:center; justify-content:center; height:100vh; font-family:'Orbitron',sans-serif; }
.wrap { position:relative; padding:4px; border-radius:20px; background: linear-gradient(135deg,#0ff,#a855f7,#0ff); animation: borderRotate 3s linear infinite; }
.content { background:#0a0a1a; border-radius:18px; padding:28px 40px; text-align:center; }
.label { font-size:10px; letter-spacing:3px; color:#0ff; opacity:.7; }
.donor { font-size:20px; font-weight:700; color:#fff; margin:10px 0 4px; }
.amount { font-size:42px; font-weight:900; color:#0ff; text-shadow:0 0 20px #0ff,0 0 40px #0ff; }
.msg { font-size:13px; color:rgba(255,255,255,.5); margin-top:8px; }
.glow-ring { display:none; }`,
        js: `// GSAP entrance
if (typeof gsap !== 'undefined') {
  gsap.from('.wrap', { duration: 0.6, scale: 0.5, opacity: 0, ease: 'back.out(1.7)' });
  gsap.from('.amount', { duration: 0.8, delay: 0.3, textContent: 0, roundProps: 'textContent', ease: 'power2.out', snap: { textContent: 1 } });
}`,
    },
    retro: {
        html: `<div class="retro-box">
  <div class="scanlines"></div>
  <div class="header">⚡ SUPERCHAT ⚡</div>
  <div class="donor">{{donor_name}}</div>
  <div class="amount">₹ {{amount}}</div>
  <div class="msg">"{{message}}"</div>
</div>`,
        css: `@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
* { margin:0;padding:0;box-sizing:border-box; }
body { background:transparent; display:flex; align-items:center; justify-content:center; height:100vh; }
.retro-box { font-family:'Press Start 2P',monospace; background:#1a0033; border:4px solid #ff00ff; padding:24px; position:relative; overflow:hidden; animation:pixelIn .3s steps(8) both; }
.scanlines { position:absolute; inset:0; background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.3) 2px,rgba(0,0,0,.3) 4px); pointer-events:none; }
.header { color:#ff00ff; font-size:10px; text-align:center; margin-bottom:16px; animation:blink 1s step-end infinite; }
.donor { color:#00ffff; font-size:12px; margin-bottom:8px; }
.amount { color:#ffff00; font-size:20px; margin-bottom:8px; }
.msg { color:#fff; font-size:9px; opacity:.75; }
@keyframes pixelIn { from { clip-path: polygon(0 0,0 0,0 0,0 0); } to { clip-path: polygon(0 0,100% 0,100% 100%,0 100%); } }
@keyframes blink { 50% { opacity:0; } }`,
        js: ``,
    },
}

// ─── Variables reference ──────────────────────────────────────────────────────
const VARS = [
    { key: '{{donor_name}}', desc: 'Donor display name' },
    { key: '{{amount}}', desc: 'Donation amount (₹)' },
    { key: '{{message}}', desc: 'Donor message' },
    { key: '{{utr}}', desc: 'Payment UTR number' },
    { key: '{{source}}', desc: 'Payment app (PhonePe / GPay)' },
]

// ─── Panel tabs ───────────────────────────────────────────────────────────────
type Panel = 'html' | 'css' | 'js' | 'visual' | 'libraries'

const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8, padding: '9px 12px', color: '#fff', fontSize: 13,
    fontFamily: 'inherit', outline: 'none', width: '100%', boxSizing: 'border-box',
}

export default function TemplateDesigner() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const editId = searchParams.get('id')

    // ── Code state ────────────────────────────────────────────────────────────
    const [htmlCode, setHtmlCode] = useState(STARTERS.blank.html)
    const [cssCode, setCssCode] = useState(STARTERS.blank.css)
    const [jsCode, setJsCode] = useState(STARTERS.blank.js)
    const [panel, setPanel] = useState<Panel>('html')

    // ── Visual state ──────────────────────────────────────────────────────────
    const [bgColor, setBgColor] = useState('#0a0a0a')
    const [bgType, setBgType] = useState<'solid' | 'gradient' | 'transparent'>('transparent')
    const [gradFrom, setGradFrom] = useState('#0a0a2e')
    const [gradTo, setGradTo] = useState('#1a0033')

    // ── Library state ─────────────────────────────────────────────────────────
    const [enabledLibs, setEnabledLibs] = useState<string[]>([])
    const [enabledFonts, setEnabledFonts] = useState<string[]>(['Inter'])

    // ── Template meta ─────────────────────────────────────────────────────────
    const [tmplId, setTmplId] = useState('')
    const [tmplName, setTmplName] = useState('')
    const [tmplDesc, setTmplDesc] = useState('')
    const [tmplPremium, setTmplPremium] = useState(false)
    const [saveLoading, setSaveLoading] = useState(false)
    const [saveMsg, setSaveMsg] = useState('')

    const iframeRef = useRef<HTMLIFrameElement>(null)
    const [previewExpanded, setPreviewExpanded] = useState(false)

    // ── Load existing if editing ─────────────────────────────────────────────
    useEffect(() => {
        if (!editId) return
        const load = async () => {
            const { data } = await supabase.from('overlay_templates').select('*').eq('id', editId).single()
            if (!data) return

            setTmplId(data.id)
            setTmplName(data.name)
            setTmplDesc(data.description || '')
            setTmplPremium(data.is_premium)

            if (data.gradient) {
                if (data.gradient.startsWith('linear-gradient')) {
                    setBgType('gradient')
                    // extremely naive parsing, but helpful
                    const matches = data.gradient.match(/#[0-9a-fA-F]{3,6}/g)
                    if (matches && matches.length >= 2) {
                        setGradFrom(matches[0])
                        setGradTo(matches[1])
                    }
                } else if (data.gradient.startsWith('#')) {
                    setBgType('solid')
                    setBgColor(data.gradient)
                }
            }

            if (data.full_code) {
                // Try to extract body HTML
                const bodyMatch = data.full_code.match(/<body>([\s\S]*?)<script>/)
                if (bodyMatch) setHtmlCode(bodyMatch[1].trim())

                // Try to extract CSS
                const cssMatch = data.full_code.match(/<style>([\s\S]*?)<\/style>/)
                if (cssMatch) {
                    // strip out the auto-injected bg
                    const rawCss = cssMatch[1].replace(/html, body \{ width:100%; height:100%; margin:0; padding:0;.*?\]?\s*\}\n?/s, '')
                    setCssCode(rawCss.trim())
                }

                // Try to extract JS
                const jsMatch = data.full_code.match(/try \{([\s\S]*?)\} catch\(e\)/)
                if (jsMatch) setJsCode(jsMatch[1].trim())
            }
        }
        load()
    }, [editId])

    // ── Mock alert data for preview ───────────────────────────────────────────
    const [mockDonor, setMockDonor] = useState('StreamFan99')
    const [mockAmount, setMockAmount] = useState('251')
    const [mockMessage, setMockMessage] = useState('Keep streaming! GGs 🎮')
    const [mockSource, setMockSource] = useState('PhonePe')

    const buildPreviewHtml = useCallback(() => {
        // Replace template variables with mock data
        const replacer = (s: string) => s
            .replace(/\{\{donor_name\}\}/g, mockDonor)
            .replace(/\{\{amount\}\}/g, mockAmount)
            .replace(/\{\{message\}\}/g, mockMessage)
            .replace(/\{\{source\}\}/g, mockSource)
            .replace(/\{\{utr\}\}/g, 'UTR12345678901')

        // Build library script tags
        const libTags = LIBRARIES
            .filter(l => enabledLibs.includes(l.id))
            .map(l => `${l.extra}<script src="${l.cdn}"></script>`)
            .join('\n')

        // Build font links
        const fontLink = enabledFonts.length
            ? `<link href="https://fonts.googleapis.com/css2?${enabledFonts.map(f => `family=${f.replace(/ /g, '+')}:wght@400;700;900`).join('&')}&display=swap" rel="stylesheet">`
            : ''

        // Body background from visual controls
        let bodyBg = 'transparent'
        if (bgType === 'solid') bodyBg = bgColor
        if (bgType === 'gradient') bodyBg = `linear-gradient(135deg, ${gradFrom}, ${gradTo})`

        const fullHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
${fontLink}
${libTags}
<style>
html, body { width:100%; height:100%; margin:0; padding:0; ${bgType !== 'transparent' ? `background: ${bodyBg};` : 'background: transparent;'} overflow: hidden; }
${replacer(cssCode)}
</style>
</head>
<body>
${replacer(htmlCode)}
<script>
try {
${replacer(jsCode)}
} catch(e) { console.error('Template JS error:', e); }
</script>
</body>
</html>`
        return fullHtml
    }, [htmlCode, cssCode, jsCode, mockDonor, mockAmount, mockMessage, mockSource, enabledLibs, enabledFonts, bgType, bgColor, gradFrom, gradTo])

    const refreshPreview = useCallback(() => {
        if (!iframeRef.current) return
        const blob = new Blob([buildPreviewHtml()], { type: 'text/html' })
        const url = URL.createObjectURL(blob)
        iframeRef.current.src = url
        setTimeout(() => URL.revokeObjectURL(url), 5000)
    }, [buildPreviewHtml])

    // Auto-refresh preview 600ms after code change
    useEffect(() => {
        const t = setTimeout(refreshPreview, 600)
        return () => clearTimeout(t)
    }, [refreshPreview])

    const handleSave = async () => {
        if (!tmplId.trim() || !tmplName.trim()) { setSaveMsg('Template ID and Name required'); return }
        setSaveLoading(true); setSaveMsg('')
        // Build the full HTML+CSS+JS blob — will be stored as the overlay template code
        const fullCode = buildPreviewHtml()
        const gradient = bgType === 'gradient' ? `linear-gradient(135deg,${gradFrom},${gradTo})` : bgType === 'solid' ? bgColor : 'linear-gradient(135deg,#1a1a2e,#16213e)'
        const { error } = await supabase.from('overlay_templates').upsert({
            id: tmplId.trim(),
            name: tmplName.trim(),
            description: tmplDesc.trim(),
            gradient,
            is_premium: tmplPremium,
            is_active: true,
            sort_order: 100,
            full_code: fullCode, // Store the full designer-built HTML
        })
        if (error) { setSaveMsg('Error: ' + error.message); setSaveLoading(false); return }
        // Also upsert the full HTML code into a separate column if it exists, else store as-is
        await supabase.from('overlay_templates').update({ preview_url: null }).eq('id', tmplId.trim())
        setSaveMsg('✓ Template published to users!')
        setSaveLoading(false)
    }

    const applyStarter = (key: keyof typeof STARTERS) => {
        setHtmlCode(STARTERS[key].html)
        setCssCode(STARTERS[key].css)
        setJsCode(STARTERS[key].js)
        setPanel('html')
    }

    const toggleLib = (id: string) => setEnabledLibs(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
    const toggleFont = (f: string) => setEnabledFonts(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f])

    // ── Styles ────────────────────────────────────────────────────────────────
    const tabBtn = (active: boolean, color = '#22c55e'): React.CSSProperties => ({
        padding: '7px 14px', borderRadius: 8, border: active ? `1px solid ${color}40` : '1px solid rgba(255,255,255,0.08)',
        background: active ? `${color}15` : 'rgba(255,255,255,0.04)', color: active ? color : 'var(--text-muted)',
        cursor: 'pointer', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5, transition: 'all 0.15s',
    })

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#080810', fontFamily: 'var(--font-inter)', overflow: 'hidden' }}>

            {/* ── Top bar ─────────────────────────────────────────────────── */}
            <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: 12, background: '#0d0d1a', flexShrink: 0 }}>
                <button onClick={() => navigate('/admin')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                    <ArrowLeft size={16} /> Back
                </button>
                <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.1)' }} />
                <Wand2 size={16} color="#a855f7" />
                <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>
                    {editId ? 'Edit Template' : 'Template Designer'}
                </span>
                <div style={{ flex: 1 }} />

                {/* Quick starter picks */}
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Start with:</span>
                {Object.keys(STARTERS).map(k => (
                    <button key={k} onClick={() => applyStarter(k as keyof typeof STARTERS)}
                        style={{ ...tabBtn(false), fontSize: 11, padding: '5px 10px' }}>
                        {k.charAt(0).toUpperCase() + k.slice(1)}
                    </button>
                ))}

                <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.1)' }} />
                {/* Preview refresh */}
                <button onClick={refreshPreview} style={tabBtn(false, '#3b82f6')}>
                    <Play size={12} /> Refresh
                </button>
                <button onClick={() => setPreviewExpanded(v => !v)} style={tabBtn(previewExpanded, '#f59e0b')}>
                    <Eye size={12} /> {previewExpanded ? 'Split' : 'Full Preview'}
                </button>
            </div>

            {/* ── Main 2-col layout ────────────────────────────────────────── */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

                {/* ── Left: Editor + Controls ──────────────────────────────── */}
                {!previewExpanded && (
                    <div style={{ width: '50%', display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>

                        {/* Panel tabs */}
                        <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 6, background: '#0d0d1a', flexShrink: 0, flexWrap: 'wrap' }}>
                            <button style={tabBtn(panel === 'html', '#f97316')} onClick={() => setPanel('html')}><Code2 size={12} />HTML</button>
                            <button style={tabBtn(panel === 'css', '#3b82f6')} onClick={() => setPanel('css')}><Code2 size={12} />CSS</button>
                            <button style={tabBtn(panel === 'js', '#f59e0b')} onClick={() => setPanel('js')}><Code2 size={12} />JS</button>
                            <button style={tabBtn(panel === 'visual', '#a855f7')} onClick={() => setPanel('visual')}><Sliders size={12} />Visual</button>
                            <button style={tabBtn(panel === 'libraries', '#10b981')} onClick={() => setPanel('libraries')}><BookOpen size={12} />Libraries</button>
                        </div>

                        {/* Monaco editor panels */}
                        {(panel === 'html' || panel === 'css' || panel === 'js') && (
                            <div style={{ flex: 1, overflow: 'hidden' }}>
                                <Editor
                                    height="100%"
                                    language={panel === 'html' ? 'html' : panel === 'css' ? 'css' : 'javascript'}
                                    value={panel === 'html' ? htmlCode : panel === 'css' ? cssCode : jsCode}
                                    onChange={v => {
                                        if (panel === 'html') setHtmlCode(v ?? '')
                                        else if (panel === 'css') setCssCode(v ?? '')
                                        else setJsCode(v ?? '')
                                    }}
                                    theme="vs-dark"
                                    options={{
                                        fontSize: 13, minimap: { enabled: false }, wordWrap: 'on',
                                        scrollBeyondLastLine: false, padding: { top: 12, bottom: 12 },
                                        lineNumbers: 'on', automaticLayout: true,
                                        suggestOnTriggerCharacters: true, quickSuggestions: true,
                                    }}
                                />
                            </div>
                        )}

                        {/* Visual panel */}
                        {panel === 'visual' && (
                            <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 18 }}>

                                {/* Background */}
                                <section>
                                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: 1, marginBottom: 10 }}>BACKGROUND</div>
                                    <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                                        {(['transparent', 'solid', 'gradient'] as const).map(t => (
                                            <button key={t} onClick={() => setBgType(t)} style={tabBtn(bgType === t, '#a855f7')}>
                                                {t.charAt(0).toUpperCase() + t.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                    {bgType === 'solid' && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} style={{ width: 40, height: 40, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'none', padding: 0 }} />
                                            <input value={bgColor} onChange={e => setBgColor(e.target.value)} style={inputStyle} />
                                        </div>
                                    )}
                                    {bgType === 'gradient' && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <input type="color" value={gradFrom} onChange={e => setGradFrom(e.target.value)} style={{ width: 36, height: 36, borderRadius: 6, border: 'none', cursor: 'pointer', padding: 0 }} />
                                                <input value={gradFrom} onChange={e => setGradFrom(e.target.value)} style={inputStyle} placeholder="From color" />
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <input type="color" value={gradTo} onChange={e => setGradTo(e.target.value)} style={{ width: 36, height: 36, borderRadius: 6, border: 'none', cursor: 'pointer', padding: 0 }} />
                                                <input value={gradTo} onChange={e => setGradTo(e.target.value)} style={inputStyle} placeholder="To color" />
                                            </div>
                                            <div style={{ height: 36, borderRadius: 10, background: `linear-gradient(135deg,${gradFrom},${gradTo})` }} />
                                        </div>
                                    )}
                                </section>

                                {/* Fonts */}
                                <section>
                                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: 1, marginBottom: 10 }}>GOOGLE FONTS  <span style={{ fontWeight: 400, color: '#6b7280' }}>(click to toggle)</span></div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                        {FONTS.map(f => (
                                            <button key={f} onClick={() => toggleFont(f)} style={{ ...tabBtn(enabledFonts.includes(f), '#3b82f6'), fontFamily: 'inherit' }}>
                                                {f}
                                            </button>
                                        ))}
                                    </div>
                                    {enabledFonts.length > 0 && (
                                        <div style={{ marginTop: 10, fontSize: 11, color: '#3b82f6', background: 'rgba(59,130,246,0.08)', padding: '8px 12px', borderRadius: 8 }}>
                                            Use in CSS: <code style={{ fontFamily: 'monospace' }}>font-family: '{enabledFonts[0]}', sans-serif;</code>
                                        </div>
                                    )}
                                </section>

                                {/* Variable reference */}
                                <section>
                                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: 1, marginBottom: 10 }}>TEMPLATE VARIABLES</div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        {VARS.map(v => (
                                            <div key={v.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '8px 12px' }}>
                                                <code style={{ fontFamily: 'monospace', fontSize: 12, color: '#f59e0b' }}>{v.key}</code>
                                                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{v.desc}</span>
                                                <button onClick={() => navigator.clipboard?.writeText(v.key)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', padding: '2px 4px' }}>
                                                    <Copy size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* Mock data for preview */}
                                <section>
                                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: 1, marginBottom: 10 }}>PREVIEW MOCK DATA</div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        {[
                                            { label: 'Donor Name', val: mockDonor, set: setMockDonor },
                                            { label: 'Amount (₹)', val: mockAmount, set: setMockAmount },
                                            { label: 'Message', val: mockMessage, set: setMockMessage },
                                            { label: 'Source App', val: mockSource, set: setMockSource },
                                        ].map((f, i) => (
                                            <div key={i}>
                                                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 3 }}>{f.label}</div>
                                                <input value={f.val} onChange={e => f.set(e.target.value)} style={inputStyle} />
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>
                        )}

                        {/* Libraries panel */}
                        {panel === 'libraries' && (
                            <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
                                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: 1, marginBottom: 14 }}>ANIMATION & EFFECTS LIBRARIES</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {LIBRARIES.map(lib => (
                                        <button key={lib.id} onClick={() => toggleLib(lib.id)}
                                            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 12, border: enabledLibs.includes(lib.id) ? `1px solid ${lib.color}50` : '1px solid rgba(255,255,255,0.07)', background: enabledLibs.includes(lib.id) ? `${lib.color}10` : 'rgba(255,255,255,0.03)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
                                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: lib.color, flexShrink: 0, boxShadow: enabledLibs.includes(lib.id) ? `0 0 8px ${lib.color}` : 'none' }} />
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: 13, fontWeight: 700, color: enabledLibs.includes(lib.id) ? lib.color : '#fff' }}>{lib.name}</div>
                                                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{lib.desc}</div>
                                            </div>
                                            <div style={{ fontSize: 11, fontWeight: 700, color: enabledLibs.includes(lib.id) ? lib.color : 'var(--text-muted)' }}>
                                                {enabledLibs.includes(lib.id) ? '✓ ENABLED' : 'OFF'}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                                {enabledLibs.length > 0 && (
                                    <div style={{ marginTop: 14, padding: '12px 14px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 10, fontSize: 12, color: '#10b981' }}>
                                        ✓ {enabledLibs.length} lib{enabledLibs.length > 1 ? 's' : ''} loaded in preview. Use their global vars (e.g. <code>gsap</code>, <code>anime</code>, <code>confetti</code>) in your JS panel.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* ── Right: Live Preview + Save ───────────────────────────── */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

                    {/* Preview area */}
                    <div style={{ flex: 1, position: 'relative', background: '#050508' }}>
                        <iframe
                            ref={iframeRef}
                            title="Template Preview"
                            sandbox="allow-scripts allow-same-origin"
                            style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                        />
                        {/* Preview label */}
                        <div style={{ position: 'absolute', top: 10, left: 12, fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.25)', letterSpacing: 1, pointerEvents: 'none' }}>
                            LIVE PREVIEW · updates automatically
                        </div>
                    </div>

                    {/* ── Save panel ───────────────────────────────────────── */}
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '14px 16px', background: '#0d0d1a', flexShrink: 0 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: 1, marginBottom: 10 }}>PUBLISH TEMPLATE</div>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                            {[
                                { val: tmplId, set: setTmplId, ph: 'template-id (slug)', w: 140 },
                                { val: tmplName, set: setTmplName, ph: 'Display Name', w: 160 },
                                { val: tmplDesc, set: setTmplDesc, ph: 'Short description', w: 200 },
                            ].map((f, i) => (
                                <input key={i} value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph}
                                    style={{ ...inputStyle, width: f.w, flexShrink: 0 }} />
                            ))}
                            {/* Premium toggle */}
                            <button onClick={() => setTmplPremium(v => !v)}
                                style={{ ...tabBtn(tmplPremium, '#f59e0b'), padding: '9px 14px', flexShrink: 0 }}>
                                {tmplPremium ? '⭐ Premium' : '🆓 Free'}
                            </button>
                            {/* Save button */}
                            <button onClick={handleSave} disabled={saveLoading}
                                style={{ background: 'linear-gradient(135deg,#a855f7,#7c3aed)', border: 'none', borderRadius: 8, padding: '9px 20px', fontSize: 13, fontWeight: 700, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                                {saveLoading ? <div className="spinner" /> : <><Save size={14} /> Publish</>}
                            </button>
                        </div>
                        {saveMsg && <div style={{ marginTop: 8, fontSize: 12, color: saveMsg.startsWith('✓') ? '#22c55e' : '#ef4444' }}>{saveMsg}</div>}
                    </div>
                </div>
            </div>
        </div>
    )
}
