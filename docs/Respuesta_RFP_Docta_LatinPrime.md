# Latin Prime Systems — Respuesta a Solicitud de Definiciones Técnicas, Costos y Condiciones Operativas

**Para:** Docta Consulting LLC / RD Exchange
**De:** Latin Prime Systems
**Asunto:** Propuesta estructurada como Infra Partner estratégico — Reunión de Alineación
**Fecha:** [COMPLETAR]

> Este documento responde, punto por punto, a la solicitud de Docta Consulting. Las cifras de costo son estimaciones de referencia para la primera etapa y se ajustarán según el alcance final acordado. Los campos marcados `[COMPLETAR]` se llenarán con datos oficiales de la empresa antes de la firma.

---

## 1. Resumen ejecutivo

Latin Prime Systems propone construir y operar la infraestructura tecnológica de **RD Exchange**: un ecosistema de adquisición inmobiliaria que captura leads, **enriquece cada propiedad con datos reales** (valuación, impuestos, hipoteca, propietario y equity), permite que un **agente de IA califique y genere ofertas preliminares**, y se comunica con los dueños vía **SMS y WhatsApp** bajo compliance de EE.UU.

Nuestra ventaja no es revender un CRM genérico: es un **motor propietario de enriquecimiento + IA de ofertas** ya funcional, montado sobre herramientas líderes (GoHighLevel, n8n, Twilio) que **quedan a nombre de Docta** para garantizar control y continuidad.

**Diferenciador clave — ya tenemos un demo funcional en vivo** que, a partir de una dirección real de EE.UU., extrae datos de ATTOM (incluida hipoteca y equity estimado), calcula una oferta y un agente de IA (Claude) redacta el mensaje al propietario. Lo presentaremos en vivo en la reunión.

---

## 2. Definiciones técnicas

### 2.1 Identidad, empresa y equipo

| Dato | Detalle |
|---|---|
| Nombre legal de la empresa prestadora | `[COMPLETAR — razón social exacta]` |
| Relación Latin Prime Systems / Latin Prime FG / otras entidades | `[COMPLETAR — estructura societaria]` |
| Sitio web oficial | `[COMPLETAR]` |
| LinkedIn empresa / responsables | `[COMPLETAR]` |
| Dirección comercial y registro en EE.UU. | `[COMPLETAR]` |
| Responsable directo del proyecto | `[COMPLETAR — nombre, rol]` |
| Equipo asignado primeros 90 días | `[COMPLETAR — roles: lead técnico, integraciones, IA/datos, soporte]` |

### 2.2 Experiencia y evidencia

Posición transparente: presentamos **capacidad técnica demostrada**, no historial inflado.

- **Evidencia principal — demo funcional en vivo** (descrito en §1 y mostrado en la reunión): enriquecimiento real ATTOM + agente IA generando una oferta sobre una dirección que Docta elija en el momento.
- Repositorio de código y entorno staging disponibles para auditoría técnica.
- Casos / referencias previas: `[COMPLETAR — listar solo lo verificable; no incluir nada que no resista verificación]`.
- Experiencia específica en real estate / A2P 10DLC aprobado: `[COMPLETAR con honestidad — si no existe, se sustituye por dominio demostrado del proceso de compliance, ver §2.4]`.

> **Nota de integridad:** No declaramos clientes, métricas ni registros A2P que no podamos comprobar. Donde no haya historial, lo compensamos con el entorno funcional verificable.

### 2.3 CRM y pipeline operativo

**Plataforma recomendada: GoHighLevel (GHL)** como núcleo CRM/comunicaciones, por:
- CRM + pipelines + **multiusuario y roles** nativos (admin, operador, agencia, broker, inversor).
- **SMS y WhatsApp integrados** con soporte de registro **A2P 10DLC**.
- Automatizaciones internas + webhooks para conectar con nuestro motor.
- **Cuentas a nombre de Docta** → control y transferencia garantizados (ver §3.4).

**Orquestación: n8n** (self-hosted o cloud) para los flujos entre GHL, las APIs de datos y el motor de IA.

