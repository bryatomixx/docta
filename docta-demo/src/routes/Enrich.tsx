import { useState, type FormEvent, type ReactNode } from 'react';
import { Topbar } from '../components/Topbar';
import { Pill } from '../components/StatPill';
import { usd, num } from '../lib/format';
import { MapPin, Sparkles, Bed, Bath, Square, Calendar } from 'lucide-react';

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
  financing: {
    loanAmount: number | null;
    lender: string | null;
    loanDate: string | null;
    loanType: string | null;
    termMonths: number | null;
    dueDate: string | null;
    estimatedEquity: number | null;
  } | null;
  owner: {
    name: string | null;
    secondName: string | null;
    corporate: boolean | null;
    absentee: boolean | null;
    mailingAddress: string | null;
  } | null;
};

type Offer = { basis: 'AVM'; avmValue: number; factor: number; value: number; low: number; high: number };
type OfferEmail = { subject: string; body: string };
type LeadResult = {
  record: Enriched;
  offer: Offer | null;
  email: OfferEmail | null;
  emailSent: boolean;
  leadSaved: boolean;
};
type Contact = { firstName: string; lastName: string; phone: string; email: string };

const FROM_EMAIL = 'abryan@latinprimefg.com';
const EXAMPLE = {
  contact: { firstName: 'María', lastName: 'López', phone: '305-555-0100', email: 'maria.lopez@example.com' },
  address: '4529 Winona Court, Denver, CO 80212',
};
const LOAN_TYPES: Record<string, string> = { CNV: 'Convencional', FHA: 'FHA', VA: 'VA', PRI: 'Privado', USDA: 'USDA' };

const inputCls =
  'h-10 w-full px-3 bg-white/[0.02] ring-1 ring-white/10 focus:ring-gold/40 outline-none rounded-md text-[13px] text-paper placeholder-paper-dim';

const fUsd = (n: number | null | undefined) => (n != null ? usd(n) : '—');
const fNum = (n: number | null | undefined) => (n != null ? num(n) : '—');

export default function Enrich() {
  const [contact, setContact] = useState<Contact>({ firstName: '', lastName: '', phone: '', email: '' });
  const [address, setAddress] = useState('');
  const [result, setResult] = useState<LeadResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof Contact>(k: K, v: string) {
    setContact((c) => ({ ...c, [k]: v }));
  }
  function useExample() {
    setContact(EXAMPLE.contact);
    setAddress(EXAMPLE.address);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (loading) return;
    if (!address.trim()) return setError('Falta la dirección de la propiedad.');
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contact.email.trim())) return setError('Correo del cliente inválido.');
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/offer', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ address: address.trim(), contact }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(
          res.status === 404
            ? 'Dirección no encontrada. Revisa el formato o prueba otra.'
            : (data?.error ?? `Error ${res.status} al generar la oferta.`),
        );
      } else {
        setResult(data as LeadResult);
      }
    } catch {
      setError('No se pudo conectar al endpoint local (/api/offer). ¿Está corriendo el dev server?');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Topbar
        title="Generar oferta"
        subtitle="Estimado de compra"
        actions={<Pill tone="gold" size="sm">En vivo</Pill>}
      />

      <div className="px-6 py-4 border-b border-white/5">
        <form onSubmit={onSubmit} className="flex flex-col gap-2.5 max-w-3xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input className={inputCls} placeholder="Nombre" aria-label="Nombre" value={contact.firstName} onChange={(e) => set('firstName', e.target.value)} />
            <input className={inputCls} placeholder="Apellido" aria-label="Apellido" value={contact.lastName} onChange={(e) => set('lastName', e.target.value)} />
            <input className={inputCls} placeholder="Teléfono" aria-label="Teléfono" value={contact.phone} onChange={(e) => set('phone', e.target.value)} />
            <input className={inputCls} type="email" placeholder="Correo del cliente" aria-label="Correo del cliente" value={contact.email} onChange={(e) => set('email', e.target.value)} />
          </div>
          <div className="relative">
            <MapPin size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-paper-dim" />
            <input className={`${inputCls} pl-9`} placeholder="Dirección de EE.UU. — calle, ciudad, estado, ZIP" aria-label="Dirección de la propiedad" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <button type="submit" disabled={loading} className="h-10 px-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-deep bg-gold hover:bg-gold-bright rounded-md transition disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? <span className="h-3.5 w-3.5 rounded-full border-2 border-ink-deep/40 border-t-ink-deep animate-spin" /> : <Sparkles size={14} strokeWidth={2.2} />}
              {loading ? 'Generando…' : 'Generar oferta'}
            </button>
            <button type="button" onClick={useExample} className="h-10 px-3 inline-flex items-center text-[12px] text-paper-soft hover:text-paper hover:bg-white/5 rounded-md ring-1 ring-white/10 transition">
              Usar ejemplo
            </button>
          </div>
        </form>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5">
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} />
        ) : result ? (
          <ResultView data={result} clientEmail={contact.email} />
        ) : (
          <EmptyState onUseExample={useExample} />
        )}
      </div>
    </>
  );
}

