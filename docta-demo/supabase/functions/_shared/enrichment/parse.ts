import type { AttomConfig, EnrichedProperty } from './types.ts';
import { getByPath } from './config.ts';

function num(v: unknown): number | null {
  const n = typeof v === 'string' ? Number(v) : v;
  return typeof n === 'number' && Number.isFinite(n) ? n : null;
}

function str(v: unknown): string | null {
  return typeof v === 'string' && v.length > 0 ? v : null;
}

function buildAssessment(p: unknown, config: AttomConfig): EnrichedProperty['assessment'] {
  const assessedValue = num(getByPath(p, config.paths.assessedValue));
  const marketValue = num(getByPath(p, config.paths.marketValue));
  const taxAmount = num(getByPath(p, config.paths.taxAmount));
  const taxYear = num(getByPath(p, config.paths.taxYear));
  if (assessedValue === null && marketValue === null && taxAmount === null && taxYear === null) {
    return null;
  }
  return { assessedValue, marketValue, taxAmount, taxYear };
}

export function parseAllEvents(raw: unknown, config: AttomConfig): EnrichedProperty {
  const root = raw as { property?: unknown[] };
  const p = (root.property?.[0] ?? {}) as Record<string, unknown>;

  const avmValue = num(getByPath(p, config.paths.avmValue));
  const saleHistRaw = getByPath(p, config.paths.saleHistory);
  const saleHistory = Array.isArray(saleHistRaw)
    ? saleHistRaw.map((s) => ({
        saleDate: str(getByPath(s, config.paths.saleHistoryDate)),
        saleAmount: num(getByPath(s, config.paths.saleHistoryAmount)),
      }))
    : [];

  return {
    identifiers: {
      attomId: String(getByPath(p, 'identifier.attomId') ?? ''),
      fips: str(getByPath(p, 'identifier.fips')),
      apn: str(getByPath(p, 'identifier.apn')),
    },
    address: {
      line1: str(getByPath(p, 'address.line1')) ?? '',
      line2: str(getByPath(p, 'address.line2')) ?? '',
      oneLine: str(getByPath(p, 'address.oneLine')) ?? '',
    },
    characteristics: {
      beds: num(getByPath(p, 'building.rooms.beds')),
      baths: num(getByPath(p, 'building.rooms.bathstotal')),
      sqft: num(getByPath(p, 'building.size.universalsize')) ?? num(getByPath(p, 'building.size.livingsize')),
      yearBuilt: num(getByPath(p, 'summary.yearbuilt')),
      lotSizeSqft: num(getByPath(p, 'lot.lotsize2')),
    },
    valuation:
      avmValue !== null
        ? {
            avmValue,
            avmHigh: num(getByPath(p, config.paths.avmHigh)),
            avmLow: num(getByPath(p, config.paths.avmLow)),
          }
        : null,
    assessment: buildAssessment(p, config),
    saleHistory,
    enrichedAt: new Date().toISOString(),
  };
}
