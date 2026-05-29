import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { proposal } from '../../data/proposal'
import Eyebrow from '../ui/Eyebrow'
import SectionNumber from '../ui/SectionNumber'
import { fadeUp, lineGrowCenter, viewport } from '../../lib/animations'

export default function Vision() {
  const { vision } = proposal
  const ref = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const bgOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.4, 1, 0.4])
  const bgScale = useTransform(scrollYProgress, [0, 1], [0.9, 1.1])

  return (
    <section
      ref={ref}
      id="vision"
      className="relative overflow-hidden bg-ink-deep px-6 py-32 sm:px-10 md:px-16 md:py-44 lg:px-24"
    >
      {/* Pulsing radial gold */}
      <motion.div
        aria-hidden
        className="absolute inset-0"
        style={{
          opacity: bgOpacity,
          scale: bgScale,
          background:
            'radial-gradient(circle at 50% 50%, rgba(201,165,90,0.15), transparent 55%)',
        }}
      />
      <div aria-hidden className="noise-overlay" />

      <div className="absolute right-6 top-12 z-0 sm:right-12 md:right-20 lg:right-32">
        <SectionNumber value={vision.number} />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        <div className="flex justify-center">
          <Eyebrow number={vision.number}>{vision.eyebrow}</Eyebrow>
        </div>

        <h2 className="mt-12 font-serif text-[clamp(2rem,4.5vw,3.7rem)] leading-[1.15] text-paper">
          <motion.span
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="block"
          >
            Una <span className="italic text-gold">infraestructura propietaria</span> diseñada específicamente para su ecosistema —
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
            className="block text-paper/80"
          >
            no un producto de catálogo adaptado a la fuerza.
          </motion.span>
        </h2>

        <motion.span
          variants={lineGrowCenter}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mx-auto mt-14 block h-px w-32 bg-gold"
          aria-hidden
        />

        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          transition={{ delay: 0.2 }}
          className="mx-auto mt-12 max-w-3xl font-sans text-[1.05rem] leading-[1.75] text-paper/70"
        >
          {vision.body}
        </motion.p>
      </div>
    </section>
  )
}
