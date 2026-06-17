import { useState, useEffect, useRef } from 'react'
import { getSiteContent, updateSiteContent } from '../services/dbService'

// ── Belt data ordered to match the video's belt color progression ──
const defaultBelts = [
  {
    name: "White Belt", kyu: "9th", color: "#ffffff",
    description: "The journey begins with humility. Master foundational stances, straight punches, and rising blocks.",
    requirements: "Beginner level. Learn Dojo etiquette, bowing protocols, and basic vocabulary.",
    kihon: "Choku-Zuki (Straight punch), Age-Uke (Rising block), Zenkutsu-Dachi (Front stance)",
    kata: "Taikyoku Shodan (Basics Form)",
    kumite: "Gohon Kumite (5-step basic sparring)",
    gold: false
  },
  {
    name: "Yellow Belt", kyu: "8th", color: "#eab308",
    description: "A flash of light — the first spark of real skill. Front kicks, counter blocks, and movement patterns.",
    requirements: "Minimum 3 months of regular training.",
    kihon: "Gyaku-Zuki (Reverse punch), Gedan-Barai (Downward block), Kokutsu-Dachi (Back stance)",
    kata: "Heian Shodan (Peaceful Mind - Level 1)",
    kumite: "Gohon Kumite (Focus on distance & timing)",
    gold: false
  },
  {
    name: "Orange Belt", kyu: "7th", color: "#f97316",
    description: "Energy ignites like a flame. Side kicks, combination transitions, and basic sparring kata.",
    requirements: "Minimum 3 months as 8th Kyu.",
    kihon: "Soto-Uke (Outside block), Mae-Geri (Front kick), combination transitions",
    kata: "Heian Nidan (Peaceful Mind - Level 2)",
    kumite: "Sanbon Kumite (3-step semi-free sparring)",
    gold: false
  },
  {
    name: "Green Belt", kyu: "6th", color: "#22c55e",
    description: "Growth surges like water breaking through stone. Sweeps, inside blocks, and kumite strategy.",
    requirements: "Minimum 4 months as 7th Kyu.",
    kihon: "Uchi-Uke (Inside block), Shuto-Uke (Knife-hand block), Yoko-Geri Keage (Side snap kick)",
    kata: "Heian Sandan (Peaceful Mind - Level 3)",
    kumite: "Kihon Ippon Kumite (1-step basic sparring)",
    gold: false
  },
  {
    name: "Blue Belt", kyu: "5th", color: "#3b82f6",
    description: "Advanced kata precision, roundhouse kicks, and defense drills.",
    requirements: "Minimum 4 months as a 6th Kyu.",
    kihon: "Yoko-Geri Kekomi (Side thrust kick), Nukite (Spear hand strike)",
    kata: "Heian Yondan (Peaceful Mind - Level 4)",
    kumite: "Kihon Ippon Kumite (Semi-free combinations)",
    gold: false
  },
  {
    name: "Purple Belt", kyu: "4th", color: "#a855f7",
    description: "Specialized defense combinations, advanced body conditioning, and counter-attacks.",
    requirements: "Minimum 5 months as a 5th Kyu.",
    kihon: "Mawashi-Geri (Roundhouse kick), Ushiro-Geri (Back kick)",
    kata: "Heian Godan (Peaceful Mind - Level 5)",
    kumite: "Jiyu Ippon Kumite (1-step semi-free sparring)",
    gold: false
  },
  {
    name: "Brown Belt", kyu: "3rd–1st", color: "#78350f",
    description: "Assistant instructor training, deep tournament tactics, and mastery of all Heian Katas.",
    requirements: "Minimum 6 months training per rank level.",
    kihon: "Multi-angle kick combinations, advanced stance shifts, speed drills",
    kata: "Tekki Shodan, Bassai Dai (To Penetrate a Fortress)",
    kumite: "Jiyu Ippon Kumite & Jiyu Kumite (Free sparring basics)",
    gold: false
  },
  {
    name: "Black Belt (Shodan)", kyu: "1st Dan", color: "#111111",
    description: "Mastery of Shotokan fundamentals, advanced Katas, and professional kumite.",
    requirements: "Minimum 12 months as a 1st Kyu Brown Belt, age 16+.",
    kihon: "All fundamental and advanced techniques at maximum power and speed",
    kata: "Bassai Dai, Kanku Dai (To View the Sky), plus one choice kata",
    kumite: "Jiyu Kumite (Advanced tournament free sparring)",
    gold: true
  }
]

// ── Frame index ranges per belt (0-based: 0=frame_0001, 299=frame_0300) ──
const BELT_FRAME_RANGES = [
  { start: 0,   end: 35  }, // 0: White
  { start: 36,  end: 83  }, // 1: Yellow
  { start: 84,  end: 111 }, // 2: Orange
  { start: 112, end: 148 }, // 3: Green
  { start: 149, end: 181 }, // 4: Blue
  { start: 182, end: 219 }, // 5: Purple
  { start: 220, end: 252 }, // 6: Brown
  { start: 253, end: 299 }, // 7: Black
]

