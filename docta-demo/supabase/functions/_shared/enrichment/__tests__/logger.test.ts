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
