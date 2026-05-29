import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'

type Props = {
  from?: number
  to: number
  duration?: number
  className?: string
  format?: (n: number) => string
}

export default function AnimatedCounter({
  from = 0,
  to,
  duration = 1.4,
  className = '',
  format,
}: Props) {
  const [value, setValue] = useState(from)
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 })

  useEffect(() => {
    if (!inView) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setValue(to)
      return
    }
    let start = 0
    const startTime = performance.now()
    const step = (now: number) => {
      const elapsed = (now - startTime) / 1000
      const t = Math.min(elapsed / duration, 1)
      // ease-out-expo
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
      const next = from + (to - from) * eased
      setValue(next)
      if (t < 1) start = requestAnimationFrame(step)
    }
    start = requestAnimationFrame(step)
    return () => cancelAnimationFrame(start)
  }, [inView, from, to, duration])

  const display = format ? format(value) : Math.round(value).toString().padStart(2, '0')

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  )
}