const FRAME_COUNT = 300
const PLAYBACK_FPS = 15 // frames per second → 300 / 15 = 20s full cycle

const getFramePath = (i) => `/karate_frames/frame_${String(i).padStart(4, '0')}.png`

function getBeltForFrame(frameIdx) {
  for (let i = 0; i < BELT_FRAME_RANGES.length; i++) {
    const { start, end } = BELT_FRAME_RANGES[i]
    if (frameIdx >= start && frameIdx <= end) return i
  }
  return 0
}

export default function BeltSystem() {
  const [belts, setBelts] = useState(defaultBelts)
  const [activeIdx, setActiveIdx] = useState(0)
  const [loadingFrames, setLoadingFrames] = useState(true)
  const [preloadProgress, setPreloadProgress] = useState(0)

  const canvasRef = useRef(null)
  const ctxRef = useRef(null)
  const currentFrameIdx = useRef(0)
  const currentBeltIdx = useRef(0)
  const drawFrameRef = useRef(null)
  const imagesRef = useRef([])

  // ── Fetch belt content from DB (fallback to defaults) ──
  useEffect(() => {
    getSiteContent('belts', defaultBelts)
      .then(data => {
        const hasRed = data && data.some(b => b.name === "Red Belt");
        if (data && data.length === defaultBelts.length && !hasRed) {
          setBelts(data)
        } else {
          console.warn('⚠️ Outdated/Mismatched belt list loaded from database. Resetting to 8-belt default.');
          setBelts(defaultBelts)
          updateSiteContent('belts', defaultBelts).catch(e => {})
        }
      })
      .catch(err => {
        console.warn('⚠️ Belt content load error:', err.message)
        setBelts(defaultBelts)
      })
  }, [])

  // ── Preload all 300 frames ──
  useEffect(() => {
    let loaded = 0
    let isCancelled = false
    const imagesList = []

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = img.onerror = () => {
        if (isCancelled) return
        loaded++
        if (loaded % 15 === 0 || loaded === FRAME_COUNT) {
          setPreloadProgress(Math.round((loaded / FRAME_COUNT) * 100))
        }
        // Dismiss loader early once 15+ frames are ready
        if (loaded >= 15) {
          setLoadingFrames(false)
          if (currentFrameIdx.current === 0) drawFrameRef.current?.(0)
        }
      }
      img.src = getFramePath(i)
      imagesList.push(img)
    }
    imagesRef.current = imagesList

    // Safety fallback: dismiss loader after 2s regardless
    const safetyTimeout = setTimeout(() => {
      if (!isCancelled) setLoadingFrames(false)
    }, 2000)

    return () => { isCancelled = true; clearTimeout(safetyTimeout) }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Canvas setup + resize ──
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    ctxRef.current = ctx

    function resizeCanvas() {
      const panel = canvas.parentElement
      if (!panel) return
      const panelW = panel.clientWidth
      const panelH = panel.clientHeight
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      const aspect = 16 / 9

      // Scale to CONTAIN the panel cleanly to avoid excessive zooming
      let drawW = panelW
      let drawH = panelW / aspect
      if (drawH > panelH) {
        drawH = panelH
        drawW = panelH * aspect
      }

      canvas.width = Math.round(drawW * dpr)
      canvas.height = Math.round(drawH * dpr)
      canvas.style.width = drawW + 'px'
      canvas.style.height = drawH + 'px'
      canvas.style.position = 'absolute'
      canvas.style.left = '50%'
      canvas.style.top = '50%'
      canvas.style.transform = 'translate(-50%, -50%)'
      ctx.scale(dpr, dpr)
      drawFrameRef.current?.(currentFrameIdx.current)
    }

    // ── Draw a single frame onto the canvas ──
    drawFrameRef.current = (frameIdx) => {
      const c = canvasRef.current
      const ctx = ctxRef.current
      if (!c || !ctx) return
      const img = imagesRef.current[frameIdx]
      if (!img?.complete || !img?.naturalWidth) return
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      const W = c.width / dpr
      const H = c.height / dpr
      ctx.clearRect(0, 0, W, H)
      ctx.drawImage(img, 0, 0, W, H)

      // Key out the pure black background in light mode to make the canvas transparent
      const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark'
      if (!isDarkMode) {
        try {
          const imgData = ctx.getImageData(0, 0, c.width, c.height)
          const data = imgData.data
          const beltIdx = getBeltForFrame(frameIdx)
          const threshold = beltIdx === 7 ? 15 : 45
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i]
            const g = data[i+1]
            const b = data[i+2]
            // Key out anything under the dynamic threshold
            if (r < threshold && g < threshold && b < threshold) {
              data[i+3] = 0
            }
          }
          ctx.putImageData(imgData, 0, 0)
        } catch (e) {
          console.warn('Canvas background removal failed:', e)
        }
      }
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    return () => window.removeEventListener('resize', resizeCanvas)
  }, [])

  // ── Timer-based auto-playback (fires once frames start loading) ──
  useEffect(() => {
    if (loadingFrames) return

    let rafId
    let lastTime = performance.now()
    const interval = 1000 / PLAYBACK_FPS

    const tick = (time) => {
      if (time - lastTime >= interval) {
        lastTime = time
        // Advance frame
        const nextFrame = (currentFrameIdx.current + 1) % FRAME_COUNT
        currentFrameIdx.current = nextFrame
        drawFrameRef.current?.(nextFrame)

        // Check if belt changed
        const newBelt = getBeltForFrame(nextFrame)
        if (newBelt !== currentBeltIdx.current) {
          currentBeltIdx.current = newBelt
          setActiveIdx(newBelt)
        }
      }
      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [loadingFrames])

  // ── Spotlight glow effect on card hover ──
  const handleMouseMove = (e) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
    card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
  }

  const activeBelt = belts[activeIdx] || defaultBelts[0]
  const activeAccent = activeBelt.gold ? '#D4A017'
    : activeBelt.color === '#ffffff' || activeBelt.color === '#e0e0e0' ? '#e2e8f0'
    : activeBelt.color

  return (
    <div className="bsp-layout">
      <div className="bsp-container">
        {/* Floating Active Content Card Overlay (Now stacked above) */}
        {!loadingFrames && (
          <div className="bsp-content-overlay">
            <div 
              key={activeIdx}
              className={`bsp-overlay-card bsp-card-animate${activeBelt.gold ? ' bsp-gold-card' : ''}`}
              onMouseMove={handleMouseMove}
              style={{ 
                '--belt-accent-color': activeAccent, 
                '--belt-accent-glow': `${activeAccent}20` 
              }}
            >
              {/* Spotlight hover effect */}
              <div className="card-glow-overlay" />

              {/* Title row */}
              <div className="bsp-card-title-row" style={{ position: 'relative', zIndex: 2 }}>
                <div
                  className="bsp-belt-dot"
                  style={{
                    background: activeAccent,
                    boxShadow: `0 0 14px ${activeAccent}aa`
                  }}
                />
                <div style={{ flex: 1 }}>
                  <p className="eyebrow" style={{ color: '#D4A017', fontWeight: 700, margin: '0 0 0.2rem', fontSize: '0.75rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
                    Shotokan Rank System
                  </p>
                  <h3 className="bsp-belt-name" style={{ color: activeBelt.gold ? '#D4A017' : 'var(--text-1)', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                    {activeBelt.name}
                    <span className="bsp-kyu" style={{ fontSize: '0.8rem', color: 'var(--text-2)' }}>
                      ({activeBelt.kyu.includes('Dan') ? activeBelt.kyu : `${activeBelt.kyu} Kyu`})
                    </span>
                  </h3>
                  <p className="bsp-belt-desc" style={{ fontSize: '0.85rem', margin: '0.5rem 0' }}>{activeBelt.description || activeBelt.desc}</p>
                  <p className="bsp-belt-req" style={{ fontSize: '0.8rem' }}>
                    <strong>Requirements: </strong>{activeBelt.requirements || activeBelt.req}
                  </p>
                </div>
                {activeBelt.gold && <span className="bsp-star">⭐</span>}
              </div>

              {/* Syllabus grid */}
              {(activeBelt.kihon || activeBelt.kata || activeBelt.kumite) && (
                 <div className="bsp-syllabus-grid" style={{ position: 'relative', zIndex: 2 }}>
                   {activeBelt.kihon && (
                     <div className="bsp-syllabus-item">
                       <h4 className="bsp-syllabus-label">Kihon</h4>
                       <p className="bsp-syllabus-text">{activeBelt.kihon}</p>
                     </div>
                   )}
                   {activeBelt.kata && (
                     <div className="bsp-syllabus-item">
                       <h4 className="bsp-syllabus-label">Kata</h4>
                       <p className="bsp-syllabus-text">{activeBelt.kata}</p>
                     </div>
                   )}
                   {activeBelt.kumite && (
                     <div className="bsp-syllabus-item">
                       <h4 className="bsp-syllabus-label">Kumite</h4>
                       <p className="bsp-syllabus-text">{activeBelt.kumite}</p>
                     </div>
                   )}
                 </div>
               )}
            </div>
          </div>
        )}

        {/* Shrunk Canvas Panel (Centered below) */}
        <div className="bsp-canvas-panel">
          {loadingFrames && (
            <div className="belt-canvas-loader">
              <h3>🥋 Entering Dojo...</h3>
              <div className="belt-loader-bar">
                <div className="belt-loader-bar-fill" style={{ width: `${preloadProgress}%` }} />
              </div>
              <p>Loading — {preloadProgress}%</p>
            </div>
          )}
          <canvas ref={canvasRef} id="beltScrollCanvas" />
        </div>

        {/* Active belt badge bottom-centered (direct child of container) */}
        {!loadingFrames && (
          <div className="bsp-active-badge" style={{ '--badge-color': activeAccent }}>
            <span className="bsp-badge-dot" style={{ background: activeAccent }} />
            <span className="bsp-badge-name">{activeBelt.name}</span>
          </div>
        )}
      </div>
    </div>
  )
}
