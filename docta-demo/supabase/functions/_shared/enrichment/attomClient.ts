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
    const msg = b.status?.msg ?? '';
    const prop = b.property?.[0];
    const attomId = prop?.identifier?.attomId;

    // No match: ATTOM signals this with a "SuccessWithoutResult" message (which
    // can carry a non-zero code) or the 999999999 sentinel attomId. Treat all of
    // these as not-found, not as a hard API error.
    if (/withoutresult/i.test(msg) || String(attomId) === NOT_FOUND_ATTOM_ID) {
      throw new AttomNotFoundError(`${address1}, ${address2}`);
    }
    // Any other non-zero status code is a genuine API error (e.g. 401/403).
    if (typeof code === 'number' && code !== 0) {
      throw new AttomApiError(code, msg || 'unknown');
    }
    if (!prop) {
      throw new AttomNotFoundError(`${address1}, ${address2}`);
    }
    return body;
  }

  async function request(endpoint: string, address1: string, address2: string): Promise<unknown> {
    const url =
      `${config.baseUrl}${endpoint}` +
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
          if (attempt < config.maxRetries) await backoff(attempt);
          continue;
        }
        const body = await response.json();
        return interpret(body, address1, address2);
      } catch (err) {
        clearTimeout(timer);
        if (err instanceof AttomNotFoundError || err instanceof AttomApiError) throw err;
        lastError = err;
        if (attempt < config.maxRetries) await backoff(attempt);
      }
    }
    throw new AttomRequestError('exhausted retries', lastError);
  }

  return {
    fetchAllEvents: (address1, address2) => request(config.endpoint, address1, address2),
    fetchMortgageOwner: (address1, address2) => request(config.mortgageEndpoint, address1, address2),
  };
}
