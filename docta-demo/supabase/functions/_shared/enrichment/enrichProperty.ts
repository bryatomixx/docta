import type { EnrichDeps, EnrichedProperty } from './types.ts';
import { parseAddress } from './address.ts';
import { parseAllEvents } from './parse.ts';
import { AttomNotFoundError } from './errors.ts';
import { createDefaultDeps } from './deps.ts';

export async function enrichProperty(address: string, deps?: EnrichDeps): Promise<EnrichedProperty> {
  const d = deps ?? createDefaultDeps();
  const started = Date.now();
  let attomId: string | null = null;
  try {
    const { address1, address2 } = parseAddress(address);
    const raw = await d.attom.fetchAllEvents(address1, address2);
    const record = parseAllEvents(raw, d.config);
    attomId = record.identifiers.attomId;
    await d.repo.upsert(record, raw);
    d.logger.log({
      event: 'enrichment',
      inputAddress: address,
      attomId,
      outcome: 'success',
      durationMs: Date.now() - started,
    });
    return record;
  } catch (err) {
    d.logger.log({
      event: 'enrichment',
      inputAddress: address,
      attomId,
      outcome: err instanceof AttomNotFoundError ? 'not_found' : 'error',
      durationMs: Date.now() - started,
      error: err instanceof Error ? err.message : String(err),
    });
    throw err;
  }
}
