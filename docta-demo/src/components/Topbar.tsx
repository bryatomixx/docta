import { Bell, Calendar, Plus, MoonStar } from 'lucide-react';

export function Topbar({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="h-14 px-6 border-b border-white/5 bg-ink-deep/60 backdrop-blur flex items-center gap-4 sticky top-0 z-30">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <h1 className="text-[15px] font-display font-medium text-paper leading-none">{title}</h1>
          {subtitle && <span className="text-[12px] text-paper-dim">· {subtitle}</span>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {actions}
        <button className="h-8 px-2.5 inline-flex items-center gap-1.5 text-[12px] text-paper-soft hover:text-paper hover:bg-white/5 rounded-md ring-1 ring-white/5 transition">
          <Calendar size={13} /> Mayo 2026
        </button>
        <button className="h-8 w-8 grid place-items-center text-paper-soft hover:text-paper hover:bg-white/5 rounded-md ring-1 ring-white/5">
          <MoonStar size={13} />
        </button>
        <button className="h-8 w-8 grid place-items-center text-paper-soft hover:text-paper hover:bg-white/5 rounded-md ring-1 ring-white/5 relative">
          <Bell size={13} />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 bg-gold rounded-full" />
        </button>
        <button className="h-8 px-3 inline-flex items-center gap-1.5 text-[12px] text-ink-deep font-medium bg-gold hover:bg-gold-bright rounded-md transition">
          <Plus size={13} strokeWidth={2.5} /> Nuevo lead
        </button>
      </div>
    </header>
  );
}
