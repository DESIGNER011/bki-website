import { useState, useEffect } from 'react'
import { getSiteContent } from '../services/dbService'

const defaultBelts = [
  {
    name: "White Belt",
    kyu: "9th",
    color: "#ffffff",
    description: "Foundational stances, punching, and blocking techniques.",
    requirements: "Beginner level. Learn basic Dojo etiquette and vocabulary.",
    kihon: "Choku-Zuki (Straight punch), Age-Uke (Rising block), Zenkutsu-Dachi (Front stance)",
    kata: "Taikyoku Shodan (Basics Form)",
    kumite: "Gohon Kumite (5-step basic sparring)",
    gold: false
  },
  {
    name: "Yellow Belt",
    kyu: "8th",
    color: "#eab308",
    description: "Introduction to movement patterns, front kicks, and counter blocks.",
    requirements: "Minimum 3 months of regular training.",
    kihon: "Gyaku-Zuki (Reverse punch), Gedan-Barai (Downward block), Kokutsu-Dachi (Back stance)",
    kata: "Heian Shodan (Peaceful Mind - Level 1)",
    kumite: "Gohon Kumite (Focus on distance & timing)",
    gold: false
  },
  {
    name: "Orange Belt",
    kyu: "7th",
    color: "#f97316",
    description: "Introduction to side kicks, combinations, and basic sparring kata.",
    requirements: "Minimum 3 months as an 8th Kyu.",
    kihon: "Soto-Uke (Outside block), Mae-Geri (Front kick), combination transitions",
    kata: "Heian Nidan (Peaceful Mind - Level 2)",
    kumite: "Sanbon Kumite (3-step semi-free sparring)",
    gold: false
  },
  {
    name: "Green Belt",
    kyu: "6th",
    color: "#22c55e",
    description: "Intermediate blocks, sweeps, and kumite strategies.",
    requirements: "Minimum 4 months as a 7th Kyu.",
    kihon: "Uchi-Uke (Inside block), Shuto-Uke (Knife-hand block), Yoko-Geri Keage (Side snap kick)",
    kata: "Heian Sandan (Peaceful Mind - Level 3)",
    kumite: "Kihon Ippon Kumite (1-step basic sparring)",
    gold: false
  },
  {
    name: "Blue Belt",
    kyu: "5th",
    color: "#3b82f6",
    description: "Advanced kata precision, roundhouse kicks, and defense drills.",
    requirements: "Minimum 4 months as a 6th Kyu.",
    kihon: "Yoko-Geri Kekomi (Side thrust kick), Nukite (Spear hand strike)",
    kata: "Heian Yondan (Peaceful Mind - Level 4)",
    kumite: "Kihon Ippon Kumite (Semi-free combinations)",
    gold: false
  },
  {
    name: "Purple Belt",
    kyu: "4th",
    color: "#a855f7",
    description: "Specialized defense combinations, advanced body conditioning, and counter-attacks.",
    requirements: "Minimum 5 months as a 5th Kyu.",
    kihon: "Mawashi-Geri (Roundhouse kick), Ushiro-Geri (Back kick)",
    kata: "Heian Godan (Peaceful Mind - Level 5)",
    kumite: "Jiyu Ippon Kumite (1-step semi-free sparring)",
    gold: false
  },
  {
    name: "Brown Belt",
    kyu: "3rd - 1st",
    color: "#78350f",
    description: "Assistant instructor training, deep tournament tactics, and mastery of all Heian Katas.",
    requirements: "Minimum 6 months training per rank level.",
    kihon: "Multi-angle kick combinations, advanced stance shifts, speed drills",
    kata: "Tekki Shodan, Bassai Dai (To Penetrate a Fortress)",
    kumite: "Jiyu Ippon Kumite & Jiyu Kumite (Free sparring basics)",
    gold: false
  },
  {
    name: "Black Belt (Shodan)",
    kyu: "1st Dan",
    color: "#111111",
    description: "Mastery of Shotokan fundamentals, advanced Katas, and professional kumite.",
    requirements: "Minimum 12 months as a 1st Kyu Brown Belt, age 16+.",
    kihon: "All fundamental and advanced techniques at maximum power and speed",
    kata: "Bassai Dai, Kanku Dai (To View the Sky), plus one choice kata",
    kumite: "Jiyu Kumite (Advanced tournament free sparring)",
    gold: true
  }
]

