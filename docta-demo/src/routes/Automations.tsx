import { useState } from 'react';
import { Topbar } from '../components/Topbar';
import { ChannelBadge } from '../components/ChannelBadge';
import { Pill } from '../components/StatPill';
import { CAMPAIGNS, FLOWS, type Campaign } from '../data/campaigns';
import { num, usd, pct } from '../lib/format';
import { cn } from '../lib/cn';
import {
  Zap,
  Plus,
  Play,
  Pause,
  Edit3,
  Copy,
  TrendingUp,
  Mail,
  MessageCircle,
  MessageSquare,
  Phone,
  Megaphone,
  Search as SearchIcon,
  Globe,
  Clock,
  GitBranch,
} from 'lucide-react';
import type { ChannelKey } from '../data/channels';

const TABS = ['Campañas', 'Flows'] as const;

export default function Automations() {
  const [tab, setTab] = useState<(typeof TABS)[number]>('Campañas');

  const liveCount = CAMPAIGNS.filter((c) => c.status === 'live').length;
  const totalLeads = CAMPAIGNS.reduce((s, c) => s + c.leads, 0);
  const totalRevenue = CAMPAIGNS.reduce((s, c) => s + c.revenue, 0);
  const totalSpend = CAMPAIGNS.reduce((s, c) => s + c.spend, 0);

  return (
    <>
      <Topbar
        title="Automatizaciones"
        subtitle="Campañas en frío · flows · drip · IA copywriter"
        actions={
          <button className="h-8 px-3 inline-flex items-center gap-1.5 text-[12px] text-ink-deep font-medium bg-gold rounded-md">
            <Plus size={13} strokeWidth={2.5} /> Nueva
          </button>
        }
      />

      <div className="px-6 py-5 space-y-5">
        {/* Stats overview */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Campañas en vivo', value: liveCount, icon: Zap, tone: 'success' as const },
            { label: 'Leads MTD', value: num(totalLeads), icon: TrendingUp, tone: 'gold' as const },
            { label: 'Revenue atribuido', value: usd(totalRevenue, { compact: true }), icon: TrendingUp, tone: 'gold' as const },
            { label: 'ROAS combinado', value: `${(totalRevenue / totalSpend).toFixed(0)}x`, icon: TrendingUp, tone: 'success' as const },
          ].map((s) => (
            <div key={s.label} className="rounded-lg bg-white/[0.02] ring-1 ring-white/5 p-4">
              <s.icon size={14} className={cn('mb-2', s.tone === 'success' ? 'text-success' : 'text-gold')} />
              <div className="font-display text-xl text-paper">{s.value}</div>
              <div className="text-[11px] text-paper-dim mt-0.5 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="border-b border-white/5 flex gap-4">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'pb-2.5 text-[13px] border-b-2 transition',
                tab === t ? 'text-gold border-gold' : 'text-paper-dim border-transparent hover:text-paper',
              )}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === 'Campañas' ? <CampaignsTable /> : <FlowsView />}
      </div>
    </>
  );
}

