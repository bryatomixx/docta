# Docta — ATTOM Property Enrichment Module — Design

**Date:** 2026-05-29
**Project:** `docta-demo` (Vite + React 19 + TypeScript SPA)
**Status:** Approved (design), pending implementation plan

## 1. Purpose

Add a property-enrichment module to the Docta product. Given a U.S. street
address, it calls the ATTOM Data API, extracts a clean structured record
(identifiers, characteristics, AVM valuation, assessment/tax, sale history),
persists it to Supabase Postgres keyed by `attomId`, and returns a typed object
ready for an AI agent to consume and draft a first purchase offer.

## 2. Context & constraints

`docta-demo` is currently a **frontend-only** SPA (Vite + React Router v7 in
SPA mode, Tailwind v4, mock data in `src/data/*.ts`). It has **no backend, no
database, no ORM, no env handling, and no test runner**. The current UI is
placeholder; the goal of this work is to make real enrichment function.

The module therefore cannot run in the browser:

- The ATTOM API key (`apikey` header) must never reach the client.
- Persistence requires a server-side DB client.

**Decided architecture (approved):**

- Core logic written as a **pure, host-agnostic TypeScript module**
  (`enrichProperty`) with its external dependencies (HTTP, repository, logger,
  config) **injected**, so it is fully unit-testable without a server.
- Exposed via a **thin Supabase Edge Function** (Deno/TypeScript), which holds
  the API key as a Supabase secret and writes directly to Supabase Postgres.
- The placeholder SPA consumes it later via a single `fetch`; no SPA routing or
  tooling is changed by this work.

## 3. File layout (inside `docta-demo/`)

Uses Supabase conventions — `functions/_shared/` holds code shared between
functions and is not deployed as a standalone function.

```
docta-demo/
  supabase/
    migrations/
      0001_enriched_properties.sql      # table + unique index on attom_id
    functions/
      enrich-property/
        index.ts                        # Edge Function handler (thin shell, Deno)
        deno.json                        # import map / config for the function
      _shared/
        enrichment/
          enrichProperty.ts             # orchestration (pure)
          attomClient.ts                # ATTOM HTTP: retries, backoff, timeout
          address.ts                    # normalize + split into address1/address2
          parse.ts                      # ATTOM JSON -> EnrichedProperty
          persistence.ts                # SupabaseRepository (EnrichmentRepository)
          logger.ts                     # audit logging
          config.ts                     # ATTOM base/endpoint + configurable AVM paths
          types.ts                      # EnrichedProperty + dependency interfaces
          errors.ts                     # typed errors
          deps.ts                       # createDefaultDeps(env) factory
          __tests__/
            address.test.ts
            attomClient.test.ts
            parse.test.ts
            enrichProperty.test.ts
            fixtures/
              allevents-detail.success.json
              allevents-detail.notfound.json
```

Tests run under **vitest** (added as a devDependency). `vitest.config.ts` is
configured to include `supabase/functions/_shared/**/*.test.ts`. The enrichment
module uses only portable APIs (standard `fetch`, `AbortController`) so the same
source runs under both Node (tests) and Deno (Edge Function).

## 4. Public interface

```ts
// enrichProperty.ts
export async function enrichProperty(
  address: string,
  deps?: EnrichDeps,
): Promise<EnrichedProperty>;
```

- `address` — a U.S. address as a single string.
- `deps` — optional injected dependencies; defaults to the real ones produced by
  `createDefaultDeps(env)`. Callers use `enrichProperty(addr)`; tests pass mocks.

```ts
// types.ts
export interface EnrichDeps {
  http: HttpClient;        // fetch wrapper used by attomClient
  repo: EnrichmentRepository;
  logger: Logger;
  config: AttomConfig;
}
```

Orchestration flow inside `enrichProperty`:

1. `parseAddress(address)` → `{ address1, address2 }`.
2. `attomClient.fetchAllEvents(address1, address2)` → raw ATTOM JSON (or typed error).
3. `parse(rawJson, config)` → `EnrichedProperty`.
4. `repo.upsert(record)` — always stores `attomId`.
5. Return the `EnrichedProperty`.
6. `logger` records the outcome of the operation (success / not_found / error)
   with timing, regardless of which branch is taken.

