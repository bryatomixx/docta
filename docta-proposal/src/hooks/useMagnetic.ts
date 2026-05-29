import { useEffect, useRef } from 'react'

export function useMagnetic<T extends HTMLElement>(strength = 0.3) {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    if (window.matchMedia('(hover: none)').matches) return

    let rafId = 0
    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      targetX = (e.clientX - cx) * strength
      targetY = (e.clientY - cy) * strength
      if (!rafId) rafId = requestAnimationFrame(loop)
    }

    const handleLeave = () => {
      targetX = 0
      targetY = 0
      if (!rafId) rafId = requestAnimationFrame(loop)
    }

    const loop = () => {
      currentX += (targetX - currentX) * 0.18
      currentY += (targetY - currentY) * 0.18
      el.style.transform = `translate(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px)`
      if (Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
        rafId = requestAnimationFrame(loop)
      } else {
        rafId = 0
      }
    }

    el.addEventListener('mousemove', handleMove)
    el.addEventListener('mouseleave', handleLeave)
    return () => {
      el.removeEventListener('mousemove', handleMove)
      el.removeEventListener('mouseleave', handleLeave)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [strength])

  return ref
}
