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
