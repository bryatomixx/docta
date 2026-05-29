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
