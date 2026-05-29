import { motion } from 'framer-motion'
import { proposal } from '../../data/proposal'
import { viewport } from '../../lib/animations'

export default function Footer() {
  const { footer } = proposal
  return (
    <footer className="relative bg-ink-deep px-6 py-16 sm:px-10 md:px-16 lg:px-24">
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={viewport}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="origin-left h-px w-full bg-gold/30"
      />
      <div className="mt-10 flex flex-col gap-3 font-mono text-[0.65rem] uppercase tracking-[0.28em] text-paper/55 md:flex-row md:items-center md:justify-between">
        <div>{footer.lines[0]}</div>
        <div>{footer.lines[1]}</div>
        <div className="text-paper/40">{footer.lines[2]}</div>
      </div>
    </footer>
  )
}
