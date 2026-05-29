import type { Variants, Transition } from 'framer-motion'
import { theme } from './theme'

const smooth: Transition = {
  duration: 0.9,
  ease: theme.easings.smooth as unknown as [number, number, number, number],
}

const elegant: Transition = {
  duration: 1.1,
  ease: theme.easings.elegant as unknown as [number, number, number, number],
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: smooth },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { ...smooth, duration: 1.2 } },
}

export const revealClip: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: elegant,
  },
}

export const staggerContainer = (stagger = 0.08, delay = 0): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger,
      delayChildren: delay,
    },
  },
})

export const lineGrow: Variants = {
  hidden: { scaleX: 0, transformOrigin: '0% 50%' },
  visible: {
    scaleX: 1,
    transition: { duration: 1.1, ease: theme.easings.smooth as unknown as [number, number, number, number] },
  },
}

export const lineGrowCenter: Variants = {
  hidden: { scaleX: 0, transformOrigin: '50% 50%' },
  visible: {
    scaleX: 1,
    transition: { duration: 1.2, ease: theme.easings.smooth as unknown as [number, number, number, number] },
  },
}

export const wordReveal: Variants = {
  hidden: { y: '110%' },
  visible: {
    y: '0%',
    transition: { duration: 0.9, ease: theme.easings.smooth as unknown as [number, number, number, number] },
  },
}

export const cardEnter: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      delay: i * 0.08,
      ease: theme.easings.smooth as unknown as [number, number, number, number],
    },
  }),
}

export const viewport = { once: true, amount: 0.15 }
