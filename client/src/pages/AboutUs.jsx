import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useScrollCanvas } from '../hooks/useScrollCanvas'

export default function AboutUs() {
  const { canvasRef, loading, progress } = useScrollCanvas(240)
  const speedOverlayRef = useRef(null)

  const professionalTraining = [
    {
      name: 'Shotokan Karate',
      icon: (
        <svg className="program-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15, color: '#D4A017', flexShrink: 0 }}>
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      )
    },
    {
      name: 'Kata',
      icon: (
        <svg className="program-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15, color: '#D4A017', flexShrink: 0 }}>
          <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
        </svg>
      )
    },
    {
      name: 'Kumite',
      icon: (
        <svg className="program-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15, color: '#D4A017', flexShrink: 0 }}>
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      )
    },
    {
      name: 'Team Kata',
      icon: (
        <svg className="program-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15, color: '#D4A017', flexShrink: 0 }}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    }
  ];

  const otherDisciplines = [
    {
      name: 'Yoga',
      icon: (
        <svg className="program-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15, color: '#a1a1aa', flexShrink: 0 }}>
          <circle cx="12" cy="5" r="2" />
          <path d="M12 7c-3.5 0-6 2.5-6 6v7h12v-7c0-3.5-2.5-6-6-6z" />
          <path d="M6 13H2v-2a2 2 0 0 1 2-2h2" />
          <path d="M18 13h4v-2a2 2 0 0 0-2-2h-2" />
        </svg>
      )
    },
    {
      name: 'Kickboxing',
      icon: (
        <svg className="program-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15, color: '#a1a1aa', flexShrink: 0 }}>
          <path d="M18 14h-8l-4 6H2l6-9 2-5h5l3 3h5" />
          <circle cx="15" cy="5" r="1.5" />
        </svg>
      )
    },
    {
      name: 'Boxing',
      icon: (
        <svg className="program-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15, color: '#a1a1aa', flexShrink: 0 }}>
          <rect x="3" y="11" width="18" height="10" rx="2" />
          <path d="M12 2v9M8 5v6M16 5v6" />
        </svg>
      )
    },
    {
      name: 'Silambam',
      icon: (
        <svg className="program-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15, color: '#a1a1aa', flexShrink: 0 }}>
          <line x1="18" y1="2" x2="6" y2="22" />
          <line x1="6" y1="2" x2="18" y2="22" />
        </svg>
      )
    }
  ];

  /* ── Particles & Speed Lines Generation ── */
  useEffect(() => {
    // Generate particles
    const pContainer = document.getElementById('particles-container')
    if (pContainer) {
      pContainer.innerHTML = ''
      for (let i = 0; i < 35; i++) {
        const p = document.createElement('div')
        p.className = 'particle'
        p.style.left = `${Math.random() * 100}vw`
        p.style.setProperty('--size', `${3 + Math.random() * 7}px`)
        p.style.setProperty('--opacity', `${0.2 + Math.random() * 0.5}`)
        p.style.setProperty('--drift', `${-50 + Math.random() * 100}px`)
        p.style.setProperty('--duration', `${6 + Math.random() * 8}s`)
        p.style.animationDelay = `${Math.random() * 5}s`
        pContainer.appendChild(p)
      }
    }

    // Generate speed lines
    const sOverlay = speedOverlayRef.current
    if (sOverlay) {
      sOverlay.innerHTML = ''
      for (let i = 0; i < 40; i++) {
        const line = document.createElement('div')
        line.className = 'speed-line'
        line.style.setProperty('--angle', `${Math.random() * 360}deg`)
        line.style.setProperty('--width', `${100 + Math.random() * 150}px`)
        line.style.setProperty('--speed', `${0.1 + Math.random() * 0.15}s`)
        sOverlay.appendChild(line)
      }
    }
  }, [])

  /* ── Spotlight Tracking & GSAP Setup ── */
  useEffect(() => {
    if (loading) return

    // Card Spotlight cursor tracking
    const cards = document.querySelectorAll('.about-glow-wrapper, .instructor-card, .about-sub-card')
    const onMouseMove = (e) => {
      const card = e.currentTarget
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      card.style.setProperty('--mouse-x', `${x}px`)
      card.style.setProperty('--mouse-y', `${y}px`)
    }
    cards.forEach(c => c.addEventListener('mousemove', onMouseMove))

    // GSAP ScrollTrigger reveals
    let gsapTriggers = []
    const gsap = window.gsap
    const ScrollTrigger = window.ScrollTrigger
    if (gsap && ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger)
      gsap.utils.toArray('.instructor-card, .about-glow-wrapper, .mission-card, .about-sub-card, .dojo-kun-plaque').forEach(el => {
        const trigger = ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          toggleClass: "active"
        })
        gsapTriggers.push(trigger)
      })
      ScrollTrigger.refresh()
    }

    return () => {
      cards.forEach(c => c.removeEventListener('mousemove', onMouseMove))
      gsapTriggers.forEach(t => t.kill())
    }
  }, [loading])

  return (
    <>
      {/* Loader */}
      {loading && (
        <div id="loader" className="loader-overlay">
          <h2>Loading About Us...</h2>
          <p id="loader-text">Initializing Dojo {progress}%</p>
        </div>
      )}

      {/* Floating Particles & Speed lines */}
      <div id="particles-container" className="particles-container" />
      <div ref={speedOverlayRef} id="speed-lines-overlay" className="speed-lines-overlay" />

      {/* Canvas */}
      <div className="canvas-container">
        <canvas ref={canvasRef} id="scrollCanvas" />
      </div>

      <div className="page-container about-page-container" style={{
        paddingTop: '3rem',
        paddingBottom: '0rem',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 'calc(100vh - var(--nav-h))',
        boxSizing: 'border-box',
        background: 'transparent'
      }}>
        {/* Hero — text only */}
        <div className="stagger-1" style={{
          padding: '2.5rem 0 1.5rem 0',
          borderBottom: '1px solid rgba(193, 18, 31, 0.18)',
          marginBottom: '0.5rem'
        }}>
          <h1 className="page-title slide-left" style={{
            marginBottom: '0.5rem',
            color: 'var(--red)',
            fontSize: 'clamp(2rem, 5vw, 3.2rem)'
          }}>
            The Spirit of Karate
          </h1>
          <p className="slide-right" style={{
            color: 'var(--text-1)',
            fontSize: '1.05rem',
            margin: 0
          }}>
            Forging Character. Building Strength.
          </p>
        </div>

        {/* SECTION 2: About Our Academy */}
        <div className="about-grid stagger-2" style={{ marginBottom: '3rem', alignItems: 'stretch' }}>
          <div className="slide-left about-glow-wrapper" style={{ padding: '2.5rem 2.75rem' }}>
            <div className="about-glow-bg" />
            <div className="about-content-wrapper">
              <div>
                <h2 className="text-gold" style={{ marginBottom: '1.5rem', fontSize: '2.2rem', fontWeight: 800 }}>About Our Academy</h2>
                
                <div className="about-lines-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                  {[
                    { section: 'Legacy & Foundation', lines: [
                      'Founded by a chief instructor with over 40+ years of dedication.',
                      'Built on a passion that began at the early age of 15.',
                      'Headquartered in a modern, fully-equipped martial arts dojo.',
                      'Guided by the authentic lineage and principles of Okinawan Karate.',
                      'A family-friendly and inclusive sanctuary for physical fitness.'
                    ]},
                    { section: 'Curriculum & Mastery', lines: [
                      'Specializing in traditional Shotokan Karate fundamentals.',
                      'Rigorous training in Kata (forms) for focus and precision.',
                      'Dynamic combat practice in Kumite (sparring) for real-world application.',
                      'Focused Team Kata practice for coordination and synchronization.',
                      'Multi-disciplinary syllabus incorporating Yoga for breathing and core strength.',
                      'Modern striking elements from Kickboxing and Boxing.',
                      'Traditional Indian weapons training specializing in Silambam.'
                    ]},
                    { section: 'Core Growth & Philosophy', lines: [
                      'Fostering strict self-discipline and mutual respect.',
                      'Developing time management and goal-oriented behaviors.',
                      'Strengthening mental focus and situational awareness.',
                      'Cultivating the courage to face life\'s challenges head-on.',
                      'Building inner peace, emotional control, and physical flexibility.'
                    ]},
                    { section: 'Dojo Highlights', lines: [
                      'Proudly certified between 500 and 1,000 Black Belts.',
                      'Low student-to-teacher ratio for personalized, safe instruction.',
                      'Low-impact, youth-focused kids development programs.',
                      'Elite tournament preparation for regional and national competitions.',
                      'Honored with an excellence award by the Dr. A.P.J. Abdul Kalam Academy.'
                    ]}
                  ].map((sec, sIdx) => (
                    <div key={sIdx} style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                      <h4 style={{ color: '#D4A017', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.25rem', fontWeight: '800' }}>
                        {sec.section}
                      </h4>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        {sec.lines.map((line, lIdx) => (
                          <li key={lIdx} style={{ fontSize: '0.98rem', color: 'var(--text-1)', display: 'flex', alignItems: 'flex-start', gap: '0.55rem', lineHeight: '1.4' }}>
                            <span style={{ color: '#D4A017', marginTop: '0.25rem', fontSize: '0.75rem' }}>⚡</span>
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stylized Quote Block */}
              <div style={{
                marginTop: '1.5rem',
                padding: '1.25rem 1.5rem',
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, transparent 100%)',
                borderLeft: '4px solid #D4A017',
                borderRadius: '0 8px 8px 0',
                fontStyle: 'italic',
                color: '#fff',
                fontSize: '1.05rem',
                lineHeight: '1.6',
                position: 'relative'
              }}>
                <span style={{ position: 'absolute', top: '-0.9rem', left: '0.5rem', fontSize: '3.5rem', color: 'rgba(245, 158, 11, 0.12)', fontFamily: 'serif', pointerEvents: 'none' }}>“</span>
                Karate does not begin and end with fighting. It begins with respect and ends with respect. Our goal is to forge unbreakable spirit, sharp focus, and humble confidence in every student who steps onto our tatami.
              </div>

              {/* Stats Cards to eliminate empty space */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1.25rem', marginTop: '2.5rem' }}>
                <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '1.25rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.03)', textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#D4A017', marginBottom: '0.25rem' }}>40+</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-1)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Years Experience</div>
                </div>
                <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '1.25rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.03)', textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#D4A017', marginBottom: '0.25rem' }}>1000+</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-1)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Black Belts Certified</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mission-card slide-right" style={{ background: 'rgba(11, 15, 25, 0.35)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '12px', padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', gap: '1.5rem' }}>
            
            {/* Disciplines Container */}
            <div className="disciplines-wrapper">
              {/* Professional Training */}
              <div className="about-sub-card card-training">
                <h3 className="sub-card-title">🥋 Training</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  {professionalTraining.map(item => (
                    <div key={item.name} className="training-pill">
                      {item.icon}
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Other Disciplines */}
              <div className="about-sub-card card-disciplines">
                <h3 className="sub-card-title">⚔️ Disciplines</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  {otherDisciplines.map(item => (
                    <div key={item.name} className="discipline-pill">
                      {item.icon}
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Core Focus */}
            <div className="about-sub-card" style={{ background: 'transparent', border: 'none', padding: 0 }}>
              <h3 className="sub-card-title">🔥 Core Focus</h3>
              <div className="focus-grid-container">
                {[
                  { title: 'Discipline', icon: <svg className="focus-box-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
                  { title: 'Respect', icon: <svg className="focus-box-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> },
                  { title: 'Time Mgmt', icon: <svg className="focus-box-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 2h14M5 22h14M19 2v4a7 7 0 0 1-7 7 7 7 0 0 1-7-7V2M5 22v-4a7 7 0 0 1 7-7 7 7 0 0 1 7 7v4"/></svg> },
                  { title: 'Focus', icon: <svg className="focus-box-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg> },
                  { title: 'Confidence', icon: <svg className="focus-box-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z"/><path d="M3 20h18"/></svg> },
                  { title: 'Flexibility', icon: <svg className="focus-box-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 8.5c-1-1-3-1-4-1H9c-1 0-3 0-4 1L3 11l1.5 1.5L7 10v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-5l2.5 1 1.5-2-2-3.5z"/></svg> }
                ].map(item => (
                  <div key={item.title} className="focus-box">
                    {item.icon}
                    <span className="focus-box-title">{item.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dojo Rules */}
            <div className="dojo-kun-plaque">
              <h3 className="sub-card-title">📜 Shotokan Rules (Dojo Kun)</h3>
              <div className="kun-scroll-list">
                {[
                  {
                    title: 'Seek perfection of character',
                    jp: 'JINKAKU KANSEI',
                    detail: 'Karate is a path to refine the mind and spirit. Every technique practiced is a step towards cultivating personal integrity, humility, and strength of character.'
                  },
                  {
                    title: 'Be faithful and sincere',
                    jp: 'MAKOTO NO MICHI',
                    detail: 'Stay true to your path, defend the truth, and practice with absolute honesty. Sincerity builds trust within the dojo and honor in daily life.'
                  },
                  {
                    title: 'Endeavor to excel',
                    jp: 'DORYOKU NO SEISHIN',
                    detail: 'True mastery is forged through relentless effort and dedication. Cultivate patience, embrace sweat and struggle, and never settle for mediocrity.'
                  },
                  {
                    title: 'Respect others and courtesy',
                    jp: 'REIGI O OMOUNZU',
                    detail: 'Traditional karate begins and ends with courtesy. Respect your instructors, support your peers, and show kindness to all living beings.'
                  },
                  {
                    title: 'Refrain from violent behavior',
                    jp: 'KEKI NO YU',
                    detail: 'The ultimate purpose of karate training is peace. Restrain impulsive anger, control your power, and use martial skills strictly for defense and justice.'
                  }
                ].map((rule, idx) => (
                  <div key={idx} className="kun-scroll-item" style={{ alignItems: 'flex-start', gap: '0.85rem' }}>
                    <div className="kun-kanji-marker" style={{ marginTop: '0.2rem' }}>一</div>
                    <div className="kun-text-container" style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.25rem' }}>
                        <span className="kun-text-en" style={{ fontWeight: '700', fontSize: '0.9rem' }}>{rule.title}</span>
                        <span className="kun-text-jp" style={{ fontSize: '0.55rem', opacity: 0.8 }}>{rule.jp}</span>
                      </div>
                      <span className="kun-rule-detail" style={{ fontSize: '0.76rem', color: 'var(--text-1)', lineHeight: 1.4, marginTop: '0.15rem', display: 'block' }}>{rule.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recognition Showcase */}
            <div className="recognition-showcase">
              <div className="recognition-glow-bg" />
              <div className="recognition-flex">
                <div className="recognition-badge-container">
                  <svg className="recognition-badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="7" />
                    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                  </svg>
                </div>
                <div className="recognition-content">
                  <div className="recognition-numbers">
                    <span>500</span> – <span>1,000+</span> Black Belts
                  </div>
                  <p className="recognition-text">
                    Graduated under our Chief Instructor. Honored with excellence award by the <strong>Dr. A.P.J. Abdul Kalam Academy</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.07)', marginBottom: '3rem' }} />

        {/* Instructor Team */}
        <section className="stagger-2">
          <h2 className="text-gold" style={{ textAlign: 'center', marginBottom: '2rem' }}>Our Instructor Team</h2>
          <div className="card-grid">
            {[
              { name: 'Mr. A.G.Prasanth Kumar', role: 'Chief Instructor · 7th Dan Black Belt', bio: 'Over 40+ years of experience. Founder of BKI and national award winner.' },
              { name: 'Mr. Pattu Kumar', role: 'Senior Instructor · Black Belt', bio: '10+ years of experience. Specializes in advanced Kumite strategies and tournament preparation.' },
              { name: 'Mr. Kanaga Raj', role: 'Kids Program Director · Black Belt', bio: '10+ years of experience. Expert in youth development, focus training, and foundational techniques.' },
              { name: 'Mr. Harshan', role: 'Assistant Instructor · Black Belt', bio: '10+ years of experience. Focused on adult fitness and strength conditioning.' },
              { name: 'Mr. Yadhu Krishnan', role: 'Assistant Instructor · Black Belt', bio: '10+ years of experience. Specializes in kata precision, bunkai application, and junior classes.' },
              { name: 'Mr. P.Vishnu Vardhan', role: 'Assistant Instructor · Black Belt', bio: '10+ years of experience. Passionate about kids introduction programs and dojo etiquette.' },
            ].map(({ name, role, bio }) => (
              <div key={name} className="card glass-glow instructor-card" style={{ textAlign: 'center' }}>
                <div className="card-glow-overlay" />
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <div style={{ width: 90, height: 90, borderRadius: '50%', background: '#111', margin: '0 auto 1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.25rem', border: '2px solid #D4A017' }}>👤</div>
                  <h3 style={{ marginBottom: '0.35rem' }}>{name}</h3>
                  <p className="text-gold" style={{ fontSize: '0.82rem', marginBottom: '0.65rem' }}>{role}</p>
                  <p style={{ color: 'var(--text-1)', fontSize: '0.85rem', lineHeight: 1.6 }}>{bio}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: '3.5rem',
          paddingBottom: '3.5rem'
        }}>
          <Link to="/trial" className="btn btn-gold">Join Our Dojo Today</Link>
        </div>
      </div>
    </>
  )
}
