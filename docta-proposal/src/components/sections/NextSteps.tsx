import { motion } from 'framer-motion'
import { proposal } from '../../data/proposal'
import Eyebrow from '../ui/Eyebrow'
import SectionNumber from '../ui/SectionNumber'
import MagneticButton from '../ui/MagneticButton'
import { fadeUp, viewport } from '../../lib/animations'

function CornerDecor({
  position,
}: {
  position: 'tl' | 'tr' | 'bl' | 'br'
}) {
  const transforms: Record<typeof position, string> = {
    tl: '',
    tr: 'rotate-90',
    br: 'rotate-180',
    bl: '-rotate-90',
  }
  const positions: Record<typeof position, string> = {
    tl: 'top-0 left-0',
    tr: 'top-0 right-0',
    bl: 'bottom-0 left-0',
    br: 'bottom-0 right-0',
  }
  return (
    <svg
      aria-hidden
      className={`absolute h-8 w-8 text-gold ${positions[position]} ${transforms[position]}`}
      viewBox="0 0 32 32"
      fill="none"
    >
      <motion.path
        d="M 32 0 L 0 0 L 0 32"
        stroke="currentColor"
        strokeWidth="1.2"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={viewport}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  )
}

export default function NextSteps() {
  const { nextSteps } = proposal

  return (
    <section
      id="proximos"
      className="relative bg-ink-deep px-6 py-28 sm:px-10 md:px-16 md:py-36 lg:px-24"
    >
      <div className="absolute right-6 top-12 z-0 sm:right-12 md:right-20 lg:right-32">
        <SectionNumber value={nextSteps.number} />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <Eyebrow number={nextSteps.number}>{nextSteps.eyebrow}</Eyebrow>

        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mt-8 max-w-4xl font-serif text-[clamp(2.4rem,5vw,4.2rem)] leading-[1.05]"
        >
          {nextSteps.title.pre}
          <span className="italic text-gold">{nextSteps.title.em}</span>
          {nextSteps.title.post}
        </motion.h2>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          transition={{ delay: 0.15 }}
          className="mt-10 max-w-3xl font-sans text-[1.02rem] leading-[1.75] text-paper/65"
        >
          {nextSteps.intro}
        </motion.p>

        <div className="mt-20 grid gap-12 md:grid-cols-3 md:gap-10">
          {nextSteps.steps.map((step, i) => (
            <motion.div
              key={step.numeral}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{ duration: 0.9, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <motion.span
                aria-hidden
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewport}
                transition={{ duration: 1, delay: i * 0.15 + 0.1 }}
                className="block font-serif text-[clamp(4rem,8vw,7rem)] italic leading-none text-gold"
              >
                {step.numeral}
              </motion.span>
              <h3 className="mt-6 font-serif text-[1.55rem] leading-tight text-paper">
                {step.title}
              </h3>
              <p className="mt-4 font-sans text-[0.95rem] leading-[1.7] text-paper/65">
                {step.body}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA Block */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-24 overflow-hidden border border-gold/30 bg-ink-soft/40 p-10 text-center sm:p-16 md:p-20"
        >
          <CornerDecor position="tl" />
          <CornerDecor position="tr" />
          <CornerDecor position="bl" />
          <CornerDecor position="br" />

          <h3 className="font-serif text-[clamp(2.2rem,4.5vw,3.6rem)] leading-tight text-paper">
            {nextSteps.cta.title.pre}
            <span className="italic text-gold">{nextSteps.cta.title.em}</span>
            {nextSteps.cta.title.post}
          </h3>
          <p className="mx-auto mt-6 max-w-2xl font-sans text-[1rem] leading-[1.75] text-paper/65">
            {nextSteps.cta.body}
          </p>

          <div className="mt-10 flex justify-center">
            <MagneticButton href={`mailto:${nextSteps.cta.contacts[1].value}`}>
              Reservar reunión
              <span aria-hidden className="ml-1">→</span>
            </MagneticButton>
          </div>

          <div className="mt-14 flex flex-wrap items-center justify-center gap-8 border-t border-gold/15 pt-10 sm:gap-12">
            {nextSteps.cta.contacts.map((c) => (
              <div key={c.label} className="text-center" data-cursor="hover">
                <div className="font-mono text-[0.62rem] uppercase tracking-[0.32em] text-gold/70">
                  {c.label}
                </div>
                <div className="mt-2 font-serif text-[1.05rem] italic text-paper">
                  {c.value}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
