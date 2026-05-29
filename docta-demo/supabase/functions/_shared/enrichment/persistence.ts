import type { EnrichedProperty, EnrichmentRepository } from './types.ts';

const TABLE = 'enriched_properties';

export function toRow(r: EnrichedProperty, raw: unknown) {
  return {
    attom_id: r.identifiers.attomId,
    fips: r.identifiers.fips,
    apn: r.identifiers.apn,
    address_line1: r.address.line1,
    address_line2: r.address.line2,
    address_one_line: r.address.oneLine,
    beds: r.characteristics.beds,
    baths: r.characteristics.baths,
    sqft: r.characteristics.sqft,
    year_built: r.characteristics.yearBuilt,
    lot_size_sqft: r.characteristics.lotSizeSqft,
    avm_value: r.valuation?.avmValue ?? null,
    avm_high: r.valuation?.avmHigh ?? null,
    avm_low: r.valuation?.avmLow ?? null,
    assessed_value: r.assessment?.assessedValue ?? null,
    market_value: r.assessment?.marketValue ?? null,
    tax_amount: r.assessment?.taxAmount ?? null,
    tax_year: r.assessment?.taxYear ?? null,
    sale_history: r.saleHistory,
    raw,
    updated_at: new Date().toISOString(),
  };
}

export type EnrichedRow = ReturnType<typeof toRow> & { created_at?: string };

export function fromRow(row: EnrichedRow): EnrichedProperty {
  const hasAvm = row.avm_value !== null && row.avm_value !== undefined;
  const hasAssessment =
    row.assessed_value !== null ||
    row.market_value !== null ||
    row.tax_amount !== null ||
    row.tax_year !== null;
  return {
    identifiers: { attomId: row.attom_id, fips: row.fips, apn: row.apn },
    address: { line1: row.address_line1, line2: row.address_line2, oneLine: row.address_one_line },
    characteristics: {
      beds: row.beds,
      baths: row.baths,
      sqft: row.sqft,
      yearBuilt: row.year_built,
      lotSizeSqft: row.lot_size_sqft,
    },
    valuation: hasAvm
      ? { avmValue: row.avm_value as number, avmHigh: row.avm_high, avmLow: row.avm_low }
      : null,
    assessment: hasAssessment
      ? {
          assessedValue: row.assessed_value,
          marketValue: row.market_value,
          taxAmount: row.tax_amount,
          taxYear: row.tax_year,
        }
      : null,
    saleHistory: (row.sale_history ?? []) as EnrichedProperty['saleHistory'],
    enrichedAt: row.created_at ?? new Date().toISOString(),
  };
}

interface MinimalSupabase {
  from(table: string): {
    upsert(row: unknown, opts: { onConflict: string }): Promise<{ error: { message: string } | null }>;
    select(cols: string): {
      eq(col: string, val: string): {
        maybeSingle(): Promise<{ data: EnrichedRow | null; error: { message: string } | null }>;
      };
    };
  };
}

export class SupabaseRepository implements EnrichmentRepository {
  private readonly client: MinimalSupabase;

  constructor(client: MinimalSupabase) {
    this.client = client;
  }

  async upsert(record: EnrichedProperty, raw?: unknown): Promise<void> {
    const { error } = await this.client.from(TABLE).upsert(toRow(record, raw ?? null), { onConflict: 'attom_id' });
    if (error) throw new Error(error.message);
  }

  async findByAttomId(attomId: string): Promise<EnrichedProperty | null> {
    const { data, error } = await this.client.from(TABLE).select('*').eq('attom_id', attomId).maybeSingle();
    if (error) throw new Error(error.message);
    return data ? fromRow(data) : null;
  }
}
