import { Link, useParams } from 'react-router-dom';
import { Topbar } from '../components/Topbar';
import { Pill } from '../components/StatPill';
import { Avatar } from '../components/Avatar';
import { PROPERTIES } from '../data/properties';
import { TEAM } from '../data/users';
import { LEADS } from '../data/leads';
import { usd, num } from '../lib/format';
import {
  ArrowLeft,
  Bed,
  Bath,
  Square,
  MapPin,
  Calendar,
  Eye,
  Heart,
  Share2,
  MessageCircle,
  Sparkles,
  TrendingUp,
  Flame,
} from 'lucide-react';

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const property = PROPERTIES.find((p) => p.id === id);
  if (!property) {
    return (
      <div className="p-8">
        <Link to="/marketplace" className="text-gold">← Volver al marketplace</Link>
        <p className="text-paper-dim mt-4">Propiedad no encontrada.</p>
      </div>
    );
  }
  const agent = TEAM.find((u) => u.id === property.agentId) ?? TEAM[0];
  const relatedLeads = LEADS.filter((l) => l.propertyId === property.id).slice(0, 4);

  return (
    <>
      <Topbar
        title={property.title}
        subtitle={`MLS ${property.mls} · ${property.city}, FL`}
        actions={
          <div className="flex gap-1">
            <button className="h-8 w-8 grid place-items-center text-paper-soft hover:bg-white/5 rounded-md ring-1 ring-white/5"><Heart size={13} /></button>
            <button className="h-8 w-8 grid place-items-center text-paper-soft hover:bg-white/5 rounded-md ring-1 ring-white/5"><Share2 size={13} /></button>
            <button className="h-8 px-3 inline-flex items-center gap-1.5 text-[12px] text-ink-deep font-medium bg-gold rounded-md">
              <Calendar size={12} /> Agendar visita
            </button>
          </div>
        }
      />

      <div className="px-6 py-5 max-w-[1400px] mx-auto">
        <Link to="/marketplace" className="text-[12px] text-paper-dim hover:text-gold inline-flex items-center gap-1 mb-3">
          <ArrowLeft size={12} /> Marketplace
        </Link>

        {/* Gallery */}
        <div className="grid grid-cols-4 gap-2 rounded-lg overflow-hidden mb-5">
          <div className="col-span-2 row-span-2 aspect-square">
            <img src={property.image} alt="" className="w-full h-full object-cover" />
          </div>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-square overflow-hidden">
              <img
                src={property.gallery[i % property.gallery.length]}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* MAIN */}
          <div className="lg:col-span-2 space-y-5">
            <div>
              <div className="flex items-baseline gap-3 mb-2">
                <span className="font-display text-4xl text-paper">{usd(property.price)}</span>
                {property.hot && (
                  <Pill tone="gold" size="sm">
                    <Flame size={10} /> HOT — 12 leads esta semana
                  </Pill>
                )}
              </div>
              <h2 className="font-display text-2xl text-paper mb-1">{property.title}</h2>
              <div className="text-[13px] text-paper-dim inline-flex items-center gap-1.5">
                <MapPin size={12} /> {property.address}, {property.city}, FL {property.zip}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {[
                { icon: Bed,    label: 'Dormitorios', value: property.beds },
                { icon: Bath,   label: 'Baños',        value: property.baths },
                { icon: Square, label: 'sqft',         value: num(property.sqft) },
                { icon: Calendar, label: 'Año',        value: property.yearBuilt },
              ].map((s) => (
                <div key={s.label} className="rounded-md bg-white/[0.02] ring-1 ring-white/5 p-3">
                  <s.icon size={14} className="text-gold mb-2" />
                  <div className="font-display text-lg text-paper leading-none">{s.value}</div>
                  <div className="text-[10.5px] uppercase tracking-wider text-paper-dim mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            <section className="rounded-lg bg-white/[0.02] ring-1 ring-white/5 p-5">
              <h3 className="font-display text-lg text-paper mb-2">Descripción</h3>
              <p className="text-[13px] text-paper-soft leading-relaxed">
                Propiedad excepcional en {property.city}, una de las zonas más demandadas de
                Florida. {property.beds > 0 && `Distribuida en ${property.beds} habitaciones y ${property.baths} baños, `}
                ofrece {num(property.sqft)} sqft de espacio cuidadosamente diseñado. Construida en
                {' '}{property.yearBuilt}, combina arquitectura clásica con acabados contemporáneos. Ideal para
                {property.type === 'multi-family' || property.type === 'commercial' ? ' inversionistas que buscan flujo de caja inmediato' : ' familias o ejecutivos que valoran ubicación, seguridad y calidad de vida'}.
              </p>
            </section>

            <section className="rounded-lg bg-white/[0.02] ring-1 ring-white/5 p-5">
              <h3 className="font-display text-lg text-paper mb-3">Características destacadas</h3>
              <div className="grid grid-cols-2 gap-2">
                {[...property.features, 'A/C central', 'Garage cubierto', 'Internet fibra', 'Smoke detectors', 'Hurricane impact windows'].map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-[12.5px] text-paper-soft">
                    <span className="h-1 w-1 bg-gold rounded-full" /> {f}
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-lg bg-white/[0.02] ring-1 ring-white/5 p-5">
              <h3 className="font-display text-lg text-paper mb-3">Performance del listing</h3>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <div className="font-display text-xl text-paper">{num(property.views)}</div>
                  <div className="text-[11px] text-paper-dim">Vistas totales</div>
                </div>
                <div>
                  <div className="font-display text-xl text-paper">{property.saves}</div>
                  <div className="text-[11px] text-paper-dim">Guardadas</div>
                </div>
                <div>
                  <div className="font-display text-xl text-gold">{property.leads}</div>
                  <div className="text-[11px] text-paper-dim">Leads generados</div>
                </div>
                <div>
                  <div className="font-display text-xl text-paper">{property.daysOnMarket}</div>
                  <div className="text-[11px] text-paper-dim">Días en mercado</div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 text-[12px] text-paper-soft">
                <TrendingUp size={12} className="text-success" />
                Esta propiedad está performando <span className="text-success">+38% sobre el promedio</span> de su zona y rango de precio.
              </div>
            </section>

            {relatedLeads.length > 0 && (
              <section className="rounded-lg bg-white/[0.02] ring-1 ring-white/5 p-5">
                <h3 className="font-display text-lg text-paper mb-3">Leads interesados en esta propiedad</h3>
                <div className="space-y-2">
                  {relatedLeads.map((l) => (
                    <div key={l.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                      <Avatar name={l.name} size={28} />
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] text-paper">{l.name}</div>
                        <div className="text-[11px] text-paper-dim">Score {l.score} · {l.intent} · {usd(l.budget, { compact: true })}</div>
                      </div>
                      <button className="text-[11px] text-gold hover:text-gold-bright inline-flex items-center gap-1">
                        <MessageCircle size={11} /> Contactar
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* ASIDE */}
          <aside className="space-y-4">
            <div className="rounded-lg bg-white/[0.02] ring-1 ring-white/5 p-5">
              <div className="text-[11px] text-paper-dim uppercase mb-3 tracking-wider">Listing agent</div>
              <div className="flex items-center gap-3 mb-4">
                <Avatar name={agent.name} hue={agent.avatarHue} size={52} />
                <div>
                  <div className="text-[14px] text-paper">{agent.name}</div>
                  <div className="text-[11.5px] text-paper-dim">{agent.team}</div>
                  <div className="text-[11px] text-paper-dim font-mono mt-0.5">DOCTA · {agent.city}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 h-9 text-[12px] bg-gold hover:bg-gold-bright text-ink-deep font-medium rounded-md inline-flex items-center justify-center gap-1.5">
                  <MessageCircle size={12} /> WhatsApp
                </button>
                <button className="flex-1 h-9 text-[12px] text-paper-soft hover:text-paper hover:bg-white/5 ring-1 ring-white/10 rounded-md">
                  Llamar
                </button>
              </div>
              <div className="mt-3 text-[11px] text-paper-dim">
                Tiempo medio de respuesta: <span className="text-success">4 min</span>
              </div>
            </div>

            <div className="rounded-lg bg-white/[0.02] ring-1 ring-white/5 p-5 space-y-3">
              <h4 className="font-display text-base text-paper inline-flex items-center gap-2">
                <Sparkles size={14} className="text-gold" /> IA · Precio sugerido
              </h4>
              <div>
                <div className="text-[11px] text-paper-dim">Rango competitivo</div>
                <div className="font-display text-lg text-paper">{usd(property.price * 0.95, { compact: true })} — {usd(property.price * 1.04, { compact: true })}</div>
              </div>
              <div className="h-1.5 bg-white/[0.04] rounded-full relative">
                <div className="absolute top-0 left-[40%] right-[18%] h-full bg-gradient-to-r from-success/30 via-gold/40 to-warning/30 rounded-full" />
                <div className="absolute top-1/2 left-[55%] -translate-y-1/2 h-3 w-3 bg-gold rounded-full ring-2 ring-ink-deep" />
              </div>
              <p className="text-[11px] text-paper-dim leading-relaxed">
                Basado en 38 propiedades comparables vendidas en últimos 90 días dentro de un radio de 0.5 mi.
              </p>
            </div>

            <div className="rounded-lg bg-white/[0.02] ring-1 ring-white/5 p-5 space-y-2">
              <h4 className="font-display text-base text-paper">Detalles</h4>
              {[
                ['Tipo', property.type],
                ['Año construcción', property.yearBuilt],
                ['ZIP', property.zip],
                ['Condado', property.county],
                ['Listado', property.listedAt],
                ['Estado', property.status],
              ].map(([k, v]) => (
                <div key={k as string} className="flex justify-between text-[12px] py-1 border-b border-white/5 last:border-0">
                  <span className="text-paper-dim capitalize">{k}</span>
                  <span className="text-paper-soft capitalize">{v}</span>
                </div>
              ))}
            </div>

            <div className="rounded-lg bg-gradient-to-br from-gold/5 to-transparent ring-1 ring-gold/20 p-5">
              <Eye size={14} className="text-gold mb-2" />
              <h4 className="font-display text-base text-paper mb-1">Vista 360 / Tour 3D</h4>
              <p className="text-[11.5px] text-paper-soft mb-3">
                Recorrido virtual completo disponible con Matterport.
              </p>
              <button className="w-full h-8 text-[12px] text-gold hover:bg-gold/10 rounded-md ring-1 ring-gold/30">
                Abrir tour 3D →
              </button>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
