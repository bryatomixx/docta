type Props = {
  children: React.ReactNode
  number?: React.ReactNode
  className?: string
}

export default function Eyebrow({ children, number, className = '' }: Props) {
  return (
    <div
      className={`flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.32em] text-gold ${className}`}
    >
      {number != null && (
        <span className="inline-block h-px w-8 bg-gold/60" aria-hidden />
      )}
      {number != null && <span className="text-gold/70">{number}</span>}
      <span>{children}</span>
    </div>
  )
}
