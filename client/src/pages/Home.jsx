import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [resetKey, setResetKey] = useState(0)

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

  const slides = [
    {
      eyebrow: "Traditional Shotokan Dojo",
      title: "Discipline & Strength",
      description: "Train in authentic Japanese Shotokan Karate. Build self-defense, focus, and physical conditioning under certified instructors.",
      detailedDescription: "Embark on the traditional journey from White Belt (10th Kyu) to Black Belt (1st Dan and beyond). This program follows the authentic Shotokan Karate syllabus, approved by certified Japanese Karate Masters.",
      cardTitle: "Traditional Dojo",
      cardSubtitle: "Shotokan Karate",
      image: "/karate_slide_shotokan.png",
      focus: [
        "Core Kihon (basics: stances, blocks, punches, kicks)",
        "Standard Shotokan Katas (forms: Heian series, Tekki, Bassai Dai, etc.)",
        "Kumite (controlled sparring: Gohon, Ippon, and Jiyu Kumite)",
        "Dojo Kun principles (character, sincerity, effort, etiquette, self-control)"
      ]
    },
    {
      eyebrow: "Youth Character Building",
      title: "Confidence & Respect",
      description: "Build confidence, concentration, and coordination through age-appropriate training. Teaching critical life skills for tomorrow.",
      detailedDescription: "Designed specifically for children aged 4 to 12. We focus on teaching discipline, respect, and self-confidence through active play and structured martial arts training.",
      cardTitle: "Kids Program",
      cardSubtitle: "Ages 4-12",
      image: "/karate_slide_kids.png",
      focus: [
        "Motor skills, agility, and body coordination",
        "Respect for self and others, focus, and listening skills",
        "Basic self-defense and anti-bullying awareness",
        "Goal setting through a progressive belt system"
      ]
    },
    {
      eyebrow: "Adult Martial Arts",
      title: "Physical & Mental Balance",
      description: "Transform fitness, relieve stress, and master realistic self-defense. Accessible to all skill levels from beginners to black belts.",
      detailedDescription: "For adults of all ages and fitness levels. This course blends intense physical conditioning, flexibility training, and realistic self-defense skills with traditional karate forms.",
      cardTitle: "Adult Classes",
      cardSubtitle: "Ages 18+",
      image: "/karate_slide_adults.png",
      focus: [
        "High-intensity cardio conditioning and core strength training",
        "Practical self-defense tactics and close-quarters combat techniques",
        "Advanced martial arts forms and applications (Bunkai)",
        "Stress relief, mental focus, and meditation practices"
      ]
    },
    {
      eyebrow: "Elite Competition Training",
      title: "Speed & Precision",
      description: "Master WKF sparring regulations, athletic speed drills, and advanced Kata expression. For competitors aspiring to state and national stages.",
      detailedDescription: "A specialized program for athletes looking to compete in state, national, and international karate tournaments. We focus on modern sports karate regulations, tactical scoring, and speed drills.",
      cardTitle: "Tournament Prep",
      cardSubtitle: "Elite Sparring",
      image: "/karate_slide_tournament.png",
      focus: [
        "WKF (World Karate Federation) rules and scoring strategies",
        "High-speed competition sparring (Kumite) drills and timing",
        "Precision and expression in Tournament Kata execution",
        "Mental toughness, performance psychology, and stamina training"
      ]
    }
  ]

  // Auto-play timer: 5 seconds per slide for the hero slider
  useEffect(() => {
    const timer = setTimeout(() => {
      handleNextSlide()
    }, 5000)
    return () => clearTimeout(timer)
  }, [activeIdx, resetKey])

  const handleNextSlide = () => {
    setActiveIdx((prev) => (prev + 1) % slides.length)
    setResetKey((prev) => prev + 1)
  }

  const handleCardClick = (targetIdx) => {
    setActiveIdx(targetIdx)
    setResetKey((prev) => prev + 1)
  }

  const allIndices = slides.map((_, i) => i)

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

  // Scroll reveal: add shadow class to cards when they scroll into view
  useEffect(() => {
    const cards = document.querySelectorAll('.home-card')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('shadow-active')
        } else {
          entry.target.classList.remove('shadow-active')
        }
      })
    }, {
      threshold: 0.2,
      rootMargin: '0px 0px -10% 0px'
    })

    cards.forEach(card => observer.observe(card))
    return () => observer.disconnect()
  }, [])

  const scrollToSection = (targetId) => {
    if (!autoplayActive.current) return

    const navH = window.innerWidth <= 768 ? 62 : 80
    const targetEl = document.getElementById(targetId)
    if (!targetEl) return

    const gsap = window.gsap
    if (gsap && window.ScrollToPlugin) {
      gsap.to(window, {
        scrollTo: { y: `#${targetId}`, offsetY: navH, autoKill: false },
        duration: 0.8,
        ease: "power2.inOut",
        onComplete: () => {
          autoplayTimeout.current = setTimeout(() => {
            currentSectionIdx.current++
            if (currentSectionIdx.current < sections.length) {
              scrollToSection(sections[currentSectionIdx.current])
            } else {
              autoplayActive.current = false
            }
          }, 2000)
        }
      })
    } else {
      const rect = targetEl.getBoundingClientRect()
      const targetY = window.pageYOffset + rect.top - navH
      window.scrollTo({ top: targetY, behavior: 'smooth' })

      autoplayTimeout.current = setTimeout(() => {
        currentSectionIdx.current++
        if (currentSectionIdx.current < sections.length) {
          scrollToSection(sections[currentSectionIdx.current])
        } else {
          autoplayActive.current = false
        }
      }, 2500)
    }
  }

  const startJourney = (e) => {
    e.preventDefault()
    autoplayActive.current = true
    currentSectionIdx.current = 0
    scrollToSection(sections[0])
  }

  return (
    <>
      {/* Hero Slider Section (The first page) */}
      <div className="samurai-slider-container">
        {/* Full-width Slides Background View */}
        {slides.map((slide, idx) => (
          <div 
            key={idx} 
            className={`samurai-slider-slide ${idx === activeIdx ? 'active' : ''}`}
          >
            <div className="samurai-slider-overlay" />
          </div>
        ))}

        {/* Staggered Entrance Text Contents (Left Panel) */}
        <div className="samurai-slider-content">
          <div key={activeIdx} className="samurai-slider-text-wrapper">
            <span className="eyebrow">{slides[activeIdx].eyebrow}</span>
            <h2>{slides[activeIdx].title}</h2>
            <p>{slides[activeIdx].description}</p>
          </div>
          <div className="samurai-actions-row">
            <button 
              className="samurai-btn-primary" 
              onClick={startJourney}
            >
              Start Journey
            </button>
          </div>
        </div>

        {/* Floating Preview Cards List (Right Panel) */}
        <div className="samurai-slider-cards-list">
          {allIndices.map((slideIdx) => (
            <div 
              key={slideIdx} 
              className={`samurai-slider-card-item${slideIdx === activeIdx ? ' samurai-card-active' : ''}`}
              onClick={() => handleCardClick(slideIdx)}
            >
              <img 
                src={slides[slideIdx].image} 
                alt={slides[slideIdx].cardTitle} 
                className="samurai-slider-card-img"
              />
              <div className="samurai-slider-card-overlay" />
              <div className="samurai-slider-card-info">
                <h4>{slides[slideIdx].cardTitle}</h4>
                <span>{slides[slideIdx].cardSubtitle}</span>
              </div>
              {slideIdx === activeIdx && (
                <div className="samurai-card-active-indicator" />
              )}
            </div>
          ))}
        </div>

        {/* Floating Scroll Button at the bottom center of the hero slider */}
        <button className="samurai-scroll-btn" onClick={startJourney}>
          <span>Start Journey</span>
          <svg className="samurai-scroll-chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
      </div>

      {/* Scroll Sections Container with maroon gradient background */}
      <div className="home-sections-container">
        {/* Legacy Section */}
        <section className="scroll-section card-section card-on-right" id="legacy-section">
          <h2 className="journey-section-title">Our Legacy</h2>
          <div className="home-card">
            <div className="card-glow-overlay" />
            <div style={{ position: 'relative', zIndex: 2 }}>
              <p>Founded in 2001 with a vision to spread Martial Arts, Self Defence, Discipline, Fitness, and Confidence.</p>
              <p>For more than 25 years, Best Karate of India has been transforming lives through traditional martial arts training and character development.</p>
            </div>
          </div>
        </section>

        {/* Master Section */}
        <section className="scroll-section card-section card-on-left" id="master-section">
          <h2 className="journey-section-title">Master's Journey</h2>
          <div className="home-card">
            <div className="card-glow-overlay" />
            <div style={{ position: 'relative', zIndex: 2 }}>
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
        <section className="scroll-section card-section card-on-right" id="achievements-section">
          <h2 className="journey-section-title">Achievements &amp; Training</h2>
          <div className="home-card">
            <div className="card-glow-overlay" />
            <div style={{ position: 'relative', zIndex: 2 }}>
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ fontSize: '1.1rem' }}>🥋</span> Shotokan Karate</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ fontSize: '1.1rem' }}>🧘</span> Yoga Asanas</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ fontSize: '1.1rem' }}>🏋️</span> Silambam</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ fontSize: '1.1rem' }}>💪</span> Fitness Training</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section className="scroll-section card-section card-on-left" id="impact-section">
          <h2 className="journey-section-title">Our Impact</h2>
          <div className="home-card" style={{ maxWidth: '550px' }}>
            <div className="card-glow-overlay" />
            <div style={{ position: 'relative', zIndex: 2 }}>
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
        <section className="scroll-section card-section card-on-right" id="experience-section">
          <h2 className="journey-section-title">Training Experience</h2>
          <div className="home-card" style={{ maxWidth: '520px' }}>
            <div className="card-glow-overlay" />
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', paddingLeft: '1.5rem', borderLeft: '2px dashed rgba(245, 158, 11, 0.3)', marginLeft: '0.5rem', color: '#ffffff', textAlign: 'left' }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '-2.05rem', top: '0.15rem', width: '12px', height: '12px', borderRadius: '50%', background: 'var(--gold)', border: '2px solid #000' }}></div>
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
        <section className="scroll-section card-section card-on-left" id="why-choose-section">
          <h2 className="journey-section-title">Why Choose Us</h2>
          <div className="home-card" style={{ maxWidth: '520px' }}>
            <div className="card-glow-overlay" />
            <div style={{ position: 'relative', zIndex: 2 }}>
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
      </div>
    </>
  )
}