export default function BeltSystem() {
  const [belts, setBelts] = useState(defaultBelts)

  useEffect(() => {
    getSiteContent('belts', defaultBelts)
      .then(data => {
        if (data && data.length > 0) {
          setBelts(data)
        }
      })
      .catch(err => {
        console.warn('⚠️ Error loading belts content from DB:', err.message)
      })
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-zoom')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.05, rootMargin: '0px 0px -40px 0px' }
    )

    const cards = document.querySelectorAll('.belt-card')
    cards.forEach((card) => observer.observe(card))

    return () => {
      cards.forEach((card) => observer.unobserve(card))
    }
  }, [belts])

  const handleMouseMove = (e) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    card.style.setProperty('--mouse-x', `${x}px`)
    card.style.setProperty('--mouse-y', `${y}px`)
  }

  return (
    <div className="page-container belt-system-page" style={{ paddingTop: '3rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <p className="eyebrow">Rank System</p>
        <h1 className="page-title">Belt <span className="text-gold">Hierarchy</span></h1>
        <p className="section-sub" style={{ maxWidth: 620, margin: '0 auto' }}>
          The Shotokan belt system represents your journey of mastery — from the purity of White to the excellence of Black.
        </p>
      </div>

      <div className="belts-list">
          {belts.map((belt, i) => (
            <div key={i} className={`belt-card card ${belt.gold ? 'glass-glow' : ''}`}
              onMouseMove={handleMouseMove}
              style={{ borderLeft: `4px solid ${belt.color || 'var(--gold)'}` }}>
              
              {/* spotlight glow */}
              <div className="card-glow-overlay" />

              {/* Main Belt Row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', position: 'relative', zIndex: 2 }}>
                <div className="belt-visual-strip" style={{ background: belt.color, '--belt-glow': belt.color }} />
                
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: belt.gold ? 'var(--gold)' : '#fff' }}>
                    {belt.name} <span style={{ fontSize: '0.85rem', color: 'var(--text-3)', fontWeight: 500, marginLeft: '0.5rem' }}>({belt.kyu.includes('Dan') ? belt.kyu : `${belt.kyu} Kyu`})</span>
                  </h3>
                  <p style={{ color: 'var(--text-2)', fontSize: '0.9rem', margin: '0.35rem 0 0 0', lineHeight: 1.5 }}>
                    {belt.description || belt.desc}
                  </p>
                  <p style={{ color: 'var(--text-3)', fontSize: '0.8rem', fontStyle: 'italic', margin: '0.25rem 0 0 0' }}>
                    <strong>Requirements:</strong> {belt.requirements || belt.req}
                  </p>
                </div>
                {belt.gold && <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>⭐</span>}
              </div>

              {/* Syllabus details */}
              {(belt.kihon || belt.kata || belt.kumite) && (
                <div className="syllabus-grid">
                  {belt.kihon && (
                    <div className="syllabus-panel">
                      <h4 style={{ fontSize: '0.85rem', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.4rem' }}>Kihon (Basics)</h4>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-2)', margin: 0, lineHeight: 1.4 }}>{belt.kihon}</p>
                    </div>
                  )}
                  {belt.kata && (
                    <div className="syllabus-panel">
                      <h4 style={{ fontSize: '0.85rem', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.4rem' }}>Kata (Forms)</h4>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-2)', margin: 0, lineHeight: 1.4 }}>{belt.kata}</p>
                    </div>
                  )}
                  {belt.kumite && (
                    <div className="syllabus-panel">
                      <h4 style={{ fontSize: '0.85rem', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.4rem' }}>Kumite (Sparring)</h4>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-2)', margin: 0, lineHeight: 1.4 }}>{belt.kumite}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
    </div>
  )
}
