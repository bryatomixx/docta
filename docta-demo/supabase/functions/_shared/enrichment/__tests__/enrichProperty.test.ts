import { it, expect, vi } from 'vitest';
import { enrichProperty } from '../enrichProperty.ts';
import { ATTOM_CONFIG } from '../config.ts';
import { createMemoryLogger, type MemoryLogger } from '../logger.ts';
import { AttomNotFoundError } from '../errors.ts';
import type { EnrichDeps } from '../types.ts';
import success from './fixtures/allevents-detail.success.json';

const moFixture = {
  property: [
    {
      mortgage: { lender: { lastname: 'ACME LENDING' }, amount: 400000, date: '2021-05-10', loantypecode: 'CNV', term: 360, duedate: '2051-06-01' },
      owner: { corporateindicator: 'N', owner1: { fullname: 'JANE DOE' }, owner2: { fullname: 'JOHN DOE' }, absenteeownerstatus: 'A', mailingaddressoneline: '99 OTHER ST, MIAMI, FL' },
    },
  ],
};

type TestDeps = EnrichDeps & {
  logger: MemoryLogger;
  repo: { upsert: ReturnType<typeof vi.fn>; findByAttomId: ReturnType<typeof vi.fn> };
};

function makeDeps(over: Partial<EnrichDeps> = {}): TestDeps {
  const logger = createMemoryLogger();
  const repo = { upsert: vi.fn(async () => {}), findByAttomId: vi.fn(async () => null) };
  return {
    attom: {
      fetchAllEvents: vi.fn(async () => success),
      fetchMortgageOwner: vi.fn(async () => moFixture),
    },
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
  expect(out.financing?.loanAmount).toBe(400000);
  expect(out.financing?.estimatedEquity).toBe(135000); // 535000 AVM − 400000 loan
  expect(out.owner?.name).toBe('JANE DOE');
  expect(out.owner?.absentee).toBe(true);
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

it('still succeeds when the mortgage/owner fetch fails (best-effort)', async () => {
  const deps = makeDeps({
    attom: {
      fetchAllEvents: vi.fn(async () => success),
      fetchMortgageOwner: vi.fn(async () => {
        throw new Error('mortgage tier blocked');
      }),
    },
  });
  const out = await enrichProperty('x', deps);
  expect(out.financing).toBeNull();
  expect(out.owner).toBeNull();
  expect(deps.repo.upsert).toHaveBeenCalledTimes(1);
  expect(deps.logger.entries[0]).toMatchObject({ outcome: 'success' });
});
