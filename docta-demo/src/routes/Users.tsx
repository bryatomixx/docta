import { useMemo, useState } from 'react';
import { Topbar } from '../components/Topbar';
import { Avatar } from '../components/Avatar';
import { Pill } from '../components/StatPill';
import { TEAM, type Role, type TeamMember } from '../data/users';
import { num, usd } from '../lib/format';
import { cn } from '../lib/cn';
import { Search, Plus, Shield, Lock, Eye, Mail } from 'lucide-react';

const ROLE_LABELS: Record<Role, string> = {
  admin: 'Admin',
  broker: 'Broker',
  realtor: 'Realtor',
  marketer: 'Marketer',
  operator: 'Operator',
  investor: 'Investor',
};

const ROLE_PERMISSIONS: { module: string; admin: boolean; broker: boolean; realtor: boolean; marketer: boolean; operator: boolean; investor: boolean }[] = [
  { module: 'Dashboard ejecutivo',  admin: true,  broker: true,  realtor: true,  marketer: true,  operator: true,  investor: true },
  { module: 'Inbox unificado',      admin: true,  broker: true,  realtor: true,  marketer: true,  operator: true,  investor: false },
  { module: 'Pipeline CRM',         admin: true,  broker: true,  realtor: true,  marketer: false, operator: true,  investor: false },
  { module: 'Marketplace — leer',   admin: true,  broker: true,  realtor: true,  marketer: true,  operator: true,  investor: true },
  { module: 'Marketplace — publicar', admin: true, broker: true, realtor: true, marketer: false, operator: true,  investor: false },
  { module: 'Campañas — leer',      admin: true,  broker: true,  realtor: true,  marketer: true,  operator: true,  investor: false },
  { module: 'Campañas — editar',    admin: true,  broker: true,  realtor: false, marketer: true,  operator: false, investor: false },
  { module: 'Equipo y permisos',    admin: true,  broker: true,  realtor: false, marketer: false, operator: false, investor: false },
  { module: 'Integraciones / API',  admin: true,  broker: false, realtor: false, marketer: false, operator: false, investor: false },
  { module: 'Reportes financieros', admin: true,  broker: true,  realtor: false, marketer: false, operator: false, investor: true },
];

const ROLES: Role[] = ['admin', 'broker', 'realtor', 'marketer', 'operator', 'investor'];

