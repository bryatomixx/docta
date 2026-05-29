import type { ChannelKey } from './channels';

export type LeadStage = 'nuevo' | 'contactado' | 'calificado' | 'visita' | 'oferta' | 'cerrado' | 'perdido';
export type LeadIntent = 'compra' | 'venta' | 'renta' | 'inversion';
export type LeadTemp = 'cold' | 'warm' | 'hot';

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  source: ChannelKey;
  campaign?: string;
  stage: LeadStage;
  intent: LeadIntent;
  temp: LeadTemp;
  budget: number;
  beds: number;
  notes: string;
  ownerId: string;
  propertyId?: string;
  createdAt: string;
  lastTouch: string;
  score: number;
};

const NAMES = [
  'Andrea Salazar', 'Roberto Méndez', 'Luisa Fernández', 'Mauricio Castro', 'Patricia Vega',
  'Hernando Ruiz', 'María Restrepo', 'Eduardo Cisneros', 'Lina Ospina', 'Felipe Caballero',
  'Camila Bustamante', 'Jorge Quiñones', 'Ana Lucía Páez', 'Sergio Velázquez', 'Mónica Arias',
  'Tomás Echeverría', 'Adriana Linares', 'Pedro Pacheco', 'Carolina Tejada', 'Iván Montenegro',
  'Verónica Solano', 'David Pinzón', 'Estefanía Lemus', 'Andrés Cifuentes', 'Marcela Higuera',
  'Joaquín Roldán', 'Beatriz Calderón', 'Hugo Vinasco', 'Daniela Acuña', 'Nicolás Polanía',
  'Sandra Cabezas', 'Cristóbal Valenzuela', 'Gabriela Sandoval', 'Diego Iturralde',
  'Lourdes Páramo', 'Mariano Esquivel', 'Renata Carvajal', 'Pablo Cisternas', 'Silvia Cárdenas',
  'Esteban Velasco', 'Olivia Toledo', 'Rodrigo Quintana', 'Aída Cortés', 'Manuel Beltrán',
  'Liliana Quintero', 'Marcos Aguilera', 'Florencia Rangel', 'Iván Padilla', 'Sara Vinueza',
  'Bruno Maldonado', 'Mateo Acuña', 'Camila Olmedo', 'Diego Carrasco', 'Lorena Cordero',
  'Federico Ávila', 'Gisela Vázquez', 'Ricardo Sotomayor', 'Natalia Manrique', 'Andrés Gallardo',
  'Elena Bocanegra', 'Joaquín Pareja', 'Sonia Rincón', 'Hernán Ríos', 'Mariana Téllez',
  'Cristian Olarte', 'Belén Ferreira', 'Sebastián Acero', 'Lorena Trujillo', 'Iván Bonilla',
  'Catalina Bohórquez', 'Diego Quiñónez', 'Paula Bohórquez', 'Tomás Saavedra', 'Lucía Espinoza',
  'Camilo Vidales', 'Mariela Sotelo', 'Hugo Saldarriaga', 'Andrea Yepes', 'Roberto Carmona',
];

const CITIES = [
  'Miami', 'Doral', 'Aventura', 'Hialeah', 'Coral Gables', 'Brickell', 'Orlando',
  'Tampa', 'Fort Lauderdale', 'Boca Raton', 'Naples', 'Sarasota', 'Jacksonville',
  'St. Petersburg', 'Pembroke Pines', 'Hollywood', 'Cape Coral',
];

const SOURCES: ChannelKey[] = ['meta-ads', 'google-ads', 'whatsapp', 'web', 'sms', 'email', 'call'];

const CAMPAIGNS = [
  'FL — Compradores LATAM Q2',
  'Miami Investors LookAlike',
  'Orlando First-Time Buyers',
  'Tampa Listing Alerts',
  'Naples Luxury Q2',
  'Refinance + Off-market',
  undefined,
  undefined,
];

