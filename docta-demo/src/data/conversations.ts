import type { ChannelKey } from './channels';
import { LEADS } from './leads';

export type Message = {
  id: string;
  from: 'lead' | 'agent' | 'system';
  text: string;
  at: string;
  attachments?: { kind: 'image' | 'doc' | 'audio'; name: string }[];
};

export type Conversation = {
  id: string;
  leadId: string;
  channel: ChannelKey;
  subject?: string;
  unread: number;
  pinned: boolean;
  lastAt: string;
  assignedTo: string;
  messages: Message[];
};

const TEMPLATES: Record<ChannelKey, Array<[string, string]>> = {
  whatsapp: [
    ['Hola! Vi el anuncio del penthouse en Brickell, ¿sigue disponible?', 'Hola Andrea 👋 sí, sigue disponible. ¿Quieres agendar una visita esta semana?'],
    ['¿Cuál es el precio final y los closing costs aproximados?', 'Precio listado $2.85M. Closing costs estimados 2.8%. Te paso el desglose por correo.'],
    ['Perfecto, mándame también opciones similares por favor.', 'Te armo un shortlist con 3 unidades comparables y te lo envío en 1h.'],
    ['Me interesa visitar el sábado a las 11am.', 'Confirmado. Te mando ubicación y mi número directo del realtor en zona.'],
  ],
  sms: [
    ['Hola, soy de la campaña de Naples Luxury. ¿Tienen tour este finde?', 'Sí — sábado 10am o domingo 2pm. ¿Cuál prefieres?'],
    ['Necesito refinanciar antes de cerrar.', 'Te conecto con nuestro broker hipotecario. ¿Te llama hoy 4pm?'],
  ],
  email: [
    ['Solicitud de cotización — propiedad MLS R10740137', 'Hola María, adjunto cotización completa: precio, taxes, HOA, seguro y closing costs estimados. Disponible para llamada el martes.'],
    ['Re: Tour Coral Gables Estate', 'Confirmamos tour para el viernes 3pm. Te mando NDA pre-tour adjunta.'],
  ],
  web: [
    ['(Web Form) Quiero info sobre rentas en Aventura, presupuesto $3.5k/mes', 'Hola Carlos, te asigné a nuestra realtor especializada en Aventura. Te contacta en menos de 15 min.'],
  ],
  call: [
    ['(Llamada perdida — 2 min)', 'Te devolvemos llamada en 5 min. Si prefieres WhatsApp respondo aquí.'],
    ['(Voicemail) Llamó por anuncio de Hollywood Beach.', 'Voicemail transcrito. Le devolví llamada y agendamos visita.'],
  ],
  'meta-ads': [
    ['(Lead form — Facebook) Interesado en inversión $500k—$1M Miami.', 'Hola Roberto, gracias por dejar tus datos. ¿Te llamo hoy o prefieres WhatsApp?'],
  ],
  'google-ads': [
    ['(Search ad — "casas Doral nuevas") Solicitó catálogo.', 'Te envío catálogo con 12 propiedades nuevas en Doral. ¿Buscas para vivir o invertir?'],
  ],
};

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export const CONVERSATIONS: Conversation[] = LEADS.slice(0, 48).map((lead, i): Conversation => {
  const channel = lead.source;
  const template = TEMPLATES[channel] ?? TEMPLATES.whatsapp;
  const pair = template[i % template.length];
  const h = hash(lead.id);
  const base = Date.now() - (h % 7) * 86400_000;
  const messages: Message[] = [
    { id: `${lead.id}-m1`, from: 'lead', text: pair[0], at: new Date(base - 1800_000).toISOString() },
    { id: `${lead.id}-m2`, from: 'agent', text: pair[1], at: new Date(base - 900_000).toISOString() },
  ];
  if (h % 3 !== 0) {
    messages.push({
      id: `${lead.id}-m3`,
      from: 'lead',
      text: ['Ok, perfecto.', '¿Me puedes enviar el contrato?', '¿Acepta financiamiento?', 'Voy a pensarlo y te confirmo en la tarde.', '¿Hay descuento si pago cash?'][h % 5],
      at: new Date(base - 60_000).toISOString(),
    });
  }
  if (h % 5 === 0) {
    messages.push({
      id: `${lead.id}-m4`,
      from: 'system',
      text: 'Lead asignado automáticamente a Carlos García (round-robin Sales South FL).',
      at: new Date(base - 30_000).toISOString(),
    });
  }
  return {
    id: `c-${(i + 1).toString().padStart(4, '0')}`,
    leadId: lead.id,
    channel,
    subject: channel === 'email' ? `Re: ${lead.notes.slice(0, 40)}…` : undefined,
    unread: i % 4 === 0 ? 1 + (h % 3) : 0,
    pinned: i < 3,
    lastAt: messages[messages.length - 1].at,
    assignedTo: lead.ownerId,
    messages,
  };
});
