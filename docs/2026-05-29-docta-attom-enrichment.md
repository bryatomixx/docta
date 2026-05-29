# Docta ATTOM Property Enrichment — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a property-enrichment module to `docta-demo` that, given a U.S. address, calls the ATTOM Data API, returns a clean typed `EnrichedProperty`, and persists it to Supabase Postgres keyed by `attomId`.

**Architecture:** Core logic is a pure, host-agnostic TypeScript module (`enrichProperty`) with injected dependencies (`attom` client, `repo`, `logger`, `config`), so it is fully unit-testable without a server. It is exposed via a thin Supabase Edge Function (Deno) that holds `ATTOM_API_KEY` as a secret and writes to Supabase Postgres. The existing SPA is untouched.

**Tech Stack:** TypeScript, Vitest (tests on Node), Supabase Edge Functions (Deno), `@supabase/supabase-js`, ATTOM `allevents/detail` REST endpoint.

**Conventions (verified):** `docta-demo/tsconfig.app.json` uses `moduleResolution: "bundler"`, `allowImportingTsExtensions: true`, and `erasableSyntaxOnly: true`. Therefore: **import relative files WITH the `.ts` extension** (works in Vitest and Deno), and **never use enums or constructor parameter properties** (assign fields explicitly). All new code lives under `docta-demo/supabase/`, which is NOT in the app's tsconfig `include`, so it will not affect `npm run build`.

**All paths below are relative to the repo root (`C:/Users/ADMIN/New Project`). Git commands run from the repo root.**

---

## File Structure

```
docta-demo/
  vitest.config.ts                                   # NEW — test runner config
  package.json                                       # MODIFY — add deps + test script
  supabase/
    migrations/
      0001_enriched_properties.sql                   # NEW — table + unique index
    functions/
      .env.example                                   # NEW — documents required secrets
      enrich-property/
        index.ts                                     # NEW — Edge Function (thin shell, Deno)
        deno.json                                    # NEW — import map for the function
      _shared/enrichment/
        types.ts                                     # NEW — interfaces & EnrichedProperty
        errors.ts                                    # NEW — typed errors
        config.ts                                    # NEW — ATTOM_CONFIG + getByPath
        address.ts                                   # NEW — parseAddress
        attomClient.ts                               # NEW — ATTOM HTTP (retry/backoff/timeout)
        parse.ts                                      # NEW — ATTOM JSON -> EnrichedProperty
        logger.ts                                    # NEW — audit logger
        persistence.ts                               # NEW — SupabaseRepository + toRow/fromRow
        deps.ts                                       # NEW — createDefaultDeps(env)
        enrichProperty.ts                            # NEW — orchestration
        __tests__/
          _sanity.test.ts                            # NEW — confirms vitest runs (removed in final task)
          errors.test.ts
          config.test.ts
          address.test.ts
          attomClient.test.ts
          parse.test.ts
          logger.test.ts
          persistence.test.ts
          deps.test.ts
          enrichProperty.test.ts
          fixtures/
            allevents-detail.success.json
```

Each `_shared/enrichment/*.ts` file has one responsibility. The Edge Function and `deps.ts` are the only files that touch I/O (env, network, DB); everything else is pure and tested with mocks.

---

## Task 1: Test tooling setup

**Files:**
- Modify: `docta-demo/package.json`
- Create: `docta-demo/vitest.config.ts`
- Create: `docta-demo/supabase/functions/_shared/enrichment/__tests__/_sanity.test.ts`

- [ ] **Step 1: Install dev/runtime dependencies**

Run:
```bash
npm --prefix docta-demo install -D vitest
npm --prefix docta-demo install @supabase/supabase-js
```
Expected: both packages added to `docta-demo/package.json`, no errors.

- [ ] **Step 2: Add the `test` script to `docta-demo/package.json`**

In the `"scripts"` block, add the `test` line so it reads:
```json
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run"
  },
```

- [ ] **Step 3: Create `docta-demo/vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['supabase/functions/_shared/**/*.test.ts'],
  },
});
```

- [ ] **Step 4: Create the sanity test**

`docta-demo/supabase/functions/_shared/enrichment/__tests__/_sanity.test.ts`:
```ts
import { it, expect } from 'vitest';

it('vitest is wired up', () => {
  expect(1 + 1).toBe(2);
});
```

- [ ] **Step 5: Run the test suite**

Run: `npm --prefix docta-demo run test`
Expected: PASS — 1 passed (`_sanity.test.ts`).

- [ ] **Step 6: Commit**

```bash
git add docta-demo/package.json docta-demo/package-lock.json docta-demo/vitest.config.ts docta-demo/supabase/functions/_shared/enrichment/__tests__/_sanity.test.ts
git commit -m "chore(enrichment): set up vitest and supabase-js for the enrichment module" -m "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 2: Core types

**Files:**
- Create: `docta-demo/supabase/functions/_shared/enrichment/types.ts`

There are no tests in this task — it defines interfaces only. Later tasks exercise these types.

- [ ] **Step 1: Create `types.ts`**

```ts
export interface AttomConfigPaths {
  avmValue: string;
  avmHigh: string;
  avmLow: string;
  assessedValue: string;
  marketValue: string;
  taxAmount: string;
  taxYear: string;
  saleHistory: string;
  saleHistoryDate: string;
  saleHistoryAmount: string;
}

export interface AttomConfig {
  baseUrl: string;
  endpoint: string;
  timeoutMs: number;
  maxRetries: number;
  paths: AttomConfigPaths;
}

export interface HttpResponse {
  status: number;
  ok: boolean;
  json(): Promise<unknown>;
}

export type HttpClient = (
  url: string,
  init: { method?: string; headers: Record<string, string>; signal: AbortSignal },
) => Promise<HttpResponse>;

export interface AttomClientApi {
  fetchAllEvents(address1: string, address2: string): Promise<unknown>;
}

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
  enrichedAt: string;
}

export type EnrichmentOutcome = 'success' | 'not_found' | 'error';

export interface LogEntry {
  event: 'enrichment';
  inputAddress: string;
  attomId: string | null;
  outcome: EnrichmentOutcome;
  durationMs: number;
  error?: string;
}

export interface Logger {
  log(entry: LogEntry): void;
}

export interface EnrichmentRepository {
  upsert(record: EnrichedProperty, raw?: unknown): Promise<void>;
  findByAttomId(attomId: string): Promise<EnrichedProperty | null>;
}

export interface EnrichDeps {
  attom: AttomClientApi;
  repo: EnrichmentRepository;
  logger: Logger;
  config: AttomConfig;
}
```

- [ ] **Step 2: Commit**

```bash
git add docta-demo/supabase/functions/_shared/enrichment/types.ts
git commit -m "feat(enrichment): add core types and dependency interfaces" -m "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 3: Typed errors

