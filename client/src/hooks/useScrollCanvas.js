import { useEffect, useRef, useState } from 'react'

/**
 * useScrollCanvas
 * Loads 240 animation frames and drives them with window scroll.
 * Returns: { canvasRef, loading, progress }
 */
export function useScrollCanvas(frameCount = 300) {
  const canvasRef  = useRef(null)
  const images     = useRef([])
  const currentIdx = useRef(0)
  const ctxRef     = useRef(null)
  const [loading,  setLoading]  = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctxRef.current = ctx

    /* ── Resize canvas ── */
    function resizeCanvas() {
      const vw = window.innerWidth
      const vh = window.innerHeight
      const isPortrait = vh > vw
      const aspect = 16 / 9

      let drawW, drawH

      if (isPortrait) {
        // Portrait (mobile): scale to cover the viewport height so the characters
        // are always fully visible top-to-bottom. The canvas will be wider than
        // the viewport and gets clipped horizontally by the overflow:hidden container.
        drawH = vh
        drawW = Math.round(vh * aspect)
      } else {
        // Landscape (desktop/tablet): cover the full viewport
        if (vw / vh > aspect) {
          drawW = vw
          drawH = Math.round(vw / aspect)
        } else {
          drawH = vh
          drawW = Math.round(vh * aspect)
        }
      }

      canvas.width  = drawW
      canvas.height = drawH
      canvas.style.position  = 'absolute'
      canvas.style.left      = '50%'
      canvas.style.top       = '50%'
      canvas.style.width     = drawW + 'px'
      canvas.style.height    = drawH + 'px'
      canvas.style.transform = 'translate(-50%, -50%)'
    }

    /* ── Draw one frame (crops bottom 60px of source) ── */
    function drawFrame(idx) {
      const img = images.current[idx]
      if (img && img.complete && img.naturalWidth) {
        const srcH = img.naturalHeight - 60
        ctx.drawImage(img, 0, 0, img.naturalWidth, srcH, 0, 0, canvas.width, canvas.height)
      }
    }

    /* ── Scroll progress ── */
    function getProgress() {
      const st  = window.scrollY || 0
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      return st / max
    }

    function updateFrame() {
      const p   = getProgress()
      const idx = Math.min(frameCount - 1, Math.ceil(p * frameCount))
      if (idx !== currentIdx.current) {
        currentIdx.current = idx
        drawFrame(idx)
      }
    }

    /* ── Load all frames ── */
    let loaded = 0
    resizeCanvas()

    // Disable scroll animation on mobile by only loading the first frame
    const isMobile = window.innerWidth <= 768
    const framesToLoad = isMobile ? 1 : frameCount

    for (let i = 0; i < framesToLoad; i++) {
      const img = new Image()
      img.src = `/all_video_frames/frame_${String(i).padStart(5, '0')}.jpg`
      images.current.push(img)

      img.onload = img.onerror = () => {
        loaded++
        setProgress(Math.round((loaded / framesToLoad) * 100))
        if (loaded === framesToLoad) {
          setLoading(false)
          drawFrame(0)
        }
      }
    }

    window.addEventListener('scroll', updateFrame, { passive: true })
    window.addEventListener('resize', () => { resizeCanvas(); drawFrame(currentIdx.current) })

    return () => {
      window.removeEventListener('scroll', updateFrame)
    }
  }, [frameCount])

  return { canvasRef, loading, progress }
}