**Motor propietario Latin Prime** (lo que ya construimos): enriquecimiento de propiedad + cálculo de oferta + redacción con IA, expuesto como servicio que GHL/n8n consumen.

**Estados de pipeline sugeridos:** Lead frío → Contactado → Interesado → Propiedad en análisis → Oferta preliminar enviada → En negociación → Cita/Deal → (Marketplace).

**Exportación / migración:** datos exportables desde GHL (CSV/API) y base de datos propia (PostgreSQL) en cualquier momento. Sin lock-in.

### 2.4 WhatsApp, SMS y compliance USA

| Tema | Definición |
|---|---|
| Proveedor SMS | **Twilio** (estándar de la industria, soporte A2P 10DLC) |
| Proveedor WhatsApp | **WhatsApp Business API** vía Twilio o GHL |
| A2P 10DLC | **Obligatorio.** Desde feb-2025 los carriers bloquean el 100% del tráfico no registrado. Gestionamos brand + campaign registration. |
| Opt-in / opt-out | Manejo de **STOP/unsubscribe** automático + **scrubbing DNC** + trazabilidad de consentimiento. |
| Estrategia anti-bloqueo | Mensajes cortos, personalizados, rotación de números, **warming** gradual de líneas, control de reputación. |
| Límite diario recomendado al inicio | Arrancar conservador (warming) y escalar a **100–300 SMS/día** según reputación. |
| Costos | Ver §3.2. SMS ~$0.0083/segmento + surcharges A2P; **ojo:** texto en español con acentos = 70 char/segmento. |

> ⚠️ **Aviso de compliance (responsabilidad compartida):** el envío en frío bajo TCPA exige consentimiento adecuado; las multas van de **$500 a $1,500 por mensaje**. Latin Prime construye el sistema con opt-out, DNC y trazabilidad integrados; **la estrategia de consentimiento y su validación legal son responsabilidad de Docta** (recomendamos revisión con abogado especializado en TCPA, especialmente por la regla FCC vigente desde ene-2026).

### 2.5 Automatización, IA y enriquecimiento de datos

**Orquestación:** n8n + workflows de GHL. Operaciones estimadas para ~150 leads/día: ver §3.2.

**Agente de IA — modelo propuesto: Claude (Anthropic).**
- **Claude Opus 4.8** para razonamiento/redacción de ofertas; **Claude Haiku** para respuestas SMS cortas (costo-eficiente).
- Capacidades del agente (Fase 1 → progresivo):
  - Responder e interpretar mensajes entrantes.
  - **Calificar leads** y pedir datos faltantes.
  - Enriquecer la propiedad y **sugerir estrategia/rango de oferta**.
  - Priorizar oportunidades (ej. dueño ausente + alto equity).
- **Control de errores (crítico):** el **monto de la oferta se calcula en código (determinista), NO lo inventa la IA**. La IA solo redacta el mensaje alrededor de cifras fijas. Lenguaje obligatorio "preliminar / no vinculante / sujeto a inspección".
- **Límite IA vs humano (definido):**
  - **Automático (IA):** primer contacto **+ primera oferta preliminar** → enviado por **SMS y email** sin intervención.
  - **Humano:** atiende la respuesta del lead y **envía la oferta final** (la cifra en firme la confirma y manda una persona, no la IA).

**Fuentes de enriquecimiento:**
- **ATTOM Data** (ya integrado y verificado): valuación AVM, impuestos, historial de ventas, **hipoteca, propietario, equity estimado, flag de dueño ausente**.
- **BatchData/BatchLeads** (recomendado sumar): **skip tracing** — teléfono/email del dueño + armado de listas off-market + DNC. Precio transparente (~$0.05/registro).
- Zillow/MLS: **no viable** como API abierta (gated vía Bridge, solo brokers); no se recomienda depender de scraping.
- **Ficha automática por propiedad:** sí — generada automáticamente con todos los datos ATTOM (ya funciona en el demo).