function CampaignsTable() {
  return (
    <div className="rounded-lg ring-1 ring-white/5 overflow-hidden">
      <table className="w-full text-[12.5px]">
        <thead className="bg-white/[0.02] border-b border-white/5 text-paper-dim">
          <tr className="text-left">
            <th className="px-4 py-2.5 font-medium uppercase text-[10.5px] tracking-wider">Campaña</th>
            <th className="px-4 py-2.5 font-medium uppercase text-[10.5px] tracking-wider">Canales</th>
            <th className="px-4 py-2.5 font-medium uppercase text-[10.5px] tracking-wider">Audiencia</th>
            <th className="px-4 py-2.5 font-medium uppercase text-[10.5px] tracking-wider text-right">Delivery</th>
            <th className="px-4 py-2.5 font-medium uppercase text-[10.5px] tracking-wider text-right">Leads</th>
            <th className="px-4 py-2.5 font-medium uppercase text-[10.5px] tracking-wider text-right">Deals</th>
            <th className="px-4 py-2.5 font-medium uppercase text-[10.5px] tracking-wider text-right">Revenue</th>
            <th className="px-4 py-2.5 font-medium uppercase text-[10.5px] tracking-wider text-right">ROAS</th>
            <th className="px-4 py-2.5"></th>
          </tr>
        </thead>
        <tbody>
          {CAMPAIGNS.map((c) => (
            <CampaignRow key={c.id} c={c} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CampaignRow({ c }: { c: Campaign }) {
  const delivery = c.sent > 0 ? (c.delivered / c.sent) * 100 : 0;
  const roas = c.spend > 0 ? c.revenue / c.spend : 0;
  const statusTone =
    c.status === 'live' ? 'success' : c.status === 'paused' ? 'warning' : c.status === 'draft' ? 'neutral' : 'info';

  return (
    <tr className="border-b border-white/[0.04] hover:bg-white/[0.02] transition group">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-md bg-gold/10 text-gold grid place-items-center ring-1 ring-gold/20">
            <Zap size={13} />
          </div>
          <div>
            <div className="text-paper inline-flex items-center gap-2">
              {c.name}
              <Pill tone={statusTone} size="sm">
                ● {c.status}
              </Pill>
            </div>
            <div className="text-[11px] text-paper-dim">desde {c.startedAt}</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-1">
          {c.channels.map((ch) => (
            <ChannelBadge key={ch} channel={ch} size="sm" />
          ))}
        </div>
      </td>
      <td className="px-4 py-3 text-paper-soft">
        <div className="text-[12.5px]">{c.audience}</div>
        <div className="text-[10.5px] text-paper-dim font-mono">{num(c.audienceSize)} contactos</div>
      </td>
      <td className="px-4 py-3 text-right font-mono">
        {c.status === 'draft' ? (
          <span className="text-paper-dim">—</span>
        ) : (
          <>
            <div className="text-paper">{pct(delivery, 1)}</div>
            <div className="text-[10.5px] text-paper-dim">{num(c.delivered)} entregados</div>
          </>
        )}
      </td>
      <td className="px-4 py-3 text-right font-mono">
        <div className="text-paper">{num(c.leads)}</div>
        <div className="text-[10.5px] text-paper-dim">{c.appointments} citas</div>
      </td>
      <td className="px-4 py-3 text-right font-mono">
        <div className="text-paper">{c.deals}</div>
      </td>
      <td className="px-4 py-3 text-right font-mono text-gold">
        {usd(c.revenue, { compact: true })}
      </td>
      <td className="px-4 py-3 text-right">
        {roas > 0 ? (
          <Pill tone={roas > 100 ? 'success' : roas > 30 ? 'gold' : 'warning'} size="sm">
            {roas.toFixed(0)}x
          </Pill>
        ) : (
          <span className="text-paper-dim">—</span>
        )}
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
          <button className="h-7 w-7 grid place-items-center text-paper-dim hover:text-paper hover:bg-white/5 rounded">
            {c.status === 'paused' ? <Play size={12} /> : <Pause size={12} />}
          </button>
          <button className="h-7 w-7 grid place-items-center text-paper-dim hover:text-paper hover:bg-white/5 rounded">
            <Edit3 size={12} />
          </button>
          <button className="h-7 w-7 grid place-items-center text-paper-dim hover:text-paper hover:bg-white/5 rounded">
            <Copy size={12} />
          </button>
        </div>
      </td>
    </tr>
  );
}

const STEP_ICON: Record<string, typeof Mail> = {
  email: Mail,
  whatsapp: MessageCircle,
  sms: MessageSquare,
  call: Phone,
  web: Globe,
  'meta-ads': Megaphone,
  'google-ads': SearchIcon,
  wait: Clock,
  condition: GitBranch,
};

function FlowsView() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {FLOWS.map((f) => (
        <div key={f.id} className="rounded-lg bg-white/[0.02] ring-1 ring-white/5 p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="h-9 w-9 rounded-md bg-gold/10 text-gold grid place-items-center ring-1 ring-gold/20 shrink-0">
              <GitBranch size={15} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-[14px] text-paper">{f.name}</h3>
                <Pill tone={f.status === 'active' ? 'success' : 'warning'} size="sm">
                  ● {f.status}
                </Pill>
              </div>
              <div className="text-[11.5px] text-paper-dim">Trigger: {f.trigger}</div>
            </div>
            <button className="text-[11px] text-paper-dim hover:text-gold">Editar</button>
          </div>

          <ol className="relative">
            {f.steps.map((s, i) => {
              const Icon = STEP_ICON[s.kind] ?? Mail;
              const isWait = s.kind === 'wait';
              const isCond = s.kind === 'condition';
              return (
                <li key={i} className="flex gap-3 pb-3 last:pb-0 relative">
                  {i < f.steps.length - 1 && (
                    <span className="absolute left-3 top-7 bottom-0 w-px bg-white/10" />
                  )}
                  <span
                    className={cn(
                      'h-6 w-6 rounded-md grid place-items-center text-[10px] shrink-0 ring-1 z-[1]',
                      isWait
                        ? 'bg-white/5 text-paper-dim ring-white/10'
                        : isCond
                        ? 'bg-violet-500/10 text-violet-400 ring-violet-500/20'
                        : 'bg-gold/10 text-gold ring-gold/20',
                    )}
                  >
                    <Icon size={11} />
                  </span>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className={cn('text-[12.5px]', isWait ? 'text-paper-dim italic' : 'text-paper-soft')}>
                      {s.label}
                    </div>
                    {s.delay && <div className="text-[10.5px] text-paper-dim font-mono">{s.delay}</div>}
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/5">
            <div>
              <div className="text-[10.5px] text-paper-dim uppercase">Inscritos</div>
              <div className="font-mono text-paper">{num(f.enrolled)}</div>
            </div>
            <div>
              <div className="text-[10.5px] text-paper-dim uppercase">Completados</div>
              <div className="font-mono text-paper">{num(f.completed)}</div>
            </div>
            <div>
              <div className="text-[10.5px] text-paper-dim uppercase">Conversión</div>
              <div className="font-mono text-gold">{pct(f.conversion, 1)}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ChannelKeyTypeAvoidUnused(_k: ChannelKey) { return _k; }
ChannelKeyTypeAvoidUnused;