**Files:**
- Create: `docta-demo/supabase/functions/_shared/enrichment/errors.ts`
- Test: `docta-demo/supabase/functions/_shared/enrichment/__tests__/errors.test.ts`

- [ ] **Step 1: Write the failing test**

`__tests__/errors.test.ts`:
```ts
import { it, expect } from 'vitest';
import { AttomNotFoundError, AttomApiError, AttomRequestError } from '../errors.ts';

it('AttomNotFoundError carries the address and a stable name', () => {
  const e = new AttomNotFoundError('123 Main St');
  expect(e).toBeInstanceOf(Error);
  expect(e.name).toBe('AttomNotFoundError');
  expect(e.address).toBe('123 Main St');
});

it('AttomApiError carries the status code', () => {
  const e = new AttomApiError(401, 'Unauthorized');
  expect(e.name).toBe('AttomApiError');
  expect(e.code).toBe(401);
});

it('AttomRequestError preserves the cause', () => {
  const cause = new Error('ECONNRESET');
  const e = new AttomRequestError('exhausted retries', cause);
  expect(e.name).toBe('AttomRequestError');
  expect(e.cause).toBe(cause);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm --prefix docta-demo run test -- errors.test.ts`
Expected: FAIL — cannot resolve `../errors.ts`.

- [ ] **Step 3: Write the implementation**

`errors.ts`:
```ts
export class AttomNotFoundError extends Error {
  readonly address: string;
  constructor(address: string) {
    super(`ATTOM: address not found: ${address}`);
    this.name = 'AttomNotFoundError';
    this.address = address;
  }
}

export class AttomApiError extends Error {
  readonly code: number;
  constructor(code: number, message: string) {
    super(`ATTOM API error ${code}: ${message}`);
    this.name = 'AttomApiError';
    this.code = code;
  }
}

export class AttomRequestError extends Error {
  constructor(message: string, cause?: unknown) {
    super(`ATTOM request failed: ${message}`, { cause });
    this.name = 'AttomRequestError';
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm --prefix docta-demo run test -- errors.test.ts`
Expected: PASS — 3 passed.

- [ ] **Step 5: Commit**

```bash
git add docta-demo/supabase/functions/_shared/enrichment/errors.ts docta-demo/supabase/functions/_shared/enrichment/__tests__/errors.test.ts
git commit -m "feat(enrichment): add typed ATTOM errors" -m "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 4: Config + safe path getter

**Files:**
- Create: `docta-demo/supabase/functions/_shared/enrichment/config.ts`
- Test: `docta-demo/supabase/functions/_shared/enrichment/__tests__/config.test.ts`

- [ ] **Step 1: Write the failing test**

`__tests__/config.test.ts`:
```ts
import { it, expect } from 'vitest';
import { getByPath, ATTOM_CONFIG } from '../config.ts';

it('getByPath reads nested values', () => {
  expect(getByPath({ a: { b: { c: 5 } } }, 'a.b.c')).toBe(5);
});

it('getByPath returns undefined for a missing path', () => {
  expect(getByPath({ a: {} }, 'a.b.c')).toBeUndefined();
});

it('getByPath returns undefined when traversing a non-object', () => {
  expect(getByPath({ a: 1 }, 'a.b')).toBeUndefined();
});