function LoadingState() {
  return (
    <div className="h-full min-h-[40vh] grid place-items-center">
      <div className="text-center">
        <span className="inline-block h-7 w-7 rounded-full border-2 border-gold/30 border-t-gold animate-spin" />
        <p className="mt-3 text-[12.5px] text-paper-dim">Generando el estimado…</p>
      </div>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="max-w-md mx-auto mt-6 rounded-lg ring-1 ring-danger/30 bg-danger/5 p-4 flex items-start gap-3">
      <span className="mt-1 h-2.5 w-2.5 rounded-full bg-danger shrink-0" />
      <div>
        <div className="text-[13px] text-paper font-medium">No se pudo generar la oferta</div>
        <div className="mt-1 text-[12px] text-paper-dim">{message}</div>
      </div>
    </div>
  );
}

function EmptyState({ onUseExample }: { onUseExample: () => void }) {
  return (
    <div className="h-full min-h-[50vh] grid place-items-center">
      <div className="text-center max-w-sm">
        <div className="mx-auto h-14 w-14 rounded-xl grid place-items-center bg-gold/10 ring-1 ring-gold/20 text-gold">
          <Sparkles size={22} strokeWidth={1.75} />
        </div>
        <h3 className="mt-4 text-lg text-paper">Genera una oferta</h3>
        <p className="mt-1.5 text-[12.5px] text-paper-dim leading-relaxed">
          Captura el lead y la dirección, y genera un estimado de compra preliminar.
        </p>
        <button onClick={onUseExample} className="mt-4 h-8 px-3 inline-flex items-center gap-1.5 text-[12px] text-gold hover:text-gold-bright rounded-md ring-1 ring-gold/30 bg-gold/5 transition">
          <MapPin size={12} /> Usar datos de ejemplo
        </button>
      </div>
    </div>
  );
}