**Frescura de datos (transparencia):** ATTOM se nutre de registros públicos con releases ~semanales a la API; valuación ~mensual; impuestos anuales. Ideal para valuar y ofertar; no es un feed en vivo de "qué pasó ayer". La hipoteca es el **préstamo registrado**, no el saldo exacto al día.

### 2.6 Marketplace

- **Recomendación: Fase posterior** (no Fase 1). Primero validar el motor de adquisición (leads → ofertas → deals).
- **Alcance mínimo viable (futuro):** publicar propiedades propias y de terceros, roles (broker/inversor/comprador), **trazabilidad de origen del deal** y **control de comisiones**.
- Se diseñará sobre la misma base de datos para no duplicar información.

---

## 3. Costos, fases y condiciones

> Dos cubetas separadas, como solicitan: **(A) honorarios Latin Prime** (setup + servicio) y **(B) licencias/herramientas de terceros** (las paga Docta directamente o se incluyen con markup — a definir).

### 3.1 Costos de implementación / setup (por fase)

**Fase 1 — Mínima viable (60–90 días).** Entregables:

| Componente | Entregable |
|---|---|
| Discovery y arquitectura | Documento de arquitectura + accesos |
| Configuración GHL | CRM, pipelines, roles, multiusuario |
| SMS + A2P 10DLC | Twilio configurado + registro A2P iniciado/aprobado |
| WhatsApp | Línea Business conectada |
| Automatizaciones (n8n) | Flujos lead → enriquecimiento → respuesta IA |
| Enriquecimiento de datos | ATTOM (+ BatchData) integrado, ficha por propiedad |
| Agente IA | Calificación + redacción de oferta con revisión humana |
| Dashboard | Reporte de leads, respuestas, ofertas |
| Testing + Documentación + Capacitación | Entorno staging, docs, training al equipo Docta |

Marketplace, enriquecimiento multi-fuente avanzado y performance share → **Fases 2–3**.

### 3.2 Costos mensuales de herramientas (terceros) — objetivo 100–300 SMS/día

| Herramienta | Función | Costo mensual estimado |
|---|---|---|
| **GoHighLevel** | CRM, SMS/WhatsApp, automatización, multiusuario | ~$97–$497 según plan |
| **Twilio** (SMS/WhatsApp) | Envío de mensajes | ~$50–$200 + ~$65 registro A2P (una vez) |
| **BatchData** (skip tracing + data) | Teléfonos + enriquecimiento + listas | ~$450–$700 ($0.05/registro) |
| **ATTOM** | Valuación, hipoteca, equity, propietario | Cotización con ATTOM (estimado ~$200+) |
| **Claude (Anthropic)** | Agente IA (Opus + Haiku) | ~$20–$50 (uso) |
| **Supabase** (DB + backend) | PostgreSQL + serverless | ~$25 |
| **Hosting** (frontend/dashboards) | CDN | ~$0–$20 |
| **Google Workspace / Email / Dominio** | Correo + dominio | Existente / ~$15/año |
| **TOTAL herramientas** | | **≈ $900 – $1,700 / mes** (escala con volumen) |

**Costos variables (referencia):**
- SMS: ~$0.0083/segmento · Conversación WhatsApp: ~$0.005–0.08 según país/categoría · IA: ~$0.04–0.06/oferta (Opus), centavos/SMS (Haiku) · Enriquecimiento: ~$0.05/propiedad (BatchData) o cotización ATTOM · Usuario adicional / volumen extra de leads: según plan GHL/datos.

> Indicaremos claramente en el contrato qué paga Docta directamente (recomendado para APIs que escalan con su volumen) y qué se incluye en el fee.

### 3.3 Tres escenarios de inversión (honorarios Latin Prime)

> Cifras de referencia para negociación; el fee de Latin Prime es independiente de las licencias de §3.2.

| Escenario | Setup (una vez) | Mensual (servicio LP) | Incluye |
|---|---|---|---|
| **Mínimo viable** | ~$12,000 | ~$2,500/mes | Fase 1: GHL + SMS + 1 agente IA + enriquecimiento + dashboard |
| **Robusto** | ~$30,000 | ~$10,000/mes | + WhatsApp, automatizaciones completas, multiusuario/roles, soporte ampliado |
| **Escalable** | A definir | Base + **performance** | + Marketplace, multi-fuente, e **incentivo por resultados / participación en facturación** generada |

