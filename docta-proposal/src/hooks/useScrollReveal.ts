import { useInView } from 'react-intersection-observer'

export function useScrollReveal(threshold = 0.25) {
  const { ref, inView } = useInView({
    threshold,
    triggerOnce: true,
    rootMargin: '0px 0px -10% 0px',
  })
  return { ref, inView }
}
