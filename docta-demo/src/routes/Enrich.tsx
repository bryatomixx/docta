import { useState, type FormEvent } from 'react';
import { Topbar } from '../components/Topbar';
import { Pill } from '../components/StatPill';
import { cn } from '../lib/cn';
import { usd, num } from '../lib/format';
import { MapPin, Sparkles, Search, Bed, Bath, Square, Calendar } from 'lucide-react';

/**
 * UI shape mirroring the backend `EnrichedProperty`
 * (supabase/functions/_shared/enrichment/types.ts). Kept local so the SPA
 * stays decoupled from the Deno/Supabase module.
 */
type Enriched = {
  identifiers: { attomId: string; fips: string | null; apn: string | null };
  address: { line1: string; line2: string; oneLine: string };
  characteristics: {
    beds: number | null;
    baths: number | null;
    sqft: number | null;
    yearBuilt: number | null;
    lotSizeSqft: number | null;
  };
  valuation: { avmValue: number; avmHigh: number | null; avmLow: number | null } | null;
  assessment: {
    assessedValue: number | null;
    marketValue: number | null;
    taxAmount: number | null;
    taxYear: number | null;
  } | null;
  saleHistory: Array<{ saleDate: string | null; saleAmount: number | null }>;
};

const SAMPLE: Enriched = {
  identifiers: { attomId: '145423', fips: '48453', apn: '0123456789' },
  address: { line1: '123 MAIN ST', line2: 'AUSTIN, TX 78701', oneLine: '123 MAIN ST, AUSTIN, TX 78701' },
  characteristics: { beds: 4, baths: 3, sqft: 2450, yearBuilt: 1998, lotSizeSqft: 10890 },
  valuation: { avmValue: 535000, avmHigh: 560000, avmLow: 510000 },
  assessment: { assessedValue: 410000, marketValue: 520000, taxAmount: 9800, taxYear: 2024 },
  saleHistory: [
    { saleDate: '2019-06-01', saleAmount: 480000 },
    { saleDate: '2012-03-15', saleAmount: 350000 },
  ],
};

const EXAMPLE_ADDRESS = '123 Main St, Austin, TX 78701';

export default function Enrich() {
  const [address, setAddress] = useState('');
  const [result, setResult] = useState<Enriched | null>(null);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const a = address.trim();
    if (!a) return;
    // Demo only: no network call yet. Show the sample record, echoing the
    // typed address so the card reflects the input.
    setResult({ ...SAMPLE, address: { ...SAMPLE.address, oneLine: a.toUpperCase() } });
  }

  return (
    <>
      <Topbar
        title="Enriquecer propiedad"
        subtitle="Datos de propiedad vía ATTOM"
        actions={<Pill tone="gold" size="sm">Demo · datos de ejemplo</Pill>}
      />

      {/* Search bar */}
      <div className="px-6 py-4 border-b border-white/5">
        <form onSubmit={onSubmit} className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[280px] max-w-2xl">
            <MapPin size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-paper-dim" />
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Dirección de EE.UU. — calle, ciudad, estado, ZIP"
              aria-label="Dirección de la propiedad"
              className="h-10 w-full pl-9 pr-3 bg-white/[0.02] ring-1 ring-white/10 focus:ring-gold/40 outline-none rounded-md text-[13px] text-paper placeholder-paper-dim"
            />
          </div>
          <button
            type="submit"
            className="h-10 px-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-deep bg-gold hover:bg-gold-bright rounded-md transition"
          >
            <Sparkles size={14} strokeWidth={2.2} /> Enriquecer
          </button>
          <button
            type="button"
            onClick={() => setAddress(EXAMPLE_ADDRESS)}
            className="h-10 px-3 inline-flex items-center gap-1.5 text-[12px] text-paper-soft hover:text-paper hover:bg-white/5 rounded-md ring-1 ring-white/10 transition"
          >
            Usar ejemplo
          </button>
        </form>
        <p className="mt-2 text-[11.5px] text-paper-dim">
          ATTOM busca por <span className="text-paper-soft">dirección</span> (no por link de listing). El resultado queda
          listo para que un agente de IA genere una primera oferta de compra.
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        {result ? <ResultView data={result} /> : <EmptyState onUseExample={() => setAddress(EXAMPLE_ADDRESS)} />}
      </div>
    </>
  );
}

function EmptyState({ onUseExample }: { onUseExample: () => void }) {
  return (
    <div className="h-full min-h-[50vh] grid place-items-center">
      <div className="text-center max-w-sm">
        <div className="mx-auto h-14 w-14 rounded-xl grid place-items-center bg-gold/10 ring-1 ring-gold/20 text-gold">
          <Search size={22} strokeWidth={1.75} />
        </div>
        <h3 className="mt-4 text-lg text-paper">Enriquece una propiedad</h3>
        <p className="mt-1.5 text-[12.5px] text-paper-dim leading-relaxed">
          Ingresa una dirección de EE.UU. y obtén identificadores ATTOM, características, valuación AVM, impuestos e
          historial de ventas.
        </p>
        <button
          onClick={onUseExample}
          className="mt-4 h-8 px-3 inline-flex items-center gap-1.5 text-[12px] text-gold hover:text-gold-bright rounded-md ring-1 ring-gold/30 bg-gold/5 transition"
        >
          <MapPin size={12} /> {EXAMPLE_ADDRESS}
        </button>
      </div>
    </div>
  );
}

