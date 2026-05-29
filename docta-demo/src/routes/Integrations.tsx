import { useState } from 'react';
import { Topbar } from '../components/Topbar';
import { Pill } from '../components/StatPill';
import { INTEGRATIONS, API_KEYS, WEBHOOKS } from '../data/integrations';
import { cn } from '../lib/cn';
import { Check, AlertTriangle, Plus, Copy, Key, Webhook, Settings2 } from 'lucide-react';

const CATEGORIES = ['Todas', 'Mensajería', 'Ads', 'CRM', 'MLS', 'Pagos', 'Firmas', 'Telefonía', 'Analytics'] as const;

export default function Integrations() {
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>('Todas');

  const filtered = INTEGRATIONS.filter((i) => cat === 'Todas' || i.category === cat.toLowerCase());

  return (
    <>
      <Topbar
        title="Integraciones & API"
        subtitle={`${INTEGRATIONS.filter((i) => i.status === 'connected').length} conectadas · API v1.4`}
        actions={
          <button className="h-8 px-3 inline-flex items-center gap-1.5 text-[12px] text-gold hover:text-gold-bright rounded-md ring-1 ring-gold/30 bg-gold/5">
            <Settings2 size={12} /> Documentación
          </button>
        }
      />

      <div className="px-6 py-5 space-y-6">
        {/* category filter */}
        <div className="flex flex-wrap gap-1">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={cn(
                'h-7 px-2.5 rounded-md text-[11.5px] transition',
                cat === c ? 'bg-gold/10 text-gold ring-1 ring-gold/30' : 'text-paper-dim hover:bg-white/5 hover:text-paper',
              )}
            >
              {c}
            </button>
          ))}
        </div>

        {/* integration grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((i) => (
            <div
              key={i.id}
              className={cn(
                'rounded-lg ring-1 p-4 transition',
                i.status === 'connected'
                  ? 'bg-white/[0.02] ring-white/5 hover:ring-gold/20'
                  : i.status === 'error'
                  ? 'bg-danger/5 ring-danger/20'
                  : 'bg-white/[0.015] ring-white/5',
              )}
            >
              <div className="flex items-start gap-3 mb-3">
                <div
                  className="h-10 w-10 rounded-md grid place-items-center font-bold text-[12px] shrink-0 text-white"
                  style={{ background: i.logoColor }}
                >
                  {i.logoText}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-paper text-[13.5px]">{i.name}</span>
                    {i.status === 'connected' && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-success">
                        <Check size={10} strokeWidth={3} />
                      </span>
                    )}
                    {i.status === 'error' && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-danger">
                        <AlertTriangle size={10} />
                      </span>
                    )}
                  </div>
                  <div className="text-[10.5px] text-paper-dim capitalize">{i.category}</div>
                </div>
              </div>

              <p className="text-[12px] text-paper-soft leading-snug mb-3 min-h-[34px]">{i.description}</p>

              {i.metrics && (
                <div className="grid grid-cols-2 gap-2 mb-3 pt-3 border-t border-white/5">
                  {i.metrics.map((m) => (
                    <div key={m.label}>
                      <div className="text-[10px] text-paper-dim uppercase">{m.label}</div>
                      <div className="font-mono text-paper text-[12.5px]">{m.value}</div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                <div className="text-[10.5px] text-paper-dim">
                  {i.status === 'connected' && i.syncedAt && `Sync ${i.syncedAt}`}
                  {i.status === 'error' && 'Token expirado'}
                  {i.status === 'available' && 'No conectado'}
                </div>
                {i.status === 'connected' ? (
                  <button className="text-[11px] text-paper-soft hover:text-gold">Configurar</button>
                ) : i.status === 'error' ? (
                  <button className="text-[11px] text-danger hover:text-danger/80">Reconectar</button>
                ) : (
                  <button className="text-[11px] text-gold hover:text-gold-bright inline-flex items-center gap-1">
                    <Plus size={10} /> Conectar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* API keys + Webhooks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-lg bg-white/[0.02] ring-1 ring-white/5 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-base text-paper inline-flex items-center gap-2">
                <Key size={14} className="text-gold" /> API Keys
              </h3>
              <button className="text-[11px] text-gold hover:text-gold-bright inline-flex items-center gap-1">
                <Plus size={11} /> Generar
              </button>
            </div>
            <div className="space-y-2">
              {API_KEYS.map((k) => (
                <div key={k.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                  <div className="flex-1 min-w-0">
                    <div className="text-[12.5px] text-paper">{k.label}</div>
                    <div className="text-[11px] text-paper-dim font-mono truncate">{k.key}</div>
                  </div>
                  <div className="text-[10.5px] text-paper-dim text-right">
                    <div>Creado {k.createdAt}</div>
                    <div className="font-mono">{k.lastUsed}</div>
                  </div>
                  <button className="h-7 w-7 grid place-items-center text-paper-dim hover:text-paper hover:bg-white/5 rounded">
                    <Copy size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-white/[0.02] ring-1 ring-white/5 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-base text-paper inline-flex items-center gap-2">
                <Webhook size={14} className="text-gold" /> Webhooks · últimos eventos
              </h3>
              <span className="text-[10.5px] text-success inline-flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> en vivo
              </span>
            </div>
            <div className="space-y-1.5">
              {WEBHOOKS.map((w) => (
                <div key={w.id} className="grid grid-cols-[18px_1fr_60px_60px] gap-3 items-center text-[11.5px] py-1">
                  <Pill tone={w.status === 200 ? 'success' : 'danger'} size="sm">
                    {w.status}
                  </Pill>
                  <span className="font-mono text-paper-soft truncate">{w.event}</span>
                  <span className="font-mono text-paper-dim text-right">{w.latency}ms</span>
                  <span className="font-mono text-paper-dim text-right">{w.at}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-paper-dim">
              POST <span className="font-mono text-paper-soft">https://api.docta.us/v1/webhooks</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
