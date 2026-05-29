import { Topbar } from '../components/Topbar';
import { ChannelBadge } from '../components/ChannelBadge';
import { StatPill, Pill } from '../components/StatPill';
import { Avatar } from '../components/Avatar';
import { num, usd } from '../lib/format';
import {
  KPIS,
  LEADS_BY_CHANNEL,
  FUNNEL,
  REVENUE_TREND,
  TOP_PERFORMERS,
  RECENT_ACTIVITY,
} from '../data/kpis';
import { CHANNELS } from '../data/channels';
import {
  TrendingUp,
  Target,
  DollarSign,
  Clock,
  Sparkles,
  Building2,
  Activity,
} from 'lucide-react';

function StatCard({
  label,
  value,
  delta,
  hint,
  icon: Icon,
  invert,
}: {
  label: string;
  value: string;
  delta?: number;
  hint?: string;
  icon: typeof TrendingUp;
  invert?: boolean;
}) {
  return (
    <div className="rounded-lg bg-white/[0.02] ring-1 ring-white/5 p-4 hover:ring-white/10 transition">
      <div className="flex items-start justify-between">
        <div className="h-7 w-7 rounded-md bg-gold/10 text-gold grid place-items-center ring-1 ring-gold/20">
          <Icon size={14} strokeWidth={2} />
        </div>
        {delta !== undefined && <StatPill delta={delta} invert={invert} />}
      </div>
      <div className="mt-3 font-display text-2xl text-paper leading-none">{value}</div>
      <div className="mt-1.5 text-[11px] uppercase tracking-wider text-paper-dim">{label}</div>
      {hint && <div className="text-[11px] text-paper-soft/60 mt-1">{hint}</div>}
    </div>
  );
}

