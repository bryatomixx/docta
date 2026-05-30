import { it, expect } from 'vitest';
import { buildOffer, DEFAULT_OFFER_FACTOR } from '../offer.ts';
import type { EnrichedProperty } from '../types.ts';

function rec(avm: number | null): EnrichedProperty {
  return {
    identifiers: { attomId: '1', fips: null, apn: null },
    address: { line1: '', line2: '', oneLine: '123 Main St' },
    characteristics: { beds: 3, baths: 2, sqft: 1500, yearBuilt: 2000, lotSizeSqft: null },
    valuation: avm == null ? null : { avmValue: avm, avmHigh: null, avmLow: null },
    assessment: null,
    saleHistory: [],
    enrichedAt: 'x',
  };
}

it('computes a 70% cash offer rounded to nearest $1,000 with a ±2% range', () => {
  const o = buildOffer(rec(639253))!;
  expect(o.factor).toBe(DEFAULT_OFFER_FACTOR);
  expect(o.avmValue).toBe(639253);
  expect(o.value).toBe(447000); // 0.70 * 639253 = 447477 -> 447000
  expect(o.low).toBe(435000); // 0.68 * 639253 = 434692 -> 435000
  expect(o.high).toBe(460000); // 0.72 * 639253 = 460262 -> 460000
});

it('returns null when there is no AVM', () => {
  expect(buildOffer(rec(null))).toBeNull();
});

it('accepts a custom factor', () => {
  const o = buildOffer(rec(500000), 0.75)!;
  expect(o.factor).toBe(0.75);
  expect(o.value).toBe(375000);
});
