import { useState, useEffect } from 'react'
import { getMedia, getSiteContent } from '../services/dbService'

function escHtml(str) {
  return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
}

const defaultAchievements = [
  {
    category: "International Tournaments",
    icon: "🏆",
    items: [
      { title: "World Shotokan Championship 2025", award: "Gold Medal — Team Kata", location: "Tokyo, Japan", winner: "Senior Team A", highlight: true },
      { title: "World Open Karate 2023", award: "Bronze Medal — Individual Kumite", location: "Berlin, Germany", winner: "Sensei R. Kumar" }
    ]
  },
  {
    category: "National Champions",
    icon: "🥈",
    items: [
      { title: "National Games 2025", award: "Overall Team Champions", location: "New Delhi, India", winner: "Dojo Team" },
      { title: "All India Shotokan Cup 2024", award: "Gold — U18 Girls Kumite", location: "Mumbai, India", winner: "P. Priya" },
      { title: "South Zone Karate Open 2024", award: "Gold — Kids Team Kata", location: "Bengaluru, India", winner: "Kids Team A" }
    ]
  }
]

const defaultGallery = [
  {
    _id: "default-1",
    type: "image",
    url: "https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=800&q=80",
    originalName: "kumite_practice.jpg",
    label: "Kumite Practice"
  },
  {
    _id: "default-2",
    type: "image",
    url: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80",
    originalName: "black_belt_focus.jpg",
    label: "Belt Graduation"
  },
  {
    _id: "default-3",
    type: "image",
    url: "https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&w=800&q=80",
    originalName: "dojo_hall.jpg",
    label: "Honbu Dojo"
  },
  {
    _id: "default-4",
    type: "image",
    url: "https://images.unsplash.com/photo-1576003767218-91374863e40f?auto=format&fit=crop&w=800&q=80",
    originalName: "traditional_training.jpg",
    label: "Traditional Kata"
  },
  {
    _id: "default-5",
    type: "image",
    url: "https://images.unsplash.com/photo-1615117961803-fa1518f888f4?auto=format&fit=crop&w=800&q=80",
    originalName: "youth_focus.jpg",
    label: "Youth Focus Program"
  },
  {
    _id: "default-6",
    type: "image",
    url: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=800&q=80",
    originalName: "dojo_championship.jpg",
    label: "Dojo Championship"
  }
]

