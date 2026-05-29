import { motion } from 'framer-motion'
import { theme } from '../../lib/theme'

type Props = {
  children: string
  className?: string
  staggerDelay?: number
  delay?: number
  as?: 'span' | 'div'
}

/**
 * Splits a string into word-spans, each masked and animated upward on view.
 * Preserves whitespace.
 */
export default function RevealText({
  children,
  className = '',
  staggerDelay = 0.05,
  delay = 0,
  as: As = 'span',
}: Props) {
  const words = children.split(/(\s+)/)

  return (
    <As className={`inline-block ${className}`}>
      {words.map((word, i) => {
        if (/^\s+$/.test(word)) return <span key={i}>{word}</span>
        return (
          <span
            key={i}
            className="inline-block overflow-hidden align-bottom"
            style={{ verticalAlign: 'bottom' }}
          >
            <motion.span
              className="inline-block"
              initial={{ y: '110%' }}
              whileInView={{ y: '0%' }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{
                duration: 0.85,
                delay: delay + i * staggerDelay,
                ease: theme.easings.smooth as unknown as [number, number, number, number],
              }}
            >
              {word}
            </motion.span>
          </span>
        )
      })}
    </As>
  )
}
