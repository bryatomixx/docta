import type { AttomConfig } from './types.ts';

export const ATTOM_CONFIG: AttomConfig = {
  baseUrl: 'https://api.gateway.attomdata.com/propertyapi/v1.0.0/',
  endpoint: 'allevents/detail',
  timeoutMs: 10_000,
  maxRetries: 3,
  // TODO: verify the exact AVM / assessment / sale-history paths within the
  // allevents/detail response against the official docs:
  // https://api.developer.attomdata.com/docs
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
