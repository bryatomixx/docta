import { useMagnetic } from '../../hooks/useMagnetic'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string
  strength?: number
}

export default function MagneticButton({
  children,
  href,
  strength = 0.25,
  className = '',
  ...rest
}: Props) {
  const ref = useMagnetic<HTMLAnchorElement & HTMLButtonElement>(strength)

  const base =
    'relative inline-flex items-center gap-3 px-7 py-4 font-mono text-[0.72rem] uppercase tracking-[0.32em] text-paper border border-gold/40 bg-transparent transition-colors hover:border-gold hover:text-gold-bright will-change-transform'

  if (href) {
    return (
      <a ref={ref} href={href} className={`${base} ${className}`}>
        {children}
      </a>
    )
  }
  return (
    <button ref={ref} className={`${base} ${className}`} {...rest}>
      {children}
    </button>
  )
}
