export type PropertyStatus = 'active' | 'pending' | 'sold' | 'off-market' | 'rented';
export type PropertyType = 'single-family' | 'condo' | 'townhome' | 'multi-family' | 'land' | 'commercial';

export type Property = {
  id: string;
  mls: string;
  title: string;
  type: PropertyType;
  status: PropertyStatus;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  lotSqft?: number;
  yearBuilt: number;
  address: string;
  city: string;
  zip: string;
  county: 'Miami-Dade' | 'Broward' | 'Palm Beach' | 'Orange' | 'Hillsborough' | 'Duval' | 'Lee' | 'Collier';
  agentId: string;
  listedAt: string;
  daysOnMarket: number;
  views: number;
  saves: number;
  leads: number;
  hot?: boolean;
  features: string[];
  image: string;
  gallery: string[];
};

const TYPES: PropertyType[] = ['single-family', 'condo', 'townhome', 'multi-family', 'land', 'commercial'];

const SEED: Array<Partial<Property> & Pick<Property, 'title' | 'price' | 'beds' | 'baths' | 'sqft' | 'city' | 'county' | 'image'>> = [
  { title: 'Brickell Skyline Penthouse', price: 2_850_000, beds: 4, baths: 4, sqft: 3420, city: 'Miami', county: 'Miami-Dade', image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&q=70', type: 'condo', hot: true, features: ['Vista al mar', 'Doorman 24/7', 'Smart Home', 'Pool deck'] },
  { title: 'Coral Gables Family Estate', price: 1_975_000, beds: 5, baths: 5, sqft: 4180, city: 'Coral Gables', county: 'Miami-Dade', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=70', type: 'single-family', features: ['Pool privada', 'Garage 3 autos', 'Cocina chef'] },
  { title: 'Aventura Bayfront Tower 22F', price: 1_240_000, beds: 3, baths: 3, sqft: 2090, city: 'Aventura', county: 'Miami-Dade', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=70', type: 'condo', hot: true, features: ['Vista bahía', 'Gimnasio', 'Beach club'] },
  { title: 'Doral Modern New Build', price: 895_000, beds: 4, baths: 3, sqft: 2640, city: 'Doral', county: 'Miami-Dade', image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=70', type: 'single-family', features: ['Nuevo 2025', 'Open floor plan', 'Solar ready'] },
  { title: 'Fort Lauderdale Riverfront Villa', price: 3_450_000, beds: 6, baths: 6, sqft: 5210, city: 'Fort Lauderdale', county: 'Broward', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=70', type: 'single-family', hot: true, features: ['Dock privado', 'Pool con vista', 'Home theater'] },
  { title: 'Hollywood Beach Boutique Condo', price: 645_000, beds: 2, baths: 2, sqft: 1180, city: 'Hollywood', county: 'Broward', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=70', type: 'condo', features: ['A 1 cuadra del mar', 'Renta corta permitida'] },
  { title: 'Boca Raton Polo Club Home', price: 2_120_000, beds: 4, baths: 4, sqft: 3680, city: 'Boca Raton', county: 'Palm Beach', image: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1200&q=70', type: 'single-family', features: ['Country club', 'Golf course view'] },
  { title: 'West Palm Beach Lofts (8 unidades)', price: 4_900_000, beds: 16, baths: 12, sqft: 9800, city: 'West Palm Beach', county: 'Palm Beach', image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=70', type: 'multi-family', features: ['8 unidades alquiladas', 'Cap rate 7.2%'] },
  { title: 'Lake Eola Tower Loft', price: 520_000, beds: 1, baths: 1, sqft: 980, city: 'Orlando', county: 'Orange', image: 'https://images.unsplash.com/photo-1505873242700-f289a29e1e0f?w=1200&q=70', type: 'condo', features: ['Downtown Orlando', 'Vista al lago'] },
  { title: 'Winter Park Bungalow', price: 720_000, beds: 3, baths: 2, sqft: 1840, city: 'Winter Park', county: 'Orange', image: 'https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=1200&q=70', type: 'single-family', features: ['Histórico restaurado', 'Backyard zen'] },
  { title: 'Lake Nona Smart Home', price: 1_050_000, beds: 4, baths: 3, sqft: 3050, city: 'Orlando', county: 'Orange', image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=70', type: 'single-family', hot: true, features: ['Tesla wallbox', 'Lutron lighting'] },
  { title: 'Hyde Park Townhome', price: 880_000, beds: 3, baths: 3, sqft: 2240, city: 'Tampa', county: 'Hillsborough', image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&q=70', type: 'townhome', features: ['Rooftop terrace', 'Bayshore a pie'] },
  { title: 'Tampa Downtown Office Floor', price: 6_200_000, beds: 0, baths: 4, sqft: 14_500, city: 'Tampa', county: 'Hillsborough', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=70', type: 'commercial', features: ['Triple net', 'Inquilino corporativo'] },
  { title: 'St. Petersburg Beach Bungalow', price: 695_000, beds: 3, baths: 2, sqft: 1520, city: 'St. Petersburg', county: 'Hillsborough', image: 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=1200&q=70', type: 'single-family', features: ['Walk to beach', 'Renovated 2024'] },
  { title: 'San Marco Historic Home', price: 940_000, beds: 4, baths: 3, sqft: 2780, city: 'Jacksonville', county: 'Duval', image: 'https://images.unsplash.com/photo-1598228723793-52759bba239c?w=1200&q=70', type: 'single-family', features: ['1928 restaurada', 'Wraparound porch'] },
  { title: 'Jacksonville Beach Condo', price: 460_000, beds: 2, baths: 2, sqft: 1280, city: 'Jacksonville', county: 'Duval', image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=70', type: 'condo', features: ['Frente al mar', 'Resort amenities'] },
  { title: 'Cape Coral Canal Home', price: 780_000, beds: 3, baths: 2, sqft: 2010, city: 'Cape Coral', county: 'Lee', image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200&q=70', type: 'single-family', features: ['Acceso al golfo', 'Boat lift'] },
  { title: 'Naples Bay Tower Residence', price: 3_850_000, beds: 4, baths: 5, sqft: 4220, city: 'Naples', county: 'Collier', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=70', type: 'condo', hot: true, features: ['Servicio concierge', 'Vista 270°'] },
  { title: 'Naples Equestrian Estate', price: 5_200_000, beds: 6, baths: 7, sqft: 7100, city: 'Naples', county: 'Collier', image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=70', type: 'single-family', features: ['12 acres', 'Establo 8 boxes'] },
  { title: 'Sarasota Lido Beach Suite', price: 1_180_000, beds: 2, baths: 2, sqft: 1620, city: 'Sarasota', county: 'Hillsborough', image: 'https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=1200&q=70', type: 'condo', features: ['Pies en arena', 'Rentas autorizadas'] },
  { title: 'Hialeah Income Duplex', price: 540_000, beds: 4, baths: 2, sqft: 1800, city: 'Hialeah', county: 'Miami-Dade', image: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=1200&q=70', type: 'multi-family', features: ['Ambas unidades rentadas', 'Cap 6.8%'] },
  { title: 'Brickell Studio Investment', price: 365_000, beds: 0, baths: 1, sqft: 540, city: 'Miami', county: 'Miami-Dade', image: 'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=1200&q=70', type: 'condo', features: ['Renta corta', 'Pool deck'] },
  { title: 'Wynwood Mixed-Use Building', price: 4_300_000, beds: 0, baths: 6, sqft: 8200, city: 'Miami', county: 'Miami-Dade', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=70', type: 'commercial', features: ['Retail + 6 lofts', 'Zona arte'] },
  { title: 'Davie 3-acre Build Site', price: 1_350_000, beds: 0, baths: 0, sqft: 0, city: 'Davie', county: 'Broward', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=70', type: 'land', features: ['Zonificado mixto', 'Frente a vía principal'] },
  { title: 'Pembroke Pines Family Home', price: 685_000, beds: 4, baths: 3, sqft: 2410, city: 'Pembroke Pines', county: 'Broward', image: 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=1200&q=70', type: 'single-family', features: ['Pool', 'Cul-de-sac'] },
  { title: 'Sunny Isles Oceanfront 38F', price: 2_640_000, beds: 3, baths: 3, sqft: 2380, city: 'Sunny Isles', county: 'Miami-Dade', image: 'https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?w=1200&q=70', type: 'condo', hot: true, features: ['Servicio beach club', 'Spa'] },
  { title: 'Coconut Grove Eco Townhome', price: 1_120_000, beds: 3, baths: 3, sqft: 2050, city: 'Miami', county: 'Miami-Dade', image: 'https://images.unsplash.com/photo-1600566753086-00f18fe6ba93?w=1200&q=70', type: 'townhome', features: ['LEED Silver', 'Roof garden'] },
  { title: 'Key Biscayne Beach Cottage', price: 3_100_000, beds: 4, baths: 4, sqft: 3540, city: 'Key Biscayne', county: 'Miami-Dade', image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=70', type: 'single-family', features: ['Beach access', 'Boat slip incluido'] },
  { title: 'Pinecrest Modern Estate', price: 2_780_000, beds: 5, baths: 5, sqft: 4880, city: 'Pinecrest', county: 'Miami-Dade', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=70', type: 'single-family', features: ['Pool / spa', 'Cocina exterior'] },
  { title: 'Bal Harbour Penthouse', price: 6_900_000, beds: 5, baths: 6, sqft: 6420, city: 'Bal Harbour', county: 'Miami-Dade', image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&q=70', type: 'condo', hot: true, features: ['Terraza 1200 sqft', 'Servicio 24/7'] },
];

function zipFor(county: Property['county'], i: number): string {
  const base: Record<Property['county'], number> = {
    'Miami-Dade': 33101,
    Broward: 33301,
    'Palm Beach': 33401,
    Orange: 32801,
    Hillsborough: 33601,
    Duval: 32201,
    Lee: 33901,
    Collier: 34102,
  };
  return String(base[county] + (i % 40));
}

export const PROPERTIES: Property[] = SEED.map((p, i) => {
  const status: PropertyStatus =
    i % 13 === 0 ? 'pending' : i % 17 === 0 ? 'sold' : i % 23 === 0 ? 'off-market' : 'active';
  const days = (i * 7 + 3) % 120;
  return {
    id: `p-${(i + 1).toString().padStart(3, '0')}`,
    mls: `R10${740000 + i * 137}`,
    type: p.type ?? TYPES[i % TYPES.length],
    status,
    yearBuilt: 1975 + ((i * 13) % 50),
    address: `${1000 + i * 47} ${['Brickell', 'Ocean', 'Coral', 'Palm', 'Sunset', 'Royal', 'Bay', 'Marina'][i % 8]} ${['Ave', 'Blvd', 'Dr', 'Way'][i % 4]}`,
    zip: zipFor(p.county, i),
    agentId: `u-${((i % 30) + 1).toString().padStart(3, '0')}`,
    listedAt: new Date(Date.now() - days * 86400_000).toISOString().slice(0, 10),
    daysOnMarket: days,
    views: 320 + ((i * 173) % 4800),
    saves: 8 + ((i * 17) % 95),
    leads: 2 + ((i * 11) % 28),
    lotSqft: p.type === 'land' ? 130_000 + i * 1100 : p.sqft && p.sqft > 0 ? p.sqft * 3 : undefined,
    features: p.features ?? [],
    gallery: [p.image, p.image, p.image],
    ...p,
  } as Property;
});
