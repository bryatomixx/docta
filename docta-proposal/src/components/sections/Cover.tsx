import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { proposal } from '../../data/proposal'
import { theme } from '../../lib/theme'

export default function Cover() {
  const ref = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const titleY = useTransform(scrollYProgress, [0, 1], [0, 120])
  const titleOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  const { cover, meta } = proposal
  const ease = theme.easings.smooth as unknown as [number, number, number, number]

  return (
    <section
      ref={ref}
      className="relative min-h-screen overflow-hidden bg-ink-deep px-6 pt-10 pb-16 sm:px-10 md:px-16 md:pt-12 lg:px-24 lg:pt-16"
    >
      {/* Background — radial gold pulse */}
      <motion.div
        aria-hidden
        className="absolute inset-0"
        animate={{ opacity: [0.55, 0.85, 0.55] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background:
            'radial-gradient(ellipse at 30% 20%, rgba(201,165,90,0.15), transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(201,165,90,0.08), transparent 55%)',
        }}
      />
      {/* Subtle grid */}
      <div aria-hidden className="absolute inset-0 grid-backdrop opacity-40" />
      <div aria-hidden className="noise-overlay" />

      {/* Top frame */}
      <div className="relative z-10 flex items-start justify-between">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.2 }}
          className="flex items-center gap-3"
        >
          <span className="grid h-9 w-9 place-items-center border border-gold/50 font-serif text-lg italic text-gold">
            L
          </span>
          <div className="text-[0.65rem] uppercase tracking-[0.28em] text-paper/70 font-mono">
            <div>Latin Prime Systems</div>
            <div className="text-paper/40">División de Latin Prime Financial Group</div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.35 }}
          className="hidden text-right font-mono text-[0.65rem] uppercase tracking-[0.28em] text-paper/60 sm:block"
        >
          <div>{meta.confidential}</div>
          <div>{meta.year}</div>
          <div className="text-gold/70">{meta.ref}</div>
        </motion.div>
      </div>

      {/* Center title */}
      <motion.div
        style={{ y: titleY, opacity: titleOpacity }}
        className="relative z-10 mx-auto flex min-h-[78vh] max-w-5xl flex-col justify-center pt-16"
      >
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.5 }}
          className="mb-8 flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.34em] text-gold"
        >
          <span className="inline-block h-px w-10 bg-gold/60" />
          {cover.eyebrow}
        </motion.div>

        <h1 className="font-serif font-normal leading-[1.02] text-paper">
          {cover.titleLines.map((line, i) => (
            <span
              key={i}
              className="block overflow-hidden"
              style={{
                paddingLeft: line.indent ? 'clamp(2rem, 8vw, 8rem)' : 0,
              }}
            >
              <motion.span
                initial={{ y: '110%' }}
                animate={{ y: '0%' }}
                transition={{
                  duration: 1.05,
                  ease,
                  delay: 0.7 + i * 0.18,
                }}
                className={`inline-block text-[clamp(2.4rem,6.5vw,5.6rem)] ${
                  line.italic ? 'italic text-gold-bright' : ''
                }`}
              >
                {line.text}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 1.4 }}
          className="mt-10 max-w-2xl font-sans text-base leading-[1.7] text-paper/65 sm:text-lg"
        >
          {cover.subtitle}
        </motion.p>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease, delay: 1.7 }}
        className="relative z-10 mt-12 flex flex-col gap-4 border-t border-gold/15 pt-6 font-mono text-[0.65rem] uppercase tracking-[0.28em] text-paper/55 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <span className="text-paper/40">Preparado para:</span>{' '}
          <span className="text-paper/80">{meta.preparedFor}</span>
        </div>
        <div>
          <span className="text-paper/40">Preparado por:</span>{' '}
          <span className="text-paper/80">{meta.preparedBy}</span>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex"
      >
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.32em] text-paper/50">
          Scroll
        </span>
        <div className="relative h-12 w-px overflow-hidden bg-gold/20">
          <motion.span
            className="absolute left-0 top-0 h-3 w-px bg-gold"
            animate={{ y: [-12, 48] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </section>
  )
}
