import { ArrowDown, ArrowUp } from 'lucide-react';
import { cn } from '../lib/cn';

export function StatPill({
  delta,
  invert = false,
}: {
  delta: number;
  invert?: boolean;
}) {
  const good = invert ? delta < 0 : delta > 0;
  const Icon = delta >= 0 ? ArrowUp : ArrowDown;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-0.5 text-[11px] font-medium px-1.5 py-0.5 rounded',
        good
          ? 'bg-success/10 text-success ring-1 ring-success/20'
          : 'bg-danger/10 text-danger ring-1 ring-danger/20',
      )}
    >
      <Icon size={11} strokeWidth={2.5} />
      {Math.abs(delta).toFixed(1)}%
    </span>
  );
}

export function Pill({
  children,
  tone = 'neutral',
  size = 'md',
}: {
  children: React.ReactNode;
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'gold';
  size?: 'sm' | 'md';
}) {
  const toneMap = {
    neutral: 'bg-white/5 text-paper-soft ring-white/10',
    success: 'bg-success/10 text-success ring-success/20',
    warning: 'bg-warning/10 text-warning ring-warning/20',
    danger: 'bg-danger/10 text-danger ring-danger/20',
    info: 'bg-info/10 text-info ring-info/20',
    gold: 'bg-gold/10 text-gold ring-gold/30',
  } as const;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full ring-1 font-medium',
        size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-[11px] px-2 py-0.5',
        toneMap[tone],
      )}
    >
      {children}
    </span>
  );
}
