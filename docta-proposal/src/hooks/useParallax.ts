import { useScroll, useTransform, useReducedMotion } from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import { useRef } from 'react'
import type { RefObject } from 'react'

export function useParallax(distance = 60): {
  ref: RefObject<HTMLDivElement | null>
  y: MotionValue<number>
} {
  const ref = useRef<HTMLDivElement | null>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [distance, -distance])
  return { ref, y }
}
