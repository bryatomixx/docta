import { useMemo, useState } from 'react';
import { Topbar } from '../components/Topbar';
import { ChannelBadge } from '../components/ChannelBadge';
import { Pill } from '../components/StatPill';
import { Avatar } from '../components/Avatar';
import { CONVERSATIONS } from '../data/conversations';
import { LEADS, type Lead } from '../data/leads';
import { CHANNELS, type ChannelKey } from '../data/channels';
import { TEAM } from '../data/users';
import { relativeTime } from '../lib/format';
import { cn } from '../lib/cn';
import {
  Pin,
  Paperclip,
  Send,
  Sparkles,
  ChevronDown,
  Filter,
  Phone,
  Video,
  MoreHorizontal,
  CheckCheck,
} from 'lucide-react';

const FILTERS: { key: 'all' | ChannelKey | 'unread'; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'unread', label: 'No leídos' },
  { key: 'whatsapp', label: 'WhatsApp' },
  { key: 'sms', label: 'SMS' },
  { key: 'email', label: 'Email' },
  { key: 'web', label: 'Web' },
  { key: 'call', label: 'Llamadas' },
  { key: 'meta-ads', label: 'Meta' },
  { key: 'google-ads', label: 'Google' },
];

export default function Inbox() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['key']>('all');
  const [selectedId, setSelectedId] = useState<string>(CONVERSATIONS[0].id);
  const [draft, setDraft] = useState('');

  const leadsById = useMemo(() => Object.fromEntries(LEADS.map((l) => [l.id, l])), []);
  const usersById = useMemo(() => Object.fromEntries(TEAM.map((u) => [u.id, u])), []);

  const conversations = useMemo(() => {
    const list = [...CONVERSATIONS].sort((a, b) => (a.pinned === b.pinned ? +new Date(b.lastAt) - +new Date(a.lastAt) : a.pinned ? -1 : 1));
    if (filter === 'all') return list;
    if (filter === 'unread') return list.filter((c) => c.unread > 0);
    return list.filter((c) => c.channel === filter);
  }, [filter]);

  const selected = CONVERSATIONS.find((c) => c.id === selectedId)!;
  const lead = leadsById[selected.leadId];
  const owner = usersById[selected.assignedTo];

  return (
    <>
      <Topbar
        title="Inbox unificado"
        subtitle={`${conversations.length} conversaciones · 7 canales`}
        actions={
          <button className="h-8 px-2.5 inline-flex items-center gap-1.5 text-[12px] text-paper-soft hover:text-paper hover:bg-white/5 rounded-md ring-1 ring-white/5">
            <Filter size={12} /> Vistas
          </button>
        }
      />

      <div className="flex-1 grid grid-cols-12 min-h-0">
        {/* LIST */}
        <div className="col-span-4 border-r border-white/5 flex flex-col min-h-0">
          <div className="px-3 py-2.5 border-b border-white/5 flex gap-1 overflow-x-auto">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={cn(
                  'h-7 px-2.5 rounded-md text-[11.5px] whitespace-nowrap transition',
                  filter === f.key ? 'bg-gold/10 text-gold ring-1 ring-gold/30' : 'text-paper-dim hover:bg-white/5 hover:text-paper',
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.map((c) => {
              const l = leadsById[c.leadId];
              const last = c.messages[c.messages.length - 1];
              const active = c.id === selectedId;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={cn(
                    'w-full px-3 py-3 border-b border-white/5 flex gap-3 text-left transition relative',
                    active ? 'bg-gold/5' : 'hover:bg-white/[0.02]',
                  )}
                >
                  {active && <span className="absolute left-0 inset-y-0 w-0.5 bg-gold" />}
                  <Avatar name={l.name} size={36} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[13px] text-paper truncate flex-1">{l.name}</span>
                      <span className="text-[10.5px] text-paper-dim font-mono">{relativeTime(new Date(c.lastAt))}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <ChannelBadge channel={c.channel} size="sm" />
                      <span className="text-[11px] text-paper-dim truncate">{CHANNELS[c.channel].label}</span>
                      {c.pinned && <Pin size={10} className="text-gold ml-auto shrink-0" />}
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <p className={cn('text-[12px] truncate flex-1', c.unread ? 'text-paper' : 'text-paper-dim')}>
                        {last.from === 'agent' ? 'Tú: ' : ''}
                        {last.text}
                      </p>
                      {c.unread > 0 && (
                        <span className="text-[10px] font-mono bg-gold text-ink-deep px-1.5 py-0.5 rounded-full shrink-0">
                          {c.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* CONVERSATION */}
        <div className="col-span-5 flex flex-col min-h-0 border-r border-white/5">
          <div className="px-4 h-14 border-b border-white/5 flex items-center gap-3 shrink-0">
            <Avatar name={lead.name} size={36} />
            <div className="flex-1 min-w-0">
              <div className="text-[13.5px] text-paper">{lead.name}</div>
              <div className="text-[11px] text-paper-dim flex items-center gap-2">
                <ChannelBadge channel={selected.channel} size="sm" />
                <span>{lead.phone}</span>
                <span>·</span>
                <span>{lead.city}, FL</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button className="h-8 w-8 grid place-items-center text-paper-soft hover:bg-white/5 rounded-md"><Phone size={13} /></button>
              <button className="h-8 w-8 grid place-items-center text-paper-soft hover:bg-white/5 rounded-md"><Video size={13} /></button>
              <button className="h-8 w-8 grid place-items-center text-paper-soft hover:bg-white/5 rounded-md"><MoreHorizontal size={13} /></button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
            {selected.messages.map((m) => {
              const isAgent = m.from === 'agent';
              const isSystem = m.from === 'system';
              if (isSystem) {
                return (
                  <div key={m.id} className="flex justify-center">
                    <div className="text-[11px] text-paper-dim bg-white/[0.02] px-3 py-1.5 rounded-full ring-1 ring-white/5">
                      <Sparkles size={10} className="inline mr-1 text-gold" /> {m.text}
                    </div>
                  </div>
                );
              }
              return (
                <div key={m.id} className={cn('flex', isAgent ? 'justify-end' : 'justify-start')}>
                  <div className={cn('max-w-[78%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed', isAgent ? 'bg-gold text-ink-deep rounded-br-md' : 'bg-white/[0.04] text-paper rounded-bl-md ring-1 ring-white/5')}>
                    <p>{m.text}</p>
                    <div className={cn('text-[10px] mt-1 flex items-center gap-1', isAgent ? 'text-ink-deep/70' : 'text-paper-dim')}>
                      {new Date(m.at).toLocaleTimeString('es-US', { hour: '2-digit', minute: '2-digit' })}
                      {isAgent && <CheckCheck size={10} />}
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="flex justify-center">
              <Pill tone="info" size="sm">IA sugiere · respuesta lista en 4s</Pill>
            </div>
          </div>

          <div className="border-t border-white/5 p-3 shrink-0">
            <div className="flex items-end gap-2">
              <button className="h-9 w-9 grid place-items-center text-paper-soft hover:bg-white/5 rounded-md ring-1 ring-white/5">
                <Paperclip size={14} />
              </button>
              <div className="flex-1 rounded-md ring-1 ring-white/10 bg-white/[0.02] focus-within:ring-gold/40 transition">
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder={`Responde por ${CHANNELS[selected.channel].label}…  /template para insertar plantilla`}
                  rows={2}
                  className="w-full bg-transparent resize-none outline-none px-3 py-2 text-[13px] text-paper placeholder-paper-dim"
                />
                <div className="flex items-center justify-between px-2 pb-2">
                  <div className="flex gap-1.5">
                    <button className="text-[11px] text-paper-dim hover:text-paper px-1.5 py-0.5 rounded hover:bg-white/5">
                      /plantilla
                    </button>
                    <button className="text-[11px] text-gold hover:text-gold-bright px-1.5 py-0.5 rounded hover:bg-gold/5 inline-flex items-center gap-1">
                      <Sparkles size={10} /> IA mejorar
                    </button>
                  </div>
                  <span className="text-[10px] text-paper-dim font-mono">{draft.length} / 1600</span>
                </div>
              </div>
              <button className="h-9 px-3 bg-gold hover:bg-gold-bright text-ink-deep rounded-md inline-flex items-center gap-1.5 text-[12px] font-medium">
                Enviar <Send size={12} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>

        {/* CONTEXT PANEL */}
        <div className="col-span-3 overflow-y-auto p-5 space-y-5">
          <ContactCard lead={lead} ownerName={owner?.name ?? 'Sin asignar'} />
          <PropertyMini lead={lead} />
          <ActivityTimeline lead={lead} />
        </div>
      </div>
    </>
  );
}

function ContactCard({ lead, ownerName }: { lead: Lead; ownerName: string }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <h3 className="font-display text-base text-paper">Contacto</h3>
        <Pill
          tone={lead.temp === 'hot' ? 'danger' : lead.temp === 'warm' ? 'warning' : 'info'}
          size="sm"
        >
          {lead.temp.toUpperCase()} · {lead.score}
        </Pill>
      </div>

      <div className="text-[11px] text-paper-dim grid grid-cols-2 gap-2">
        <div>
          <div className="uppercase tracking-wider mb-0.5">Email</div>
          <div className="text-paper-soft truncate">{lead.email}</div>
        </div>
        <div>
          <div className="uppercase tracking-wider mb-0.5">Tel.</div>
          <div className="text-paper-soft">{lead.phone}</div>
        </div>
        <div>
          <div className="uppercase tracking-wider mb-0.5">Etapa</div>
          <div className="text-paper-soft capitalize">{lead.stage}</div>
        </div>
        <div>
          <div className="uppercase tracking-wider mb-0.5">Intención</div>
          <div className="text-paper-soft capitalize">{lead.intent}</div>
        </div>
        <div>
          <div className="uppercase tracking-wider mb-0.5">Budget</div>
          <div className="text-paper-soft">${(lead.budget / 1000).toFixed(0)}k</div>
        </div>
        <div>
          <div className="uppercase tracking-wider mb-0.5">Beds</div>
          <div className="text-paper-soft">{lead.beds}+</div>
        </div>
      </div>

      <div className="border-t border-white/5 pt-3">
        <div className="text-[11px] text-paper-dim uppercase mb-1">Asignado a</div>
        <div className="flex items-center gap-2">
          <Avatar name={ownerName} size={24} />
          <span className="text-[12.5px] text-paper">{ownerName}</span>
          <button className="ml-auto text-[11px] text-gold hover:text-gold-bright inline-flex items-center gap-0.5">
            cambiar <ChevronDown size={11} />
          </button>
        </div>
      </div>

      <div className="border-t border-white/5 pt-3">
        <div className="text-[11px] text-paper-dim uppercase mb-1">Nota interna</div>
        <p className="text-[12px] text-paper-soft leading-relaxed">{lead.notes}</p>
      </div>
    </div>
  );
}

function PropertyMini({ lead }: { lead: Lead }) {
  if (!lead.propertyId) return null;
  return (
    <div className="border-t border-white/5 pt-4 space-y-2">
      <h3 className="font-display text-base text-paper">Propiedad de interés</h3>
      <div className="rounded-md bg-white/[0.02] ring-1 ring-white/5 overflow-hidden">
        <div className="aspect-[16/9] bg-gradient-to-br from-ink-soft to-ink-deep" />
        <div className="p-3">
          <div className="text-[12.5px] text-paper">Brickell Skyline Penthouse</div>
          <div className="text-[11px] text-paper-dim">4 · 4 · 3,420 sqft · $2.85M</div>
        </div>
      </div>
    </div>
  );
}

function ActivityTimeline({ lead }: { lead: Lead }) {
  return (
    <div className="border-t border-white/5 pt-4 space-y-2.5">
      <h3 className="font-display text-base text-paper">Cronología</h3>
      <ol className="space-y-2.5 text-[12px]">
        {[
          ['Lead recibido', relativeTime(new Date(lead.createdAt))],
          ['Auto-asignación round-robin', '14 min después'],
          ['Primer SMS enviado', '2 min después'],
          ['WhatsApp respondido por lead', '4 min después'],
          ['Tour pre-agendado para sábado', 'hoy'],
        ].map(([t, when], i) => (
          <li key={i} className="flex gap-2.5">
            <div className="flex flex-col items-center pt-0.5">
              <span className={cn('h-2 w-2 rounded-full', i === 0 ? 'bg-gold' : 'bg-white/20')} />
              {i < 4 && <span className="w-px flex-1 bg-white/5 my-1" />}
            </div>
            <div>
              <div className="text-paper-soft leading-tight">{t}</div>
              <div className="text-[10.5px] text-paper-dim font-mono">{when}</div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
