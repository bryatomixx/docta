import { motion } from 'framer-motion'
import { proposal } from '../../data/proposal'
import Eyebrow from '../ui/Eyebrow'
import SectionNumber from '../ui/SectionNumber'
import { fadeUp, viewport } from '../../lib/animations'

export default function Investment() {
  const { investment } = proposal

  return (
    <section
      id="inversion"
      className="relative bg-ink-deep px-6 py-28 sm:px-10 md:px-16 md:py-36 lg:px-24"
    >
      <div className="absolute right-6 top-12 z-0 sm:right-12 md:right-20 lg:right-32">
        <SectionNumber value={investment.number} />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <Eyebrow number={investment.number}>{investment.eyebrow}</Eyebrow>

        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="mt-8 max-w-4xl font-serif text-[clamp(2.4rem,5vw,4.2rem)] leading-[1.05]"
        >
          {investment.title.pre}
          <span className="italic text-gold">{investment.title.em}</span>
          {investment.title.post}
        </motion.h2>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          transition={{ delay: 0.15 }}
          className="mt-10 max-w-3xl font-sans text-[1.02rem] leading-[1.75] text-paper/65"
        >
          {investment.intro}
        </motion.p>

        {/* Phase cards */}
        <div className="mt-16 grid gap-6 md:grid-cols-3 md:gap-8">
          {investment.phases.map((phase, i) => (
            <motion.article
              key={phase.code}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{ duration: 0.9, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden border border-gold/20 bg-ink-soft/40 p-8 transition-all hover:border-gold/60 hover:shadow-[0_10px_60px_-20px_rgba(201,165,90,0.4)] sm:p-10"
              data-cursor="hover"
            >
              <div className="font-mono text-[0.7rem] uppercase tracking-[0.32em] text-gold">
                {phase.code}
              </div>
              <h3 className="mt-3 font-serif text-[1.7rem] leading-tight text-paper">
                {phase.title}
              </h3>
              <div className="mt-1 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-paper/55">
                {phase.duration}
              </div>

              <div className="mt-8 font-serif text-[2.1rem] italic leading-tight text-gold-bright">
                {phase.price}
              </div>
              <div className="mt-2 font-mono text-[0.65rem] uppercase tracking-[0.22em] text-paper/55">
                {phase.terms}
              </div>

              <div className="mt-8 h-px w-full bg-gold/20" />

              <ul className="mt-8 space-y-3">
                {phase.deliverables.map((d) => (
                  <li
                    key={d}
                    className="flex gap-3 font-sans text-[0.92rem] leading-[1.6] text-paper/70"
                  >
                    <span aria-hidden className="mt-2.5 h-px w-3 shrink-0 bg-gold/60" />
                    {d}
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>

        {/* Retainer card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-10 overflow-hidden border-2 border-gold/70 bg-gradient-to-br from-ink-soft/80 via-ink-soft/40 to-ink-soft/80 p-10 sm:p-14"
          data-cursor="hover"
        >
          {/* shimmer */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -inset-px"
            style={{
              background:
                'linear-gradient(110deg, transparent 35%, rgba(228,196,120,0.35) 50%, transparent 65%)',
            }}
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', repeatDelay: 4 }}
          />

          <div className="relative z-10 grid items-start gap-10 md:grid-cols-12 md:gap-14">
            <div className="md:col-span-5">
              <div className="font-mono text-[0.7rem] uppercase tracking-[0.32em] text-gold">
                {investment.retainer.eyebrow}
              </div>
              <h3 className="mt-3 font-serif text-[clamp(2rem,4vw,3rem)] leading-tight text-paper">
                {investment.retainer.title.pre}
                <span className="italic text-gold-bright">{investment.retainer.title.em}</span>
              </h3>
              <div className="mt-8 flex items-baseline gap-3 font-serif italic">
                <span className="text-[clamp(2.4rem,5vw,3.8rem)] leading-none text-gold-bright">
                  {investment.retainer.price}
                </span>
                <span className="text-lg text-paper/70">{investment.retainer.cadence}</span>
              </div>
              <p className="mt-4 font-mono text-[0.65rem] uppercase tracking-[0.22em] text-paper/60">
                {investment.retainer.note}
              </p>
            </div>

            <ul className="grid gap-3 md:col-span-7 md:grid-cols-2 md:gap-x-8">
              {investment.retainer.items.map((it, i) => (
                <motion.li
                  key={it}
                  initial={{ opacity: 0, x: 8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={viewport}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.05 }}
                  className="flex gap-3 font-sans text-[0.95rem] leading-[1.5] text-paper/80"
                >
                  <span aria-hidden className="mt-2.5 h-px w-3 shrink-0 bg-gold" />
                  {it}
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>

        <p className="mt-10 max-w-3xl font-mono text-[0.7rem] uppercase tracking-[0.22em] text-paper/50">
          {investment.disclaimer}
        </p>
      </div>
    </section>
  )
}
