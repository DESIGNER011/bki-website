import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useScrollCanvas } from '../hooks/useScrollCanvas'

export default function Home() {
  const { canvasRef, loading, progress } = useScrollCanvas(240)
  const speedOverlayRef = useRef(null)
  const autoplayActive = useRef(false)
  const autoplayTimeout = useRef(null)
  const currentSectionIdx = useRef(0)

  const sections = [
    'legacy-section',
    'master-section',
    'achievements-section',
    'impact-section',
    'experience-section',
    'why-choose-section'
  ]

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
    const homeCards = document.querySelectorAll('.home-card')
    const onMouseMove = (e) => {
      const card = e.currentTarget
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      card.style.setProperty('--mouse-x', `${x}px`)
      card.style.setProperty('--mouse-y', `${y}px`)
    }
    homeCards.forEach(c => c.addEventListener('mousemove', onMouseMove))

    // GSAP ScrollTrigger Section Reveals
    let gsapTriggers = []
    const gsap = window.gsap
    const ScrollTrigger = window.ScrollTrigger

    if (gsap && ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger, window.ScrollToPlugin)

      // Animate card entries and h2 energy glow
      gsap.utils.toArray('.journey-reveal').forEach(section => {
        const header = section.querySelector('h2')
        const trigger = ScrollTrigger.create({
          trigger: section,
          start: "top 80%",
          toggleClass: "active",
          onToggle: self => {
            if (header) {
              if (self.isActive) header.classList.add('energy-glow-active')
              else header.classList.remove('energy-glow-active')
            }
          }
        })
        gsapTriggers.push(trigger)
      })

      // Hero Title Animation zoom trigger
      const heroTitle = document.querySelector('.hero-title')
      if (heroTitle) {
        const titleTrigger = ScrollTrigger.create({
          trigger: heroTitle,
          start: "top 80%",
          onEnter: () => {
            setTimeout(() => heroTitle.classList.add('zoom-in'), 150)
          }
        })
        gsapTriggers.push(titleTrigger)
      }

      ScrollTrigger.refresh()
    } else {
      // Fallback simple IntersectionObserver reveals
      const reveals = document.querySelectorAll('.journey-reveal')
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active')
          }
        })
      }, { threshold: 0.25 })
      reveals.forEach(el => observer.observe(el))
    }

    return () => {
      homeCards.forEach(c => c.removeEventListener('mousemove', onMouseMove))
      gsapTriggers.forEach(t => t.kill())
    }
  }, [loading])

  /* ── Autoplay Scroll Journey Logic ── */
  useEffect(() => {
    const stopAutoplay = () => {
      if (autoplayTimeout.current) {
        clearTimeout(autoplayTimeout.current)
        autoplayTimeout.current = null
      }
      autoplayActive.current = false
      if (window.gsap) {
        window.gsap.killTweensOf(window)
      }
      if (speedOverlayRef.current) {
        speedOverlayRef.current.classList.remove('active')
      }
    }

    const onUserInterrupt = () => {
      if (autoplayActive.current) stopAutoplay()
    }

    // Bind scroll/interact interrupt listeners
    window.addEventListener('wheel', onUserInterrupt, { passive: true })
    window.addEventListener('touchmove', onUserInterrupt, { passive: true })
    const onKeyDown = (e) => {
      if ([' ', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End'].includes(e.key)) {
        onUserInterrupt()
      }
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      stopAutoplay()
      window.removeEventListener('wheel', onUserInterrupt)
      window.removeEventListener('touchmove', onUserInterrupt)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  const scrollToSection = (targetId) => {
    if (!autoplayActive.current) return

    const sOverlay = speedOverlayRef.current
    if (sOverlay) sOverlay.classList.add('active')

    const gsap = window.gsap
    if (gsap && window.ScrollToPlugin) {
      gsap.to(window, {
        scrollTo: { y: `#${targetId}`, autoKill: false },
        duration: 0.5,
        ease: "power2.inOut",
        onComplete: () => {
          if (sOverlay) sOverlay.classList.remove('active')

          autoplayTimeout.current = setTimeout(() => {
            currentSectionIdx.current++
            if (currentSectionIdx.current < sections.length) {
              scrollToSection(sections[currentSectionIdx.current])
            } else {
              autoplayActive.current = false
            }
          }, 500)
        }
      })
    } else {
      const targetEl = document.getElementById(targetId)
      if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' })
      if (sOverlay) sOverlay.classList.remove('active')

      autoplayTimeout.current = setTimeout(() => {
        currentSectionIdx.current++
        if (currentSectionIdx.current < sections.length) {
          scrollToSection(sections[currentSectionIdx.current])
        } else {
          autoplayActive.current = false
        }
      }, 700)
    }
  }

  const startAutoplay = (e) => {
    e.preventDefault()
    if (window.innerWidth <= 768) {
      // On mobile, just scroll smoothly to the first content section and center it
      const targetEl = document.getElementById(sections[0])
      if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    autoplayActive.current = true
    currentSectionIdx.current = 0
    scrollToSection(sections[0])
  }

  return (
    <>
      {/* Loader */}
      {loading && (
        <div id="loader" className="loader-overlay">
          <h2>Loading Bushido Karate...</h2>
          <p id="loader-text">Initializing Dojo {progress}%</p>
        </div>
      )}

      {/* Floating Particles & Anime overlays */}
      <div id="particles-container" className="particles-container" />
      <div ref={speedOverlayRef} id="speed-lines-overlay" className="speed-lines-overlay" />

      {/* Canvas */}
      <div className="canvas-container">
        <canvas ref={canvasRef} id="scrollCanvas" />
      </div>

      {/* Hero Section */}
      <section className="scroll-section hero-section" id="hero-section">
        <div className="hero-content fade-in">
          <h1 className="hero-title">Forge Character.<br />Build <span className="text-gold">Strength.</span></h1>
          <div className="hero-actions">
            <button className="btn btn-gold btn-next-section" style={{ border: 'none' }} onClick={startAutoplay}>START THE JOURNEY</button>
          </div>
        </div>
      </section>

      {/* Legacy Section */}
      <section className="scroll-section card-section journey-reveal" id="legacy-section">
        <div className="home-card stagger-2" style={{ alignSelf: 'flex-end' }}>
          <div className="card-glow-overlay" />
          <div style={{ position: 'relative', zIndex: 2 }}>
            <h2 className="text-gold">Our Legacy</h2>
            <p>Founded in 2001 with a vision to spread Martial Arts, Self Defence, Discipline, Fitness, and Confidence.</p>
            <p>For more than 25 years, Best Karate of India has been transforming lives through traditional martial arts training and character development.</p>
          </div>
        </div>
      </section>

      {/* Master Section */}
      <section className="scroll-section card-section journey-reveal" id="master-section">
        <div className="home-card stagger-2" style={{ alignSelf: 'flex-start' }}>
          <div className="card-glow-overlay" />
          <div style={{ position: 'relative', zIndex: 2 }}>
            <h2 className="text-gold">Master's Journey</h2>
            <h3 style={{ color: '#ffffff', marginBottom: '0.25rem' }}>A.G. Prasanth Kumar</h3>
            <p className="text-gold" style={{ fontSize: '0.85rem', marginBottom: '1.25rem', fontWeight: 'normal', letterSpacing: '1px' }}>5th Dan Black Belt Practitioner</p>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1.5rem', color: '#ffffff' }}>
              <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span className="text-gold">🥋</span> 25+ Years of Shotokan Karate Experience</li>
              <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span className="text-gold">🥋</span> Dedicated Karate Instructor</li>
              <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span className="text-gold">🥋</span> Martial Arts &amp; Fitness Trainer</li>
            </ul>
            <h4 className="text-gold" style={{ marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.9rem' }}>Milestones:</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#ffffff' }}>
              <div><strong className="text-gold">2001</strong> – Founded Best Karate of India</div>
              <div><strong className="text-gold">2015</strong> – Achieved 5th Dan Black Belt</div>
              <div><strong className="text-gold">Present</strong> – Training Hundreds of Martial Artists</div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="scroll-section card-section journey-reveal" id="achievements-section">
        <div className="home-card stagger-2" style={{ alignSelf: 'flex-end' }}>
          <div className="card-glow-overlay" />
          <div style={{ position: 'relative', zIndex: 2 }}>
            <h2 className="text-gold">Achievements &amp; Training</h2>
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 className="text-gold" style={{ marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.9rem' }}>Achievements:</h4>
              <div style={{ marginBottom: '0.4rem', color: '#ffffff' }}><span style={{ fontSize: '1.1rem', marginRight: '0.4rem' }}>🏆</span> World Record Achievement</div>
              <div style={{ marginBottom: '0.4rem', color: '#ffffff' }}><span style={{ fontSize: '1.1rem', marginRight: '0.4rem' }}>🏆</span> Abdul Kalam Academy Best Practitioner Award</div>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 className="text-gold" style={{ marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.9rem' }}>Certified By:</h4>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: 0, color: '#ffffff' }}>
                <li style={{ marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span className="text-gold">✓</span> Japanese Karate Masters</li>
                <li style={{ marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span className="text-gold">✓</span> Senior Masters from India</li>
              </ul>
            </div>
            <div>
              <h4 className="text-gold" style={{ marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.9rem' }}>Programs:</h4>
              <div className="home-programs-grid">
                <div style={{ display: 'flex', alignHTML: 'center', gap: '0.5rem' }}><span style={{ fontSize: '1.1rem' }}>🥋</span> Shotokan Karate</div>
                <div style={{ display: 'flex', alignHTML: 'center', gap: '0.5rem' }}><span style={{ fontSize: '1.1rem' }}>🧘</span> Yoga Asanas</div>
                <div style={{ display: 'flex', alignHTML: 'center', gap: '0.5rem' }}><span style={{ fontSize: '1.1rem' }}>⚔️</span> Silambam</div>
                <div style={{ display: 'flex', alignHTML: 'center', gap: '0.5rem' }}><span style={{ fontSize: '1.1rem' }}>💪</span> Fitness Training</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="scroll-section card-section journey-reveal" id="impact-section">
        <div className="home-card stagger-2" style={{ alignSelf: 'flex-start', maxWidth: '550px' }}>
          <div className="card-glow-overlay" />
          <div style={{ position: 'relative', zIndex: 2 }}>
            <h2 className="text-gold" style={{ marginBottom: '1.5rem' }}>Our Impact</h2>
            <div className="home-stats-grid">
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '1.25rem', borderRadius: '8px', textAlign: 'center', backdropFilter: 'blur(10px)' }}>
                <div className="text-gold" style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem' }}>200+</div>
                <div style={{ color: '#ffffff', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Active Members</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '1.25rem', borderRadius: '8px', textAlign: 'center', backdropFilter: 'blur(10px)' }}>
                <div className="text-gold" style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem' }}>200+</div>
                <div style={{ color: '#ffffff', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Students Trained</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '1.25rem', borderRadius: '8px', textAlign: 'center', backdropFilter: 'blur(10px)', gridColumn: 'span 2' }}>
                <div className="text-gold" style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem' }}>500–1000</div>
                <div style={{ color: '#ffffff', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Black Belt Holders</div>
              </div>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '1rem 1.25rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#ffffff', backdropFilter: 'blur(10px)' }}>
              <span style={{ fontSize: '1.3rem' }}>📍</span>
              <div style={{ textAlign: 'left' }}>
                <div className="text-gold" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.15rem' }}>Presence</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Pollachi, Coimbatore, Pondicherry, Palakkad</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Training Experience Section */}
      <section className="scroll-section card-section journey-reveal" id="experience-section">
        <div className="home-card stagger-2" style={{ alignSelf: 'flex-end', maxWidth: '520px' }}>
          <div className="card-glow-overlay" />
          <div style={{ position: 'relative', zIndex: 2 }}>
            <h2 className="text-gold" style={{ marginBottom: '1.5rem' }}>Training Experience</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', paddingLeft: '1.5rem', borderLeft: '2px dashed rgba(245, 158, 11, 0.3)', marginLeft: '0.5rem', color: '#ffffff', textAlign: 'left' }}>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: -'2.05rem', left: '-2.05rem', top: '0.15rem', width: '12px', height: '12px', borderRadius: '50%', background: 'var(--gold)', border: '2px solid #000' }}></div>
                <h4 className="text-gold" style={{ fontSize: '1rem', marginBottom: '0.15rem' }}>Beginner</h4>
                <p style={{ marginBottom: 0, fontSize: '0.85rem', color: '#ccc', fontWeight: 'normal', textShadow: 'none' }}>Start with no experience. Welcome to the Dojo.</p>
              </div>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-2.05rem', top: '0.15rem', width: '12px', height: '12px', borderRadius: '50%', background: 'var(--gold)', border: '2px solid #000' }}></div>
                <h4 className="text-gold" style={{ fontSize: '1rem', marginBottom: '0.15rem' }}>Learn Basics &amp; Build Discipline</h4>
                <p style={{ marginBottom: 0, fontSize: '0.85rem', color: '#ccc', fontWeight: 'normal', textShadow: 'none' }}>Master the stances, blocks, punches, and dojo etiquette.</p>
              </div>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-2.05rem', top: '0.15rem', width: '12px', height: '12px', borderRadius: '50%', background: 'var(--gold)', border: '2px solid #000' }}></div>
                <h4 className="text-gold" style={{ fontSize: '1rem', marginBottom: '0.15rem' }}>Master Techniques</h4>
                <p style={{ marginBottom: 0, fontSize: '0.85rem', color: '#ccc', fontWeight: 'normal', textShadow: 'none' }}>Advance through Kata and Kumite training schedules.</p>
              </div>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-2.05rem', top: '0.15rem', width: '12px', height: '12px', borderRadius: '50%', background: 'var(--gold)', border: '2px solid #000' }}></div>
                <h4 className="text-gold" style={{ fontSize: '1rem', marginBottom: '0.15rem' }}>Earn Black Belt &amp; Become a Martial Artist</h4>
                <p style={{ marginBottom: 0, fontSize: '0.85rem', color: '#ccc', fontWeight: 'normal', textShadow: 'none' }}>Reach peak performance, self-mastery, and leadership.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="scroll-section card-section journey-reveal" id="why-choose-section">
        <div className="home-card stagger-2" style={{ alignSelf: 'flex-start', maxWidth: '520px' }}>
          <div className="card-glow-overlay" />
          <div style={{ position: 'relative', zIndex: 2 }}>
            <h2 className="text-gold" style={{ marginBottom: '1.5rem' }}>Why Choose Us</h2>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem', color: '#ffffff', textAlign: 'left' }}>
              <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <span className="text-gold" style={{ fontSize: '1.2rem', lineHeight: 1 }}>✓</span>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.95rem' }}>25+ Years Experience</strong>
                  <span style={{ fontSize: '0.8rem', color: '#ccc' }}>A legacy of expert leadership and teaching.</span>
                </div>
              </li>
              <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <span className="text-gold" style={{ fontSize: '1.2rem', lineHeight: 1 }}>✓</span>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.95rem' }}>Authentic Shotokan Training</strong>
                  <span style={{ fontSize: '0.8rem', color: '#ccc' }}>True traditional forms and applications.</span>
                </div>
              </li>
              <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <span className="text-gold" style={{ fontSize: '1.2rem', lineHeight: 1 }}>✓</span>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.95rem' }}>Traditional + Modern Approach</strong>
                  <span style={{ fontSize: '0.8rem', color: '#ccc' }}>Merging ancient wisdom with modern athletic conditioning.</span>
                </div>
              </li>
              <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <span className="text-gold" style={{ fontSize: '1.2rem', lineHeight: 1 }}>✓</span>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.95rem' }}>Physical &amp; Mental Growth</strong>
                  <span style={{ fontSize: '0.8rem', color: '#ccc' }}>Forging character, self-control, and resilience.</span>
                </div>
              </li>
            </ul>

            <div style={{ borderLeft: '3px solid var(--gold)', padding: '0.75rem 0 0.75rem 1.25rem', background: 'rgba(245, 158, 11, 0.04)', borderRadius: '0 8px 8px 0', marginBottom: '2rem', textAlign: 'left' }}>
              <p style={{ fontStyle: 'italic', marginBottom: 0, color: '#ffffff', fontSize: '1.05rem', fontWeight: 500, textShadow: 'none', lineHeight: '1.4' }}>
                "Your Journey Towards Strength Begins Here"
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link to="/contact" className="btn btn-gold" style={{ textShadow: 'none' }}>JOIN OUR ACADEMY</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
