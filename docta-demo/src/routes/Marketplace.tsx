import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Topbar } from '../components/Topbar';
import { Pill } from '../components/StatPill';
import { PROPERTIES, type PropertyType, type PropertyStatus } from '../data/properties';
import { usd, num } from '../lib/format';
import { cn } from '../lib/cn';
import { Search, Filter, MapPin, Bed, Bath, Square, Heart, Eye, Flame } from 'lucide-react';

const TYPE_LABELS: Record<PropertyType, string> = {
  'single-family': 'Casa',
  condo: 'Condo',
  townhome: 'Townhome',
  'multi-family': 'Multifamiliar',
  land: 'Terreno',
  commercial: 'Comercial',
};

const STATUS_TONES: Record<PropertyStatus, 'success' | 'warning' | 'info' | 'neutral' | 'gold'> = {
  active: 'success',
  pending: 'warning',
  sold: 'neutral',
  'off-market': 'neutral',
  rented: 'info',
};

const STATUS_LABELS: Record<PropertyStatus, string> = {
  active: 'Activa',
  pending: 'Pendiente',
  sold: 'Vendida',
  'off-market': 'Off-market',
  rented: 'Rentada',
};

export default function Marketplace() {
  const [query, setQuery] = useState('');
  const [type, setType] = useState<PropertyType | 'all'>('all');
  const [priceMax, setPriceMax] = useState<number>(0);

  const filtered = useMemo(() => {
    let r = PROPERTIES;
    if (type !== 'all') r = r.filter((p) => p.type === type);
    if (priceMax > 0) r = r.filter((p) => p.price <= priceMax);
    if (query) {
      const q = query.toLowerCase();
      r = r.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.mls.toLowerCase().includes(q) ||
          p.zip.includes(q),
      );
    }
    return r;
  }, [query, type, priceMax]);

  return (
    <>
      <Topbar
        title="Marketplace"
        subtitle={`${num(filtered.length)} propiedades · ${num(PROPERTIES.filter(p => p.status === 'active').length)} activas`}
        actions={
          <button className="h-8 px-2.5 inline-flex items-center gap-1.5 text-[12px] text-gold hover:text-gold-bright rounded-md ring-1 ring-gold/30 bg-gold/5">
            + Nueva propiedad
          </button>
        }
      />

      <div className="px-6 py-4 border-b border-white/5 flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-paper-dim" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Título, ciudad, MLS, ZIP…"
            className="h-8 w-80 pl-8 pr-3 bg-white/[0.02] ring-1 ring-white/10 focus:ring-gold/40 outline-none rounded-md text-[12.5px] text-paper placeholder-paper-dim"
          />
        </div>
        <div className="flex gap-1 ml-2">
          {(['all', 'single-family', 'condo', 'townhome', 'multi-family', 'land', 'commercial'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={cn(
                'h-7 px-2.5 rounded-md text-[11.5px] transition capitalize',
                type === t ? 'bg-gold/10 text-gold ring-1 ring-gold/30' : 'text-paper-dim hover:bg-white/5 hover:text-paper',
              )}
            >
              {t === 'all' ? 'Todo' : TYPE_LABELS[t]}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2 text-[11.5px]">
          <span className="text-paper-dim">Precio máx</span>
          <select
            value={priceMax}
            onChange={(e) => setPriceMax(+e.target.value)}
            className="h-7 px-2 bg-white/[0.02] ring-1 ring-white/10 rounded-md text-paper outline-none"
          >
            <option value={0}>Cualquiera</option>
            <option value={500_000}>$500k</option>
            <option value={1_000_000}>$1M</option>
            <option value={2_000_000}>$2M</option>
            <option value={5_000_000}>$5M</option>
          </select>
          <button className="h-7 px-2.5 inline-flex items-center gap-1.5 text-paper-soft hover:text-paper hover:bg-white/5 rounded-md ring-1 ring-white/10">
            <Filter size={11} /> Más
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((p) => (
            <Link
              key={p.id}
              to={`/marketplace/${p.id}`}
              className="group rounded-lg overflow-hidden ring-1 ring-white/5 bg-white/[0.02] hover:ring-gold/30 transition flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-ink-soft">
                <img
                  src={p.image}
                  alt={p.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-deep/80 via-transparent" />
                <div className="absolute top-2 left-2 flex gap-1">
                  <Pill tone={STATUS_TONES[p.status]} size="sm">
                    ● {STATUS_LABELS[p.status]}
                  </Pill>
                  {p.hot && (
                    <Pill tone="gold" size="sm">
                      <Flame size={9} /> HOT
                    </Pill>
                  )}
                </div>
                <button className="absolute top-2 right-2 h-7 w-7 grid place-items-center rounded-md bg-ink-deep/60 text-paper-soft hover:text-gold backdrop-blur ring-1 ring-white/10">
                  <Heart size={12} />
                </button>
                <div className="absolute bottom-2 left-3 right-3 flex items-baseline justify-between">
                  <span className="font-display text-xl text-paper drop-shadow">{usd(p.price, { compact: true })}</span>
                  <span className="text-[10.5px] text-paper-dim font-mono">MLS {p.mls}</span>
                </div>
              </div>
              <div className="p-3 flex-1 flex flex-col gap-2">
                <h3 className="text-[13.5px] text-paper font-medium leading-snug line-clamp-1">{p.title}</h3>
                <div className="text-[11.5px] text-paper-dim flex items-center gap-1">
                  <MapPin size={10} /> {p.city}, {p.county}
                </div>
                <div className="flex items-center gap-3 text-[11.5px] text-paper-soft mt-auto pt-2 border-t border-white/5">
                  {p.beds > 0 && (
                    <span className="inline-flex items-center gap-1">
                      <Bed size={11} /> {p.beds}
                    </span>
                  )}
                  {p.baths > 0 && (
                    <span className="inline-flex items-center gap-1">
                      <Bath size={11} /> {p.baths}
                    </span>
                  )}
                  {p.sqft > 0 && (
                    <span className="inline-flex items-center gap-1">
                      <Square size={11} /> {num(p.sqft)}
                    </span>
                  )}
                  <span className="ml-auto inline-flex items-center gap-1 text-paper-dim font-mono">
                    <Eye size={11} /> {num(p.views, { compact: true })}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10.5px] text-paper-dim">
                  <span>{p.daysOnMarket} días en mercado</span>
                  <span>{p.leads} leads · {p.saves} saves</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
