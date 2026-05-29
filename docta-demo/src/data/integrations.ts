export type Integration = {
  id: string;
  name: string;
  category: 'mensajería' | 'ads' | 'crm' | 'pagos' | 'firmas' | 'mls' | 'analytics' | 'telefonía';
  status: 'connected' | 'available' | 'error';
  description: string;
  syncedAt?: string;
  metrics?: { label: string; value: string }[];
  logoText: string;
  logoColor: string;
};

export const INTEGRATIONS: Integration[] = [
  { id: 'twilio',     name: 'Twilio',          category: 'mensajería', status: 'connected', description: 'SMS / Voice / WhatsApp Business — 12 números activos',  syncedAt: 'hace 2 min',   logoText: 'TW', logoColor: '#F22F46', metrics: [{ label: 'Mensajes hoy', value: '4,820' }, { label: 'Costo MTD', value: '$842' }] },
  { id: 'whatsapp',   name: 'WhatsApp Business',category: 'mensajería',status: 'connected', description: '6 líneas multiagente con templates aprobados',           syncedAt: 'hace 1 min',   logoText: 'WA', logoColor: '#25D366', metrics: [{ label: 'Conversaciones', value: '1,240' }, { label: 'Templates', value: '34' }] },
  { id: 'meta-ads',   name: 'Meta Ads',        category: 'ads',         status: 'connected', description: 'Catalog feed + Lead Ads + Conversions API',             syncedAt: 'hace 4 min',   logoText: 'M',  logoColor: '#0866FF', metrics: [{ label: 'Spend MTD', value: '$68.4k' }, { label: 'Leads', value: '642' }] },
  { id: 'google-ads', name: 'Google Ads',      category: 'ads',         status: 'connected', description: 'Search + Performance Max + offline conversions',        syncedAt: 'hace 6 min',   logoText: 'GA', logoColor: '#4285F4', metrics: [{ label: 'Spend MTD', value: '$54.1k' }, { label: 'Leads', value: '488' }] },
  { id: 'gmail',      name: 'Google Workspace',category: 'mensajería',  status: 'connected', description: 'Email tracking + threading + send-as-realtor',         syncedAt: 'hace 8 min',   logoText: 'G',  logoColor: '#EA4335' },
  { id: 'stellar',    name: 'Stellar MLS',     category: 'mls',         status: 'connected', description: 'Florida MLS — sync bidireccional cada 15 min',          syncedAt: 'hace 11 min',  logoText: 'ML', logoColor: '#c9a55a', metrics: [{ label: 'Listings sync', value: '184' }, { label: 'Última', value: '11 min' }] },
  { id: 'mls-broward',name: 'BeachesMLS',      category: 'mls',         status: 'connected', description: 'Broward / Palm Beach feeds — RESO API',                 syncedAt: 'hace 12 min',  logoText: 'BM', logoColor: '#0a1628' },
  { id: 'docusign',   name: 'DocuSign',        category: 'firmas',      status: 'connected', description: 'Contratos, NDAs y addendums con e-firma',               syncedAt: 'hace 14 min',  logoText: 'DS', logoColor: '#FFCC22' },
  { id: 'stripe',     name: 'Stripe',          category: 'pagos',       status: 'connected', description: 'Earnest money + suscripciones de listing premium',     syncedAt: 'hace 1 h',     logoText: 'S',  logoColor: '#635BFF' },
  { id: 'ga4',        name: 'Google Analytics 4', category: 'analytics', status: 'connected', description: 'Tracking de tráfico + conversiones con GTM server-side',syncedAt: 'hace 2 h',     logoText: 'A',  logoColor: '#F4B400' },
  { id: 'aircall',    name: 'Aircall',         category: 'telefonía',   status: 'connected', description: 'IVR + grabación de llamadas + transcripción AI',       syncedAt: 'hace 3 min',   logoText: 'AC', logoColor: '#00BFA6' },
  { id: 'hubspot',    name: 'HubSpot',         category: 'crm',         status: 'error',     description: 'Sync legacy con HubSpot — token expirado',              syncedAt: 'hace 2 días',  logoText: 'HS', logoColor: '#FF7A59' },
  { id: 'tiktok-ads', name: 'TikTok Ads',      category: 'ads',         status: 'available', description: 'Conectar para activar TikTok Lead Generation',          logoText: 'TT', logoColor: '#000' },
  { id: 'salesforce', name: 'Salesforce',      category: 'crm',         status: 'available', description: 'Importar contactos y oportunidades de Salesforce',     logoText: 'SF', logoColor: '#00A1E0' },
  { id: 'matterport', name: 'Matterport',      category: 'mls',         status: 'available', description: '3D tours embebidos en cada listing',                    logoText: 'MP', logoColor: '#19181D' },
];

export type ApiKey = { id: string; label: string; key: string; createdAt: string; lastUsed: string };
export const API_KEYS: ApiKey[] = [
  { id: 'k-1', label: 'Production — Webhooks',      key: 'sk_live_••••••••8472', createdAt: '2025-11-12', lastUsed: 'hace 1 min' },
  { id: 'k-2', label: 'Mobile app — iOS',           key: 'sk_live_••••••••4109', createdAt: '2026-01-04', lastUsed: 'hace 14 min' },
  { id: 'k-3', label: 'Mobile app — Android',       key: 'sk_live_••••••••8821', createdAt: '2026-01-04', lastUsed: 'hace 28 min' },
  { id: 'k-4', label: 'BI — Tableau read-only',     key: 'sk_live_••••••••6190', createdAt: '2026-02-18', lastUsed: 'hace 2 h' },
];

export type WebhookLog = { id: string; event: string; status: number; at: string; latency: number };
export const WEBHOOKS: WebhookLog[] = [
  { id: 'w1', event: 'lead.created',         status: 200, at: 'hace 12 s',  latency: 184 },
  { id: 'w2', event: 'message.received',     status: 200, at: 'hace 24 s',  latency: 91 },
  { id: 'w3', event: 'deal.stage_changed',   status: 200, at: 'hace 1 min', latency: 142 },
  { id: 'w4', event: 'campaign.delivered',   status: 200, at: 'hace 2 min', latency: 88 },
  { id: 'w5', event: 'lead.assigned',        status: 200, at: 'hace 3 min', latency: 112 },
  { id: 'w6', event: 'property.synced',      status: 200, at: 'hace 4 min', latency: 412 },
  { id: 'w7', event: 'message.received',     status: 500, at: 'hace 6 min', latency: 5012 },
  { id: 'w8', event: 'lead.scored',          status: 200, at: 'hace 8 min', latency: 64 },
];
