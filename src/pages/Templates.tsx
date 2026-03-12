import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { type Template as SupabaseTemplate } from '../lib/supabase'
import { Crown } from 'lucide-react'

type TemplateCategory = 'all' | 'basic' | 'premium'

type Template = SupabaseTemplate & {
    full_code?: string
    is_premium?: boolean
    gradient?: string
}

export default function Templates() {
    const { profile } = useAuth()
    const [activeTemplate, setActiveTemplate] = useState<string | null>(null)
    const [category, setCategory] = useState<TemplateCategory>('all')
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
    const [templates, setTemplates] = useState<Template[]>([])
    const [loadingTemplates, setLoadingTemplates] = useState(true)

    useEffect(() => {
        if (!profile?.id) return
        const init = async () => {
            const [{ data: userData }, { data: tplData }] = await Promise.all([
                supabase.from('users').select('active_template').eq('id', profile.id).single(),
                supabase.from('overlay_templates').select('*').eq('is_active', true).order('sort_order', { ascending: true })
            ])
            if (userData?.active_template) setActiveTemplate(userData.active_template)
            if (tplData) setTemplates(tplData as Template[])
            setLoadingTemplates(false)
        }
        init()
    }, [profile])

    const isPro = profile?.plan_id && profile.plan_id !== 'free'

    const filtered = templates.filter(t => {
        if (category === 'basic') return !t.is_premium
        if (category === 'premium') return t.is_premium
        return true
    })

    const handleActivate = async (template: Template) => {
        if (template.is_premium && !isPro) return
        if (!profile?.id) return
        await supabase.from('users').update({ active_template: template.id }).eq('id', profile.id)
        setActiveTemplate(template.id)
        setSelectedTemplate(null)
    }

    return (
        <div style={{ padding: '0 0 24px', fontFamily: 'var(--font-inter)', background: 'var(--bg)', minHeight: '100vh' }}>

            {/* Header */}
            <div style={{ padding: '20px 16px 16px' }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Overlay Templates</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Choose your stream alert style</div>
            </div>

            {loadingTemplates && (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
                    <div className="spinner" />
                </div>
            )}

            {/* Filter Chips */}
            <div style={{ display: 'flex', gap: 8, padding: '0 16px', marginBottom: 20 }}>
                {(['all', 'basic', 'premium'] as TemplateCategory[]).map(c => (
                    <button
                        key={c}
                        onClick={() => setCategory(c)}
                        style={{
                            padding: '7px 18px',
                            borderRadius: 20,
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: 13,
                            fontWeight: 600,
                            background: category === c ? '#22c55e' : 'rgba(255,255,255,0.07)',
                            color: category === c ? '#000' : 'var(--text-secondary)',
                            transition: 'all 0.2s'
                        }}
                    >
                        {c.charAt(0).toUpperCase() + c.slice(1)}
                    </button>
                ))}
            </div>

            {/* Template Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '0 16px' }}>
                {filtered.map(t => {
                    const isLocked = t.is_premium && !isPro
                    const isActive = activeTemplate === t.id
                    return (
                        <div
                            key={t.id}
                            onClick={() => setSelectedTemplate(t)}
                            style={{
                                borderRadius: 16,
                                overflow: 'hidden',
                                cursor: 'pointer',
                                border: isActive ? '2px solid #22c55e' : '2px solid transparent',
                                position: 'relative',
                                background: '#1a1a24',
                                transition: 'all 0.2s'
                            }}
                        >
                            {/* Preview Area */}
                            <div style={{ background: t.gradient, height: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                                {t.full_code ? (
                                    <div style={{ width: '400%', height: '400%', transform: 'scale(0.25)', transformOrigin: 'top left', pointerEvents: 'none', position: 'absolute', top: 0, left: 0 }}>
                                        <iframe srcDoc={t.full_code.replace(/setTimeout\(\(\) => \{[\s\S]*?opacity = '0'[\s\S]*?\}, 4000\)/g, '')} style={{ width: '100%', height: '100%', border: 'none' }} sandbox="allow-scripts allow-same-origin" />
                                    </div>
                                ) : t.preview_url ? (
                                    <img src={t.preview_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <span style={{ fontSize: 36, position: 'relative', zIndex: 1, color: 'rgba(255,255,255,0.2)' }}>🎨</span>
                                )}

                                {/* Crown badge for premium */}
                                {t.is_premium && (
                                    <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.4)', borderRadius: 6, padding: '3px 5px', display: 'flex', alignItems: 'center', zIndex: 2 }}>
                                        <Crown size={12} color="#f59e0b" fill="#f59e0b" />
                                    </div>
                                )}

                                {/* Lock overlay */}
                                {isLocked && (
                                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3 }}>
                                        <span style={{ fontSize: 22 }}>🔒</span>
                                    </div>
                                )}

                                {/* Active badge */}
                                {isActive && (
                                    <div style={{ position: 'absolute', bottom: 8, left: 8, background: '#22c55e', borderRadius: 6, padding: '3px 8px', fontSize: 10, fontWeight: 700, color: '#000', zIndex: 2 }}>
                                        ACTIVE
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div style={{ padding: '10px 12px 12px' }}>
                                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 3 }}>{t.name}</div>
                                <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.4 }}>{t.description}</div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Template Detail Modal */}
            {selectedTemplate && (
                <div className="modal-backdrop" onClick={() => setSelectedTemplate(null)}>
                    <div className="modal" onClick={e => e.stopPropagation()} style={{ overflow: 'hidden', padding: 0 }}>
                        <div style={{ padding: 0 }}>
                            {/* Large Preview */}
                            <div style={{ width: '100%', height: 280, background: selectedTemplate.gradient || '#1a1a24', position: 'relative', overflow: 'hidden' }}>
                                {selectedTemplate.full_code ? (
                                    <div style={{ width: '200%', height: '200%', transform: 'scale(0.5)', transformOrigin: 'top left', position: 'absolute', top: 0, left: 0 }}>
                                        <iframe 
                                            srcDoc={selectedTemplate.full_code.replace(/setTimeout\(\(\) => \{[\s\S]*?opacity = '0'[\s\S]*?\}, 5500\)/g, '')} 
                                            style={{ width: '100%', height: '100%', border: 'none' }} 
                                            sandbox="allow-scripts allow-same-origin" 
                                        />
                                    </div>
                                ) : selectedTemplate.preview_url ? (
                                    <img src={selectedTemplate.preview_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                        <span style={{ fontSize: 48, color: 'rgba(255,255,255,0.2)' }}>🎨</span>
                                    </div>
                                )}
                            </div>

                            <div style={{ padding: 24 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
                                    <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>{selectedTemplate.name}</div>
                                    {selectedTemplate.is_premium && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 6, padding: '3px 8px' }}>
                                            <Crown size={12} color="#f59e0b" fill="#f59e0b" />
                                            <span style={{ fontSize: 11, color: '#f59e0b', fontWeight: 700 }}>PRO</span>
                                        </div>
                                    )}
                                </div>
                                <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 20 }}>{selectedTemplate.description}</div>

                            {selectedTemplate.is_premium && !isPro ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    <div style={{ padding: '12px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 8, fontSize: 13, color: '#f59e0b' }}>
                                        🔒 This template requires a Pro plan or above.
                                    </div>
                                    <div style={{ display: 'flex', gap: 10 }}>
                                        <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setSelectedTemplate(null)}>Close</button>
                                        <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => { setSelectedTemplate(null); window.location.href = '/pricing' }}>Upgrade</button>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', gap: 10 }}>
                                    <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setSelectedTemplate(null)}>Cancel</button>
                                    <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => handleActivate(selectedTemplate)}>
                                        {activeTemplate === selectedTemplate.id ? '✓ Active' : 'Activate'}
                                    </button>
                                </div>
                            )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
