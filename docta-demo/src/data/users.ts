export type Role = 'admin' | 'broker' | 'realtor' | 'marketer' | 'operator' | 'investor';

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: Role;
  team: 'Sales — North FL' | 'Sales — South FL' | 'Marketing' | 'Operations' | 'Investor Relations';
  status: 'active' | 'invited' | 'paused';
  city: string;
  joined: string;
  deals: number;
  revenue: number;
  avatarHue: number;
};

const FIRST = [
  'Carlos', 'Sofía', 'Andrés', 'Valeria', 'Luis', 'Camila', 'Diego', 'Daniela',
  'Mateo', 'Isabella', 'Javier', 'Lucía', 'Sebastián', 'Elena', 'Tomás', 'Paula',
  'Esteban', 'Renata', 'Miguel', 'Antonia', 'Rafael', 'Florencia', 'Ignacio',
  'Camilo', 'Adriana', 'Joaquín', 'Mariana', 'Felipe', 'Catalina', 'Ricardo',
  'Gabriela', 'Hernán', 'Natalia', 'Bruno', 'Salomé', 'Iván', 'Beatriz', 'Óscar',
  'Verónica', 'Damián', 'Patricia', 'Cristian', 'Lourdes', 'Manuel', 'Carolina',
  'Roberto', 'Estefanía', 'Pablo', 'Liliana', 'Nicolás',
];
const LAST = [
  'García', 'Rodríguez', 'Martínez', 'Hernández', 'Pérez', 'Sánchez', 'Ramírez',
  'Torres', 'Flores', 'Rivera', 'Gómez', 'Díaz', 'Reyes', 'Cruz', 'Morales',
  'Ortiz', 'Gutiérrez', 'Castillo', 'Romero', 'Álvarez', 'Mendoza', 'Vargas',
  'Aguilar', 'Salazar', 'Delgado', 'Ríos', 'Cordero', 'Cárdenas', 'Acosta',
  'Núñez', 'Bermúdez', 'Estrada', 'Valdés', 'Camacho', 'Ramos', 'Cabrera',
  'Lara', 'Soto', 'Solís', 'Vázquez', 'Mejía', 'Cano', 'Pineda', 'Rojas',
];
const CITIES = [
  'Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Fort Lauderdale', 'Naples',
  'Sarasota', 'West Palm Beach', 'Cape Coral', 'St. Petersburg', 'Doral',
  'Coral Gables', 'Aventura', 'Hialeah', 'Boca Raton',
];

const ROLES_DIST: Role[] = [
  ...Array(38).fill('realtor'),
  ...Array(18).fill('marketer'),
  ...Array(22).fill('operator'),
  ...Array(14).fill('investor'),
  ...Array(11).fill('broker'),
  ...Array(5).fill('admin'),
];

const TEAMS_BY_ROLE: Record<Role, TeamMember['team']> = {
  admin: 'Operations',
  broker: 'Sales — South FL',
  realtor: 'Sales — North FL',
  marketer: 'Marketing',
  operator: 'Operations',
  investor: 'Investor Relations',
};

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export const TEAM: TeamMember[] = Array.from({ length: 108 }, (_, i): TeamMember => {
  const fn = FIRST[i % FIRST.length];
  const ln = LAST[(i * 7) % LAST.length];
  const role = ROLES_DIST[i % ROLES_DIST.length];
  const isSouth = i % 2 === 0;
  const team =
    role === 'realtor'
      ? isSouth
        ? 'Sales — South FL'
        : 'Sales — North FL'
      : TEAMS_BY_ROLE[role];
  const name = `${fn} ${ln}`;
  const slug = `${fn}.${ln}`.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const deals = role === 'realtor' ? 4 + (hash(name) % 18) : role === 'broker' ? 12 + (hash(name) % 30) : 0;
  return {
    id: `u-${(i + 1).toString().padStart(3, '0')}`,
    name,
    email: `${slug}@docta.us`,
    role,
    team,
    status: i % 23 === 0 ? 'invited' : i % 37 === 0 ? 'paused' : 'active',
    city: CITIES[hash(name) % CITIES.length],
    joined: new Date(2024, hash(name) % 12, 1 + (hash(slug) % 27)).toISOString().slice(0, 10),
    deals,
    revenue: deals * (42000 + (hash(name) % 80000)),
    avatarHue: hash(name) % 360,
  };
});

export const CURRENT_USER = {
  name: 'Alejandro Salgado',
  email: 'alex@docta.us',
  role: 'Founder & Broker',
  city: 'Miami, FL',
  avatarHue: 38,
};
