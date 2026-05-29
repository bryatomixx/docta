import { motion } from 'framer-motion'
import { proposal } from '../../data/proposal'
import Eyebrow from '../ui/Eyebrow'
import SectionNumber from '../ui/SectionNumber'
import RevealText from '../ui/RevealText'
import { fadeUp, viewport } from '../../lib/animations'

export default function WhyLPS() {
  const { whyLps } = proposal

  return (
    <section
      id="por-que"
      className="relative bg-ink px-6 py-28 sm:px-10 md:px-16 md:py-36 lg:px-24"
    >
      <div className="absolute right-6 top-12 z-0 sm:right-12 md:right-20 lg:right-32">
        <SectionNumber value={whyLps.number} />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <Eyebrow number={whyLps.number}>{whyLps.eyebrow}</Eyebrow>

        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mt-8 max-w-4xl font-serif text-[clamp(2.4rem,5vw,4.2rem)] leading-[1.05]"
        >
          {whyLps.title.pre}
          <span className="italic text-gold">{whyLps.title.em}</span>
          {whyLps.title.post}
        </motion.h2>

        <blockquote className="mt-14 border-l-2 border-gold pl-6 sm:pl-10">
          <p className="font-serif text-[clamp(1.3rem,2.4vw,1.95rem)] italic leading-[1.45] text-paper/90">
            <RevealText staggerDelay={0.025}>{whyLps.quote}</RevealText>
          </p>
        </blockquote>

        <div className="mt-20 grid gap-6 sm:grid-cols-2 md:gap-10">
          {whyLps.pillars.map((p, i) => (
            <motion.article
              key={p.numeral}
              initial={{ opacity: 0, y: 30, rotate: -2 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={viewport}
              transition={{ duration: 0.9, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden border border-gold/15 bg-ink-soft/30 p-8 transition-colors hover:border-gold/40 hover:bg-ink-soft/60 sm:p-10"
              data-cursor="hover"
            >
              <span
                aria-hidden
                className="absolute -right-2 -top-4 select-none font-serif text-[6rem] italic text-gold/10 transition-all duration-500 group-hover:text-gold/25 sm:text-[7.5rem]"
              >
                {p.numeral}
              </span>
              <div className="relative z-10">
                <div className="font-mono text-[0.7rem] uppercase tracking-[0.32em] text-gold">
                  {p.numeral}
                </div>
                <h3 className="mt-3 font-serif text-[1.55rem] leading-tight text-paper">
                  {p.title}
                </h3>
                <p className="mt-5 font-sans text-[0.98rem] leading-[1.7] text-paper/65">
                  {p.body}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