function ResultView({ data, clientEmail }: { data: LeadResult; clientEmail: string }) {
  const { record, offer, email } = data;
  const c = record.characteristics;
  const f = record.financing;
  const o = record.owner;

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-4">
      {/* Offer hero */}
      {offer ? (
        <div className="rounded-lg ring-1 ring-gold/25 bg-gradient-to-br from-gold/[0.1] to-transparent p-5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-[11px] uppercase tracking-[0.16em] text-paper-dim">Oferta de compra en efectivo</span>
            <div className="flex gap-1.5">
              <Pill tone="gold" size="sm">{Math.round(offer.factor * 100)}% del AVM</Pill>
              <Pill tone="warning" size="sm">Preliminar · no vinculante</Pill>
            </div>
          </div>
          <div className="mt-2 font-display text-4xl text-paper">{usd(offer.value)}</div>
          <div className="mt-2 flex items-center gap-3 text-[12px] text-paper-dim flex-wrap">
            <span>Rango <span className="text-paper-soft font-mono">{usd(offer.low, { compact: true })} – {usd(offer.high, { compact: true })}</span></span>
            <span className="text-white/10">|</span>
            <span>AVM <span className="text-paper-soft font-mono">{usd(offer.avmValue)}</span></span>
            {f?.estimatedEquity != null && (
              <>
                <span className="text-white/10">|</span>
                <span>Equity estimado <span className="text-success font-mono">{usd(f.estimatedEquity)}</span></span>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-lg ring-1 ring-white/10 bg-white/[0.02] p-5 text-[13px] text-paper-dim">
          No hay valuación (AVM) para esta propiedad, así que no se generó oferta. Revisa la dirección.
        </div>
      )}

      {/* Two columns: LEFT = email that will be auto-sent · RIGHT = ALL property data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        {/* LEFT — Email */}
        <Section
          title="Email que se enviará automáticamente"
          badge={<Pill tone={data.emailSent ? 'success' : 'neutral'} size="sm">{data.emailSent ? 'Enviado' : 'Envío pendiente'}</Pill>}
        >
          {email ? (
            <>
              <div className="text-[11px] text-paper-dim">
                Para: <span className="text-paper-soft font-mono">{clientEmail}</span> · De: <span className="text-paper-soft font-mono">{FROM_EMAIL}</span>
              </div>
              <div className="mt-2 text-[13.5px] text-paper font-medium">{email.subject}</div>
              <div className="mt-1.5 text-[12.5px] text-paper-soft leading-relaxed whitespace-pre-line border-t border-white/5 pt-2.5">{email.body}</div>
            </>
          ) : (
            <div className="text-[12.5px] text-paper-dim">Sin oferta, no se generó email.</div>
          )}
        </Section>

        {/* RIGHT — ALL property data */}
        <Section title="Información de la propiedad">
          <div className="text-[13px] text-paper">{record.address.oneLine}</div>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            <IdPill label="ID" value={record.identifiers.attomId} />
            <IdPill label="FIPS" value={record.identifiers.fips} />
            <IdPill label="APN" value={record.identifiers.apn} />
          </div>

          <div className="mt-4 flex flex-col gap-4">
            {/* Owner */}
            <SubBlock title="Propietario">
              {o ? (
                <>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[13.5px] text-paper font-medium">{o.name}{o.secondName ? ` y ${o.secondName}` : ''}</span>
                    {o.absentee === true && <Pill tone="warning" size="sm">Dueño ausente</Pill>}
                    {o.absentee === false && <Pill tone="neutral" size="sm">Ocupado por dueño</Pill>}
                    {o.corporate === true && <Pill tone="info" size="sm">Corporativo</Pill>}
                  </div>
                  {o.mailingAddress && <div className="text-[11px] text-paper-dim">Correspondencia: {o.mailingAddress}</div>}
                </>
              ) : (
                <div className="text-[12.5px] text-paper-dim">Sin datos de propietario.</div>
              )}
            </SubBlock>

            {/* Financing */}
            <SubBlock title="Hipoteca y equity">
              {f && (f.loanAmount != null || f.lender) ? (
                <>
                  <KV label="Préstamo registrado" value={`${fUsd(f.loanAmount)}${f.loanDate ? ` · ${f.loanDate}` : ''}`} />
                  <KV label="Prestamista" value={f.lender ?? '—'} />
                  <KV label="Tipo / plazo" value={`${f.loanType ? (LOAN_TYPES[f.loanType] ?? f.loanType) : '—'}${f.termMonths ? ` · ${f.termMonths} meses (~${Math.round(f.termMonths / 12)} años)` : ''}`} />
                  <KV label="Vence" value={f.dueDate ?? '—'} />
                  <KV label="Equity estimado" value={f.estimatedEquity != null ? usd(f.estimatedEquity) : '—'} hint="AVM − préstamo registrado (estimado conservador)" strong />
                </>
              ) : (
                <div className="text-[12.5px] text-paper-dim">Sin hipoteca registrada (posible libre de gravamen).</div>
              )}
            </SubBlock>

            {/* Valuation */}
            <SubBlock title="Valuación (AVM)">
              <KV label="Valor estimado" value={record.valuation ? usd(record.valuation.avmValue) : '—'} strong />
              <KV label="Rango" value={record.valuation ? `${fUsd(record.valuation.avmLow)} – ${fUsd(record.valuation.avmHigh)}` : '—'} />
            </SubBlock>

            {/* Assessment */}
            <SubBlock title="Assessment / Impuestos">
              <KV label="Valor catastral" value={fUsd(record.assessment?.assessedValue)} />
              <KV label="Valor de mercado" value={fUsd(record.assessment?.marketValue)} />
              <KV label={`Impuesto ${record.assessment?.taxYear ?? ''}`.trim()} value={fUsd(record.assessment?.taxAmount)} />
            </SubBlock>

            {/* Characteristics */}
            <SubBlock title="Características">
              <div className="grid grid-cols-3 gap-2">
                <Mini icon={Bed} label="Rec." value={c.beds != null ? String(c.beds) : '—'} />
                <Mini icon={Bath} label="Baños" value={c.baths != null ? String(c.baths) : '—'} />
                <Mini icon={Square} label="Pies²" value={fNum(c.sqft)} />
                <Mini icon={Calendar} label="Año" value={c.yearBuilt != null ? String(c.yearBuilt) : '—'} />
                <Mini icon={Square} label="Lote ft²" value={fNum(c.lotSizeSqft)} />
              </div>
            </SubBlock>

            {/* Sale history */}
            <SubBlock title="Historial de ventas">
              {record.saleHistory.length > 0 ? (
                <ul className="flex flex-col divide-y divide-white/5">
                  {record.saleHistory.map((s, i) => (
                    <li key={i} className="flex items-center justify-between py-1.5 first:pt-0 last:pb-0 text-[12.5px]">
                      <span className="text-paper-soft font-mono">{s.saleDate ?? '—'}</span>
                      <span className="text-paper">{fUsd(s.saleAmount)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-[12.5px] text-paper-dim">Sin ventas registradas.</div>
              )}
            </SubBlock>
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, badge, children }: { title: string; badge?: ReactNode; children: ReactNode }) {
  return (
    <div className="rounded-lg ring-1 ring-white/5 bg-white/[0.02] p-4">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-[11px] uppercase tracking-[0.16em] text-paper-dim">{title}</span>
        {badge}
      </div>
      {children}
    </div>
  );
}

function SubBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <div className="text-[10.5px] uppercase tracking-wide text-paper-dim mb-2">{title}</div>
      <div className="flex flex-col gap-1.5">{children}</div>
    </div>
  );
}

function KV({ label, value, hint, strong }: { label: string; value: string; hint?: string; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-[12.5px]">
      <span className="text-paper-dim">
        {label}
        {hint && <span className="block text-[10px] text-paper-dim/70">{hint}</span>}
      </span>
      <span className={strong ? 'text-paper font-display text-base' : 'text-paper font-medium'}>{value}</span>
    </div>
  );
}

function Mini({ icon: Icon, label, value }: { icon: typeof Bed; label: string; value: string }) {
  return (
    <div className="rounded-md bg-white/[0.02] ring-1 ring-white/5 px-2.5 py-2">
      <div className="flex items-center gap-1 text-paper-dim text-[10px] uppercase tracking-wide">
        <Icon size={11} /> {label}
      </div>
      <div className="mt-0.5 font-display text-base text-paper">{value}</div>
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
