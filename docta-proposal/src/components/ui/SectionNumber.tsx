type Props = { value: string; className?: string }

export default function SectionNumber({ value, className = '' }: Props) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none select-none font-serif italic text-[clamp(8rem,18vw,22rem)] leading-none text-gold/[0.06] ${className}`}
    >
      {value}
    </span>
  )
}