export default function Users() {
  const [filter, setFilter] = useState<Role | 'all'>('all');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    let r = TEAM;
    if (filter !== 'all') r = r.filter((u) => u.role === filter);
    if (query) {
      const q = query.toLowerCase();
      r = r.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.city.toLowerCase().includes(q));
    }
    return r;
  }, [filter, query]);

  const counts = useMemo(() => {
    const m: Record<Role, number> = { admin: 0, broker: 0, realtor: 0, marketer: 0, operator: 0, investor: 0 };
    TEAM.forEach((u) => (m[u.role] += 1));
    return m;
  }, []);

  return (
    <>
      <Topbar
        title="Equipo y permisos"
        subtitle={`${num(TEAM.length)} usuarios · 6 roles · 5 equipos`}
        actions={
          <button className="h-8 px-3 inline-flex items-center gap-1.5 text-[12px] text-ink-deep font-medium bg-gold rounded-md">
            <Plus size={13} strokeWidth={2.5} /> Invitar usuario
          </button>
        }
      />

      <div className="px-6 py-5 space-y-5">
        {/* Role counts */}
        <div className="grid grid-cols-6 gap-2">
          {ROLES.map((r) => (
            <button
              key={r}
              onClick={() => setFilter(r)}
              className={cn(
                'rounded-lg p-3 text-left transition ring-1',
                filter === r ? 'bg-gold/10 ring-gold/30' : 'bg-white/[0.02] ring-white/5 hover:ring-white/15',
              )}
            >
              <div className="font-display text-2xl text-paper">{counts[r]}</div>
              <div className="text-[11px] text-paper-dim mt-0.5">{ROLE_LABELS[r]}</div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {/* Users table */}
          <div className="xl:col-span-2 rounded-lg ring-1 ring-white/5 overflow-hidden">
            <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
              <div className="relative flex-1">
                <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-paper-dim" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar miembro…"
                  className="h-8 w-full pl-8 pr-3 bg-white/[0.02] ring-1 ring-white/10 focus:ring-gold/40 outline-none rounded-md text-[12.5px] text-paper placeholder-paper-dim"
                />
              </div>
              <button
                onClick={() => setFilter('all')}
                className={cn(
                  'h-8 px-2.5 rounded-md text-[11.5px]',
                  filter === 'all' ? 'bg-gold/10 text-gold ring-1 ring-gold/30' : 'text-paper-dim hover:bg-white/5',
                )}
              >
                Todos
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-[12.5px]">
                <thead className="bg-white/[0.015] border-b border-white/5 text-paper-dim">
                  <tr className="text-left">
                    <th className="px-4 py-2 font-medium uppercase text-[10.5px] tracking-wider">Miembro</th>
                    <th className="px-2 py-2 font-medium uppercase text-[10.5px] tracking-wider">Rol</th>
                    <th className="px-2 py-2 font-medium uppercase text-[10.5px] tracking-wider">Equipo</th>
                    <th className="px-2 py-2 font-medium uppercase text-[10.5px] tracking-wider">Ciudad</th>
                    <th className="px-2 py-2 font-medium uppercase text-[10.5px] tracking-wider text-right">Deals</th>
                    <th className="px-2 py-2 font-medium uppercase text-[10.5px] tracking-wider text-right">Revenue</th>
                    <th className="px-2 py-2 font-medium uppercase text-[10.5px] tracking-wider">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.slice(0, 60).map((u) => (
                    <UserRow key={u.id} u={u} />
                  ))}
                </tbody>
              </table>
              {filtered.length > 60 && (
                <div className="px-4 py-3 text-[11px] text-paper-dim text-center border-t border-white/5">
                  {filtered.length - 60} más · usar búsqueda para encontrarlos
                </div>
              )}
            </div>
          </div>

          {/* Permissions matrix */}
          <div className="rounded-lg bg-white/[0.02] ring-1 ring-white/5 p-5">
            <h3 className="font-display text-base text-paper mb-1 inline-flex items-center gap-2">
              <Shield size={14} className="text-gold" /> Matriz de permisos
            </h3>
            <p className="text-[11px] text-paper-dim mb-4">Configurable por rol y por usuario</p>

            <div className="overflow-x-auto">
              <table className="w-full text-[11.5px]">
                <thead>
                  <tr className="text-paper-dim">
                    <th className="text-left py-1.5 font-medium"></th>
                    {ROLES.map((r) => (
                      <th key={r} className="text-center py-1.5 font-medium uppercase text-[9.5px] tracking-wider">
                        {ROLE_LABELS[r].slice(0, 4)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ROLE_PERMISSIONS.map((p) => (
                    <tr key={p.module} className="border-t border-white/5">
                      <td className="py-1.5 pr-2 text-paper-soft truncate">{p.module}</td>
                      {ROLES.map((r) => (
                        <td key={r} className="text-center py-1.5">
                          {p[r] ? (
                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold" />
                          ) : (
                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/10" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-5 pt-4 border-t border-white/5 space-y-2 text-[11.5px]">
              <div className="flex items-center gap-2 text-paper-soft">
                <Lock size={11} className="text-gold" /> SSO Google Workspace activo
              </div>
              <div className="flex items-center gap-2 text-paper-soft">
                <Eye size={11} className="text-gold" /> Auditoría completa por usuario y acción
              </div>
              <div className="flex items-center gap-2 text-paper-soft">
                <Mail size={11} className="text-gold" /> Invitaciones automáticas con MFA obligatorio
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function UserRow({ u }: { u: TeamMember }) {
  return (
    <tr className="border-b border-white/[0.04] hover:bg-white/[0.02]">
      <td className="px-4 py-2.5">
        <div className="flex items-center gap-2.5">
          <Avatar name={u.name} hue={u.avatarHue} size={28} />
          <div>
            <div className="text-paper">{u.name}</div>
            <div className="text-[11px] text-paper-dim">{u.email}</div>
          </div>
        </div>
      </td>
      <td className="px-2 py-2.5">
        <Pill tone={u.role === 'admin' || u.role === 'broker' ? 'gold' : 'neutral'} size="sm">
          {ROLE_LABELS[u.role]}
        </Pill>
      </td>
      <td className="px-2 py-2.5 text-paper-soft">{u.team}</td>
      <td className="px-2 py-2.5 text-paper-soft">{u.city}</td>
      <td className="px-2 py-2.5 text-right font-mono text-paper">{u.deals || '—'}</td>
      <td className="px-2 py-2.5 text-right font-mono text-paper-soft">
        {u.revenue > 0 ? usd(u.revenue, { compact: true }) : '—'}
      </td>
      <td className="px-2 py-2.5">
        <Pill
          tone={u.status === 'active' ? 'success' : u.status === 'invited' ? 'warning' : 'danger'}
          size="sm"
        >
          ● {u.status}
        </Pill>
      </td>
    </tr>
  );
}
