export type Bullet = string

export interface PillarCard {
  numeral: string
  title: string
  body: string
}

export interface Capability {
  numeral: string
  title: string
  tag: string
  description: string
  bullets: Bullet[]
}

export interface Phase {
  code: string
  title: string
  duration: string
  description: string
  items: string[]
}

export interface SupportFeature {
  title: string
  body: string
}

export interface InvestmentPhase {
  code: string
  title: string
  duration: string
  price: string
  terms: string
  deliverables: string[]
}

export interface NextStep {
  numeral: string
  title: string
  body: string
}

export interface ProposalData {
  meta: {
    ref: string
    confidential: string
    year: string
    preparedFor: string
    preparedBy: string
  }
  cover: {
    eyebrow: string
    titleLines: { text: string; italic?: boolean; indent?: boolean }[]
    subtitle: string
  }
  summary: {
    number: string
    eyebrow: string
    title: { pre: string; em: string; post: string }
    paragraphs: { text: string; lead?: boolean }[]
  }
  understanding: {
    number: string
    eyebrow: string
    title: { pre: string; em: string; post: string }
    intro: string
    cards: PillarCard[]
  }
  vision: {
    number: string
    eyebrow: string
    title: { line1: string; line2: string }
    body: string
  }
  capabilities: {
    number: string
    eyebrow: string
    title: { pre: string; em: string; post: string }
    intro: string
    items: Capability[]
  }
  methodology: {
    number: string
    eyebrow: string
    title: { pre: string; em: string; post: string }
    intro: string
    phases: Phase[]
  }
  support: {
    number: string
    eyebrow: string
    title: { pre: string; em: string; post: string }
    description: string
    features: SupportFeature[]
  }
  investment: {
    number: string
    eyebrow: string
    title: { pre: string; em: string; post: string }
    intro: string
    phases: InvestmentPhase[]
    retainer: {
      eyebrow: string
      title: { pre: string; em: string }
      price: string
      cadence: string
      note: string
      items: string[]
    }
    disclaimer: string
  }
  whyLps: {
    number: string
    eyebrow: string
    title: { pre: string; em: string; post: string }
    quote: string
    pillars: PillarCard[]
  }
  nextSteps: {
    number: string
    eyebrow: string
    title: { pre: string; em: string; post: string }
    intro: string
    steps: NextStep[]
    cta: {
      title: { pre: string; em: string; post: string }
      body: string
      contacts: { label: string; value: string }[]
    }
  }
  footer: { lines: string[] }
}