it('ATTOM_CONFIG exposes the base URL, endpoint, and configurable AVM path', () => {
  expect(ATTOM_CONFIG.baseUrl).toBe('https://api.gateway.attomdata.com/propertyapi/v1.0.0/');
  expect(ATTOM_CONFIG.endpoint).toBe('allevents/detail');
  expect(ATTOM_CONFIG.paths.avmValue).toBe('avm.amount.value');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm --prefix docta-demo run test -- config.test.ts`
Expected: FAIL — cannot resolve `../config.ts`.

- [ ] **Step 3: Write the implementation**

`config.ts`:
```ts
import type { AttomConfig } from './types.ts';

export const ATTOM_CONFIG: AttomConfig = {
  baseUrl: 'https://api.gateway.attomdata.com/propertyapi/v1.0.0/',
  endpoint: 'allevents/detail',
  timeoutMs: 10_000,
  maxRetries: 3,
  // TODO: verify the exact AVM / assessment / sale-history paths within the
  // allevents/detail response against the official docs:
  // https://api.developer.attomdata.com/docs
  paths: {
    avmValue: 'avm.amount.value',
    avmHigh: 'avm.amount.high',
    avmLow: 'avm.amount.low',
    assessedValue: 'assessment.assessed.assdttlvalue',
    marketValue: 'assessment.market.mktttlvalue',
    taxAmount: 'assessment.tax.taxamt',
    taxYear: 'assessment.tax.taxyear',
    saleHistory: 'saleshistory',
    saleHistoryDate: 'amount.salerecdate',
    saleHistoryAmount: 'amount.saleamt',
  },
};

export function getByPath(obj: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc !== null && typeof acc === 'object' && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm --prefix docta-demo run test -- config.test.ts`
Expected: PASS — 4 passed.

- [ ] **Step 5: Commit**

```bash
git add docta-demo/supabase/functions/_shared/enrichment/config.ts docta-demo/supabase/functions/_shared/enrichment/__tests__/config.test.ts
git commit -m "feat(enrichment): add ATTOM config with configurable paths and getByPath" -m "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 5: Address normalization

**Files:**
- Create: `docta-demo/supabase/functions/_shared/enrichment/address.ts`
- Test: `docta-demo/supabase/functions/_shared/enrichment/__tests__/address.test.ts`

- [ ] **Step 1: Write the failing test**

`__tests__/address.test.ts`:
```ts
import { it, expect } from 'vitest';
import { parseAddress } from '../address.ts';

it('splits "street, city, ST ZIP"', () => {
  expect(parseAddress('123 Main St, Austin, TX 78701')).toEqual({
    address1: '123 Main St',
    address2: 'Austin, TX 78701',
  });
});

it('collapses whitespace and uppercases the state', () => {
  expect(parseAddress('  123  Main   St ,  austin , tx 78701 ')).toEqual({
    address1: '123 Main St',
    address2: 'austin, TX 78701',
  });
});

it('handles two-part "street, city ST ZIP"', () => {
  expect(parseAddress('500 W 2nd St, Austin TX 78701')).toEqual({
    address1: '500 W 2nd St',
    address2: 'Austin TX 78701',
  });
});

it('best-effort split with no commas treats the last 3 tokens as city/state/zip', () => {
  expect(parseAddress('500 W 2nd St Austin TX 78701')).toEqual({
    address1: '500 W 2nd St',
    address2: 'Austin TX 78701',
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm --prefix docta-demo run test -- address.test.ts`
Expected: FAIL — cannot resolve `../address.ts`.

- [ ] **Step 3: Write the implementation**

`address.ts`:
```ts
function normalizeState(address2: string): string {
  // Uppercase a 2-letter state code that sits immediately before a 5- or
  // 9-digit ZIP at the end of the string. Leaves everything else untouched.
  return address2.replace(/\b([A-Za-z]{2})\b(?=\s+\d{5}(-\d{4})?$)/, (m) => m.toUpperCase());
}

export function parseAddress(raw: string): { address1: string; address2: string } {
  const cleaned = raw.replace(/\s+/g, ' ').trim();
  const parts = cleaned.split(',').map((p) => p.trim()).filter(Boolean);

  if (parts.length >= 3) {
    return { address1: parts[0], address2: normalizeState(parts.slice(1).join(', ')) };
  }
  if (parts.length === 2) {
    return { address1: parts[0], address2: normalizeState(parts[1]) };
  }

  // No commas: best-effort. Treat the last 3 tokens as "City ST ZIP".
  const tokens = cleaned.split(' ');
  if (tokens.length > 3) {
    return {
      address1: tokens.slice(0, -3).join(' '),
      address2: normalizeState(tokens.slice(-3).join(' ')),
    };
  }
  return { address1: cleaned, address2: '' };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm --prefix docta-demo run test -- address.test.ts`
Expected: PASS — 4 passed.

- [ ] **Step 5: Commit**

```bash
git add docta-demo/supabase/functions/_shared/enrichment/address.ts docta-demo/supabase/functions/_shared/enrichment/__tests__/address.test.ts
git commit -m "feat(enrichment): add address normalization into address1/address2" -m "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 6: ATTOM HTTP client

**Files:**
- Create: `docta-demo/supabase/functions/_shared/enrichment/attomClient.ts`
- Test: `docta-demo/supabase/functions/_shared/enrichment/__tests__/attomClient.test.ts`

- [ ] **Step 1: Write the failing test**

`__tests__/attomClient.test.ts`:
```ts
import { it, expect, vi } from 'vitest';
import { createAttomClient } from '../attomClient.ts';
import { AttomApiError, AttomNotFoundError, AttomRequestError } from '../errors.ts';
import { ATTOM_CONFIG } from '../config.ts';
import type { HttpClient, HttpResponse } from '../types.ts';

const cfg = { ...ATTOM_CONFIG, maxRetries: 2, timeoutMs: 50 };
const noSleep = async () => {};

function res(status: number, body: unknown): HttpResponse {
  return { status, ok: status >= 200 && status < 300, json: async () => body };
}

const okBody = {
  status: { code: 0, msg: 'SuccessWithResult' },
  property: [{ identifier: { attomId: 145423 } }],
};

it('sends apikey/accept headers and an abort signal, and returns the body', async () => {
  const http = vi.fn<HttpClient>(async () => res(200, okBody));
  const client = createAttomClient('KEY123', { http, config: cfg, sleep: noSleep });

  const out = await client.fetchAllEvents('123 Main St', 'Austin, TX 78701');

  expect(out).toEqual(okBody);
  const [url, init] = http.mock.calls[0];
  expect(url).toBe(
    'https://api.gateway.attomdata.com/propertyapi/v1.0.0/allevents/detail' +
      '?address1=123%20Main%20St&address2=Austin%2C%20TX%2078701',
  );
  expect(init.headers).toMatchObject({ apikey: 'KEY123', accept: 'application/json' });
  expect(init.signal).toBeInstanceOf(AbortSignal);
});

it('throws AttomNotFoundError when attomId is 999999999', async () => {
  const body = { status: { code: 0, msg: 'SuccessWithoutResult' }, property: [{ identifier: { attomId: 999999999 } }] };
  const client = createAttomClient('k', { http: async () => res(200, body), config: cfg, sleep: noSleep });
  await expect(client.fetchAllEvents('a', 'b')).rejects.toBeInstanceOf(AttomNotFoundError);
});

it('throws AttomNotFoundError when no property is returned', async () => {
  const body = { status: { code: 0, msg: 'SuccessWithoutResult' } };
  const client = createAttomClient('k', { http: async () => res(200, body), config: cfg, sleep: noSleep });
  await expect(client.fetchAllEvents('a', 'b')).rejects.toBeInstanceOf(AttomNotFoundError);
});

it('throws AttomApiError on a non-zero status.code', async () => {
  const body = { status: { code: 401, msg: 'Unauthorized' } };
  const client = createAttomClient('k', { http: async () => res(200, body), config: cfg, sleep: noSleep });
  await expect(client.fetchAllEvents('a', 'b')).rejects.toBeInstanceOf(AttomApiError);
});

it('retries on HTTP 429 and then succeeds', async () => {
  let n = 0;
  const http: HttpClient = async () => (++n < 3 ? res(429, {}) : res(200, okBody));
  const client = createAttomClient('k', { http, config: cfg, sleep: noSleep });
  expect(await client.fetchAllEvents('a', 'b')).toEqual(okBody);
  expect(n).toBe(3);
});

it('retries on a network error and throws AttomRequestError after exhausting retries', async () => {
  const http: HttpClient = async () => {
    throw new Error('ECONNRESET');
  };
  const client = createAttomClient('k', { http, config: cfg, sleep: noSleep });
  await expect(client.fetchAllEvents('a', 'b')).rejects.toBeInstanceOf(AttomRequestError);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm --prefix docta-demo run test -- attomClient.test.ts`
Expected: FAIL — cannot resolve `../attomClient.ts`.

- [ ] **Step 3: Write the implementation**

`attomClient.ts`:
```ts
import type { AttomClientApi, AttomConfig, HttpClient } from './types.ts';
import { AttomApiError, AttomNotFoundError, AttomRequestError } from './errors.ts';

const NOT_FOUND_ATTOM_ID = '999999999';

export interface AttomClientDeps {
  http: HttpClient;
  config: AttomConfig;
  sleep?: (ms: number) => Promise<void>;
}

export function createAttomClient(apiKey: string, deps: AttomClientDeps): AttomClientApi {
  const { http, config } = deps;
  const sleep = deps.sleep ?? ((ms: number) => new Promise<void>((r) => setTimeout(r, ms)));

  async function backoff(attempt: number): Promise<void> {
    const base = 500 * 2 ** attempt;
    const jitter = Math.random() * 250;
    await sleep(base + jitter);
  }

  function interpret(body: unknown, address1: string, address2: string): unknown {
    const b = body as {
      status?: { code?: number; msg?: string };
      property?: Array<{ identifier?: { attomId?: number | string } }>;
    };
    const code = b.status?.code;
    // ATTOM returns status.code 0 on success. A non-zero code is an API error.
    // TODO: confirm code semantics against https://api.developer.attomdata.com/docs
    if (typeof code === 'number' && code !== 0) {
      throw new AttomApiError(code, b.status?.msg ?? 'unknown');
    }
    const prop = b.property?.[0];
    const attomId = prop?.identifier?.attomId;
    if (!prop || String(attomId) === NOT_FOUND_ATTOM_ID) {
      throw new AttomNotFoundError(`${address1}, ${address2}`);
    }
    return body;
  }

  async function fetchAllEvents(address1: string, address2: string): Promise<unknown> {
    const url =
      `${config.baseUrl}${config.endpoint}` +
      `?address1=${encodeURIComponent(address1)}` +
      `&address2=${encodeURIComponent(address2)}`;
    const headers = { apikey: apiKey, accept: 'application/json' };

    let lastError: unknown;
    for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), config.timeoutMs);
      try {
        const response = await http(url, { headers, signal: controller.signal });
        clearTimeout(timer);
        if (response.status === 429 || response.status >= 500) {
          lastError = new AttomApiError(response.status, 'retryable');
          await backoff(attempt);
          continue;
        }
        const body = await response.json();
        return interpret(body, address1, address2);
      } catch (err) {
        clearTimeout(timer);
        if (err instanceof AttomNotFoundError || err instanceof AttomApiError) throw err;
        lastError = err;
        await backoff(attempt);
      }
    }
    throw new AttomRequestError('exhausted retries', lastError);
  }

  return { fetchAllEvents };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm --prefix docta-demo run test -- attomClient.test.ts`
Expected: PASS — 6 passed.

- [ ] **Step 5: Commit**

```bash
git add docta-demo/supabase/functions/_shared/enrichment/attomClient.ts docta-demo/supabase/functions/_shared/enrichment/__tests__/attomClient.test.ts
git commit -m "feat(enrichment): add ATTOM client with retries, backoff, timeout, status handling" -m "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 7: Response parsing

**Files:**
- Create: `docta-demo/supabase/functions/_shared/enrichment/parse.ts`
- Create: `docta-demo/supabase/functions/_shared/enrichment/__tests__/fixtures/allevents-detail.success.json`
- Test: `docta-demo/supabase/functions/_shared/enrichment/__tests__/parse.test.ts`

- [ ] **Step 1: Create the fixture**

`__tests__/fixtures/allevents-detail.success.json`:
```json
{
  "status": { "version": "1.0.0", "code": 0, "msg": "SuccessWithResult", "total": 1 },
  "property": [
    {
      "identifier": { "attomId": 145423, "fips": "48453", "apn": "0123456789" },
      "address": {
        "line1": "123 MAIN ST",
        "line2": "AUSTIN, TX 78701",
        "oneLine": "123 MAIN ST, AUSTIN, TX 78701"
      },
      "lot": { "lotsize1": 0.25, "lotsize2": 10890 },
      "summary": { "yearbuilt": 1998 },
      "building": {
        "rooms": { "beds": 4, "bathstotal": 3 },
        "size": { "universalsize": 2450, "livingsize": 2450 }
      },
      "assessment": {
        "assessed": { "assdttlvalue": 410000 },
        "market": { "mktttlvalue": 520000 },
        "tax": { "taxamt": 9800, "taxyear": 2024 }
      },
      "avm": { "amount": { "value": 535000, "high": 560000, "low": 510000, "scr": 88 } },
      "saleshistory": [
        { "amount": { "saleamt": 480000, "salerecdate": "2019-06-01" } },
        { "amount": { "saleamt": 350000, "salerecdate": "2012-03-15" } }
      ]
    }
  ]
}
```

- [ ] **Step 2: Write the failing test**

`__tests__/parse.test.ts`:
```ts
import { it, expect } from 'vitest';
import { parseAllEvents } from '../parse.ts';
import { ATTOM_CONFIG } from '../config.ts';
import success from './fixtures/allevents-detail.success.json';

it('extracts identifiers, characteristics, AVM, assessment, and sale history', () => {
  const r = parseAllEvents(success, ATTOM_CONFIG);
  expect(r.identifiers).toEqual({ attomId: '145423', fips: '48453', apn: '0123456789' });
  expect(r.characteristics).toEqual({ beds: 4, baths: 3, sqft: 2450, yearBuilt: 1998, lotSizeSqft: 10890 });
  expect(r.valuation).toEqual({ avmValue: 535000, avmHigh: 560000, avmLow: 510000 });
  expect(r.assessment).toEqual({ assessedValue: 410000, marketValue: 520000, taxAmount: 9800, taxYear: 2024 });
  expect(r.saleHistory).toEqual([
    { saleDate: '2019-06-01', saleAmount: 480000 },
    { saleDate: '2012-03-15', saleAmount: 350000 },
  ]);
  expect(typeof r.enrichedAt).toBe('string');
});

it('valuation is null when the avm block is missing', () => {
  const clone = structuredClone(success) as { property: Array<Record<string, unknown>> };
  delete clone.property[0].avm;
  expect(parseAllEvents(clone, ATTOM_CONFIG).valuation).toBeNull();
});

it('assessment is null when the assessment block is missing', () => {
  const clone = structuredClone(success) as { property: Array<Record<string, unknown>> };
  delete clone.property[0].assessment;
  expect(parseAllEvents(clone, ATTOM_CONFIG).assessment).toBeNull();
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm --prefix docta-demo run test -- parse.test.ts`
Expected: FAIL — cannot resolve `../parse.ts`.

- [ ] **Step 4: Write the implementation**

`parse.ts`:
```ts
import type { AttomConfig, EnrichedProperty } from './types.ts';
import { getByPath } from './config.ts';

function num(v: unknown): number | null {
  const n = typeof v === 'string' ? Number(v) : v;
  return typeof n === 'number' && Number.isFinite(n) ? n : null;
}

function str(v: unknown): string | null {
  return typeof v === 'string' && v.length > 0 ? v : null;
}

function buildAssessment(p: unknown, config: AttomConfig): EnrichedProperty['assessment'] {
  const assessedValue = num(getByPath(p, config.paths.assessedValue));
  const marketValue = num(getByPath(p, config.paths.marketValue));
  const taxAmount = num(getByPath(p, config.paths.taxAmount));
  const taxYear = num(getByPath(p, config.paths.taxYear));
  if (assessedValue === null && marketValue === null && taxAmount === null && taxYear === null) {
    return null;
  }
  return { assessedValue, marketValue, taxAmount, taxYear };
}

export function parseAllEvents(raw: unknown, config: AttomConfig): EnrichedProperty {
  const root = raw as { property?: unknown[] };
  const p = (root.property?.[0] ?? {}) as Record<string, unknown>;

  const avmValue = num(getByPath(p, config.paths.avmValue));
  const saleHistRaw = getByPath(p, config.paths.saleHistory);
  const saleHistory = Array.isArray(saleHistRaw)
    ? saleHistRaw.map((s) => ({
        saleDate: str(getByPath(s, config.paths.saleHistoryDate)),
        saleAmount: num(getByPath(s, config.paths.saleHistoryAmount)),
      }))
    : [];

  return {
    identifiers: {
      attomId: String(getByPath(p, 'identifier.attomId') ?? ''),
      fips: str(getByPath(p, 'identifier.fips')),
      apn: str(getByPath(p, 'identifier.apn')),
    },
    address: {
      line1: str(getByPath(p, 'address.line1')) ?? '',
      line2: str(getByPath(p, 'address.line2')) ?? '',
      oneLine: str(getByPath(p, 'address.oneLine')) ?? '',
    },
    characteristics: {
      beds: num(getByPath(p, 'building.rooms.beds')),
      baths: num(getByPath(p, 'building.rooms.bathstotal')),
      sqft: num(getByPath(p, 'building.size.universalsize')) ?? num(getByPath(p, 'building.size.livingsize')),
      yearBuilt: num(getByPath(p, 'summary.yearbuilt')),
      lotSizeSqft: num(getByPath(p, 'lot.lotsize2')),
    },
    valuation:
      avmValue !== null
        ? {
            avmValue,
            avmHigh: num(getByPath(p, config.paths.avmHigh)),
            avmLow: num(getByPath(p, config.paths.avmLow)),
          }
        : null,
    assessment: buildAssessment(p, config),
    saleHistory,
    enrichedAt: new Date().toISOString(),
  };
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm --prefix docta-demo run test -- parse.test.ts`
Expected: PASS — 3 passed.

- [ ] **Step 6: Commit**

```bash
git add docta-demo/supabase/functions/_shared/enrichment/parse.ts "docta-demo/supabase/functions/_shared/enrichment/__tests__/fixtures/allevents-detail.success.json" docta-demo/supabase/functions/_shared/enrichment/__tests__/parse.test.ts
git commit -m "feat(enrichment): parse allevents response into EnrichedProperty" -m "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 8: Audit logger

**Files:**
- Create: `docta-demo/supabase/functions/_shared/enrichment/logger.ts`
- Test: `docta-demo/supabase/functions/_shared/enrichment/__tests__/logger.test.ts`

- [ ] **Step 1: Write the failing test**

`__tests__/logger.test.ts`:
```ts
import { it, expect } from 'vitest';
import { createMemoryLogger } from '../logger.ts';

it('memory logger captures entries in order', () => {
  const logger = createMemoryLogger();
  logger.log({ event: 'enrichment', inputAddress: '123 Main', attomId: '1', outcome: 'success', durationMs: 5 });
  logger.log({ event: 'enrichment', inputAddress: 'x', attomId: null, outcome: 'error', durationMs: 2, error: 'boom' });
  expect(logger.entries).toHaveLength(2);
  expect(logger.entries[0].outcome).toBe('success');
  expect(logger.entries[1].error).toBe('boom');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm --prefix docta-demo run test -- logger.test.ts`
Expected: FAIL — cannot resolve `../logger.ts`.

- [ ] **Step 3: Write the implementation**

`logger.ts`:
```ts
import type { LogEntry, Logger } from './types.ts';

export const consoleLogger: Logger = {
  log(entry: LogEntry): void {
    console.log(JSON.stringify(entry));
  },
};

export interface MemoryLogger extends Logger {
  entries: LogEntry[];
}

export function createMemoryLogger(): MemoryLogger {
  const entries: LogEntry[] = [];
  return {
    entries,
    log(entry: LogEntry): void {
      entries.push(entry);
    },
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm --prefix docta-demo run test -- logger.test.ts`
Expected: PASS — 1 passed.

- [ ] **Step 5: Commit**

```bash
git add docta-demo/supabase/functions/_shared/enrichment/logger.ts docta-demo/supabase/functions/_shared/enrichment/__tests__/logger.test.ts
git commit -m "feat(enrichment): add audit logger (console + in-memory for tests)" -m "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 9: Supabase persistence

**Files:**
- Create: `docta-demo/supabase/functions/_shared/enrichment/persistence.ts`
- Test: `docta-demo/supabase/functions/_shared/enrichment/__tests__/persistence.test.ts`

- [ ] **Step 1: Write the failing test**

`__tests__/persistence.test.ts`:
```ts
import { it, expect, vi } from 'vitest';
import { SupabaseRepository, toRow, fromRow } from '../persistence.ts';
import type { EnrichedProperty } from '../types.ts';

const rec: EnrichedProperty = {
  identifiers: { attomId: '145423', fips: '48453', apn: '0123456789' },
  address: { line1: '123 MAIN ST', line2: 'AUSTIN, TX 78701', oneLine: '123 MAIN ST, AUSTIN, TX 78701' },
  characteristics: { beds: 4, baths: 3, sqft: 2450, yearBuilt: 1998, lotSizeSqft: 10890 },
  valuation: { avmValue: 535000, avmHigh: 560000, avmLow: 510000 },
  assessment: { assessedValue: 410000, marketValue: 520000, taxAmount: 9800, taxYear: 2024 },
  saleHistory: [{ saleDate: '2019-06-01', saleAmount: 480000 }],
  enrichedAt: '2026-05-29T00:00:00.000Z',
};

it('toRow maps the record and raw payload to snake_case columns', () => {
  const row = toRow(rec, { foo: 'bar' });
  expect(row.attom_id).toBe('145423');
  expect(row.avm_value).toBe(535000);
  expect(row.year_built).toBe(1998);
  expect(row.sale_history).toEqual([{ saleDate: '2019-06-01', saleAmount: 480000 }]);
  expect(row.raw).toEqual({ foo: 'bar' });
});

it('fromRow reconstructs an EnrichedProperty', () => {
  const back = fromRow({ ...toRow(rec, null), created_at: rec.enrichedAt });
  expect(back.identifiers.attomId).toBe('145423');
  expect(back.valuation?.avmValue).toBe(535000);
  expect(back.assessment?.taxYear).toBe(2024);
  expect(back.saleHistory).toEqual(rec.saleHistory);
  expect(back.enrichedAt).toBe(rec.enrichedAt);
});

it('upsert calls supabase with onConflict attom_id and throws on db error', async () => {
  const upsert = vi.fn(async () => ({ error: null }));
  const from = vi.fn(() => ({ upsert }));
  await new SupabaseRepository({ from } as never).upsert(rec, { foo: 1 });
  expect(from).toHaveBeenCalledWith('enriched_properties');
  expect(upsert).toHaveBeenCalledWith(
    expect.objectContaining({ attom_id: '145423' }),
    { onConflict: 'attom_id' },
  );

  const failing = { from: () => ({ upsert: async () => ({ error: { message: 'db down' } }) }) };
  await expect(new SupabaseRepository(failing as never).upsert(rec, null)).rejects.toThrow('db down');
});

it('findByAttomId returns fromRow(data) or null', async () => {
  const row = { ...toRow(rec, null), created_at: rec.enrichedAt };
  const found = {
    from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: row, error: null }) }) }) }),
  };
  const repo = new SupabaseRepository(found as never);
  expect((await repo.findByAttomId('145423'))?.identifiers.attomId).toBe('145423');

  const missing = {
    from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: null, error: null }) }) }) }),
  };
  expect(await new SupabaseRepository(missing as never).findByAttomId('x')).toBeNull();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm --prefix docta-demo run test -- persistence.test.ts`
Expected: FAIL — cannot resolve `../persistence.ts`.

- [ ] **Step 3: Write the implementation**

`persistence.ts`:
```ts
import type { EnrichedProperty, EnrichmentRepository } from './types.ts';

const TABLE = 'enriched_properties';

export function toRow(r: EnrichedProperty, raw: unknown) {
  return {
    attom_id: r.identifiers.attomId,
    fips: r.identifiers.fips,
    apn: r.identifiers.apn,
    address_line1: r.address.line1,
    address_line2: r.address.line2,
    address_one_line: r.address.oneLine,
    beds: r.characteristics.beds,
    baths: r.characteristics.baths,
    sqft: r.characteristics.sqft,
    year_built: r.characteristics.yearBuilt,
    lot_size_sqft: r.characteristics.lotSizeSqft,
    avm_value: r.valuation?.avmValue ?? null,
    avm_high: r.valuation?.avmHigh ?? null,
    avm_low: r.valuation?.avmLow ?? null,
    assessed_value: r.assessment?.assessedValue ?? null,
    market_value: r.assessment?.marketValue ?? null,
    tax_amount: r.assessment?.taxAmount ?? null,
    tax_year: r.assessment?.taxYear ?? null,
    sale_history: r.saleHistory,
    raw,
    updated_at: new Date().toISOString(),
  };
}

export type EnrichedRow = ReturnType<typeof toRow> & { created_at?: string };

export function fromRow(row: EnrichedRow): EnrichedProperty {
  const hasAvm = row.avm_value !== null && row.avm_value !== undefined;
  const hasAssessment =
    row.assessed_value !== null ||
    row.market_value !== null ||
    row.tax_amount !== null ||
    row.tax_year !== null;
  return {
    identifiers: { attomId: row.attom_id, fips: row.fips, apn: row.apn },
    address: { line1: row.address_line1, line2: row.address_line2, oneLine: row.address_one_line },
    characteristics: {
      beds: row.beds,
      baths: row.baths,
      sqft: row.sqft,
      yearBuilt: row.year_built,
      lotSizeSqft: row.lot_size_sqft,
    },
    valuation: hasAvm
      ? { avmValue: row.avm_value as number, avmHigh: row.avm_high, avmLow: row.avm_low }
      : null,
    assessment: hasAssessment
      ? {
          assessedValue: row.assessed_value,
          marketValue: row.market_value,
          taxAmount: row.tax_amount,
          taxYear: row.tax_year,
        }
      : null,
    saleHistory: (row.sale_history ?? []) as EnrichedProperty['saleHistory'],
    enrichedAt: row.created_at ?? new Date().toISOString(),
  };
}

interface MinimalSupabase {
  from(table: string): {
    upsert(row: unknown, opts: { onConflict: string }): Promise<{ error: { message: string } | null }>;
    select(cols: string): {
      eq(col: string, val: string): {
        maybeSingle(): Promise<{ data: EnrichedRow | null; error: { message: string } | null }>;
      };
    };
  };
}

export class SupabaseRepository implements EnrichmentRepository {
  private readonly client: MinimalSupabase;

  constructor(client: MinimalSupabase) {
    this.client = client;
  }

  async upsert(record: EnrichedProperty, raw?: unknown): Promise<void> {
    const { error } = await this.client.from(TABLE).upsert(toRow(record, raw ?? null), { onConflict: 'attom_id' });
    if (error) throw new Error(error.message);
  }

  async findByAttomId(attomId: string): Promise<EnrichedProperty | null> {
    const { data, error } = await this.client.from(TABLE).select('*').eq('attom_id', attomId).maybeSingle();
    if (error) throw new Error(error.message);
    return data ? fromRow(data) : null;
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm --prefix docta-demo run test -- persistence.test.ts`
Expected: PASS — 4 passed.

- [ ] **Step 5: Commit**

```bash
git add docta-demo/supabase/functions/_shared/enrichment/persistence.ts docta-demo/supabase/functions/_shared/enrichment/__tests__/persistence.test.ts
git commit -m "feat(enrichment): add Supabase repository with attom_id upsert and row mapping" -m "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 10: Default dependency factory

**Files:**
- Create: `docta-demo/supabase/functions/_shared/enrichment/deps.ts`
- Test: `docta-demo/supabase/functions/_shared/enrichment/__tests__/deps.test.ts`

- [ ] **Step 1: Write the failing test**

`__tests__/deps.test.ts`:
```ts
import { it, expect } from 'vitest';
import { createDefaultDeps } from '../deps.ts';
import { ATTOM_CONFIG } from '../config.ts';

it('throws a clear error when ATTOM_API_KEY is missing', () => {
  expect(() =>
    createDefaultDeps({ SUPABASE_URL: 'http://localhost', SUPABASE_SERVICE_ROLE_KEY: 'svc' }),
  ).toThrow('ATTOM_API_KEY');
});

it('builds a complete EnrichDeps from env', () => {
  const d = createDefaultDeps({
    ATTOM_API_KEY: 'k',
    SUPABASE_URL: 'http://localhost',
    SUPABASE_SERVICE_ROLE_KEY: 'svc',
  });
  expect(d.config).toBe(ATTOM_CONFIG);
  expect(typeof d.attom.fetchAllEvents).toBe('function');
  expect(typeof d.repo.upsert).toBe('function');
  expect(typeof d.logger.log).toBe('function');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm --prefix docta-demo run test -- deps.test.ts`
Expected: FAIL — cannot resolve `../deps.ts`.

- [ ] **Step 3: Write the implementation**

`deps.ts`:
```ts
import { createClient } from '@supabase/supabase-js';
import type { EnrichDeps, HttpClient } from './types.ts';
import { ATTOM_CONFIG } from './config.ts';
import { createAttomClient } from './attomClient.ts';
import { SupabaseRepository } from './persistence.ts';
import { consoleLogger } from './logger.ts';

export const realHttp: HttpClient = async (url, init) => {
  const res = await fetch(url, { method: init.method ?? 'GET', headers: init.headers, signal: init.signal });
  return { status: res.status, ok: res.ok, json: () => res.json() };
};

function readEnv(): Record<string, string | undefined> {
  const g = globalThis as {
    Deno?: { env: { toObject(): Record<string, string> } };
    process?: { env: Record<string, string | undefined> };
  };
  if (g.Deno?.env) return g.Deno.env.toObject();
  return g.process?.env ?? {};
}

function required(env: Record<string, string | undefined>, key: string): string {
  const value = env[key];
  if (!value) throw new Error(`Missing required env var: ${key}`);
  return value;
}

export function createDefaultDeps(env: Record<string, string | undefined> = readEnv()): EnrichDeps {
  const apiKey = required(env, 'ATTOM_API_KEY');
  const supabaseUrl = required(env, 'SUPABASE_URL');
  const serviceRole = required(env, 'SUPABASE_SERVICE_ROLE_KEY');

  const attom = createAttomClient(apiKey, { http: realHttp, config: ATTOM_CONFIG });
  const supabase = createClient(supabaseUrl, serviceRole);

  return {
    attom,
    repo: new SupabaseRepository(supabase as never),
    logger: consoleLogger,
    config: ATTOM_CONFIG,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm --prefix docta-demo run test -- deps.test.ts`
Expected: PASS — 2 passed.

- [ ] **Step 5: Commit**

```bash
git add docta-demo/supabase/functions/_shared/enrichment/deps.ts docta-demo/supabase/functions/_shared/enrichment/__tests__/deps.test.ts
git commit -m "feat(enrichment): add createDefaultDeps factory wiring http, Supabase, logger" -m "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 11: Orchestration — `enrichProperty`

**Files:**
- Create: `docta-demo/supabase/functions/_shared/enrichment/enrichProperty.ts`
- Test: `docta-demo/supabase/functions/_shared/enrichment/__tests__/enrichProperty.test.ts`

- [ ] **Step 1: Write the failing test**

`__tests__/enrichProperty.test.ts`:
```ts
import { it, expect, vi } from 'vitest';
import { enrichProperty } from '../enrichProperty.ts';
import { ATTOM_CONFIG } from '../config.ts';
import { createMemoryLogger, type MemoryLogger } from '../logger.ts';
import { AttomNotFoundError } from '../errors.ts';
import type { EnrichDeps } from '../types.ts';
import success from './fixtures/allevents-detail.success.json';

type TestDeps = EnrichDeps & {
  logger: MemoryLogger;
  repo: { upsert: ReturnType<typeof vi.fn>; findByAttomId: ReturnType<typeof vi.fn> };
};

function makeDeps(over: Partial<EnrichDeps> = {}): TestDeps {
  const logger = createMemoryLogger();
  const repo = { upsert: vi.fn(async () => {}), findByAttomId: vi.fn(async () => null) };
  return {
    attom: { fetchAllEvents: vi.fn(async () => success) },
    repo,
    logger,
    config: ATTOM_CONFIG,
    ...over,
  } as TestDeps;
}

it('parses, upserts with attomId+raw, returns the record, and logs success', async () => {
  const deps = makeDeps();
  const out = await enrichProperty('123 Main St, Austin, TX 78701', deps);

  expect(out.identifiers.attomId).toBe('145423');
  expect(out.valuation?.avmValue).toBe(535000);
  expect(deps.repo.upsert).toHaveBeenCalledTimes(1);
  const [record, raw] = deps.repo.upsert.mock.calls[0];
  expect(record.identifiers.attomId).toBe('145423');
  expect(raw).toEqual(success);
  expect(deps.logger.entries[0]).toMatchObject({
    outcome: 'success',
    attomId: '145423',
    inputAddress: '123 Main St, Austin, TX 78701',
  });
});

it('logs not_found, does not upsert, and rethrows AttomNotFoundError', async () => {
  const deps = makeDeps({
    attom: { fetchAllEvents: vi.fn(async () => { throw new AttomNotFoundError('x'); }) },
  });
  await expect(enrichProperty('x', deps)).rejects.toBeInstanceOf(AttomNotFoundError);
  expect(deps.repo.upsert).not.toHaveBeenCalled();
  expect(deps.logger.entries[0]).toMatchObject({ outcome: 'not_found' });
});

it('logs error and rethrows on an unexpected failure', async () => {
  const deps = makeDeps({
    attom: { fetchAllEvents: vi.fn(async () => { throw new Error('boom'); }) },
  });
  await expect(enrichProperty('x', deps)).rejects.toThrow('boom');
  expect(deps.logger.entries[0]).toMatchObject({ outcome: 'error', error: 'boom' });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm --prefix docta-demo run test -- enrichProperty.test.ts`
Expected: FAIL — cannot resolve `../enrichProperty.ts`.

- [ ] **Step 3: Write the implementation**

`enrichProperty.ts`:
```ts
import type { EnrichDeps, EnrichedProperty } from './types.ts';
import { parseAddress } from './address.ts';
import { parseAllEvents } from './parse.ts';
import { AttomNotFoundError } from './errors.ts';
import { createDefaultDeps } from './deps.ts';

export async function enrichProperty(address: string, deps?: EnrichDeps): Promise<EnrichedProperty> {
  const d = deps ?? createDefaultDeps();
  const started = Date.now();
  let attomId: string | null = null;
  try {
    const { address1, address2 } = parseAddress(address);
    const raw = await d.attom.fetchAllEvents(address1, address2);
    const record = parseAllEvents(raw, d.config);
    attomId = record.identifiers.attomId;
    await d.repo.upsert(record, raw);
    d.logger.log({
      event: 'enrichment',
      inputAddress: address,
      attomId,
      outcome: 'success',
      durationMs: Date.now() - started,
    });
    return record;
  } catch (err) {
    d.logger.log({
      event: 'enrichment',
      inputAddress: address,
      attomId,
      outcome: err instanceof AttomNotFoundError ? 'not_found' : 'error',
      durationMs: Date.now() - started,
      error: err instanceof Error ? err.message : String(err),
    });
    throw err;
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm --prefix docta-demo run test -- enrichProperty.test.ts`
Expected: PASS — 3 passed.

- [ ] **Step 5: Run the FULL suite to confirm nothing regressed**

Run: `npm --prefix docta-demo run test`
Expected: PASS — all test files green.

- [ ] **Step 6: Commit**

```bash
git add docta-demo/supabase/functions/_shared/enrichment/enrichProperty.ts docta-demo/supabase/functions/_shared/enrichment/__tests__/enrichProperty.test.ts
git commit -m "feat(enrichment): add enrichProperty orchestration with audit logging" -m "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 12: Database migration

**Files:**
- Create: `docta-demo/supabase/migrations/0001_enriched_properties.sql`

This task has no unit test (SQL DDL). It is verified by applying it against Supabase.

- [ ] **Step 1: Write the migration**

`docta-demo/supabase/migrations/0001_enriched_properties.sql`:
```sql
create table if not exists public.enriched_properties (
  id                uuid primary key default gen_random_uuid(),
  attom_id          text not null,
  fips              text,
  apn               text,
  address_line1     text,
  address_line2     text,
  address_one_line  text,
  beds              integer,
  baths             numeric,
  sqft              integer,
  year_built        integer,
  lot_size_sqft     integer,
  avm_value         numeric,
  avm_high          numeric,
  avm_low           numeric,
  assessed_value    numeric,
  market_value      numeric,
  tax_amount        numeric,
  tax_year          integer,
  sale_history      jsonb not null default '[]'::jsonb,
  raw               jsonb,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- attom_id is unique per property: enables upsert (onConflict: attom_id) and
-- fast lookups for future enrichment reuse.
create unique index if not exists enriched_properties_attom_id_key
  on public.enriched_properties (attom_id);
```

- [ ] **Step 2: Verify the SQL is valid (no application required to commit)**

The migration is applied later with `supabase db push` (see Task 14) once the
Docta Supabase project is linked. To sanity-check syntax now without a project,
this step is satisfied by re-reading the file for typos. No command to run.

- [ ] **Step 3: Commit**

```bash
git add docta-demo/supabase/migrations/0001_enriched_properties.sql
git commit -m "feat(enrichment): add enriched_properties migration with unique attom_id index" -m "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 13: Edge Function + secrets template

**Files:**
- Create: `docta-demo/supabase/functions/enrich-property/index.ts`
- Create: `docta-demo/supabase/functions/enrich-property/deno.json`
- Create: `docta-demo/supabase/functions/.env.example`

This task has no unit test (the function is a thin Deno shell; the logic it calls is covered by Tasks 3–11). It is verified by `supabase functions serve` in Task 14.

- [ ] **Step 1: Write the Edge Function handler**

`docta-demo/supabase/functions/enrich-property/index.ts`:
```ts
import { enrichProperty } from '../_shared/enrichment/enrichProperty.ts';
import { AttomApiError, AttomNotFoundError, AttomRequestError } from '../_shared/enrichment/errors.ts';

function json(data: unknown, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') return json({ error: 'method not allowed' }, 405);

  let body: { address?: string };
  try {
    body = await req.json();
  } catch {
    return json({ error: 'invalid json body' }, 400);
  }

  const address = body.address?.trim();
  if (!address) return json({ error: 'address is required' }, 400);

  try {
    const record = await enrichProperty(address);
    return json(record, 200);
  } catch (err) {
    if (err instanceof AttomNotFoundError) return json({ error: 'address not found', address }, 404);
    if (err instanceof AttomApiError) return json({ error: err.message }, 502);
    if (err instanceof AttomRequestError) return json({ error: err.message }, 504);
    return json({ error: 'internal error' }, 500);
  }
});
```

- [ ] **Step 2: Write the function import map**

`docta-demo/supabase/functions/enrich-property/deno.json`:
```json
{
  "imports": {
    "@supabase/supabase-js": "npm:@supabase/supabase-js@2"
  }
}
```

- [ ] **Step 3: Write the secrets template**

`docta-demo/supabase/functions/.env.example`:
```bash
# ATTOM Data API key — request at https://api.developer.attomdata.com/
# Set in production with: supabase secrets set --env-file supabase/functions/.env
ATTOM_API_KEY=

# Supabase service-role credentials (server-side only; never expose to the browser)
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

- [ ] **Step 4: Commit**

```bash
git add docta-demo/supabase/functions/enrich-property/index.ts docta-demo/supabase/functions/enrich-property/deno.json docta-demo/supabase/functions/.env.example
git commit -m "feat(enrichment): add enrich-property Edge Function and secrets template" -m "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 14: Cleanup, full verification, and manual-run notes

**Files:**
- Delete: `docta-demo/supabase/functions/_shared/enrichment/__tests__/_sanity.test.ts`

- [ ] **Step 1: Remove the sanity test**

```bash
git rm docta-demo/supabase/functions/_shared/enrichment/__tests__/_sanity.test.ts
```

- [ ] **Step 2: Run the full suite**

Run: `npm --prefix docta-demo run test`
Expected: PASS — every test file green (errors, config, address, attomClient, parse, logger, persistence, deps, enrichProperty), no `_sanity`.

- [ ] **Step 3: Confirm the SPA build is unaffected**

Run: `npm --prefix docta-demo run build`
Expected: build succeeds (the `supabase/` tree is outside `tsconfig.app.json` `include`, so the new code is not type-checked or bundled into the SPA).

- [ ] **Step 4: Commit**

```bash
git add -A docta-demo/supabase
git commit -m "chore(enrichment): remove sanity test after suite is green" -m "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

- [ ] **Step 5: Manual run (documented for the operator — requires credentials, not part of CI)**

These steps require a Docta Supabase project and an ATTOM API key:
```bash
# 1. Link the Docta Supabase project (one-time):
supabase link --project-ref <docta-project-ref>

# 2. Apply the migration:
supabase db push

# 3. Provide secrets to the function (fill docta-demo/supabase/functions/.env first):
supabase secrets set --env-file docta-demo/supabase/functions/.env

# 4. Serve locally and smoke-test:
supabase functions serve enrich-property
curl -X POST http://localhost:54321/functions/v1/enrich-property \
  -H 'content-type: application/json' \
  -d '{"address":"123 Main St, Austin, TX 78701"}'

# 5. Deploy:
supabase functions deploy enrich-property
```
Expected (step 4): a JSON `EnrichedProperty` for a real address, and a new row in
`enriched_properties` keyed by `attom_id`. A `404` for an unknown address.

---

## Self-Review Notes

**Spec coverage** (each spec section maps to a task):
- §3 file layout → File Structure section + Tasks 2–13.
- §4 public interface `enrichProperty(address, deps?)` → Task 11.
- §5 address normalization → Task 5.
- §6 ATTOM client (headers, retries, backoff, timeout, status.code + attomId 999999999) → Task 6.
- §7 EnrichedProperty shape + configurable AVM paths + TODO → Tasks 2, 4, 7.
- §8 persistence + `enriched_properties` table + unique attom_id → Tasks 9, 12.
- §9 audit logging → Task 8 (+ used in Task 11).
- §10 Edge Function → Task 13.
- §11 tests (address, attomClient, parse, enrichProperty) → Tasks 5, 6, 7, 11 (plus errors, config, logger, persistence, deps).
- §12 env/secrets → Tasks 10, 13.

**Placeholder scan:** The only `TODO` strings are the two intentional ones the spec requires (configurable AVM/path verification against the ATTOM docs) in `config.ts` and `attomClient.ts`. No "TBD"/"implement later"/vague steps remain.

**Type consistency:** `EnrichDeps` uses `attom: AttomClientApi` (not a raw `http`); `createAttomClient(apiKey, { http, config, sleep? })` returns `AttomClientApi`; `EnrichmentRepository.upsert(record, raw?)` matches `enrichProperty` and `SupabaseRepository`; `EnrichedProperty` field names are identical across `types.ts`, `parse.ts`, `persistence.ts`, and all tests; `MemoryLogger` is exported from `logger.ts` and imported by the orchestration test.
