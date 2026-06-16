import { useEffect, useRef, useState, useMemo } from 'react'

// Module-level cache to persist preloaded images and load state across page navigations
const cache = {
  images: [],
  loadedCount: 0,
  isFullyLoaded: false,
  isPreloadStarted: false,
  listeners: new Set(),
}

const defaultPathTemplate = (i) => `/all_video_frames/frame_${String(i).padStart(5, '0')}.jpg`

/**
 * useScrollCanvas
 * Loads animation frames and drives them with window scroll.
 * Returns: { canvasRef, loading, progress }
 */
export function useScrollCanvas(options = {}) {
  // Support both passing a number (legacy) or a config object
  const isLegacy = typeof options === 'number'
  const frameCount = isLegacy ? options : (options.frameCount ?? 300)
  const pathTemplate = isLegacy ? null : options.pathTemplate
  const startIndex = isLegacy ? 0 : (options.startIndex ?? 0)
  const cropBottom = isLegacy ? 60 : (options.cropBottom ?? 60)
  const alignX = isLegacy ? 'right' : (options.alignX ?? 'right')

  // Stable path resolver to prevent effect teardowns on every render
  const getPath = useMemo(() => {
    return pathTemplate || defaultPathTemplate
  }, [pathTemplate])

  const canvasRef  = useRef(null)
  const currentIdx = useRef(0)
  const ctxRef     = useRef(null)

  // Initialize loading state directly from global cache
  const [loading,  setLoading]  = useState(!cache.isFullyLoaded)
  const [progress, setProgress] = useState(
    cache.isFullyLoaded ? 100 : Math.round((cache.loadedCount / frameCount) * 100)
  )

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
        drawH = vh
        drawW = Math.round(vh * aspect)

        if (alignX === 'right') {
          canvas.style.left      = 'auto'
          canvas.style.right     = '0px'
          canvas.style.transform = 'translate(0%, -50%)'
        } else if (alignX === 'left') {
          canvas.style.left      = '0px'
          canvas.style.right     = 'auto'
          canvas.style.transform = 'translate(0%, -50%)'
        } else {
          canvas.style.left      = '50%'
          canvas.style.right     = 'auto'
          canvas.style.transform = 'translate(-50%, -50%)'
        }
      } else {
        if (vw / vh > aspect) {
          drawW = vw
          drawH = Math.round(vw / aspect)
        } else {
          drawH = vh
          drawW = Math.round(vh * aspect)
        }

        canvas.style.left      = '50%'
        canvas.style.right     = 'auto'
        canvas.style.transform = 'translate(-50%, -50%)'
      }

      const dpr = Math.min(2, window.devicePixelRatio || 1)
      canvas.width  = drawW * dpr
      canvas.height = drawH * dpr
      canvas.style.position  = 'absolute'
      canvas.style.top       = '50%'
      canvas.style.width     = drawW + 'px'
      canvas.style.height    = drawH + 'px'
    }

    /* ── Draw one frame (crops bottom of source, fallback to nearest loaded frame) ── */
    function drawFrame(idx) {
      let img = null
      const imagesList = cache.images
      
      if (imagesList[idx] && imagesList[idx].complete && imagesList[idx].naturalWidth) {
        img = imagesList[idx]
      } else {
        let dist = 1
        while (dist < frameCount) {
          const prev = idx - dist
          const next = idx + dist
          if (prev >= 0 && imagesList[prev] && imagesList[prev].complete && imagesList[prev].naturalWidth) {
            img = imagesList[prev]
            break
          }
          if (next < frameCount && imagesList[next] && imagesList[next].complete && imagesList[next].naturalWidth) {
            img = imagesList[next]
            break
          }
          dist++
        }
      }

      if (img) {
        const srcH = img.naturalHeight - cropBottom
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0, img.naturalWidth, srcH, 0, 0, canvas.width, canvas.height)
      }
    }

    /* ── Scroll progress ── */
    function getProgress() {
      const st  = window.scrollY || 0
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      return st / max
    }

    let ticking = false
    function updateFrame() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const p   = getProgress()
          const idx = Math.min(frameCount - 1, Math.ceil(p * frameCount))
          if (idx !== currentIdx.current) {
            currentIdx.current = idx
            drawFrame(idx)
          }
          ticking = false
        })
        ticking = true
      }
    }

    resizeCanvas()

    let isDismissed = cache.isFullyLoaded
    const minRequired = Math.min(10, frameCount)

    const dismissLoader = () => {
      if (!isDismissed) {
        isDismissed = true
        setLoading(false)
        drawFrame(currentIdx.current)
      }
    }

    // Progress listener callback
    const handleProgressUpdate = (loaded, isFull) => {
      setProgress(Math.round((loaded / frameCount) * 100))
      drawFrame(currentIdx.current)
      if (loaded >= minRequired || isFull) {
        dismissLoader()
      }
    }

    cache.listeners.add(handleProgressUpdate)

    // Initial draw if cache already has some images
    if (cache.images.length > 0) {
      drawFrame(currentIdx.current)
    }

    // If we already satisfied the minRequired on mount, dismiss immediately
    if (cache.loadedCount >= minRequired || cache.isFullyLoaded) {
      dismissLoader()
    }

    let safetyTimeout = null

    if (!cache.isFullyLoaded) {
      safetyTimeout = setTimeout(() => {
        dismissLoader()
      }, 1500)

      if (!cache.isPreloadStarted) {
        cache.isPreloadStarted = true
        cache.images = []
        cache.loadedCount = 0

        for (let i = 0; i < frameCount; i++) {
          const img = new Image()
          cache.images.push(img)

          img.onload = img.onerror = () => {
            cache.loadedCount++
            const isFull = cache.loadedCount === frameCount
            if (isFull) {
              cache.isFullyLoaded = true
            }

            // Notify active listeners
            cache.listeners.forEach((listener) => {
              listener(cache.loadedCount, isFull)
            })
          }

          img.src = getPath(startIndex + i)
        }
      }
    }

    window.addEventListener('scroll', updateFrame, { passive: true })
    window.addEventListener('resize', () => { resizeCanvas(); drawFrame(currentIdx.current) })

    return () => {
      window.removeEventListener('scroll', updateFrame)
      cache.listeners.delete(handleProgressUpdate)
      if (safetyTimeout) {
        clearTimeout(safetyTimeout)
      }
    }
  }, [frameCount, startIndex, cropBottom, getPath, alignX])

  return { canvasRef, loading, progress }
}
