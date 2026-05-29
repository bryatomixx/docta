# Docta

Real-estate platform focused on **investor first-offer generation**.

## Packages

- **`docta-demo/`** — product app (Vite + React 19 + TypeScript, Tailwind v4).
  Includes the **ATTOM property-enrichment** backend: a pure TypeScript module
  (`supabase/functions/_shared/enrichment/`) exposed via a Supabase Edge
  Function (`enrich-property`) that persists to Supabase Postgres
  (`enriched_properties`, keyed by `attomId`). UI: an `/enrich` page (sidebar
  "Enriquecer").
- **`docta-proposal/`** — single-page sales proposal for Docta Consulting LLC,
  by Latin Prime Systems.

## Docs

- `docs/2026-05-29-docta-attom-enrichment-design.md` — enrichment spec
- `docs/2026-05-29-docta-attom-enrichment.md` — implementation plan

## Setup (docta-demo)

```bash
cd docta-demo
npm install
npm run dev        # SPA dev server
npm run test       # vitest (enrichment module)
npm run build      # tsc -b && vite build
```

### Enrichment backend (Supabase Edge Function)

Requires a Supabase project and an ATTOM API key. Set secrets (never commit):

```
ATTOM_API_KEY=...
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

Then: apply `docta-demo/supabase/migrations/0001_enriched_properties.sql`
(`supabase db push`), `supabase secrets set --env-file docta-demo/supabase/functions/.env`,
and `supabase functions deploy enrich-property`. The service-role key is
server-side only.
