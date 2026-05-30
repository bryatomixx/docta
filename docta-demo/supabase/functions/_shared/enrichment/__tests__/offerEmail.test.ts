import { it, expect } from 'vitest';
import { buildPrompt, type OfferEmailInput } from '../offerEmail.ts';

const input: OfferEmailInput = {
  contact: { firstName: 'Maria', lastName: 'Lopez', phone: '305-555-0100', email: 'maria@example.com' },
  record: {
    identifiers: { attomId: '1', fips: null, apn: null },
    address: { line1: '', line2: '', oneLine: '4529 WINONA CT, DENVER, CO 80212' },
    characteristics: { beds: 2, baths: 1, sqft: 1147, yearBuilt: 1900, lotSizeSqft: null },
    valuation: { avmValue: 639253, avmHigh: null, avmLow: null },
    assessment: null,
    saleHistory: [],
    enrichedAt: 'x',
  },
  offer: { basis: 'AVM', avmValue: 639253, factor: 0.7, value: 447000, low: 435000, high: 460000 },
};

it('prompt carries the address, contact, offer figures, and mandatory legal language', () => {
  const { system, user } = buildPrompt(input, 'abryan@latinprimefg.com');
  expect(user).toContain('4529 WINONA CT, DENVER, CO 80212');
  expect(user).toContain('Maria Lopez');
  expect(user).toContain('$447,000');
  expect(user).toContain('$435,000');
  expect(user).toContain('$460,000');
  const sys = system.toLowerCase();
  expect(sys).toContain('non-binding');
  expect(sys).toContain('inspection');
  expect(system).toContain('abryan@latinprimefg.com');
});
