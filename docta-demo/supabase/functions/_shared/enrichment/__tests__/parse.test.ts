import { it, expect } from 'vitest';
import { parseAllEvents, parseMortgageOwner } from '../parse.ts';
import { ATTOM_CONFIG } from '../config.ts';
import success from './fixtures/allevents-detail.success.json';

it('extracts identifiers, characteristics, AVM, assessment, and sale history', () => {
  const r = parseAllEvents(success, ATTOM_CONFIG);
  expect(r.identifiers).toEqual({ attomId: '145423', fips: '48453', apn: '0123456789' });
  expect(r.characteristics).toEqual({ beds: 4, baths: 3, sqft: 2450, yearBuilt: 1998, lotSizeSqft: 10890 });
  expect(r.valuation).toEqual({ avmValue: 535000, avmHigh: 560000, avmLow: 510000 });
  expect(r.assessment).toEqual({ assessedValue: 410000, marketValue: 520000, taxAmount: 9800, taxYear: 2024 });
  expect(r.saleHistory).toEqual([
    { saleDate: '2019-06-01', saleAmount: 480000 },
    { saleDate: '2012-03-15', saleAmount: 350000 },
  ]);
  expect(typeof r.enrichedAt).toBe('string');
});

it('valuation is null when the avm block is missing', () => {
  const clone = structuredClone(success) as { property: Array<Record<string, unknown>> };
  delete clone.property[0].avm;
  expect(parseAllEvents(clone, ATTOM_CONFIG).valuation).toBeNull();
});

it('assessment is null when the assessment block is missing', () => {
  const clone = structuredClone(success) as { property: Array<Record<string, unknown>> };
  delete clone.property[0].assessment;
  expect(parseAllEvents(clone, ATTOM_CONFIG).assessment).toBeNull();
});

it('falls back to the single `sale` object when no saleshistory array is present', () => {
  const clone = structuredClone(success) as { property: Array<Record<string, unknown>> };
  delete clone.property[0].saleshistory;
  clone.property[0].sale = { amount: { salerecdate: '2023-10-23', saleamt: 710000 } };
  expect(parseAllEvents(clone, ATTOM_CONFIG).saleHistory).toEqual([
    { saleDate: '2023-10-23', saleAmount: 710000 },
  ]);
});

it('parseMortgageOwner extracts financing and owner', () => {
  const raw = {
    property: [
      {
        mortgage: { lender: { lastname: 'THE HORN FUNDING CORP' }, amount: 510000, date: '2023-10-23', loantypecode: 'CNV', term: 301, duedate: '2048-11-01' },
        owner: { corporateindicator: 'N', owner1: { fullname: 'JENNIFER GUBNER' }, owner2: { fullname: 'SYDNEY STENTO' }, absenteeownerstatus: 'A', mailingaddressoneline: '99 OTHER ST, MIAMI, FL' },
      },
    ],
  };
  const { financing, owner } = parseMortgageOwner(raw);
  expect(financing).toEqual({
    loanAmount: 510000,
    lender: 'THE HORN FUNDING CORP',
    loanDate: '2023-10-23',
    loanType: 'CNV',
    termMonths: 301,
    dueDate: '2048-11-01',
    estimatedEquity: null,
  });
  expect(owner).toEqual({
    name: 'JENNIFER GUBNER',
    secondName: 'SYDNEY STENTO',
    corporate: false,
    absentee: true,
    mailingAddress: '99 OTHER ST, MIAMI, FL',
  });
});

it('parseMortgageOwner returns nulls when the blocks are absent', () => {
  expect(parseMortgageOwner({ property: [{}] })).toEqual({ financing: null, owner: null });
});
