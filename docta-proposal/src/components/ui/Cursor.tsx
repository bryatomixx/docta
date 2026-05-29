import { useEffect, useRef, useState } from 'react'

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement | null>(null)
  const ringRef = useRef<HTMLDivElement | null>(null)
  const [hovering, setHovering] = useState(false)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(hover: none)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    setEnabled(true)

    let mouseX = 0
    let mouseY = 0
    let dotX = 0
    let dotY = 0
    let ringX = 0
    let ringY = 0
    let rafId = 0

    const handleMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const loop = () => {
      dotX += (mouseX - dotX) * 0.55
      dotY += (mouseY - dotY) * 0.55
      ringX += (mouseX - ringX) * 0.16
      ringY += (mouseY - ringY) * 0.16

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotX - 3}px, ${dotY - 3}px, 0)`
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX - 18}px, ${ringY - 18}px, 0)`
      }
      rafId = requestAnimationFrame(loop)
    }

    const checkHover = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null
      if (!t) return
      const interactive = t.closest('a, button, [data-cursor="hover"]')
      setHovering(Boolean(interactive))
    }

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseover', checkHover)
    rafId = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseover', checkHover)
      cancelAnimationFrame(rafId)
    }
  }, [])

  if (!enabled) return null

  return (
    <>
      <div
        ref={dotRef}
        className="cursor-dot pointer-events-none fixed left-0 top-0 z-[60] h-1.5 w-1.5 rounded-full bg-gold-bright mix-blend-difference"
        style={{ willChange: 'transform' }}
      />
      <div
        ref={ringRef}
        className={`cursor-ring pointer-events-none fixed left-0 top-0 z-[60] h-9 w-9 rounded-full border border-gold/60 transition-all duration-200 ${
          hovering ? 'scale-150 border-gold-bright' : 'scale-100'
        }`}
        style={{ willChange: 'transform' }}
      />
    </>
  )
}
