import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Inbox,
  Workflow,
  Users,
  Building2,
  Zap,
  Plug,
  Settings,
  Sparkles,
  Search,
  ChevronDown,
  MapPin,
} from 'lucide-react';
import { cn } from '../lib/cn';
import { CURRENT_USER } from '../data/users';
import { Avatar } from './Avatar';

const NAV: { to: string; label: string; icon: typeof LayoutDashboard; badge?: string }[] = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/inbox', label: 'Inbox', icon: Inbox, badge: '24' },
  { to: '/leads', label: 'Leads', icon: Sparkles },
  { to: '/crm', label: 'Pipeline', icon: Workflow },
  { to: '/marketplace', label: 'Marketplace', icon: Building2 },
  { to: '/enrich', label: 'Enriquecer', icon: MapPin },
  { to: '/automations', label: 'Automatizaciones', icon: Zap },
  { to: '/users', label: 'Equipo', icon: Users },
  { to: '/integrations', label: 'Integraciones', icon: Plug },
];

export function Sidebar() {
  return (
    <aside className="w-60 shrink-0 border-r border-white/5 bg-ink-deep/70 backdrop-blur flex flex-col h-screen sticky top-0">
      <div className="px-4 h-14 flex items-center gap-2 border-b border-white/5">
        <div className="h-8 w-8 rounded-md bg-gradient-to-br from-gold to-gold-deep grid place-items-center text-ink-deep font-bold font-display text-lg shrink-0">
          D
        </div>
        <div className="leading-tight">
          <div className="text-paper font-medium text-sm tracking-wide">DOCTA</div>
          <div className="text-[10px] text-paper-dim uppercase tracking-[0.18em]">Real Estate OS</div>
        </div>
      </div>

      <div className="px-3 pt-3">
        <button className="w-full flex items-center gap-2 px-2.5 h-9 rounded-md text-[12px] text-paper-dim bg-white/[0.02] ring-1 ring-white/5 hover:ring-white/10 transition">
          <Search size={13} />
          <span className="flex-1 text-left">Buscar leads, propiedades…</span>
          <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-paper-dim font-mono">⌘K</kbd>
        </button>
      </div>

      <nav className="px-2 mt-3 flex-1 flex flex-col gap-0.5 overflow-y-auto min-h-0">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              cn(
                'group flex items-center gap-2.5 px-2.5 h-9 rounded-md text-[13px] transition-colors',
                isActive
                  ? 'bg-gold/10 text-gold ring-1 ring-gold/20'
                  : 'text-paper-soft hover:bg-white/5 hover:text-paper',
              )
            }
          >
            <item.icon size={15} strokeWidth={1.85} />
            <span className="flex-1">{item.label}</span>
            {item.badge && (
              <span className="text-[10px] font-medium bg-gold/15 text-gold px-1.5 py-0.5 rounded">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-2 pb-3 mt-2">
        <NavLink
          to="/settings"
          className="flex items-center gap-2.5 px-2.5 h-9 rounded-md text-[13px] text-paper-soft hover:bg-white/5 hover:text-paper transition-colors"
        >
          <Settings size={15} strokeWidth={1.85} />
          Ajustes
        </NavLink>
      </div>

      <div className="border-t border-white/5 p-3 flex items-center gap-2.5">
        <Avatar name={CURRENT_USER.name} hue={CURRENT_USER.avatarHue} size={32} />
        <div className="flex-1 min-w-0 leading-tight">
          <div className="text-[12.5px] text-paper truncate">{CURRENT_USER.name}</div>
          <div className="text-[10.5px] text-paper-dim truncate">{CURRENT_USER.role}</div>
        </div>
        <ChevronDown size={14} className="text-paper-dim" />
      </div>
    </aside>
  );
}
