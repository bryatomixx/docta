import type { ChannelKey } from './channels';

export const KPIS = {
  leadsThisMonth: 1_842,
  leadsLastMonth: 1_510,
  conversionRate: 11.4,
  conversionLast: 9.8,
  dealsClosed: 47,
  dealsLast: 39,
  revenueThisMonth: 38_400_000,
  revenueLast: 31_200_000,
  activeListings: 184,
  hotLeads: 92,
  responseTimeSec: 64,
  responseTimeLast: 142,
  adSpend: 142_700,
  costPerLead: 18.4,
  appointments: 312,
  averageDealSize: 817_000,
};

export const LEADS_BY_CHANNEL: { channel: ChannelKey; count: number; cpl: number }[] = [
  { channel: 'meta-ads',  count: 642, cpl: 21.4 },
  { channel: 'google-ads', count: 488, cpl: 26.8 },
  { channel: 'whatsapp',  count: 281, cpl: 4.2 },
  { channel: 'web',       count: 198, cpl: 0 },
  { channel: 'sms',       count: 92,  cpl: 11.0 },
  { channel: 'email',     count: 88,  cpl: 0 },
  { channel: 'call',      count: 53,  cpl: 0 },
];

export const FUNNEL = [
  { stage: 'Visitas web',         value: 84_200 },
  { stage: 'Leads',               value: 1_842 },
  { stage: 'Contactados',         value: 1_640 },
  { stage: 'Calificados',         value: 720 },
  { stage: 'Visitas agendadas',   value: 312 },
  { stage: 'Ofertas enviadas',    value: 118 },
  { stage: 'Cerrados',            value: 47 },
];

export const REVENUE_TREND: { month: string; revenue: number; deals: number }[] = [
  { month: 'Nov',  revenue: 18_400_000, deals: 24 },
  { month: 'Dic',  revenue: 22_100_000, deals: 28 },
  { month: 'Ene',  revenue: 19_800_000, deals: 26 },
  { month: 'Feb',  revenue: 24_600_000, deals: 31 },
  { month: 'Mar',  revenue: 28_900_000, deals: 36 },
  { month: 'Abr',  revenue: 31_200_000, deals: 39 },
  { month: 'May',  revenue: 38_400_000, deals: 47 },
];

export const TOP_PERFORMERS: { userId: string; name: string; deals: number; revenue: number }[] = [
  { userId: 'u-002', name: 'Sofía Rodríguez', deals: 8, revenue: 9_400_000 },
  { userId: 'u-005', name: 'Luis Sánchez',    deals: 7, revenue: 6_800_000 },
  { userId: 'u-011', name: 'Javier Mendoza',  deals: 6, revenue: 5_400_000 },
  { userId: 'u-018', name: 'Diego Cruz',      deals: 5, revenue: 4_100_000 },
  { userId: 'u-023', name: 'Renata Ortiz',    deals: 5, revenue: 3_800_000 },
];

export const RECENT_ACTIVITY = [
  { id: 'a1', kind: 'deal',    text: 'Sofía Rodríguez cerró Brickell Skyline Penthouse — $2.85M', at: '2 min' },
  { id: 'a2', kind: 'lead',    text: 'Nuevo lead hot: Andrea Salazar — Meta Ads (Naples Luxury)', at: '8 min' },
  { id: 'a3', kind: 'message', text: 'Roberto Méndez respondió en WhatsApp (Coral Gables Estate)', at: '14 min' },
  { id: 'a4', kind: 'visit',   text: 'Visita confirmada: Camila Bustamante → Aventura Bayfront 22F', at: '23 min' },
  { id: 'a5', kind: 'campaign',text: 'Campaña "Orlando First-Time Buyers" superó 95% delivery', at: '41 min' },
  { id: 'a6', kind: 'offer',   text: 'Oferta enviada: Mauricio Castro → Lake Nona Smart Home', at: '1 h' },
  { id: 'a7', kind: 'deal',    text: 'Luis Sánchez cerró Cape Coral Canal Home — $780k', at: '2 h' },
  { id: 'a8', kind: 'system',  text: 'Sincronización Meta Ads ✓ — 87 leads importados hoy', at: '3 h' },
];
