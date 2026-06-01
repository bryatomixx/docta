import type { AttomConfig, EnrichedProperty } from './types';
import { getByPath } from './config';

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
  // allevents/detail returns a single `sale` object (verified 2026-05-29 against
  // a live response); some responses include a `saleshistory` array instead.
  // Support both: use the array if present, else wrap the single `sale` object.
  const saleHistRaw = getByPath(p, config.paths.saleHistory);
  const saleSource: unknown[] = Array.isArray(saleHistRaw)
    ? saleHistRaw
    : getByPath(p, 'sale')
      ? [getByPath(p, 'sale')]
      : [];
  const saleHistory = saleSource.map((s) => ({
    saleDate: str(getByPath(s, config.paths.saleHistoryDate)),
    saleAmount: num(getByPath(s, config.paths.saleHistoryAmount)),
  }));

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
    financing: null,
    owner: null,
    enrichedAt: new Date().toISOString(),
  };
}

/** Parses ATTOM `property/detailmortgageowner` into the financing + owner blocks. */
export function parseMortgageOwner(raw: unknown): {
  financing: EnrichedProperty['financing'];
  owner: EnrichedProperty['owner'];
} {
  const root = raw as { property?: unknown[] };
  const p = (root.property?.[0] ?? {}) as Record<string, unknown>;

  const loanAmount = num(getByPath(p, 'mortgage.amount'));
  const lender = str(getByPath(p, 'mortgage.lender.lastname'));
  const financing =
    loanAmount !== null || lender !== null
      ? {
          loanAmount,
          lender,
          loanDate: str(getByPath(p, 'mortgage.date')),
          loanType: str(getByPath(p, 'mortgage.loantypecode')),
          termMonths: num(getByPath(p, 'mortgage.term')),
          dueDate: str(getByPath(p, 'mortgage.duedate')),
          estimatedEquity: null, // computed in enrichProperty (needs the AVM)
        }
      : null;

  const ownerName = str(getByPath(p, 'owner.owner1.fullname'));
  const absStatus = str(getByPath(p, 'owner.absenteeownerstatus'));
  const corp = str(getByPath(p, 'owner.corporateindicator'));
  const owner = ownerName
    ? {
        name: ownerName,
        secondName: str(getByPath(p, 'owner.owner2.fullname')),
        corporate: corp === null ? null : corp.toUpperCase() === 'Y',
        absentee: absStatus === null ? null : absStatus.toUpperCase() === 'A',
        mailingAddress: str(getByPath(p, 'owner.mailingaddressoneline')),
      }
    : null;

  return { financing, owner };
}
