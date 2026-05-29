import { motion } from 'framer-motion'
import { proposal } from '../../data/proposal'
import Eyebrow from '../ui/Eyebrow'
import SectionNumber from '../ui/SectionNumber'
import { cardEnter, fadeUp, viewport } from '../../lib/animations'

export default function Understanding() {
  const { understanding } = proposal

  return (
    <section
      id="entendemos"
      className="relative bg-ink px-6 py-28 sm:px-10 md:px-16 md:py-36 lg:px-24"
    >
      <div className="absolute right-6 top-12 z-0 sm:right-12 md:right-20 lg:right-32">
        <SectionNumber value={understanding.number} />
      </div>
      <div aria-hidden className="absolute inset-0 grid-backdrop opacity-25" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <Eyebrow number={understanding.number}>{understanding.eyebrow}</Eyebrow>

        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mt-8 max-w-4xl font-serif text-[clamp(2.4rem,5vw,4.2rem)] leading-[1.05]"
        >
          {understanding.title.pre}
          <span className="italic text-gold">{understanding.title.em}</span>
          {understanding.title.post}
        </motion.h2>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          transition={{ delay: 0.15 }}
          className="mt-10 max-w-3xl font-sans text-[1.02rem] leading-[1.75] text-paper/65"
        >
          {understanding.intro}
        </motion.p>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 md:gap-8 lg:gap-10">
          {understanding.cards.map((card, i) => (
            <motion.article
              key={card.numeral}
              custom={
                // diagonal stagger: i=0 → 0, i=1 → 1, i=2 → 1, i=3 → 2
                [0, 1, 1, 2][i] ?? i
              }
              variants={cardEnter}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 240, damping: 24 }}
              className="group relative overflow-hidden border border-gold/15 bg-ink-soft/40 p-8 transition-colors hover:bg-ink-soft/70 sm:p-10"
              data-cursor="hover"
            >
              <span
                aria-hidden
                className="absolute -right-3 -top-6 select-none font-serif text-[5rem] italic text-gold/15 transition-all duration-500 group-hover:scale-110 group-hover:text-gold/30 sm:text-[6.5rem]"
              >
                {card.numeral}
              </span>

              <div className="relative z-10">
                <div className="font-mono text-[0.7rem] uppercase tracking-[0.32em] text-gold">
                  {card.numeral}
                </div>
                <h3 className="mt-3 font-serif text-2xl leading-tight text-paper sm:text-[1.7rem]">
                  {card.title}
                </h3>
                <p className="mt-5 font-sans text-[0.98rem] leading-[1.7] text-paper/70">
                  {card.body}
                </p>
              </div>

              <motion.span
                aria-hidden
                className="absolute bottom-0 left-0 h-px w-full origin-left bg-gold/40"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, delay: 0.3 + i * 0.1 }}
              />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
