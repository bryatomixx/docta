import { useMemo, useState } from 'react';
import { Topbar } from '../components/Topbar';
import { ChannelBadge } from '../components/ChannelBadge';
import { Pill } from '../components/StatPill';
import { Avatar } from '../components/Avatar';
import { LEADS, LEAD_STAGE_LABELS, type LeadStage, type LeadTemp } from '../data/leads';
import { TEAM } from '../data/users';
import { usd, relativeTime } from '../lib/format';
import { cn } from '../lib/cn';
import { Search, Filter, Download, MoreHorizontal, Sparkles, ChevronDown, Star } from 'lucide-react';

const STAGE_FILTERS: { key: LeadStage | 'all'; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'nuevo', label: 'Nuevos' },
  { key: 'contactado', label: 'Contactados' },
  { key: 'calificado', label: 'Calificados' },
  { key: 'visita', label: 'Visita' },
  { key: 'oferta', label: 'Oferta' },
  { key: 'cerrado', label: 'Cerrados' },
];

const TEMP_TONES: Record<LeadTemp, 'danger' | 'warning' | 'info'> = { hot: 'danger', warm: 'warning', cold: 'info' };

export default function Leads() {
  const [stage, setStage] = useState<(typeof STAGE_FILTERS)[number]['key']>('all');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const usersById = useMemo(() => Object.fromEntries(TEAM.map((u) => [u.id, u])), []);

  const rows = useMemo(() => {
    let r = LEADS;
    if (stage !== 'all') r = r.filter((l) => l.stage === stage);
    if (query) {
      const q = query.toLowerCase();
      r = r.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q) ||
          l.phone.includes(q) ||
          l.city.toLowerCase().includes(q) ||
          (l.campaign?.toLowerCase().includes(q) ?? false),
      );
    }
    return r.sort((a, b) => b.score - a.score);
  }, [stage, query]);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <>
      <Topbar
        title="Leads"
        subtitle={`${rows.length} de ${LEADS.length}`}
        actions={
          <button className="h-8 px-2.5 inline-flex items-center gap-1.5 text-[12px] text-paper-soft hover:text-paper hover:bg-white/5 rounded-md ring-1 ring-white/5">
            <Download size={12} /> Exportar
          </button>
        }
      />

      <div className="px-6 py-4 border-b border-white/5 flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-paper-dim" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nombre, email, teléfono, ciudad…"
            className="h-8 w-72 pl-8 pr-3 bg-white/[0.02] ring-1 ring-white/10 focus:ring-gold/40 outline-none rounded-md text-[12.5px] text-paper placeholder-paper-dim"
          />
        </div>
        <div className="flex gap-1 ml-2">
          {STAGE_FILTERS.map((s) => (
            <button
              key={s.key}
              onClick={() => setStage(s.key)}
              className={cn(
                'h-7 px-2.5 rounded-md text-[11.5px] transition',
                stage === s.key ? 'bg-gold/10 text-gold ring-1 ring-gold/30' : 'text-paper-dim hover:bg-white/5 hover:text-paper',
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
        <button className="h-7 px-2.5 ml-auto inline-flex items-center gap-1.5 text-[11.5px] text-paper-soft hover:text-paper hover:bg-white/5 rounded-md ring-1 ring-white/10">
          <Filter size={11} /> Más filtros
        </button>
      </div>

      {selected.size > 0 && (
        <div className="px-6 py-2 border-b border-gold/20 bg-gold/5 text-[12px] flex items-center gap-3">
          <span className="text-gold font-medium">{selected.size} seleccionados</span>
          <button className="text-paper-soft hover:text-paper">Asignar →</button>
          <button className="text-paper-soft hover:text-paper">Agregar a campaña</button>
          <button className="text-paper-soft hover:text-paper">Cambiar etapa</button>
          <button className="text-paper-soft hover:text-paper">Exportar</button>
          <button className="ml-auto text-paper-dim hover:text-paper" onClick={() => setSelected(new Set())}>
            Limpiar
          </button>
        </div>
      )}

      <div className="flex-1 overflow-auto">
        <table className="w-full text-[12.5px]">
          <thead className="sticky top-0 bg-ink-deep/95 backdrop-blur border-b border-white/5 text-paper-dim">
            <tr className="text-left">
              <th className="px-4 py-2 w-8"></th>
              <th className="px-2 py-2 font-medium uppercase text-[10.5px] tracking-wider">Lead</th>
              <th className="px-2 py-2 font-medium uppercase text-[10.5px] tracking-wider">Canal</th>
              <th className="px-2 py-2 font-medium uppercase text-[10.5px] tracking-wider">Score</th>
              <th className="px-2 py-2 font-medium uppercase text-[10.5px] tracking-wider">Etapa</th>
              <th className="px-2 py-2 font-medium uppercase text-[10.5px] tracking-wider">Budget</th>
              <th className="px-2 py-2 font-medium uppercase text-[10.5px] tracking-wider">Ciudad</th>
              <th className="px-2 py-2 font-medium uppercase text-[10.5px] tracking-wider">Asignado</th>
              <th className="px-2 py-2 font-medium uppercase text-[10.5px] tracking-wider">Último contacto</th>
              <th className="px-4 py-2 w-8"></th>
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, 80).map((l) => {
              const owner = usersById[l.ownerId];
              const isSel = selected.has(l.id);
              return (
                <tr
                  key={l.id}
                  className={cn(
                    'border-b border-white/[0.04] hover:bg-white/[0.02] transition group',
                    isSel && 'bg-gold/5',
                  )}
                >
                  <td className="px-4 py-2.5">
                    <input
                      type="checkbox"
                      checked={isSel}
                      onChange={() => toggle(l.id)}
                      className="accent-gold"
                    />
                  </td>
                  <td className="px-2 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={l.name} size={28} />
                      <div className="min-w-0">
                        <div className="text-paper inline-flex items-center gap-1.5">
                          {l.name}
                          {l.temp === 'hot' && <Star size={11} className="text-gold fill-gold" />}
                        </div>
                        <div className="text-[11px] text-paper-dim truncate">{l.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-2.5">
                    <ChannelBadge channel={l.source} size="sm" />
                  </td>
                  <td className="px-2 py-2.5">
                    <Pill tone={TEMP_TONES[l.temp]} size="sm">
                      {l.score}
                    </Pill>
                  </td>
                  <td className="px-2 py-2.5">
                    <span className="text-paper-soft">{LEAD_STAGE_LABELS[l.stage]}</span>
                  </td>
                  <td className="px-2 py-2.5 font-mono text-paper">{usd(l.budget, { compact: true })}</td>
                  <td className="px-2 py-2.5 text-paper-soft">{l.city}</td>
                  <td className="px-2 py-2.5">
                    {owner && (
                      <div className="inline-flex items-center gap-1.5">
                        <Avatar name={owner.name} size={20} />
                        <span className="text-paper-soft">{owner.name.split(' ')[0]}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-2 py-2.5 text-paper-dim font-mono text-[11.5px]">
                    {relativeTime(new Date(l.lastTouch))}
                  </td>
                  <td className="px-4 py-2.5">
                    <button className="h-7 w-7 grid place-items-center text-paper-dim opacity-0 group-hover:opacity-100 hover:bg-white/5 rounded">
                      <MoreHorizontal size={13} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {rows.length > 80 && (
          <div className="px-6 py-4 text-[12px] text-paper-dim text-center">
            Mostrando 80 de {rows.length} resultados ·{' '}
            <button className="text-gold hover:text-gold-bright inline-flex items-center gap-0.5">
              Cargar más <ChevronDown size={11} />
            </button>
          </div>
        )}
      </div>

      <div className="border-t border-white/5 px-6 py-2 flex items-center gap-4 text-[11px] text-paper-dim">
        <span className="inline-flex items-center gap-1">
          <Sparkles size={11} className="text-gold" /> Modelo de scoring entrenado con {LEADS.length} leads — última actualización hace 12 min.
        </span>
      </div>
    </>
  );
}
