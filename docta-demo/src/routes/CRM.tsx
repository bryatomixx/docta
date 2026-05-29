import { useMemo } from 'react';
import { Topbar } from '../components/Topbar';
import { Pill } from '../components/StatPill';
import { Avatar } from '../components/Avatar';
import { ChannelBadge } from '../components/ChannelBadge';
import { LEADS, LEAD_STAGE_LABELS, type Lead, type LeadStage } from '../data/leads';
import { TEAM } from '../data/users';
import { num, usd } from '../lib/format';
import { Plus, MoreHorizontal, Filter, LayoutGrid, List } from 'lucide-react';

const STAGES: LeadStage[] = ['nuevo', 'contactado', 'calificado', 'visita', 'oferta', 'cerrado'];

export default function CRM() {
  const usersById = useMemo(() => Object.fromEntries(TEAM.map((u) => [u.id, u])), []);
  const byStage = useMemo(() => {
    const map: Record<LeadStage, Lead[]> = { nuevo: [], contactado: [], calificado: [], visita: [], oferta: [], cerrado: [], perdido: [] };
    LEADS.forEach((l) => map[l.stage].push(l));
    Object.values(map).forEach((arr) => arr.sort((a, b) => b.score - a.score));
    return map;
  }, []);

  const totalValue = useMemo(
    () => STAGES.reduce((s, st) => s + byStage[st].reduce((a, l) => a + l.budget, 0), 0),
    [byStage],
  );

  return (
    <>
      <Topbar
        title="Pipeline"
        subtitle={`${num(LEADS.length)} leads · ${usd(totalValue, { compact: true })} en pipeline`}
        actions={
          <div className="flex gap-1">
            <button className="h-8 px-2.5 inline-flex items-center gap-1.5 text-[12px] text-paper-soft hover:text-paper hover:bg-white/5 rounded-md ring-1 ring-white/5">
              <Filter size={12} /> Filtros
            </button>
            <div className="h-8 inline-flex items-center rounded-md ring-1 ring-white/5 overflow-hidden">
              <button className="h-8 w-8 grid place-items-center bg-white/5 text-gold">
                <LayoutGrid size={12} />
              </button>
              <button className="h-8 w-8 grid place-items-center text-paper-dim hover:text-paper">
                <List size={12} />
              </button>
            </div>
          </div>
        }
      />

      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-3 min-w-max px-6 py-5">
          {STAGES.map((stage) => {
            const items = byStage[stage];
            const value = items.reduce((s, l) => s + l.budget, 0);
            return (
              <div key={stage} className="w-[280px] shrink-0 flex flex-col">
                <div className="flex items-center gap-2 mb-3 px-1">
                  <span className={'h-1.5 w-1.5 rounded-full ' + stageColor(stage)} />
                  <span className="text-[12px] font-medium text-paper uppercase tracking-wider">
                    {LEAD_STAGE_LABELS[stage]}
                  </span>
                  <span className="text-[11px] text-paper-dim font-mono">{items.length}</span>
                  <button className="ml-auto h-6 w-6 grid place-items-center text-paper-dim hover:text-paper hover:bg-white/5 rounded">
                    <Plus size={12} />
                  </button>
                </div>
                <div className="text-[10.5px] text-paper-dim mb-2 px-1 font-mono">
                  {usd(value, { compact: true })} potencial
                </div>
                <div className="space-y-2 flex-1 max-h-[calc(100vh-260px)] overflow-y-auto pr-1">
                  {items.slice(0, 8).map((l) => (
                    <DealCard key={l.id} lead={l} ownerName={usersById[l.ownerId]?.name ?? 'N/A'} />
                  ))}
                  {items.length > 8 && (
                    <button className="w-full text-center text-[11px] text-paper-dim hover:text-gold py-2 border border-dashed border-white/5 rounded-md">
                      Ver {items.length - 8} más…
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

function stageColor(s: LeadStage): string {
  return {
    nuevo: 'bg-info',
    contactado: 'bg-warning',
    calificado: 'bg-gold',
    visita: 'bg-pink-400',
    oferta: 'bg-violet-400',
    cerrado: 'bg-success',
    perdido: 'bg-danger',
  }[s];
}

function DealCard({ lead, ownerName }: { lead: Lead; ownerName: string }) {
  return (
    <div className="rounded-md bg-white/[0.025] ring-1 ring-white/5 hover:ring-gold/30 p-3 cursor-grab transition group">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <div className="text-[12.5px] text-paper truncate">{lead.name}</div>
          <div className="text-[11px] text-paper-dim truncate">{lead.city}, FL · {lead.intent}</div>
        </div>
        <button className="h-5 w-5 grid place-items-center opacity-0 group-hover:opacity-100 text-paper-dim hover:text-paper">
          <MoreHorizontal size={12} />
        </button>
      </div>

      <div className="flex items-center gap-1.5 mb-2.5">
        <ChannelBadge channel={lead.source} size="sm" />
        <Pill tone={lead.temp === 'hot' ? 'danger' : lead.temp === 'warm' ? 'warning' : 'info'} size="sm">
          {lead.score}
        </Pill>
        {lead.campaign && <span className="text-[10px] text-paper-dim truncate flex-1">{lead.campaign}</span>}
      </div>

      <div className="flex items-baseline justify-between mb-2">
        <span className="font-mono text-[13px] text-gold">{usd(lead.budget, { compact: true })}</span>
        <span className="text-[10.5px] text-paper-dim">{lead.beds}br</span>
      </div>

      <div className="flex items-center gap-1.5 pt-2 border-t border-white/5">
        <Avatar name={ownerName} size={18} />
        <span className="text-[11px] text-paper-soft truncate flex-1">{ownerName.split(' ')[0]}</span>
        <span className="text-[10px] text-paper-dim font-mono">{new Date(lead.lastTouch).toLocaleDateString('es-US', { day: '2-digit', month: 'short' })}</span>
      </div>
    </div>
  );
}
