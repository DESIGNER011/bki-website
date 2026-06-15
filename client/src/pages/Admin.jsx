// ============================================================
//  client/src/pages/Admin.jsx  —  Dojo Admin Console Dashboard
// ============================================================
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import MediaUploader from '../components/MediaUploader'
import {
  getMessages, deleteMessage,
  getTrials, deleteTrial,
  getMedia, deleteMediaRecord, updateMediaLabel,
  getSiteContent, updateSiteContent
} from '../services/dbService'
import { deleteStorageFile } from '../services/storageService'

const TABS = [
  { id: 'messages', label: '📬 Messages' },
  { id: 'trials', label: '🥋 Trial Bookings' },
  { id: 'media', label: '📸 Media Library' },
  { id: 'editor', label: '⚙️ Content Editor' },
]

/* ─── Login Form ─────────────────────────────────────────────── */
function LoginForm() {
  const { login } = useAuth()
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setBusy(true); setErr('')
    try {
      await login(pw)
    } catch (ex) {
      setErr(ex.message || 'Authentication failed. Please verify the admin password.')
    } finally { setBusy(false) }
  }

  return (
    <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 120px)', padding: '2rem' }}>
      <div className="card glass-glow stagger-1" style={{ maxWidth: 440, width: '100%', padding: '3.5rem 3rem', textAlign: 'center', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>

        {/* Decorative background glows */}
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(245,158,11,0.2) 0%, transparent 70%)', filter: 'blur(30px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)', filter: 'blur(30px)', pointerEvents: 'none' }} />

        <div style={{ background: 'rgba(245, 158, 11, 0.1)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', border: '1px solid rgba(245, 158, 11, 0.2)', boxShadow: '0 0 20px rgba(245, 158, 11, 0.1)' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>

        <h2 className="text-gold" style={{ fontSize: '2.2rem', marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>BKI Console</h2>
        <p style={{ color: 'var(--text-2)', fontSize: '0.95rem', marginBottom: '2.5rem', fontWeight: 500 }}>Restricted Access: Admin only</p>

        <form onSubmit={handleSubmit} className="form-group" style={{ textAlign: 'left', position: 'relative', zIndex: 10 }}>
          <div className="form-field">
            <label style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.6rem', color: 'var(--text-1)' }}>Administrator Password</label>
            <div style={{ position: 'relative' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', zIndex: 2 }}>
                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
              </svg>
              <input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="Enter your passcode" required style={{ width: '100%', paddingLeft: '3rem', height: '54px', fontSize: '1rem', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', transition: 'all 0.3s ease' }}
                onFocus={e => { e.target.style.background = 'rgba(255, 255, 255, 0.08)'; e.target.style.borderColor = 'var(--gold)'; e.target.style.boxShadow = '0 0 0 4px rgba(245, 158, 11, 0.1)'; }}
                onBlur={e => { e.target.style.background = 'rgba(255, 255, 255, 0.04)'; e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
          </div>

          {err && (
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              <p style={{ color: '#ef4444', fontSize: '0.85rem', margin: 0, fontWeight: 500 }}>{err}</p>
            </div>
          )}

          <button type="submit" className="btn btn-gold" style={{ width: '100%', height: '54px', fontSize: '1rem', fontWeight: 700, letterSpacing: '2px', marginTop: '0.5rem' }} disabled={busy}>
            {busy ? 'AUTHENTICATING...' : 'UNLOCK CONSOLE'}
          </button>
        </form>
      </div>
    </div>
  )
}

/* ─── Messages Tab ───────────────────────────────────────────── */
function MessagesTab({ onDataChange }) {
  const [msgs, setMsgs] = useState([])
  useEffect(() => {
    getMessages().then(setMsgs).catch(() => { })
  }, [])

  const del = async (id) => {
    try {
      await deleteMessage(id)
      setMsgs(prev => prev.filter(m => m._id !== id))
      if (onDataChange) onDataChange()
    } catch (err) {
      alert(`Error deleting message: ${err.message}`)
    }
  }

  if (msgs.length === 0) return <p style={{ color: 'var(--text-2)', textAlign: 'center', padding: '2rem' }}>No contact messages yet.</p>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {msgs.map(m => (
        <div key={m._id} className="card glass-glow" style={{ padding: '1.5rem', background: 'linear-gradient(145deg, rgba(255,255,255,0.03), rgba(0,0,0,0.2))', borderLeft: '4px solid var(--gold)', transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', fontWeight: 700, fontSize: '1.2rem' }}>
                {m.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 style={{ margin: 0, color: '#fff', fontSize: '1.05rem' }}>{m.name}</h4>
                <span onClick={() => { navigator.clipboard.writeText(m.email); alert('Email copied to clipboard!'); }} style={{ fontSize: '0.85rem', color: 'var(--gold)', cursor: 'pointer', opacity: 0.9 }} title="Click to copy email">{m.email}</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-2)', background: 'rgba(255,255,255,0.05)', padding: '0.3rem 0.6rem', borderRadius: '12px' }}>{new Date(m.date).toLocaleString()}</span>
              <button className="btn btn-outline" style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem', color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.05)' }} onClick={() => del(m._id)} onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.05)'}>✕ Dismiss</button>
            </div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.4)', padding: '1.25rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <p style={{ whiteSpace: 'pre-wrap', margin: 0, color: 'var(--text-1)', fontSize: '0.95rem', lineHeight: 1.6 }}>{m.message}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ─── Trials Tab ─────────────────────────────────────────────── */
function TrialsTab({ onDataChange }) {
  const [trials, setTrials] = useState([])
  useEffect(() => {
    getTrials().then(setTrials).catch(() => { })
  }, [])

  const del = async (id) => {
    try {
      await deleteTrial(id)
      setTrials(prev => prev.filter(t => t._id !== id))
      if (onDataChange) onDataChange()
    } catch (err) {
      alert(`Error deleting booking: ${err.message}`)
    }
  }

  if (trials.length === 0) return <p style={{ color: 'var(--text-2)', textAlign: 'center', padding: '2rem' }}>No trial bookings yet.</p>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {trials.map(t => (
        <div key={t._id} className="card glass-glow" style={{ padding: '1.5rem', background: 'linear-gradient(145deg, rgba(245,158,11,0.05), rgba(0,0,0,0.3))', borderColor: 'rgba(245,158,11,0.2)', transition: 'transform 0.2s ease, box-shadow 0.2s ease', position: 'relative', overflow: 'hidden' }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: '100px', height: '100px', background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)', filter: 'blur(20px)', pointerEvents: 'none' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem', position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                🥋
              </div>
              <div>
                <h4 style={{ margin: 0, color: '#fff', fontSize: '1.1rem' }}>{t.name}</h4>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.3rem' }}>
                  <a href={`tel:${t.phone}`} style={{ fontSize: '0.8rem', color: 'var(--text-2)', textDecoration: 'none' }}>📞 {t.phone}</a>
                  <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
                  <span onClick={() => { navigator.clipboard.writeText(t.email); alert('Email copied to clipboard!'); }} style={{ fontSize: '0.8rem', color: 'var(--text-2)', cursor: 'pointer' }} title="Click to copy email">📧 {t.email}</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-2)', background: 'rgba(255,255,255,0.05)', padding: '0.3rem 0.6rem', borderRadius: '12px' }}>Booked: {new Date(t.bookedAt).toLocaleString()}</span>
              <button className="btn btn-outline" style={{ padding: '0.3rem 0.75rem', fontSize: '0.75rem', color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.05)' }} onClick={() => del(t._id)} onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.05)'}>✕ Cancel</button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', background: 'rgba(0,0,0,0.5)', padding: '1rem 1.5rem', borderRadius: '8px', flexWrap: 'wrap', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', zIndex: 2 }}>
            <div style={{ flex: 1, minWidth: '120px' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Requested Course</span>
              <h5 style={{ margin: '0.3rem 0 0 0', fontSize: '1rem', color: '#fff' }}>{t.course}</h5>
            </div>
            <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
            <div style={{ flex: 1, minWidth: '120px' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Preferred Date</span>
              <h5 style={{ margin: '0.3rem 0 0 0', fontSize: '1rem', color: '#fff' }}>{t.date}</h5>
            </div>
            {t.batch && (
              <>
                <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
                <div style={{ flex: 1, minWidth: '120px' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Batch Time</span>
                  <h5 style={{ margin: '0.3rem 0 0 0', fontSize: '1rem', color: '#fff' }}>{t.batch}</h5>
                </div>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ─── Media Library Tab ──────────────────────────────────────── */
function MediaTab({ token }) {
  const [media, setMedia] = useState([])
  const [filter, setFilter] = useState('all')
  const [showUpload, setShowUpload] = useState(false)
  const [editId, setEditId] = useState(null)
  const [editLabel, setEditLabel] = useState('')
  const [lightbox, setLightbox] = useState(null)

  const load = () => {
    getMedia('all').then(setMedia).catch(() => { })
  }

  useEffect(() => { load() }, [])

  const handleUploaded = (uploaded) => {
    setMedia(prev => [...uploaded, ...prev])
    setShowUpload(false)
    if (onDataChange) onDataChange()
  }

  const handleDelete = async (id) => {
    try {
      console.log('Deleting media:', id);
      const itemToDelete = media.find(m => m._id === id)
      if (itemToDelete && itemToDelete.publicId) {
        await deleteStorageFile(itemToDelete.publicId)
      }
      await deleteMediaRecord(id)
      setMedia(prev => prev.filter(m => m._id !== id))
      if (onDataChange) onDataChange()
    } catch (err) {
      alert(`Error deleting media: ${err.message}`)
    }
  }

  const handleSaveLabel = async (id) => {
    try {
      const updated = await updateMediaLabel(id, editLabel)
      setMedia(prev => prev.map(m => m._id === id ? updated : m))
      setEditId(null)
    } catch (err) {
      alert(`Error updating label: ${err.message}`)
    }
  }

  const copyUrl = (url) => { navigator.clipboard.writeText(url); alert('URL copied to clipboard!') }

  const filtered = filter === 'all' ? media : media.filter(m => m.type === filter)

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['all', 'image', 'video'].map(f => (
            <button key={f} className={`btn btn-outline${filter === f ? ' active' : ''}`} style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', ...(filter === f ? { background: 'var(--gold)', color: '#000', borderColor: 'var(--gold)' } : {}) }} onClick={() => setFilter(f)}>
              {f === 'all' ? 'All' : f === 'image' ? '🖼 Images' : '🎬 Videos'}
            </button>
          ))}
        </div>
        <button className="btn btn-gold" onClick={() => setShowUpload(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {showUpload ? '✕ Close Uploader' : '⬆ Upload Files'}
        </button>
      </div>

      {/* Upload panel */}
      {showUpload && (
        <div className="card glass-glow" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <MediaUploader token={token} onUploaded={handleUploaded} />
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <p style={{ color: 'var(--text-2)', textAlign: 'center', padding: '3rem' }}>
          {filter === 'all' ? 'No media uploaded yet. Click "Upload Files" to get started.' : `No ${filter}s uploaded yet.`}
        </p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
          {filtered.map(m => (
            <div key={m._id} className="media-card card glass-glow" style={{ padding: 0, overflow: 'hidden', position: 'relative' }}>
              {/* Thumbnail */}
              <div onClick={() => setLightbox(m)} style={{ cursor: 'pointer', background: '#000', aspectRatio: '16/9', overflow: 'hidden', position: 'relative' }}>
                {m.type === 'image' ? (
                  <img src={m.url} alt={m.originalName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)' }}>
                    <span style={{ fontSize: '2.5rem' }}>▶</span>
                  </div>
                )}
                <span style={{ position: 'absolute', top: 6, left: 6, background: 'rgba(0,0,0,0.65)', color: 'var(--gold)', fontSize: '0.65rem', padding: '0.2rem 0.45rem', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 700 }}>
                  {m.type}
                </span>
              </div>

              {/* Info & Actions */}
              <div style={{ padding: '0.65rem' }}>
                {editId === m._id ? (
                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <input value={editLabel} onChange={e => setEditLabel(e.target.value)} style={{ flexGrow: 1, fontSize: '0.78rem', padding: '0.25rem 0.4rem', borderRadius: '4px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }} autoFocus />
                    <button onClick={() => handleSaveLabel(m._id)} style={{ background: 'var(--gold)', color: '#000', border: 'none', borderRadius: '4px', padding: '0.25rem 0.5rem', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700 }}>✓</button>
                  </div>
                ) : (
                  <p onClick={() => { setEditId(m._id); setEditLabel(m.label || '') }} style={{ fontSize: '0.78rem', color: m.label ? 'var(--gold)' : 'var(--text-2)', cursor: 'pointer', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title="Click to edit label">
                    {m.label || '+ Add label'}
                  </p>
                )}
                <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.4rem' }}>
                  <button title="Copy URL" onClick={() => copyUrl(m.url)} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: 'var(--text-2)', cursor: 'pointer', fontSize: '0.75rem', padding: '0.3rem' }}>📋 Copy URL</button>
                  <button title="Delete" onClick={() => handleDelete(m._id)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '4px', color: '#ef4444', cursor: 'pointer', fontSize: '0.75rem', padding: '0.3rem 0.5rem' }}>🗑</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <button onClick={() => setLightbox(null)} style={{ position: 'absolute', top: 20, right: 24, background: 'none', border: 'none', color: '#fff', fontSize: '2rem', cursor: 'pointer' }}>✕</button>
          {lightbox.type === 'image'
            ? <img src={lightbox.url} alt={lightbox.originalName} style={{ maxWidth: '90vw', maxHeight: '85vh', borderRadius: '8px' }} onClick={e => e.stopPropagation()} />
            : <video src={lightbox.url} controls autoPlay style={{ maxWidth: '90vw', maxHeight: '85vh', borderRadius: '8px' }} onClick={e => e.stopPropagation()} />
          }
          <p style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', color: 'var(--text-2)', fontSize: '0.85rem' }}>{lightbox.originalName} {lightbox.label && `· ${lightbox.label}`}</p>
        </div>
      )}
    </div>
  )
}

/* ─── Content Editor Tab ─────────────────────────────────────── */
function EditorTab() {
  const [json, setJson] = useState('')
  const [status, setStatus] = useState('')
  const [color, setColor] = useState('var(--text-2)')
  const origRef = useRef('')

  useEffect(() => {
    const keys = ['courses', 'belts', 'achievements', 'schedules']
    Promise.all(keys.map(k => getSiteContent(k).then(data => [k, data])))
      .then(entries => {
        const obj = Object.fromEntries(entries)
        const str = JSON.stringify(obj, null, 2)
        setJson(str)
        origRef.current = str
      }).catch(() => { })
  }, [])

  const save = async () => {
    setStatus('Validating and saving...'); setColor('var(--text-2)')
    try {
      const parsed = JSON.parse(json)
      for (const key of ['courses', 'belts', 'achievements', 'schedules']) {
        if (parsed[key] !== undefined) {
          await updateSiteContent(key, parsed[key])
        }
      }
      setStatus('✅ Database updated successfully!'); setColor('#22c55e')
      setTimeout(() => setStatus(''), 3000)
    } catch (err) {
      setStatus(`❌ ${err.message}`); setColor('#ef4444')
    }
  }

  return (
    <div className="card glass-glow" style={{ padding: '2rem', background: 'rgba(0,0,0,0.3)' }}>
      <h3 className="text-gold" style={{ marginBottom: '0.5rem' }}>Dojo Content Data (JSON)</h3>
      <p style={{ color: 'var(--text-2)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Modify courses, belts, achievements, or schedules. Preserve JSON syntax.</p>
      <textarea value={json} onChange={e => setJson(e.target.value)} rows={18}
        style={{ fontFamily: 'monospace', fontSize: '0.85rem', lineHeight: 1.5, background: 'rgba(5,8,15,0.8)', color: '#22c55e', border: '1px solid rgba(255,255,255,0.08)', width: '100%', boxSizing: 'border-box', padding: '1rem', borderRadius: '6px', resize: 'vertical' }} />
      <p style={{ color, marginTop: '1rem', fontSize: '0.9rem' }}>{status}</p>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
        <button className="btn btn-outline" onClick={() => setJson(origRef.current)}>Reset Form</button>
        <button className="btn btn-gold" onClick={save}>Save Changes</button>
      </div>
    </div>
  )
}

/* ─── Main Admin Page ────────────────────────────────────────── */
export default function Admin() {
  const { isAuthenticated, token, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('messages')
  const [counts, setCounts] = useState({ messages: 0, trials: 0, media: 0 })

  const reloadCounts = () => {
    if (!isAuthenticated) return
    Promise.all([
      getMessages(),
      getTrials(),
      getMedia('all'),
    ]).then(([m, t, med]) => setCounts({ messages: m.length, trials: t.length, media: med.length }))
      .catch(() => { })
  }

  useEffect(() => {
    reloadCounts()
  }, [isAuthenticated])

  if (!isAuthenticated) return <LoginForm />

  return (
    <div className="page-container" style={{ paddingTop: '3rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }} className="stagger-1">
        <div>
          <h1 className="page-title" style={{ marginBottom: '0.25rem' }}>BKI Console</h1>
          <p style={{ color: 'var(--text-2)' }}>Manage content, media, messages, and bookings.</p>
        </div>
        <button onClick={logout} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>Exit Console</button>
      </div>

      {/* Tabs */}
      <div className="admin-tabs stagger-2" style={{ display: 'flex', gap: '0.75rem', marginBottom: '2.5rem', background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '12px', flexWrap: 'wrap', border: '1px solid rgba(255,255,255,0.05)' }}>
        {TABS.map(tab => (
          <button key={tab.id} className={`btn btn-outline admin-tab-btn${activeTab === tab.id ? ' active' : ''}`}
            style={{
              border: 'none',
              borderRadius: '8px',
              padding: '0.6rem 1.25rem',
              fontSize: '0.9rem',
              transition: 'all 0.3s ease',
              ...(activeTab === tab.id ? { background: 'var(--gold)', color: '#000', boxShadow: '0 4px 15px rgba(245,158,11,0.2)' } : { background: 'transparent', color: 'var(--text-2)' })
            }}
            onClick={() => setActiveTab(tab.id)}
            onMouseEnter={e => { if (activeTab !== tab.id) e.currentTarget.style.color = '#fff' }}
            onMouseLeave={e => { if (activeTab !== tab.id) e.currentTarget.style.color = 'var(--text-2)' }}
          >
            {tab.label}
            {tab.id !== 'editor' && (
              <span style={{
                background: activeTab === tab.id ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.1)',
                color: activeTab === tab.id ? 'var(--gold)' : '#fff',
                padding: '0.15rem 0.5rem',
                borderRadius: '12px',
                fontSize: '0.7rem',
                marginLeft: '0.5rem',
                fontWeight: 700
              }}>
                {counts[tab.id] || 0}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="stagger-3">
        {activeTab === 'messages' && <MessagesTab onDataChange={reloadCounts} />}
        {activeTab === 'trials' && <TrialsTab onDataChange={reloadCounts} />}
        {activeTab === 'media' && <MediaTab token={token} onDataChange={reloadCounts} />}
        {activeTab === 'editor' && <EditorTab />}
      </div>
    </div>
  )
}