function ResultView({ data }: { data: Enriched }) {
  const { identifiers, address, characteristics: c, valuation, assessment, saleHistory } = data;
  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-4">
      {/* Demo banner */}
      <div className="rounded-md bg-gold/5 ring-1 ring-gold/20 px-3.5 py-2.5 text-[11.5px] text-paper-soft flex items-start gap-2">
        <Sparkles size={13} className="text-gold mt-0.5 shrink-0" />
        <span>
          <span className="text-gold font-medium">UI de demostración.</span> Aún no llama a la API ATTOM real — estos
          son datos de ejemplo. Se cableará a la Edge Function <span className="font-mono text-paper">enrich-property</span>{' '}
          cuando haya credenciales de Supabase y ATTOM.
        </span>
      </div>

      {/* Address header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-paper-dim text-[11px] uppercase tracking-[0.16em]">
            <MapPin size={12} /> Propiedad
          </div>
          <h2 className="mt-1.5 font-display text-2xl text-paper leading-tight">{address.oneLine}</h2>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <IdPill label="ATTOM ID" value={identifiers.attomId} />
          <IdPill label="FIPS" value={identifiers.fips} />
          <IdPill label="APN" value={identifiers.apn} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: AVM + characteristics */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* AVM hero */}
          <div className="rounded-lg ring-1 ring-gold/20 bg-gradient-to-br from-gold/[0.07] to-transparent p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-[0.16em] text-paper-dim">Valuación estimada (AVM)</span>
              <Pill tone="gold" size="sm">ATTOM AVM</Pill>
            </div>
            {valuation ? (
              <>
                <div className="mt-2 font-display text-4xl text-paper">{usd(valuation.avmValue)}</div>
                <div className="mt-2 flex items-center gap-2 text-[12px] text-paper-dim">
                  <span>Rango</span>
                  <span className="text-paper-soft font-mono">
                    {valuation.avmLow != null ? usd(valuation.avmLow, { compact: true }) : '—'} ·{' '}
                    {valuation.avmHigh != null ? usd(valuation.avmHigh, { compact: true }) : '—'}
                  </span>
                </div>
              </>
            ) : (
              <div className="mt-2 text-paper-dim text-sm">Sin valuación disponible</div>
            )}
          </div>

          {/* Characteristics */}
          <div className="rounded-lg ring-1 ring-white/5 bg-white/[0.02] p-4">
            <div className="text-[11px] uppercase tracking-[0.16em] text-paper-dim mb-3">Características</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Stat icon={Bed} label="Recámaras" value={c.beds != null ? String(c.beds) : '—'} />
              <Stat icon={Bath} label="Baños" value={c.baths != null ? String(c.baths) : '—'} />
              <Stat icon={Square} label="Pies²" value={c.sqft != null ? num(c.sqft) : '—'} />
              <Stat icon={Calendar} label="Año const." value={c.yearBuilt != null ? String(c.yearBuilt) : '—'} />
              <Stat icon={Square} label="Lote (ft²)" value={c.lotSizeSqft != null ? num(c.lotSizeSqft) : '—'} />
            </div>
          </div>
        </div>

        {/* Right: assessment + sale history */}
        <div className="flex flex-col gap-4">
          <div className="rounded-lg ring-1 ring-white/5 bg-white/[0.02] p-4">
            <div className="text-[11px] uppercase tracking-[0.16em] text-paper-dim mb-3">Assessment / Impuestos</div>
            {assessment ? (
              <div className="flex flex-col gap-2.5">
                <Row label="Valor catastral" value={assessment.assessedValue != null ? usd(assessment.assessedValue) : '—'} />
                <Row label="Valor de mercado" value={assessment.marketValue != null ? usd(assessment.marketValue) : '—'} />
                <Row
                  label={`Impuesto ${assessment.taxYear ?? ''}`.trim()}
                  value={assessment.taxAmount != null ? usd(assessment.taxAmount) : '—'}
                />
              </div>
            ) : (
              <div className="text-paper-dim text-sm">Sin datos de assessment</div>
            )}
          </div>

          <div className="rounded-lg ring-1 ring-white/5 bg-white/[0.02] p-4">
            <div className="text-[11px] uppercase tracking-[0.16em] text-paper-dim mb-3">Historial de ventas</div>
            {saleHistory.length > 0 ? (
              <ul className="flex flex-col divide-y divide-white/5">
                {saleHistory.map((s, i) => (
                  <li key={i} className="flex items-center justify-between py-2 first:pt-0 last:pb-0">
                    <span className="text-[12px] text-paper-soft font-mono">{s.saleDate ?? '—'}</span>
                    <span className="text-[12.5px] text-paper">{s.saleAmount != null ? usd(s.saleAmount) : '—'}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-paper-dim text-sm">Sin ventas registradas</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Bed; label: string; value: string }) {
  return (
    <div className="rounded-md bg-white/[0.02] ring-1 ring-white/5 px-3 py-2.5">
      <div className="flex items-center gap-1.5 text-paper-dim text-[10.5px] uppercase tracking-wide">
        <Icon size={12} /> {label}
      </div>
      <div className="mt-1 font-display text-xl text-paper">{value}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-[12.5px]">
      <span className="text-paper-dim">{label}</span>
      <span className="text-paper font-medium">{value}</span>
    </div>
  );
}

function IdPill({ label, value }: { label: string; value: string | null }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md ring-1 ring-white/10 bg-white/[0.02] px-2 py-1">
      <span className="text-[9.5px] uppercase tracking-wider text-paper-dim">{label}</span>
      <span className="text-[11.5px] font-mono text-paper-soft">{value ?? '—'}</span>
    </span>
  );
}
