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

it('aborts on timeout and throws AttomRequestError after exhausting retries', async () => {
  // http never resolves on its own; it only rejects when the request's
  // AbortController fires (i.e. the client's timeout aborts it).
  const http: HttpClient = (_url, init) =>
    new Promise((_resolve, reject) => {
      init.signal.addEventListener('abort', () =>
        reject(new DOMException('The operation was aborted', 'AbortError')),
      );
    });
  const client = createAttomClient('k', {
    http,
    config: { ...ATTOM_CONFIG, maxRetries: 2, timeoutMs: 10 },
    sleep: noSleep,
  });
  await expect(client.fetchAllEvents('a', 'b')).rejects.toBeInstanceOf(AttomRequestError);
});