## 5. Address normalization (`address.ts`)

`parseAddress(raw: string): { address1: string; address2: string }`

- Collapse repeated whitespace, trim, normalize commas.
- `address1` = street number + street name (the portion before the city).
- `address2` = `City, ST ZIP` (locality, 2-letter state, ZIP).
- State is uppercased; ZIP kept as-is (5 or 9 digit).
- If the input has explicit commas, split on the first comma boundary between
  street and city. If no commas, apply a best-effort heuristic and still
  produce both parts.

These map to ATTOM's `address1` / `address2` query parameters. The exact
parameter names are confirmed by the ATTOM address-search contract; a TODO note
in `config.ts` points to the docs for re-verification.

## 6. ATTOM client (`attomClient.ts`)

- Request: `GET {base}allevents/detail?address1={a1}&address2={a2}`
  - `base` = `https://api.gateway.attomdata.com/propertyapi/v1.0.0/`
  - Headers: `apikey: <ATTOM_API_KEY>` (read from env, **never hardcoded**),
    `accept: application/json`.
- **Timeout:** ~10s via `AbortController`, configurable.
- **Retries:** up to 3 attempts with exponential backoff + jitter. Retry only on
  network errors, HTTP 429, and HTTP 5xx. Do **not** retry on 4xx (other than 429)
  or on a parsed "address not found".
- **Error handling reads the body, not just HTTP status:**
  - Parse JSON, inspect `status.code` / `status.msg`.
  - If `property[0].identifier.attomId === 999999999` (or equivalent
    not-found `status.code`), throw `AttomNotFoundError(address)`.
  - Non-success `status.code` → throw `AttomApiError(code, msg)`.
  - Timeout / exhausted retries → throw `AttomRequestError`.

## 7. Parsing & `EnrichedProperty` shape (`parse.ts`, `types.ts`)

```ts
export interface EnrichedProperty {
  identifiers: { attomId: string; fips: string | null; apn: string | null };
  address: { line1: string; line2: string; oneLine: string };
  characteristics: {
    beds: number | null;
    baths: number | null;
    sqft: number | null;
    yearBuilt: number | null;
    lotSizeSqft: number | null;
  };
  valuation: { avmValue: number; avmHigh: number | null; avmLow: number | null } | null;
  assessment: {
    assessedValue: number | null;
    marketValue: number | null;
    taxAmount: number | null;
    taxYear: number | null;
  } | null;
  saleHistory: Array<{ saleDate: string | null; saleAmount: number | null }>;
  enrichedAt: string; // ISO timestamp
}
```

**Confident extraction paths** (standard ATTOM `property[0]` shape):
`identifier.attomId`, `identifier.fips`, `identifier.apn`, `address.line1`,
`address.line2`, `address.oneLine`, `building.rooms.beds`,
`building.rooms.bathstotal`, `building.size.universalsize` /
`building.size.livingsize`, `summary.yearbuilt`, `lot.lotsize2`.

**Uncertain — kept configurable (per requirement):** the exact location of the
**AVM block** (and assessment/sale-history blocks) inside the `allevents/detail`
response. These are resolved through configurable JSON paths in `config.ts`:

```ts
// config.ts
export const ATTOM_CONFIG: AttomConfig = {
  baseUrl: 'https://api.gateway.attomdata.com/propertyapi/v1.0.0/',
  endpoint: 'allevents/detail',
  timeoutMs: 10_000,
  maxRetries: 3,
  // TODO: verify exact AVM/assessment/sale paths within allevents/detail
  // against the official docs: https://api.developer.attomdata.com/docs
  paths: {
    avmValue: 'avm.amount.value',
    avmHigh: 'avm.amount.high',
    avmLow: 'avm.amount.low',
    assessedValue: 'assessment.assessed.assdttlvalue',
    marketValue: 'assessment.market.mktttlvalue',
    taxAmount: 'assessment.tax.taxamt',
    taxYear: 'assessment.tax.taxyear',
    saleHistory: 'saleshistory',
  },
};
```

`parse.ts` reads each field through a small safe path-getter; a missing optional
path yields `null` (or `[]` for sale history), never a thrown error. If the AVM
block is absent, `valuation` is `null`.

## 8. Persistence (`persistence.ts`, migration)

