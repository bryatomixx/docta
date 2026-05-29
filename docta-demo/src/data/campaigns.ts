import type { ChannelKey } from './channels';

export type Campaign = {
  id: string;
  name: string;
  status: 'live' | 'paused' | 'draft' | 'completed';
  channels: ChannelKey[];
  audience: string;
  audienceSize: number;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  replied: number;
  leads: number;
  appointments: number;
  deals: number;
  revenue: number;
  spend: number;
  ownerId: string;
  startedAt: string;
};

export const CAMPAIGNS: Campaign[] = [
  {
    id: 'cam-001',
    name: 'FL — Compradores LATAM Q2',
    status: 'live',
    channels: ['email', 'whatsapp', 'meta-ads'],
    audience: 'LATAM expats con income > $200k',
    audienceSize: 18_400,
    sent: 16_820,
    delivered: 16_540,
    opened: 8_710,
    clicked: 2_185,
    replied: 642,
    leads: 312,
    appointments: 84,
    deals: 11,
    revenue: 22_500_000,
    spend: 41_200,
    ownerId: 'u-008',
    startedAt: '2026-04-08',
  },
  {
    id: 'cam-002',
    name: 'Miami Investors LookAlike',
    status: 'live',
    channels: ['meta-ads', 'google-ads'],
    audience: 'LookAlike 1% de cash buyers 2024',
    audienceSize: 42_000,
    sent: 42_000,
    delivered: 42_000,
    opened: 0,
    clicked: 3_840,
    replied: 0,
    leads: 487,
    appointments: 112,
    deals: 18,
    revenue: 38_900_000,
    spend: 68_400,
    ownerId: 'u-014',
    startedAt: '2026-03-22',
  },
  {
    id: 'cam-003',
    name: 'Orlando First-Time Buyers',
    status: 'live',
    channels: ['sms', 'email'],
    audience: 'Renters 25-38, score > 680',
    audienceSize: 9_800,
    sent: 9_400,
    delivered: 9_280,
    opened: 4_220,
    clicked: 1_180,
    replied: 410,
    leads: 198,
    appointments: 54,
    deals: 7,
    revenue: 4_900_000,
    spend: 14_200,
    ownerId: 'u-021',
    startedAt: '2026-04-19',
  },
  {
    id: 'cam-004',
    name: 'Naples Luxury — Cash Buyers',
    status: 'live',
    channels: ['email', 'whatsapp'],
    audience: 'Cash buyers $2M+ ZIP 34102/34108',
    audienceSize: 2_100,
    sent: 2_080,
    delivered: 2_070,
    opened: 1_410,
    clicked: 588,
    replied: 142,
    leads: 84,
    appointments: 31,
    deals: 5,
    revenue: 18_400_000,
    spend: 8_900,
    ownerId: 'u-003',
    startedAt: '2026-04-02',
  },
  {
    id: 'cam-005',
    name: 'Refi + Off-Market Owners',
    status: 'paused',
    channels: ['sms', 'call'],
    audience: 'Propietarios refi opportunity, equity > 40%',
    audienceSize: 6_400,
    sent: 3_100,
    delivered: 3_080,
    opened: 0,
    clicked: 0,
    replied: 218,
    leads: 91,
    appointments: 22,
    deals: 4,
    revenue: 3_600_000,
    spend: 6_800,
    ownerId: 'u-011',
    startedAt: '2026-03-30',
  },
  {
    id: 'cam-006',
    name: 'Tampa Listing Alerts (Drip)',
    status: 'live',
    channels: ['email'],
    audience: 'Saved searches Tampa Bay',
    audienceSize: 3_400,
    sent: 18_600,
    delivered: 18_400,
    opened: 11_400,
    clicked: 4_100,
    replied: 380,
    leads: 142,
    appointments: 41,
    deals: 6,
    revenue: 5_200_000,
    spend: 1_400,
    ownerId: 'u-018',
    startedAt: '2026-01-15',
  },
  {
    id: 'cam-007',
    name: 'Q3 Pre-Construction Launch',
    status: 'draft',
    channels: ['email', 'whatsapp', 'meta-ads', 'google-ads'],
    audience: 'VIP list + lookalikes',
    audienceSize: 14_000,
    sent: 0,
    delivered: 0,
    opened: 0,
    clicked: 0,
    replied: 0,
    leads: 0,
    appointments: 0,
    deals: 0,
    revenue: 0,
    spend: 0,
    ownerId: 'u-005',
    startedAt: '2026-06-01',
  },
];

export type Flow = {
  id: string;
  name: string;
  trigger: string;
  steps: { kind: ChannelKey | 'wait' | 'condition'; label: string; delay?: string }[];
  enrolled: number;
  completed: number;
  conversion: number;
  status: 'active' | 'paused' | 'draft';
};

export const FLOWS: Flow[] = [
  {
    id: 'fl-001',
    name: 'Lead nuevo → contacto en 5 min',
    trigger: 'Lead form recibido (Web / Meta / Google)',
    steps: [
      { kind: 'sms', label: 'SMS: "Hola {name}, soy {agent} de DOCTA"', delay: '0 min' },
      { kind: 'wait', label: 'Esperar 5 min' },
      { kind: 'whatsapp', label: 'WhatsApp con catálogo personalizado' },
      { kind: 'wait', label: 'Esperar 30 min sin respuesta' },
      { kind: 'call', label: 'Crear tarea de llamada al realtor' },
      { kind: 'email', label: 'Email de bienvenida + presentación del agente' },
    ],
    enrolled: 1_842,
    completed: 1_310,
    conversion: 24.6,
    status: 'active',
  },
  {
    id: 'fl-002',
    name: 'Visita programada → recordatorios',
    trigger: 'Visita agendada en calendario',
    steps: [
      { kind: 'email', label: 'Confirmación + agenda + NDA' },
      { kind: 'wait', label: '24h antes' },
      { kind: 'sms', label: 'Recordatorio + dirección + parqueo' },
      { kind: 'wait', label: '2h antes' },
      { kind: 'whatsapp', label: 'Mensaje del realtor' },
      { kind: 'wait', label: '1h después de la visita' },
      { kind: 'email', label: 'Follow-up: feedback + propiedades similares' },
    ],
    enrolled: 421,
    completed: 388,
    conversion: 41.2,
    status: 'active',
  },
  {
    id: 'fl-003',
    name: 'Nurture 90 días (no calificó aún)',
    trigger: 'Lead score < 40 después de 7 días',
    steps: [
      { kind: 'email', label: 'Guía: comprar en FL desde el exterior' },
      { kind: 'wait', label: '7 días' },
      { kind: 'email', label: 'Caso de éxito + ROI' },
      { kind: 'wait', label: '14 días' },
      { kind: 'whatsapp', label: 'Mensaje del agente: "¿Sigues buscando?"' },
      { kind: 'condition', label: 'Si abre o responde → re-puntuar a warm' },
    ],
    enrolled: 3_280,
    completed: 1_910,
    conversion: 11.4,
    status: 'active',
  },
  {
    id: 'fl-004',
    name: 'Cierre → onboarding post-venta',
    trigger: 'Deal pasa a Cerrado',
    steps: [
      { kind: 'email', label: 'Bienvenida + checklist post-closing' },
      { kind: 'wait', label: '14 días' },
      { kind: 'email', label: 'Encuesta NPS + Google review request' },
      { kind: 'wait', label: '90 días' },
      { kind: 'whatsapp', label: 'Aniversario propiedad + market update' },
    ],
    enrolled: 124,
    completed: 102,
    conversion: 38.7,
    status: 'active',
  },
];
