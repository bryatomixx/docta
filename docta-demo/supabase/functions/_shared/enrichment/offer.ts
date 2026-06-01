import type { EnrichedProperty } from './types';

/**
 * Deterministic, code-computed cash offer. The LLM never invents the number —
 * it only phrases the email around what this produces. Tune OFFER_FACTOR (or
 * pass `factor`) while iterating; later this can be swapped for a trained model.
 */
export interface Offer {
  basis: 'AVM';
  avmValue: number;
  factor: number;
  value: number; // target offer, rounded to nearest $1,000
  low: number; // value at (factor - 0.02)
  high: number; // value at (factor + 0.02)
}

export const DEFAULT_OFFER_FACTOR = 0.7; // "70% rule" heuristic against the AVM

function round1000(n: number): number {
  return Math.round(n / 1000) * 1000;
}

export function buildOffer(
  record: EnrichedProperty,
  factor: number = DEFAULT_OFFER_FACTOR,
): Offer | null {
  const avm = record.valuation?.avmValue;
  if (avm == null || !Number.isFinite(avm) || avm <= 0) return null;
  return {
    basis: 'AVM',
    avmValue: avm,
    factor,
    value: round1000(avm * factor),
    low: round1000(avm * (factor - 0.02)),
    high: round1000(avm * (factor + 0.02)),
  };
}
