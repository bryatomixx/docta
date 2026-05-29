import { motion } from 'framer-motion'
import { proposal } from '../../data/proposal'
import Eyebrow from '../ui/Eyebrow'
import SectionNumber from '../ui/SectionNumber'
import { fadeUp, viewport } from '../../lib/animations'

export default function Capabilities() {
  const { capabilities } = proposal

  return (
    <section
      id="capacidades"
      className="relative bg-ink px-6 py-28 sm:px-10 md:px-16 md:py-36 lg:px-24"
    >
      <div className="absolute right-6 top-12 z-0 sm:right-12 md:right-20 lg:right-32">
        <SectionNumber value={capabilities.number} />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <Eyebrow number={capabilities.number}>{capabilities.eyebrow}</Eyebrow>

        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mt-8 max-w-4xl font-serif text-[clamp(2.4rem,5vw,4.2rem)] leading-[1.05]"
        >
          {capabilities.title.pre}
          <span className="italic text-gold">{capabilities.title.em}</span>
          {capabilities.title.post}
        </motion.h2>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          transition={{ delay: 0.15 }}
          className="mt-10 max-w-3xl font-sans text-[1.02rem] leading-[1.75] text-paper/65"
        >
          {capabilities.intro}
        </motion.p>

        <div className="mt-20 divide-y divide-gold/15">
          {capabilities.items.map((cap, i) => (
            <CapabilityRow key={cap.numeral} cap={cap} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function CapabilityRow({
  cap,
  index,
}: {
  cap: (typeof proposal)['capabilities']['items'][number]
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 }}
      className="group relative py-12 md:py-16"
      data-cursor="hover"
    >
      <div className="grid items-start gap-8 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-3">
          <motion.span
            className="block font-serif text-[clamp(3.5rem,8vw,6.5rem)] italic leading-none text-gold transition-transform duration-500 group-hover:translate-x-2"
            aria-hidden
          >
            {cap.numeral}
          </motion.span>
        </div>

        <div className="md:col-span-9">
          <div className="font-mono text-[0.7rem] uppercase tracking-[0.32em] text-gold/70">
            {cap.tag}
          </div>
          <h3 className="mt-2 font-serif text-[clamp(1.7rem,2.6vw,2.4rem)] leading-tight text-paper transition-colors group-hover:text-gold-bright">
            {cap.title}
          </h3>
          <p className="mt-5 max-w-3xl font-sans text-[1rem] leading-[1.75] text-paper/65">
            {cap.description}
          </p>

          <ul className="mt-8 space-y-3">
            {cap.bullets.map((b, j) => (
              <motion.li
                key={j}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={viewport}
                transition={{ duration: 0.6, delay: 0.2 + j * 0.07 }}
                className="flex gap-4 font-sans text-[0.95rem] leading-[1.6] text-paper/75"
              >
                <span aria-hidden className="mt-3 h-px w-5 shrink-0 bg-gold/60" />
                <span>{b}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  )
}
