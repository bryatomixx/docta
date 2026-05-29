import { motion } from 'framer-motion'
import { proposal } from '../../data/proposal'
import Eyebrow from '../ui/Eyebrow'
import SectionNumber from '../ui/SectionNumber'
import AnimatedCounter from '../ui/AnimatedCounter'
import { revealClip, viewport } from '../../lib/animations'

export default function ExecutiveSummary() {
  const { summary } = proposal

  return (
    <section
      id="resumen"
      className="relative bg-ink-deep px-6 py-28 sm:px-10 md:px-16 md:py-36 lg:px-24"
    >
      <div className="absolute right-6 top-12 z-0 sm:right-12 md:right-20 lg:right-32">
        <SectionNumber value={summary.number} />
      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl gap-12 md:grid-cols-12 md:gap-16">
        {/* Sticky left column */}
        <div className="md:col-span-5 lg:col-span-4">
          <div className="md:sticky md:top-24">
            <Eyebrow
              number={<AnimatedCounter to={1} />}
            >
              {summary.eyebrow}
            </Eyebrow>
            <h2 className="mt-8 font-serif text-[clamp(2.4rem,5vw,4.2rem)] leading-[1.05]">
              {summary.title.pre}
              <span className="italic text-gold">{summary.title.em}</span>
              {summary.title.post}
            </h2>
          </div>
        </div>

        {/* Right content */}
        <div className="space-y-7 md:col-span-7 lg:col-span-7 lg:col-start-6">
          {summary.paragraphs.map((p, i) => (
            <div key={i} className="overflow-hidden">
              <motion.p
                variants={revealClip}
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
                className={
                  p.lead
                    ? 'border-l-2 border-gold pl-6 font-serif text-[1.45rem] italic leading-[1.4] text-paper/90 sm:text-[1.6rem]'
                    : 'font-sans text-[1.02rem] leading-[1.75] text-paper/70'
                }
              >
                {p.text}
              </motion.p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
