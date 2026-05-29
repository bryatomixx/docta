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

  return { fetchAllEvents };
}