Table `enriched_properties`:

| column            | type          | notes                                  |
|-------------------|---------------|----------------------------------------|
| id                | uuid pk       | `default gen_random_uuid()`            |
| attom_id          | text NOT NULL | **unique index** — upsert key          |
| fips              | text          |                                        |
| apn               | text          |                                        |
| address_line1     | text          |                                        |
| address_line2     | text          |                                        |
| address_one_line  | text          |                                        |
| beds              | integer       |                                        |
| baths             | numeric       |                                        |
| sqft              | integer       |                                        |
| year_built        | integer       |                                        |
| lot_size_sqft     | integer       |                                        |
| avm_value         | numeric       |                                        |
| avm_high          | numeric       |                                        |
| avm_low           | numeric       |                                        |
| assessed_value    | numeric       |                                        |
| market_value      | numeric       |                                        |
| tax_amount        | numeric       |                                        |
| tax_year          | integer       |                                        |
| sale_history      | jsonb         | array of `{ saleDate, saleAmount }`    |
| raw               | jsonb         | full ATTOM response (audit/debug)      |
| created_at        | timestamptz   | `default now()`                        |
| updated_at        | timestamptz   | `default now()`                        |

- **Unique index on `attom_id`** so the record is reusable for future lookups.
- `EnrichmentRepository` interface: `upsert(record): Promise<void>` and
  `findByAttomId(attomId): Promise<EnrichedProperty | null>`.
- `SupabaseRepository` implements it with `@supabase/supabase-js`, upserting on
  conflict of `attom_id`, using the **service-role key** (server-side only).

## 9. Logging (`logger.ts`)

Structured audit log emitted on every enrichment:

```
{ event: 'enrichment', inputAddress, attomId, outcome: 'success'|'not_found'|'error',
  durationMs, error? }
```

The `Logger` is injected so tests assert on emitted entries. In the Edge
Function the default logger writes to `console` (captured by Supabase logs).

## 10. Edge Function (`enrich-property/index.ts`)

Thin shell:

1. Accept `POST` with JSON body `{ address: string }`.
2. Build real deps via `createDefaultDeps(env)` reading `ATTOM_API_KEY`,
   `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.
3. Call `enrichProperty(address)`.
4. Map result/errors to HTTP: `200` + `EnrichedProperty`; `404` for
   `AttomNotFoundError`; `502`/`504` for `AttomApiError`/`AttomRequestError`;
   `400` for a missing/invalid body.

## 11. Tests (vitest, ATTOM mocked)

- **address.test** — splitting/normalization across formats (commas, no commas,
  9-digit ZIP, extra whitespace).
- **attomClient.test** — mocked `fetch`: success; `attomId === 999999999` →
  `AttomNotFoundError`; non-success `status.code` → `AttomApiError`; `429` then
  success (retry); timeout via aborted signal; retry exhaustion.
- **parse.test** — fixture `allevents-detail.success.json` → full
  `EnrichedProperty`; configurable AVM path resolves; missing AVM → `valuation`
  is `null`.
- **enrichProperty.test** — end-to-end with mocked `http`, `repo`, `logger`:
  asserts `repo.upsert` called with the resolved `attomId`, the returned object
  is well-formed, and a `success` log is emitted; plus `not_found` and `error`
  paths log correctly and surface the right error.

## 12. Environment & secrets

- `ATTOM_API_KEY` — Supabase function secret (never in repo/browser).
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` — function env.
- `docta-demo/.env.example` updated to document these (values omitted).

## 13. Assumptions

- A **Supabase project for Docta** is required (the Centro de Comando project's
  Supabase is separate). Implementation is written against this contract; the
  user provisions the project and supplies `SUPABASE_URL`,
  `SUPABASE_SERVICE_ROLE_KEY`, and `ATTOM_API_KEY` as secrets.
- `attomId` is unique per property → unique index + upsert is correct.
- Errors are surfaced as typed exceptions (not a result union); the Edge
  Function maps them to HTTP status codes. `not_found` is logged and returned as
  HTTP 404.

## 14. Out of scope

- Wiring the SPA UI to the endpoint (separate task; current UI is placeholder).
- The AI agent that turns `EnrichedProperty` into a purchase offer.
- ATTOM endpoints other than `allevents/detail`.