const STAGES: LeadStage[] = ['nuevo', 'contactado', 'calificado', 'visita', 'oferta', 'cerrado', 'perdido'];
const STAGE_DIST: LeadStage[] = [
  ...Array(28).fill('nuevo'),
  ...Array(34).fill('contactado'),
  ...Array(22).fill('calificado'),
  ...Array(14).fill('visita'),
  ...Array(7).fill('oferta'),
  ...Array(4).fill('cerrado'),
  ...Array(9).fill('perdido'),
];

const INTENT: LeadIntent[] = ['compra', 'compra', 'compra', 'inversion', 'venta', 'renta'];

const NOTES = [
  'Llamó por anuncio de Brickell, quiere ver el penthouse este sábado.',
  'Pre-aprobada hasta $1.2M con Truist. Quiere zona escolar A+.',
  'Inversionista de Bogotá, busca cap rate > 6%, cash deal.',
  'Familia llegando de Caracas en julio, necesita visa de inversionista E-2.',
  'Pareja joven, primera compra. Necesita educación de proceso.',
  'Dueño de restaurante en Doral, busca segunda casa de inversión.',
  'Pidió cotización de seguro y closing costs estimados.',
  'Vendedor motivado, divorcio. Quiere cerrar en 30 días.',
  'Cash buyer, $800K listos. Solo Miami-Dade.',
  'Cliente VIP de campaña Naples Luxury. Tour privado agendado.',
  'Refirió Carlos García (top realtor). Tratar como prioridad.',
];

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function pad(n: number, w: number): string { return n.toString().padStart(w, '0'); }

export const LEADS: Lead[] = Array.from({ length: 118 }, (_, i): Lead => {
  const name = NAMES[i % NAMES.length] + (i >= NAMES.length ? ` ${(i / NAMES.length) | 0}` : '');
  const stage = STAGE_DIST[i % STAGE_DIST.length];
  const h = hash(name + i);
  const score = stage === 'cerrado' ? 95 + (h % 5)
    : stage === 'oferta' ? 80 + (h % 15)
    : stage === 'visita' ? 65 + (h % 20)
    : stage === 'calificado' ? 50 + (h % 25)
    : stage === 'contactado' ? 25 + (h % 30)
    : stage === 'perdido' ? 5 + (h % 20)
    : 15 + (h % 35);
  const temp: LeadTemp = score >= 70 ? 'hot' : score >= 40 ? 'warm' : 'cold';
  const created = new Date(Date.now() - (h % 60) * 86400_000);
  const lastTouch = new Date(Date.now() - (h % 7) * 86400_000 - (h % 24) * 3600_000);
  const budgetBase = [350_000, 500_000, 750_000, 1_000_000, 1_500_000, 2_500_000];
  return {
    id: `l-${pad(i + 1, 4)}`,
    name,
    email: `${name.split(' ')[0].toLowerCase()}.${pad(i, 3)}@gmail.com`,
    phone: `+1 (${300 + (h % 600)}) ${100 + (h % 800)}-${pad(h % 10000, 4)}`,
    city: CITIES[h % CITIES.length],
    source: SOURCES[h % SOURCES.length],
    campaign: CAMPAIGNS[h % CAMPAIGNS.length],
    stage,
    intent: INTENT[h % INTENT.length],
    temp,
    budget: budgetBase[h % budgetBase.length],
    beds: 2 + (h % 4),
    notes: NOTES[h % NOTES.length],
    ownerId: `u-${pad((h % 30) + 1, 3)}`,
    propertyId: h % 3 === 0 ? `p-${pad((h % 30) + 1, 3)}` : undefined,
    createdAt: created.toISOString(),
    lastTouch: lastTouch.toISOString(),
    score,
  };
});

export const LEAD_STAGE_LABELS: Record<LeadStage, string> = {
  nuevo: 'Nuevo',
  contactado: 'Contactado',
  calificado: 'Calificado',
  visita: 'Visita agendada',
  oferta: 'Oferta enviada',
  cerrado: 'Cerrado / Ganado',
  perdido: 'Perdido',
};

export const ACTIVE_STAGES = STAGES.slice(0, 6) as Exclude<LeadStage, 'perdido'>[];
