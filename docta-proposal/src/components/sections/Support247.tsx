import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { proposal } from '../../data/proposal'
import Eyebrow from '../ui/Eyebrow'
import SectionNumber from '../ui/SectionNumber'
import { fadeUp, viewport } from '../../lib/animations'

function SlotNumber({ target }: { target: string }) {
  const { ref, inView } = useInView({ threshold: 0.6, triggerOnce: true })
  const [display, setDisplay] = useState(target.replace(/\d/g, '0'))

  useEffect(() => {
    if (!inView) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setDisplay(target)
      return
    }
    let count = 0
    const interval = setInterval(() => {
      count += 1
      if (count >= 14) {
        setDisplay(target)
        clearInterval(interval)
        return
      }
      const next = target
        .split('')
        .map((c) => (/\d/.test(c) ? String(Math.floor(Math.random() * 10)) : c))
        .join('')
      setDisplay(next)
    }, 60)
    return () => clearInterval(interval)
  }, [inView, target])

  return <span ref={ref}>{display}</span>
}

export default function Support247() {
  const { support } = proposal

  return (
    <section
      id="soporte"
      className="relative overflow-hidden bg-ink px-6 py-28 sm:px-10 md:px-16 md:py-36 lg:px-24"
    >
      <div className="absolute right-6 top-12 z-0 sm:right-12 md:right-20 lg:right-32">
        <SectionNumber value={support.number} />
      </div>

      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background:
            'radial-gradient(circle at 25% 50%, rgba(201,165,90,0.12), transparent 50%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        <Eyebrow number={support.number}>{support.eyebrow}</Eyebrow>

        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mt-8 max-w-4xl font-serif text-[clamp(2.4rem,5vw,4.2rem)] leading-[1.05]"
        >
          {support.title.pre}
          <span className="italic text-gold">{support.title.em}</span>
          {support.title.post}
        </motion.h2>

        <div className="mt-16 grid items-center gap-16 md:grid-cols-12 md:gap-12">
          {/* Clock visual */}
          <div className="flex justify-center md:col-span-5">
            <div className="relative h-72 w-72 sm:h-96 sm:w-96">
              <motion.svg
                viewBox="0 0 200 200"
                className="absolute inset-0 h-full w-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
              >
                {Array.from({ length: 60 }).map((_, i) => {
                  const isHour = i % 5 === 0
                  return (
                    <line
                      key={i}
                      x1="100"
                      y1={isHour ? 14 : 18}
                      x2="100"
                      y2={isHour ? 22 : 20}
                      stroke="rgb(201 165 90 / 0.6)"
                      strokeWidth={isHour ? 1.4 : 0.6}
                      transform={`rotate(${i * 6} 100 100)`}
                    />
                  )
                })}
                <circle
                  cx="100"
                  cy="100"
                  r="86"
                  fill="none"
                  stroke="rgb(201 165 90 / 0.25)"
                  strokeWidth="0.6"
                />
              </motion.svg>

              <div className="absolute inset-0 grid place-items-center text-center">
                <div>
                  <div className="font-serif text-7xl italic leading-none text-gold sm:text-8xl">
                    <SlotNumber target="24/7" />
                  </div>
                  <div className="mt-3 font-mono text-[0.7rem] uppercase tracking-[0.32em] text-paper/70">
                    365 días al año
                  </div>
                </div>
              </div>

              {/* Slow pulse glow */}
              <motion.div
                aria-hidden
                className="absolute inset-0 rounded-full"
                animate={{
                  boxShadow: [
                    '0 0 60px 0 rgba(201,165,90,0.15)',
                    '0 0 90px 10px rgba(201,165,90,0.35)',
                    '0 0 60px 0 rgba(201,165,90,0.15)',
                  ],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="md:col-span-7">
            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              className="font-sans text-[1.02rem] leading-[1.75] text-paper/70"
            >
              {support.description}
            </motion.p>

            <div className="mt-10 space-y-7">
              {support.features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={viewport}
                  transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="border-l-2 border-gold pl-5"
                >
                  <h3 className="font-serif text-[1.35rem] leading-tight text-paper">
                    {f.title}
                  </h3>
                  <p className="mt-2 font-sans text-[0.95rem] leading-[1.7] text-paper/65">
                    {f.body}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