/* ─── Gallery Lightbox ───────────────────────────────────────── */
function Lightbox({ items, startIndex, onClose }) {
  const [idx, setIdx] = useState(startIndex)
  const item = items[idx]

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') setIdx(i => Math.min(i + 1, items.length - 1))
      if (e.key === 'ArrowLeft')  setIdx(i => Math.max(i - 1, 0))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [items.length, onClose])

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(5, 8, 15, 0.97)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backdropFilter: 'blur(10px)', animation: 'fadeIn 0.25s ease forwards' }}>
      {/* Close Button */}
      <button onClick={onClose} style={{ position: 'absolute', top: 24, right: 28, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '1.25rem', width: 44, height: 44, borderRadius: '50%', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'; e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.color = '#ef4444' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff' }}>✕</button>

      {/* Prev Button */}
      {idx > 0 && (
        <button onClick={e => { e.stopPropagation(); setIdx(i => i - 1) }}
          style={{ position: 'absolute', left: 24, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', borderRadius: '50%', width: 52, height: 52, fontSize: '1.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', zIndex: 5 }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245, 158, 11, 0.1)'; e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#fff' }}>‹</button>
      )}

      {/* Media Content */}
      <div onClick={e => e.stopPropagation()} style={{ maxWidth: '85vw', maxHeight: '82vh', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', background: '#000', boxShadow: '0 24px 64px rgba(0,0,0,0.85)' }}>
          {item.type === 'image'
            ? <img src={item.url} alt={item.originalName} style={{ maxWidth: '100%', maxHeight: '72vh', display: 'block', objectFit: 'contain' }} />
            : <video src={item.url} controls autoPlay style={{ maxWidth: '100%', maxHeight: '72vh', display: 'block' }} />
          }
        </div>
        
        <div style={{ textAlign: 'center' }}>
          {item.label && <h4 style={{ color: 'var(--gold)', fontSize: '1.05rem', margin: '0 0 0.25rem 0', fontWeight: 700 }}>{item.label}</h4>}
          <p style={{ color: 'var(--text-2)', fontSize: '0.8rem', margin: 0 }}>
            {idx + 1} of {items.length} — {item.originalName}
          </p>
        </div>
      </div>

      {/* Next Button */}
      {idx < items.length - 1 && (
        <button onClick={e => { e.stopPropagation(); setIdx(i => i + 1) }}
          style={{ position: 'absolute', right: 24, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', borderRadius: '50%', width: 52, height: 52, fontSize: '1.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', zIndex: 5 }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245, 158, 11, 0.1)'; e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#fff' }}>›</button>
      )}
    </div>
  )
}

/* ─── Gallery Section ────────────────────────────────────────── */
function GallerySection() {
  const [media,    setMedia]    = useState([])
  const [filter,   setFilter]   = useState('all')
  const [lightbox, setLightbox] = useState(null)
  const [labels,   setLabels]   = useState([])
  const [hovered,  setHovered]  = useState(null)
  const [imageErrors, setImageErrors] = useState({})
  const handleImageError = (id) => {
    setImageErrors(prev => ({ ...prev, [id]: true }))
  }

  useEffect(() => {
    getMedia('all')
      .then(data => {
        if (data && data.length > 0) {
          const sanitized = data.map(item => ({
            ...item,
            url: item.url.includes('1549811160-a3198651fd08') ? 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80'
               : item.url.includes('1507398941214-572c25f4b1bc') ? 'https://images.unsplash.com/photo-1576003767218-91374863e40f?auto=format&fit=crop&w=800&q=80'
               : item.url.includes('1517838277536-f5f99be501cd') ? 'https://images.unsplash.com/photo-1615117961803-fa1518f888f4?auto=format&fit=crop&w=800&q=80'
               : item.url
          }))
          setMedia(sanitized)
          const unique = [...new Set(sanitized.map(m => m.label).filter(Boolean))]
          setLabels(unique)
        } else {
          setMedia(defaultGallery)
          const unique = [...new Set(defaultGallery.map(m => m.label).filter(Boolean))]
          setLabels(unique)
        }
      })
      .catch(() => {
        setMedia(defaultGallery)
        const unique = [...new Set(defaultGallery.map(m => m.label).filter(Boolean))]
        setLabels(unique)
      })
  }, [])

  if (media.length === 0) return null

  const filtered = filter === 'all'    ? media
                 : filter === 'image'  ? media.filter(m => m.type === 'image')
                 : filter === 'video'  ? media.filter(m => m.type === 'video')
                 : media.filter(m => m.label === filter)

  const lightboxItems = filtered

  return (
    <section style={{ marginTop: '4rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <p className="eyebrow">Media</p>
        <h2 className="section-title">Photo &amp; <span className="text-gold">Video Gallery</span></h2>
        <p className="section-sub">Moments from our dojo, championships, and training sessions.</p>
      </div>

      {/* Filter bar */}
      <div className="gallery-filters">
        {['all', 'image', 'video', ...labels].map(f => (
          <button key={f}
            onClick={() => setFilter(f)}
            className="btn btn-outline"
            style={{ padding: '0.45rem 1.25rem', fontSize: '0.85rem', textTransform: 'capitalize', borderRadius: '30px', transition: 'all 0.25s',
              ...(filter === f ? { background: 'var(--gold)', color: '#000', borderColor: 'var(--gold)', boxShadow: '0 4px 12px rgba(245, 158, 11, 0.25)' } : { background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(8px)', borderColor: 'rgba(255,255,255,0.08)' }) }}>
            {f === 'all' ? '🔍 All' : f === 'image' ? '🖼 Photos' : f === 'video' ? '🎬 Videos' : f}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="gallery-grid">
        {filtered.map((item, i) => {
          const isHovered = hovered === i;
          return (
            <div key={item._id} onClick={() => setLightbox(i)}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: 'pointer', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', background: '#0b0f19', aspectRatio: '4/3', position: 'relative', transition: 'all 0.35s cubic-bezier(0.25, 1, 0.5, 1)', transform: isHovered ? 'translateY(-5px) scale(1.02)' : 'none', boxShadow: isHovered ? '0 12px 36px rgba(0,0,0,0.5), 0 0 16px rgba(245, 158, 11, 0.15)' : 'none', borderColor: isHovered ? 'var(--gold)' : 'rgba(255,255,255,0.05)' }}>
              {item.type === 'image'
                ? (imageErrors[item._id] ? (
                    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #0b0f19 0%, #1a1510 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '0.5rem', border: '1px dashed rgba(245,158,11,0.2)', borderRadius: '12px' }}>
                      <span style={{ fontSize: '2rem' }}>🥋</span>
                      <span style={{ color: 'var(--gold)', fontSize: '0.8rem', fontWeight: 700 }}>{item.label || 'BKI Dojo'}</span>
                    </div>
                  ) : (
                    <img src={item.url} alt={item.originalName} onError={() => handleImageError(item._id)} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease', transform: isHovered ? 'scale(1.08)' : 'none' }} />
                  ))
                : (
                  <div style={{ width: '100%', height: '100%', background: 'rgba(20,20,30,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '0.5rem', position: 'relative' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.15)', border: '2px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', color: 'var(--gold)', transition: 'transform 0.3s ease', transform: isHovered ? 'scale(1.15)' : 'none' }}>▶</div>
                    {item.label && <span style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600 }}>{item.label}</span>}
                  </div>
                )
              }
              {/* Hover Overlay */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(11, 15, 25, 0.95) 0%, rgba(11, 15, 25, 0.45) 50%, transparent 100%)', opacity: isHovered ? 1 : 0, transition: 'opacity 0.3s ease', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '1.25rem', pointerEvents: 'none', backdropFilter: isHovered ? 'blur(3px)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>{item.type === 'video' ? '🎬 Video' : '🖼 Photo'}</span>
                    <strong style={{ color: '#fff', fontSize: '0.9rem', display: 'block' }}>{item.label || item.originalName}</strong>
                  </div>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--gold)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>
                    {item.type === 'video' ? '▶' : '🔍'}
                  </div>
                </div>
              </div>
              {/* Tag Badge (not hovered) */}
              {!isHovered && item.label && (
                <span style={{ position: 'absolute', bottom: 12, left: 12, background: 'rgba(5, 8, 15, 0.85)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--gold)', fontSize: '0.7rem', padding: '0.25rem 0.6rem', borderRadius: '4px', fontWeight: 600 }}>
                  {item.label}
                </span>
              )}
            </div>
          )
        })}
      </div>

      {lightbox !== null && (
        <Lightbox items={lightboxItems} startIndex={lightbox} onClose={() => setLightbox(null)} />
      )}
    </section>
  )
}

/* ─── Main Achievements Page ─────────────────────────────────── */
export default function Achievements() {
  const [groups, setGroups]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  useEffect(() => {
    getSiteContent('achievements', defaultAchievements)
      .then(data => {
        if (data && data.length > 0) {
          setGroups(data)
        } else {
          setGroups(defaultAchievements)
        }
      })
      .catch(() => {
        setGroups(defaultAchievements)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="page-section" style={{ paddingTop: '3rem', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 1.5rem' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p className="eyebrow">Our Record</p>
          <h1 className="section-title">Hall of <span className="text-gold">Champions</span></h1>
          <p className="section-sub">Celebrating the victories and milestones of our students and teams on national and international stages.</p>
        </div>

        {/* Achievements List */}
        {loading && <p style={{ color: 'var(--text-2)', textAlign: 'center' }}>Loading...</p>}
        {error   && <p style={{ color: '#ef4444',    textAlign: 'center' }}></p>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {groups.map((g, gi) => (
            <div key={gi} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '1.25rem 1.75rem', background: 'rgba(255,255,255,0.005)', borderBottom: '1px solid rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.5rem' }}>{g.icon || '🏅'}</span>
                <h2 style={{ fontSize: '1.05rem', fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--gold)' }}>{g.category}</h2>
              </div>
              <div style={{ padding: '0.5rem 0' }}>
                {(g.items || []).map((item, ii) => (
                  <div key={ii} className="achievement-item-row" style={{ background: item.highlight ? 'rgba(212,175,55,0.04)' : 'transparent' }}>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '0.95rem', color: item.highlight ? 'var(--gold)' : 'inherit' }}>{item.title}</p>
                      <p style={{ color: 'var(--text-2)', fontSize: '0.85rem', marginTop: '0.2rem' }}>{item.award}</p>
                      <p style={{ color: 'var(--text-2)', fontSize: '0.78rem', marginTop: '0.15rem' }}>📍 {item.location}</p>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <p style={{ fontSize: '0.82rem', fontWeight: 600 }}>{item.winner}</p>
                      {item.highlight && <span style={{ display: 'inline-block', marginTop: '0.3rem', fontSize: '0.72rem', background: 'rgba(212,175,55,0.15)', color: 'var(--gold)', borderRadius: '99px', padding: '0.15rem 0.6rem', fontWeight: 700 }}>★ HIGHLIGHT</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── Gallery Section (embedded) ── */}
        <GallerySection />

      </div>
    </section>
  )
}