**Modelos combinados (abiertos a negociar, como plantea Docta §3.5):** base mensual + **bono por deal cerrado** o **revenue-share** sobre la facturación que genere la infraestructura. Esto alinea incentivos: Docta paga más cuando la infraestructura produce más.

> El mensual se justifica por **ROI**, no por "mantenimiento": si la máquina (100–300 SMS/día) origina deals con utilidad de [X] por cierre, el fee es una fracción del valor generado. Cuantificaremos esto con los números reales de Docta en la reunión.

### 3.4 Propiedad, control y transferencia

Confirmamos por escrito:

- **Cuentas a nombre de Docta:** GHL, Twilio, ATTOM/BatchData, Supabase, dominios — todas bajo titularidad de Docta.
- **Dueño de los datos:** Docta. 100% exportables.
- **Workflows, integraciones y configuraciones** desarrollados para Docta → **bajo control de Docta**, documentados y entregados.
- **PI previa de Latin Prime** (el motor base de enriquecimiento/oferta): se licencia a Docta para su uso; el código específico desarrollado para Docta se entrega. (Términos exactos de licencia/cesión a acordar.)
- **Si Docta cambia de proveedor:** entregamos accesos, documentación y exportación completa; plan de transición ordenado.
- **Disponibilidad para firmar NDA, confidencialidad, cláusulas de PI y acuerdo de transferencia de activos digitales:** **Sí.**

### 3.5 Soporte, garantías y continuidad

| Nivel | Tiempo de respuesta | Incluye |
|---|---|---|
| Básico | Siguiente día hábil | Bugs no críticos, ajustes menores |
| Extendido | Mismo día hábil | Cambios de flujo, soporte operativo |
| Crítico / 24-7 | `[definir SLA, ej. 1–4 h]` | Caídas de integración o de envío |

- **Garantía:** si una integración entregada deja de funcionar en los primeros [X] meses por causa nuestra, se corrige sin costo.
- **Hitos de pago contra entregables verificables:** **Sí, aceptamos.**
- **Continuidad:** backups automáticos, recuperación ante fallos, exportación completa de datos.

---

## 4. Roadmap 30 / 60 / 90 días

| Período | Hitos |
|---|---|
| **0–30 días** | Discovery + arquitectura · GHL configurado (CRM/pipelines/roles) · ATTOM+BatchData integrados · registro A2P iniciado · primer flujo lead→enriquecimiento→IA en staging |
| **30–60 días** | SMS+WhatsApp en vivo (A2P aprobado) · agente IA calificando y redactando ofertas con revisión humana · dashboard · pruebas con volumen real (warming) |
| **60–90 días** | Operación a 100–300 SMS/día · ajustes de conversión · documentación + capacitación · cierre de Fase 1 y definición de Fase 2 (marketplace / multi-fuente) |

---

## 5. Para la reunión — Demo en vivo

Llevaremos entorno funcional para mostrar (cubre varios de los puntos solicitados por Docta):

- ✅ **Agente IA enriqueciendo y evaluando una propiedad real** (dirección elegida por Docta en el momento).
- ✅ **Enriquecimiento de datos** ATTOM: valuación, impuestos, **hipoteca, equity, propietario**.
- ✅ **Generación de oferta preliminar** + redacción del mensaje por IA.
- ✅ **Dashboard / ficha** de propiedad.
- 🔜 CRM/pipeline (GHL) e integración Twilio/WhatsApp: a configurar en Fase 1 (mostramos arquitectura y flujo).

**Cierres esperados de la reunión:** stack, Fase 1 (60–90d), setup, mensual real, variables, soporte, propiedad de activos, roadmap, y condiciones del acuerdo como Infra Partner.

---

*Latin Prime Systems — [COMPLETAR contacto, web, responsable]*
