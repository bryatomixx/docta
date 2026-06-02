import { Bell, Calendar, Plus, MoonStar, Menu } from 'lucide-react';
import { useSidebar } from '../lib/sidebar';

export function Topbar({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  const { setOpen } = useSidebar();
  return (
    <header className="h-14 px-4 sm:px-6 border-b border-white/5 bg-ink-deep/60 backdrop-blur flex items-center gap-3 sm:gap-4 sticky top-0 z-30">
      {/* Hamburger — mobile only */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Abrir menú"
        className="lg:hidden h-9 w-9 -ml-1 grid place-items-center text-paper-soft hover:text-paper hover:bg-white/5 rounded-md shrink-0"
      >
        <Menu size={18} />
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <h1 className="text-[15px] font-display font-medium text-paper leading-none truncate">{title}</h1>
          {subtitle && <span className="hidden sm:inline text-[12px] text-paper-dim truncate">· {subtitle}</span>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {actions}
        {/* Secondary controls — hidden on small screens to avoid overflow */}
        <button className="hidden md:inline-flex h-8 px-2.5 items-center gap-1.5 text-[12px] text-paper-soft hover:text-paper hover:bg-white/5 rounded-md ring-1 ring-white/5 transition">
          <Calendar size={13} /> Mayo 2026
        </button>
        <button className="hidden sm:grid h-8 w-8 place-items-center text-paper-soft hover:text-paper hover:bg-white/5 rounded-md ring-1 ring-white/5">
          <MoonStar size={13} />
        </button>
        <button className="hidden sm:grid h-8 w-8 place-items-center text-paper-soft hover:text-paper hover:bg-white/5 rounded-md ring-1 ring-white/5 relative">
          <Bell size={13} />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 bg-gold rounded-full" />
        </button>
        <button className="h-8 px-2.5 sm:px-3 inline-flex items-center gap-1.5 text-[12px] text-ink-deep font-medium bg-gold hover:bg-gold-bright rounded-md transition">
          <Plus size={13} strokeWidth={2.5} /> <span className="hidden sm:inline">Nuevo lead</span>
        </button>
      </div>
    </header>
  );
}
