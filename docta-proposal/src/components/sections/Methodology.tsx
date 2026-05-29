import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { proposal } from '../../data/proposal'
import Eyebrow from '../ui/Eyebrow'
import SectionNumber from '../ui/SectionNumber'
import { fadeUp, viewport } from '../../lib/animations'

export default function Methodology() {
  const { methodology } = proposal
  const ref = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 80%', 'end 30%'],
  })
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section
      id="metodologia"
      className="relative bg-ink-deep px-6 py-28 sm:px-10 md:px-16 md:py-36 lg:px-24"
    >
      <div className="absolute right-6 top-12 z-0 sm:right-12 md:right-20 lg:right-32">
        <SectionNumber value={methodology.number} />
      </div>

      <div ref={ref} className="relative z-10 mx-auto max-w-7xl">
        <Eyebrow number={methodology.number}>{methodology.eyebrow}</Eyebrow>

        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mt-8 max-w-4xl font-serif text-[clamp(2.4rem,5vw,4.2rem)] leading-[1.05]"
        >
          {methodology.title.pre}
          <span className="italic text-gold">{methodology.title.em}</span>
          {methodology.title.post}
        </motion.h2>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          transition={{ delay: 0.15 }}
          className="mt-10 max-w-3xl font-sans text-[1.02rem] leading-[1.75] text-paper/65"
        >
          {methodology.intro}
        </motion.p>

        {/* Timeline */}
        <div className="relative mt-20">
          {/* horizontal line drawn by SVG on desktop, vertical on mobile */}
          <svg
            aria-hidden
            className="pointer-events-none absolute left-0 right-0 top-8 hidden h-1 w-full md:block"
            viewBox="0 0 100 1"
            preserveAspectRatio="none"
          >
            <motion.line
              x1="0"
              y1="0.5"
              x2="100"
              y2="0.5"
              stroke="rgb(201 165 90 / 0.5)"
              strokeWidth="0.4"
              style={{ pathLength }}
            />
          </svg>

          <div className="grid gap-12 md:grid-cols-4 md:gap-6 lg:gap-10">
            {methodology.phases.map((phase, i) => (
              <motion.div
                key={phase.code}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewport}
                transition={{ duration: 0.85, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="group relative"
              >
                <div className="mb-6 flex items-center gap-3 md:block">
                  <motion.span
                    className="relative grid h-4 w-4 place-items-center"
                    aria-hidden
                  >
                    <span className="absolute inset-0 rounded-full bg-gold/30" />
                    <motion.span
                      className="absolute inset-0 rounded-full bg-gold"
                      animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0.2, 0.6] }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: i * 0.4,
                        ease: 'easeInOut',
                      }}
                    />
                    <span className="relative h-1.5 w-1.5 rounded-full bg-gold-bright" />
                  </motion.span>
                  <span className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-gold md:mt-4 md:block">
                    {phase.code}
                  </span>
                </div>

                <h3 className="font-serif text-[1.5rem] leading-tight text-paper transition-colors group-hover:text-gold-bright">
                  {phase.title}
                </h3>
                <div className="mt-1 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-paper/50">
                  {phase.duration}
                </div>

                <p className="mt-5 font-sans text-[0.95rem] leading-[1.7] text-paper/70">
                  {phase.description}
                </p>

                <ul className="mt-6 space-y-2">
                  {phase.items.map((it) => (
                    <li
                      key={it}
                      className="flex items-start gap-2 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-paper/55"
                    >
                      <span aria-hidden className="mt-1 h-px w-3 shrink-0 bg-gold/50" />
                      {it}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