function FunnelBar({ stage, value, max }: { stage: string; value: number; max: number }) {
  const pct = (value / max) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between text-[12px] mb-1">
        <span className="text-paper-soft">{stage}</span>
        <span className="font-mono text-paper">{num(value)}</span>
      </div>
      <div className="h-2 bg-white/[0.03] rounded-sm overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-gold-deep via-gold to-gold-bright"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function RevenueChart() {
  const max = Math.max(...REVENUE_TREND.map((p) => p.revenue));
  return (
    <div className="relative h-44">
      <svg viewBox="0 0 700 180" className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="rev-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c9a55a" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#c9a55a" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3].map((i) => (
          <line
            key={i}
            x1="0"
            x2="700"
            y1={45 * (i + 1) - 10}
            y2={45 * (i + 1) - 10}
            stroke="#ffffff"
            strokeOpacity="0.04"
          />
        ))}
        {(() => {
          const pts = REVENUE_TREND.map((p, i) => {
            const x = (i / (REVENUE_TREND.length - 1)) * 700;
            const y = 170 - (p.revenue / max) * 150;
            return [x, y];
          });
          const line = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ');
          const area = `${line} L 700 180 L 0 180 Z`;
          return (
            <>
              <path d={area} fill="url(#rev-grad)" />
              <path d={line} stroke="#c9a55a" strokeWidth="2" fill="none" />
              {pts.map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="3.5" fill="#c9a55a" stroke="#050d1a" strokeWidth="2" />
              ))}
            </>
          );
        })()}
      </svg>
      <div className="absolute inset-x-0 bottom-0 flex justify-between text-[10px] text-paper-dim font-mono px-1">
        {REVENUE_TREND.map((p) => (
          <span key={p.month}>{p.month}</span>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const maxFunnel = Math.max(...FUNNEL.map((s) => s.value));
  const maxChannel = Math.max(...LEADS_BY_CHANNEL.map((c) => c.count));

  return (
    <>
      <Topbar
        title="Dashboard"
        subtitle="Vista ejecutiva — todo el ecosistema"
        actions={
          <div className="hidden md:flex gap-1">
            <Pill tone="success">● Sistemas operativos</Pill>
            <Pill tone="gold">{num(KPIS.hotLeads)} hot leads</Pill>
          </div>
        }
      />

      <div className="px-6 py-5 space-y-5">
        {/* KPI row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard
            label="Leads este mes"
            value={num(KPIS.leadsThisMonth)}
            delta={((KPIS.leadsThisMonth - KPIS.leadsLastMonth) / KPIS.leadsLastMonth) * 100}
            hint={`vs ${num(KPIS.leadsLastMonth)} mes anterior`}
            icon={Sparkles}
          />
          <StatCard
            label="Conversión a deal"
            value={`${KPIS.conversionRate}%`}
            delta={KPIS.conversionRate - KPIS.conversionLast}
            hint="Lead → Cerrado"
            icon={Target}
          />
          <StatCard
            label="Revenue MTD"
            value={usd(KPIS.revenueThisMonth, { compact: true })}
            delta={((KPIS.revenueThisMonth - KPIS.revenueLast) / KPIS.revenueLast) * 100}
            hint={`${KPIS.dealsClosed} deals cerrados`}
            icon={DollarSign}
          />
          <StatCard
            label="Tiempo de respuesta"
            value={`${KPIS.responseTimeSec}s`}
            delta={((KPIS.responseTimeSec - KPIS.responseTimeLast) / KPIS.responseTimeLast) * 100}
            hint="primer contacto"
            icon={Clock}
            invert
          />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="lg:col-span-2 rounded-lg bg-white/[0.02] ring-1 ring-white/5 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display text-base text-paper">Revenue & deals</h3>
                <p className="text-[11px] text-paper-dim">Últimos 7 meses · todo Florida</p>
              </div>
              <div className="flex gap-3">
                <div>
                  <div className="text-[10px] text-paper-dim uppercase">Promedio</div>
                  <div className="font-mono text-[13px] text-paper">{usd(26_200_000, { compact: true })}</div>
                </div>
                <div>
                  <div className="text-[10px] text-paper-dim uppercase">Mejor mes</div>
                  <div className="font-mono text-[13px] text-gold">{usd(38_400_000, { compact: true })}</div>
                </div>
              </div>
            </div>
            <RevenueChart />
          </div>

          <div className="rounded-lg bg-white/[0.02] ring-1 ring-white/5 p-5">
            <h3 className="font-display text-base text-paper mb-1">Funnel</h3>
            <p className="text-[11px] text-paper-dim mb-4">Visita → Cerrado · MTD</p>
            <div className="space-y-3">
              {FUNNEL.map((s) => (
                <FunnelBar key={s.stage} stage={s.stage} value={s.value} max={maxFunnel} />
              ))}
            </div>
          </div>
        </div>

        {/* Channels + Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="lg:col-span-2 rounded-lg bg-white/[0.02] ring-1 ring-white/5 p-5">
            <div className="flex items-baseline justify-between mb-4">
              <div>
                <h3 className="font-display text-base text-paper">Leads por canal</h3>
                <p className="text-[11px] text-paper-dim">Multicanal · 30 días</p>
              </div>
              <div className="text-[11px] text-paper-dim">
                CPL promedio <span className="font-mono text-paper">${KPIS.costPerLead}</span>
              </div>
            </div>
            <div className="space-y-2.5">
              {LEADS_BY_CHANNEL.map((row) => {
                const pct = (row.count / maxChannel) * 100;
                return (
                  <div key={row.channel} className="flex items-center gap-3">
                    <ChannelBadge channel={row.channel} size="sm" />
                    <div className="w-24 text-[12px] text-paper-soft">{CHANNELS[row.channel].label}</div>
                    <div className="flex-1 h-1.5 bg-white/[0.03] rounded-sm overflow-hidden">
                      <div
                        className="h-full rounded-sm"
                        style={{ width: `${pct}%`, background: CHANNELS[row.channel].color }}
                      />
                    </div>
                    <div className="w-14 text-right font-mono text-[12px] text-paper">{num(row.count)}</div>
                    <div className="w-16 text-right text-[11px] text-paper-dim font-mono">
                      {row.cpl > 0 ? `$${row.cpl} CPL` : 'orgánico'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-lg bg-white/[0.02] ring-1 ring-white/5 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-base text-paper inline-flex items-center gap-2">
                <Activity size={14} className="text-gold" /> Actividad en vivo
              </h3>
              <span className="text-[10px] text-success inline-flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> en vivo
              </span>
            </div>
            <div className="space-y-3">
              {RECENT_ACTIVITY.slice(0, 7).map((a) => (
                <div key={a.id} className="flex gap-3 text-[12px] leading-snug">
                  <div className="w-1 rounded-full bg-gradient-to-b from-gold to-transparent shrink-0" />
                  <div className="flex-1">
                    <div className="text-paper-soft">{a.text}</div>
                    <div className="text-[10.5px] text-paper-dim mt-0.5 font-mono">hace {a.at}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performers + Properties stat */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="lg:col-span-2 rounded-lg bg-white/[0.02] ring-1 ring-white/5 p-5">
            <h3 className="font-display text-base text-paper mb-4">Top performers · mayo</h3>
            <div className="space-y-2.5">
              {TOP_PERFORMERS.map((p, i) => (
                <div key={p.userId} className="flex items-center gap-3 py-1.5">
                  <div className="text-[11px] font-mono text-paper-dim w-5">#{i + 1}</div>
                  <Avatar name={p.name} size={28} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] text-paper">{p.name}</div>
                    <div className="text-[11px] text-paper-dim">{p.deals} deals · {usd(p.revenue, { compact: true })}</div>
                  </div>
                  <div className="w-32 h-1 bg-white/[0.04] rounded">
                    <div
                      className="h-full bg-gold rounded"
                      style={{ width: `${(p.revenue / TOP_PERFORMERS[0].revenue) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-white/[0.02] ring-1 ring-white/5 p-5">
            <h3 className="font-display text-base text-paper inline-flex items-center gap-2 mb-4">
              <Building2 size={14} className="text-gold" /> Inventario
            </h3>
            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-[12px] text-paper-soft">Listings activos</span>
                <span className="font-mono text-paper">{KPIS.activeListings}</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-[12px] text-paper-soft">Citas agendadas</span>
                <span className="font-mono text-paper">{KPIS.appointments}</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-[12px] text-paper-soft">Ad spend MTD</span>
                <span className="font-mono text-paper">${num(KPIS.adSpend)}</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-[12px] text-paper-soft">Deal promedio</span>
                <span className="font-mono text-gold">{usd(KPIS.averageDealSize, { compact: true })}</span>
              </div>
              <div className="pt-3 border-t border-white/5 text-[11px] text-paper-dim">
                Distribución por condado: <span className="text-paper">Miami-Dade 42%</span> · Broward 18% · Palm Beach 11% · Orange 14% · resto 15%.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