export const proposal: ProposalData = {
  meta: {
    ref: 'Ref. LPS-DCC-2026',
    confidential: 'Documento Confidencial',
    year: 'Propuesta Estratégica · 2026',
    preparedFor: 'Docta Consulting LLC',
    preparedBy: 'Latin Prime Systems',
  },

  cover: {
    eyebrow: 'PROPUESTA DE PARTNER TECNOLÓGICO',
    titleLines: [
      { text: 'Una infraestructura' },
      { text: 'construida para escalar', italic: true, indent: true },
      { text: 'su ecosistema inmobiliario.' },
    ],
    subtitle:
      'Plataforma centralizada, multiusuario y multicanal para potenciar las operaciones de adquisición, gestión y comercialización de propiedades de Docta Consulting en todo el estado de Florida.',
  },

  summary: {
    number: '01',
    eyebrow: 'RESUMEN EJECUTIVO',
    title: { pre: 'Una visión ', em: 'compartida', post: '.' },
    paragraphs: [
      {
        lead: true,
        text: 'Docta Consulting no está buscando un proveedor. Está buscando un socio tecnológico que entienda que la infraestructura digital no es una herramienta de soporte — es el motor que define cuánto, cuán rápido y cuán bien puede crecer un ecosistema inmobiliario.',
      },
      {
        text: 'Hemos estudiado a fondo el alcance solicitado: una plataforma robusta, segura y escalable que conecte múltiples usuarios, canales de marketing y oportunidades de negocio en una sola operación. Lo que ustedes describen no es un proyecto único — es la columna vertebral operativa de su organización durante los próximos años.',
      },
      {
        text: 'Esta propuesta plantea exactamente eso: una arquitectura completa que centraliza la captación multicanal, el CRM avanzado, el marketplace de propiedades, la gestión multiusuario con permisos granulares, y las automatizaciones de campaña. Todo respaldado por un esquema de implementación por fases, soporte operativo 24/7/365 real, y un compromiso de partnership de largo plazo.',
      },
      {
        text: 'Construyamos algo grande juntos — pero hagámoslo bien desde el primer día.',
      },
    ],
  },

  understanding: {
    number: '02',
    eyebrow: 'LO QUE ENTENDEMOS',
    title: { pre: 'Su ', em: 'realidad', post: ' operativa.' },
    intro:
      'Antes de proponer una solución, queremos demostrar que hemos comprendido el contexto en su totalidad. Estos son los cuatro pilares operativos que extraemos de su solicitud — y los retos reales que enfrenta cualquier ecosistema inmobiliario de este tamaño en el mercado de Florida.',
    cards: [
      {
        numeral: 'I',
        title: 'Escala multiusuario real',
        body: 'Entre 100 y 150 usuarios concurrentes con roles diferenciados — realtors, marketers, operadores, inversores — exige una capa de permisos granulares, auditoría de actividad y aislamiento de datos sensibles que sistemas genéricos no soportan sin reingeniería.',
      },
      {
        numeral: 'II',
        title: 'Captación multicanal sin fugas',
        body: 'Leads entrando simultáneamente desde Ads, formularios, llamadas, SMS, WhatsApp, email y eventos físicos deben converger en un solo embudo, con atribución limpia y enrutamiento automático al usuario correcto en segundos. Cada lead perdido es un deal perdido.',
      },
      {
        numeral: 'III',
        title: 'Marketplace como activo',
        body: 'Una plataforma de propiedades publicada y gestionada internamente no es una vitrina — es un activo digital que genera tráfico orgánico, captura demanda y se integra al pipeline de deals. Su valor crece con el tiempo si está bien arquitectado desde el inicio.',
      },
      {
        numeral: 'IV',
        title: 'Operación siempre activa',
        body: 'Real estate no descansa. Una caída en una campaña de WhatsApp un viernes a las 10pm, o un error de captura un sábado por la mañana, es revenue perdido directo. Por eso el soporte 24/7/365 que ustedes solicitan no es opcional — es el estándar correcto.',
      },
    ],
  },

  vision: {
    number: '03',
    eyebrow: 'LA SOLUCIÓN PROPUESTA',
    title: {
      line1: 'Una infraestructura propietaria diseñada específicamente para su ecosistema —',
      line2: 'no un producto de catálogo adaptado a la fuerza.',
    },
    body: 'Latin Prime Systems propone construir, desplegar y mantener una plataforma operativa integral que unifica los cinco pilares solicitados en una sola experiencia para sus equipos. La arquitectura técnica se define conjuntamente durante la fase de Discovery, garantizando que cada decisión tecnológica responda a un objetivo de negocio medible y no a una preferencia de stack.',
  },

  capabilities: {
    number: '04',
    eyebrow: 'LAS CINCO ÁREAS',
    title: { pre: 'Cómo lo ', em: 'resolvemos', post: '.' },
    intro:
      'A continuación detallamos cómo Latin Prime Systems implementa cada uno de los cinco pilares solicitados en su brief. Cada área se entrega como un módulo funcional independiente pero interconectado, permitiendo evolución por separado sin afectar la integridad del sistema completo.',
    items: [
      {
        numeral: 'i',
        title: 'Captación Multicanal',
        tag: 'Pilar 01 · Adquisición',
        description:
          'Unificamos todas las fuentes de generación de leads en un único pipeline con atribución limpia, enrutamiento inteligente y respuesta automatizada en menos de 60 segundos desde la primera interacción.',
        bullets: [
          'Integración con Meta Ads, Google Ads, TikTok Ads y fuentes orgánicas',
          'Captura desde formularios web, landings, QR codes y eventos presenciales',
          'Conexión nativa con WhatsApp Business API, Twilio SMS, email transaccional y llamadas entrantes',
          'Sistema anti-duplicados con merge automático de contactos por número y email',
          'Atribución multi-touch para entender qué canal cierra qué tipo de deal',
        ],
      },
      {
        numeral: 'ii',
        title: 'Base de Datos & CRM Avanzado',
        tag: 'Pilar 02 · Inteligencia',
        description:
          'El corazón de la operación: una base de datos centralizada, segura y escalable que actúa como única fuente de verdad para toda la organización. Cada lead, contacto, propiedad y deal vive en un mismo lugar con historial completo.',
        bullets: [
          'Pipeline de deals completamente personalizable por tipo de negocio y estrategia',
          'Historial completo de interacciones por contacto: emails, llamadas, mensajes, citas',
          'Segmentación dinámica por comportamiento, fuente, etapa y valor estimado',
          'Notas internas, archivos adjuntos y tareas colaborativas entre miembros del equipo',
          'Reportería ejecutiva en tiempo real: conversión por canal, velocidad de pipeline, forecasting',
        ],
      },
      {
        numeral: 'iii',
        title: 'Marketplace Completo',
        tag: 'Pilar 03 · Distribución',
        description:
          'Plataforma propia de publicación y gestión de propiedades, diseñada como activo digital de largo plazo. Optimizada para conversión, SEO local en Florida y experiencia tanto para clientes finales como para los equipos internos que la operan.',
        bullets: [
          'Listado de propiedades con búsqueda avanzada, filtros geográficos y mapas interactivos',
          'Diferentes tipos de negocio y estrategias soportadas: venta, alquiler, inversión, lease-to-own',
          'Galería multimedia con fotos, videos, recorridos virtuales y planos descargables',
          'Sistema de leads conectado directo al CRM: cada interés genera contacto enrutado al realtor correcto',
          'Accesos y permisos diferenciados para publicación, edición y aprobación de listings',
        ],
      },
      {
        numeral: 'iv',
        title: 'Multiusuarios & Permisos',
        tag: 'Pilar 04 · Gobernanza',
        description:
          'Arquitectura preparada para 100-150 usuarios desde el día uno, con escalabilidad probada hasta el doble sin reingeniería. Cada rol con acceso exactamente a lo que necesita, ni más ni menos.',
        bullets: [
          'Roles preconfigurados: Realtor, Marketer, Operador, Inversor, Admin y Soporte',
          'Permisos granulares por módulo: ver, editar, aprobar, exportar, eliminar',
          'Aislamiento de datos: cada realtor ve únicamente sus leads y propiedades asignadas',
          'Auditoría completa de acciones: quién hizo qué, cuándo y desde dónde',
          'Onboarding documentado y capacitación grabada para acelerar la incorporación de nuevos usuarios',
        ],
      },
      {
        numeral: 'v',
        title: 'Automatizaciones & Campañas',
        tag: 'Pilar 05 · Ejecución',
        description:
          'Aquí está el verdadero diferencial competitivo: flujos de seguimiento automático, campañas en frío inteligentes y orquestación de comunicaciones que liberan a los realtors de trabajo operativo para que se enfoquen en cerrar.',
        bullets: [
          'Campañas en frío automatizadas por email, SMS y WhatsApp con personalización dinámica',
          'Secuencias de seguimiento por tipo de lead, etapa del pipeline y nivel de engagement',
          'Reactivación automática de leads inactivos con triggers de comportamiento',
          'Integración con Twilio, Meta Ads API, Google Ads API y demás herramientas críticas',
          'Inteligencia artificial conversacional para calificación inicial 24/7 antes de pasar al realtor',
        ],
      },
    ],
  },

  methodology: {
    number: '05',
    eyebrow: 'METODOLOGÍA',
    title: { pre: 'Implementación ', em: 'por fases', post: '.' },
    intro:
      'No creemos en proyectos monolíticos de seis meses sin entregas intermedias. Estructuramos el trabajo en cuatro fases con entregables medibles, permitiendo validar valor real en cada etapa antes de avanzar a la siguiente.',
    phases: [
      {
        code: 'Fase 01',
        title: 'Discovery & Diseño',
        duration: 'Semanas 1–3',
        description:
          'Inmersión profunda en su operación. Sesiones de trabajo con equipos clave, mapeo de procesos, definición técnica conjunta.',
        items: ['Auditoría operativa', 'Arquitectura técnica', 'Roadmap aprobado', 'Wireframes & UX'],
      },
      {
        code: 'Fase 02',
        title: 'MVP Funcional',
        duration: 'Semanas 4–10',
        description:
          'Construcción y despliegue del núcleo operativo: CRM, captura multicanal, primeros flujos automatizados y panel de administración.',
        items: ['CRM productivo', 'Integraciones core', 'Roles & permisos', 'Primeros 30 usuarios'],
      },
      {
        code: 'Fase 03',
        title: 'Escala & Marketplace',
        duration: 'Semanas 11–18',
        description:
          'Marketplace público, automatizaciones avanzadas, onboarding masivo de usuarios y refinamiento basado en feedback real de uso.',
        items: ['Marketplace en producción', 'Campañas automatizadas', '100+ usuarios activos', 'Dashboards ejecutivos'],
      },
      {
        code: 'Fase 04',
        title: 'Operación Continua',
        duration: 'Mes 5 en adelante',
        description:
          'Mantenimiento, soporte 24/7/365, evolución constante de la plataforma y desarrollo de nuevas capacidades según la operación lo demande.',
        items: ['Soporte premium', 'Mejora continua', 'Nuevos módulos', 'Optimización ROI'],
      },
    ],
  },

  support: {
    number: '06',
    eyebrow: 'SOPORTE & MANTENIMIENTO',
    title: { pre: 'Soporte ', em: 'premium', post: ' de verdad.' },
    description:
      'El real estate no opera de 9 a 5. Una propuesta de soporte 24/7/365 que no esté respaldada por estructura operativa es solo marketing. Latin Prime Systems entrega soporte continuo real, con tiempos de respuesta definidos por SLA y escalamiento documentado para incidentes críticos.',
    features: [
      {
        title: 'Monitoreo activo 24/7',
        body: 'Vigilancia continua de uptime, integraciones críticas, flujos de captura de leads y APIs externas. Detección y resolución antes de que ustedes lo noten.',
      },
      {
        title: 'Tiempo de respuesta garantizado',
        body: 'SLA de 15 minutos para incidentes críticos · 2 horas para issues funcionales · 24 horas para mejoras y solicitudes nuevas.',
      },
      {
        title: 'Mantenimiento preventivo continuo',
        body: 'Actualizaciones de seguridad, optimizaciones de performance, backups verificados diariamente y revisiones trimestrales de arquitectura.',
      },
      {
        title: 'Evolución del producto incluida',
        body: 'Nuevas funcionalidades, ajustes operativos y mejoras menores incluidos dentro del retainer mensual sin costos adicionales sorpresa.',
      },
    ],
  },

  investment: {
    number: '07',
    eyebrow: 'INVERSIÓN',
    title: { pre: 'Estructura ', em: 'transparente', post: ', sin sorpresas.' },
    intro:
      'La inversión está estructurada en dos componentes: implementación por fases con entregables verificables, y retainer mensual recurrente que cubre operación continua, soporte 24/7 y evolución del producto. Los rangos finales se confirman al cerrar la Fase de Discovery.',
    phases: [
      {
        code: 'Fase 01',
        title: 'Discovery & Diseño',
        duration: '3 semanas',
        price: 'USD 6,500 – 9,500',
        terms: 'Inversión única · 50% inicio · 50% entrega',
        deliverables: [
          'Auditoría operativa completa',
          'Arquitectura técnica documentada',
          'Roadmap detallado por sprint',
          'Wireframes y diseño UX/UI',
          'Aprobación formal de alcance',
        ],
      },
      {
        code: 'Fase 02',
        title: 'MVP Funcional',
        duration: '7 semanas',
        price: 'USD 18,000 – 26,000',
        terms: 'Pago en 3 hitos de avance',
        deliverables: [
          'CRM productivo y operativo',
          'Captura multicanal funcionando',
          'Sistema de roles y permisos',
          'Primeros flujos automatizados',
          'Onboarding inicial de 30 usuarios',
        ],
      },
      {
        code: 'Fase 03',
        title: 'Escala & Marketplace',
        duration: '8 semanas',
        price: 'USD 22,000 – 32,000',
        terms: 'Pago en 3 hitos de avance',
        deliverables: [
          'Marketplace público en producción',
          'Campañas automatizadas avanzadas',
          'Onboarding masivo a 100+ usuarios',
          'Dashboards ejecutivos en tiempo real',
          'Integraciones con todas las plataformas',
        ],
      },
    ],
    retainer: {
      eyebrow: 'Operación Continua · Fase 04',
      title: { pre: 'Retainer ', em: 'Mensual' },
      price: 'USD 3,800 – 5,500',
      cadence: '/ mes',
      note: 'Inicia al desplegar Fase 03 · Contrato anual con renovación automática',
      items: [
        'Soporte 24/7/365 con SLA garantizado',
        'Monitoreo activo de toda la plataforma',
        'Mantenimiento preventivo continuo',
        'Backups verificados diariamente',
        'Hasta 20 horas/mes de desarrollo evolutivo',
        'Optimizaciones de performance',
        'Actualizaciones de seguridad inmediatas',
        'Revisión trimestral de arquitectura',
      ],
    },
    disclaimer:
      'Los rangos reflejan el espectro de complejidad según hallazgos del Discovery. Cifras finales firmadas al cierre de Fase 01.',
  },

  whyLps: {
    number: '08',
    eyebrow: 'POR QUÉ LPS',
    title: { pre: 'El partner ', em: 'correcto', post: '.' },
    quote:
      'Latin Prime Systems no es una agencia de marketing digital. Somos una firma de implementación tecnológica especializada en construir infraestructura operativa para empresas de habla hispana en Estados Unidos y Latinoamérica.',
    pillars: [
      {
        numeral: 'i',
        title: 'Enfoque vertical',
        body: "Trabajamos exclusivamente con empresas que requieren infraestructura operativa real — no clientes que buscan 'una página web bonita'. Real estate, servicios financieros y operaciones multiestado son nuestro terreno natural.",
      },
      {
        numeral: 'ii',
        title: 'Operación bilingüe',
        body: 'Diseñamos y mantenemos sistemas pensando en operaciones bilingües desde la primera línea de código. Mensajes, dashboards, capacitaciones y soporte en español y en inglés, sin compromiso de calidad en ninguno.',
      },
      {
        numeral: 'iii',
        title: 'Stack moderno y abierto',
        body: 'Trabajamos con las plataformas más sólidas del mercado: CRMs empresariales, motores de automatización, APIs nativas e inteligencia artificial conversacional. La elección técnica responde a su negocio, no a comisiones de proveedores.',
      },
      {
        numeral: 'iv',
        title: 'Compromiso real de partnership',
        body: 'Cuando ustedes piden un partner de largo plazo, lo tomamos literalmente. Contratos transparentes, comunicación directa con quien construye, sin capas de account managers que diluyen el conocimiento del proyecto.',
      },
    ],
  },

  nextSteps: {
    number: '09',
    eyebrow: 'PRÓXIMOS PASOS',
    title: { pre: 'Construyamos algo ', em: 'grande', post: ' juntos.' },
    intro:
      'Esta propuesta es el punto de partida, no el documento final. La verdadera solución se define en conjunto durante las primeras semanas de trabajo. Aquí está cómo avanzamos:',
    steps: [
      {
        numeral: 'i',
        title: 'Reunión de alineamiento',
        body: 'Sesión de 60 minutos con el liderazgo de Docta Consulting para profundizar en la visión operativa, validar alcance y resolver cualquier pregunta técnica o comercial sobre esta propuesta.',
      },
      {
        numeral: 'ii',
        title: 'Carta de intención',
        body: 'Acuerdo no vinculante que reserva la capacidad operativa de Latin Prime Systems y permite iniciar Discovery dentro de los siguientes 7 días, asegurando arranque ágil sin retrasos contractuales.',
      },
      {
        numeral: 'iii',
        title: 'Kickoff de Discovery',
        body: 'Inicio formal de Fase 01 con cronograma firmado, equipo asignado y primera sesión de inmersión operativa. A partir de aquí, todo es ejecución.',
      },
    ],
    cta: {
      title: { pre: '¿Listos para ', em: 'conversar', post: '?' },
      body: 'Reservemos esa primera reunión de alineamiento. Sin compromiso, sin presión — solo una conversación honesta sobre cómo construir esto bien desde el inicio.',
      contacts: [
        { label: 'Alex · Director LPS', value: 'alex@latinprimesystems.com' },
        { label: 'Email directo', value: 'alex@latinprimesystems.com' },
        { label: 'WhatsApp', value: 'Disponible bajo solicitud' },
      ],
    },
  },

  footer: {
    lines: [
      'Latin Prime Systems · División de Latin Prime Financial Group INC',
      'Documento Confidencial · Ref. LPS-DCC-2026',
      '© 2026 · Todos los derechos reservados',
    ],
  },
}
