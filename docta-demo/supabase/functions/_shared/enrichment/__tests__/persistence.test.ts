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
