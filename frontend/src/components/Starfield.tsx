'use client'

import { useEffect, useMemo, useRef } from 'react'

type Star = {
  x: number
  y: number
  r: number
  a: number
  tw: number
  sp: number
  hue: number
}

type ShootingStar = {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  w: number
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

export default function Starfield({
  density = 0.00022,
  maxStars = 1100,
  className,
}: {
  density?: number
  maxStars?: number
  className?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const starsRef = useRef<Star[]>([])
  const shootingRef = useRef<ShootingStar[]>([])
  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  const nebulaRef = useRef<HTMLCanvasElement | null>(null)

  const reduceMotion = useMemo(() => {
    if (typeof window === 'undefined') return true
    return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let dpr = 1
    let w = 0
    let h = 0
    let running = true
    let t0 = performance.now()

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      w = Math.max(1, Math.floor(rect.width))
      h = Math.max(1, Math.floor(rect.height))
      dpr = 1
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const target = clamp(Math.floor(w * h * density), 120, maxStars)
      const next: Star[] = []
      for (let i = 0; i < target; i++) {
        // Slight color temperature variation: cool whites + a few warmer stars.
        const roll = Math.random()
        const hue = roll < 0.08 ? 35 : roll < 0.18 ? 205 : 0
        next.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 0.55 + Math.random() * 1.25,
          a: 0.22 + Math.random() * 0.45,
          tw: 0.6 + Math.random() * 1.6,
          sp: 0.08 + Math.random() * 0.18,
          hue,
        })
      }
      starsRef.current = next
      shootingRef.current = []

      // Pre-render a lightweight nebula + grain texture into an offscreen canvas.
      const neb = document.createElement('canvas')
      neb.width = Math.max(1, Math.floor(w * 0.6))
      neb.height = Math.max(1, Math.floor(h * 0.6))
      const nctx = neb.getContext('2d', { alpha: true })
      if (nctx) {
        nctx.clearRect(0, 0, neb.width, neb.height)

        // Soft “milky way” band (diagonal haze).
        nctx.save()
        nctx.translate(neb.width * 0.1, neb.height * 0.15)
        nctx.rotate(-0.32)
        const band = nctx.createLinearGradient(0, 0, neb.width, 0)
        band.addColorStop(0, 'rgba(255,255,255,0)')
        band.addColorStop(0.45, 'rgba(170,210,255,0.10)')
        band.addColorStop(0.55, 'rgba(210,180,255,0.10)')
        band.addColorStop(1, 'rgba(255,255,255,0)')
        nctx.fillStyle = band
        nctx.fillRect(0, -neb.height * 0.15, neb.width * 1.2, neb.height * 0.55)
        nctx.restore()

        // A few colored nebula blooms.
        const blooms = [
          { x: 0.25, y: 0.35, c: 'rgba(34,211,238,0.10)' },
          { x: 0.72, y: 0.28, c: 'rgba(168,85,247,0.10)' },
          { x: 0.58, y: 0.72, c: 'rgba(59,130,246,0.08)' },
        ]
        for (const b of blooms) {
          const gx = neb.width * b.x
          const gy = neb.height * b.y
          const r = Math.max(120, Math.floor(Math.min(neb.width, neb.height) * 0.42))
          const g = nctx.createRadialGradient(gx, gy, 0, gx, gy, r)
          g.addColorStop(0, b.c)
          g.addColorStop(1, 'rgba(0,0,0,0)')
          nctx.fillStyle = g
          nctx.fillRect(0, 0, neb.width, neb.height)
        }

        // Fine grain (very subtle).
        const img = nctx.getImageData(0, 0, neb.width, neb.height)
        const d = img.data
        for (let i = 0; i < d.length; i += 4) {
          const n = (Math.random() - 0.5) * 18
          d[i] = clamp(d[i] + n, 0, 255)
          d[i + 1] = clamp(d[i + 1] + n, 0, 255)
          d[i + 2] = clamp(d[i + 2] + n, 0, 255)
          // Keep alpha tiny so it never looks “dirty”.
          d[i + 3] = clamp(d[i + 3] + 8, 0, 255)
        }
        nctx.putImageData(img, 0, 0)
      }
      nebulaRef.current = neb
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: clamp(e.clientX / Math.max(1, window.innerWidth), 0, 1),
        y: clamp(e.clientY / Math.max(1, window.innerHeight), 0, 1),
      }
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    const onVisibility = () => {
      running = document.visibilityState === 'visible'
      if (running && rafRef.current == null) {
        last = performance.now()
        rafRef.current = requestAnimationFrame(draw)
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    let last = performance.now()

    const spawnShootingStar = () => {
      // Rare, short-lived streaks — like RR “shooting star”, but subtle.
      if (reduceMotion) return
      if (w < 300 || h < 300) return
      if (Math.random() > 0.006) return

      const fromLeft = Math.random() > 0.5
      const startX = fromLeft ? -40 : w + 40
      const startY = Math.random() * (h * 0.45)
      const dir = fromLeft ? 1 : -1

      shootingRef.current.push({
        x: startX,
        y: startY,
        vx: dir * (9 + Math.random() * 5),
        vy: 3.5 + Math.random() * 2.2,
        life: 0,
        maxLife: 38 + Math.random() * 26,
        w: 1.0 + Math.random() * 1.2,
      })
    }

    const draw = (now: number) => {
      const dt = Math.min(32, now - last)
      last = now

      ctx.clearRect(0, 0, w, h)

      // Slight parallax shift based on mouse position.
      const mx = mouseRef.current.x - 0.5
      const my = mouseRef.current.y - 0.5
      const px = reduceMotion ? 0 : mx * 10
      const py = reduceMotion ? 0 : my * 8

      // Space haze (pre-rendered) — extremely cheap to draw.
      const neb = nebulaRef.current
      if (neb) {
        const drift = reduceMotion ? 0 : ((now - t0) / 1000) * 4
        ctx.save()
        ctx.globalCompositeOperation = 'screen'
        ctx.globalAlpha = 0.9
        ctx.translate(px * 0.25, py * 0.25)
        // Tiled draw with slight drift for life.
        const sw = neb.width
        const sh = neb.height
        const ox = ((-drift * 0.6) % sw) - sw
        const oy = ((drift * 0.35) % sh) - sh
        for (let x = ox; x < w + sw; x += sw) {
          for (let y = oy; y < h + sh; y += sh) {
            ctx.drawImage(neb, x, y)
          }
        }
        ctx.restore()
      }

      // Stars
      ctx.save()
      ctx.translate(px, py)
      for (const s of starsRef.current) {
        const phase = (now / 1000) * s.tw
        const a = s.a + Math.sin(phase) * 0.12
        const alpha = clamp(a, 0.06, 0.95)

        // Slow drift downward to keep it “alive”.
        if (!reduceMotion) {
          s.y += s.sp * (dt / 16)
          if (s.y > h + 8) s.y = -8
        }

        ctx.beginPath()
        if (s.hue === 0) {
          ctx.fillStyle = `rgba(255,255,255,${alpha})`
        } else {
          ctx.fillStyle = `hsla(${s.hue}, 80%, 85%, ${alpha})`
        }
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.restore()

      // Shooting stars
      spawnShootingStar()
      if (shootingRef.current.length) {
        ctx.save()
        ctx.translate(px * 0.6, py * 0.6)
        const next: ShootingStar[] = []
        for (const st of shootingRef.current) {
          st.life += 1
          st.x += st.vx
          st.y += st.vy

          const t = st.life / st.maxLife
          const fade = 1 - t
          const len = 90

          ctx.strokeStyle = `rgba(255,255,255,${0.28 * fade})`
          ctx.lineWidth = st.w
          ctx.lineCap = 'round'
          ctx.beginPath()
          ctx.moveTo(st.x, st.y)
          ctx.lineTo(st.x - st.vx * (len / 14), st.y - st.vy * (len / 14))
          ctx.stroke()

          if (st.life < st.maxLife && st.x > -200 && st.x < w + 200 && st.y < h + 200) {
            next.push(st)
          }
        }
        shootingRef.current = next
        ctx.restore()
      }

      if (!running) {
        rafRef.current = null
        return
      }
      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('visibilitychange', onVisibility)
      ro.disconnect()
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [density, maxStars, reduceMotion])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
      }}
    />
  )
}

