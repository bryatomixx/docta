import type { AttomConfig } from './types.ts';

export const ATTOM_CONFIG: AttomConfig = {
  baseUrl: 'https://api.gateway.attomdata.com/propertyapi/v1.0.0/',
  endpoint: 'allevents/detail',
  mortgageEndpoint: 'property/detailmortgageowner',
  timeoutMs: 10_000,
  maxRetries: 3,
  // Field paths verified 2026-05-29 against a live allevents/detail response.
  // Note: allevents/detail returns a single `sale` object (not a `saleshistory`
  // array); parse.ts falls back to `sale` when no array is present.
  paths: {
    avmValue: 'avm.amount.value',
    avmHigh: 'avm.amount.high',
    avmLow: 'avm.amount.low',
    assessedValue: 'assessment.assessed.assdttlvalue',
    marketValue: 'assessment.market.mktttlvalue',
    taxAmount: 'assessment.tax.taxamt',
    taxYear: 'assessment.tax.taxyear',
    saleHistory: 'saleshistory',
    saleHistoryDate: 'amount.salerecdate',
    saleHistoryAmount: 'amount.saleamt',
  },
};

export function getByPath(obj: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc !== null && typeof acc === 'object' && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}
