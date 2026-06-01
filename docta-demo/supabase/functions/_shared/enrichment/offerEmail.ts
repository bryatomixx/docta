import type { EnrichedProperty } from './types';
import type { Offer } from './offer';

export interface Contact {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

export interface OfferEmail {
  subject: string;
  body: string;
}

export interface OfferEmailInput {
  contact: Contact;
  record: EnrichedProperty;
  offer: Offer;
}

/**
 * Turns the structured input into {subject, body}. The real implementation
 * calls Claude (see anthropicWriter.ts); tests inject a mock. The offer figures
 * are computed in code and passed in — the writer must not change them.
 */
export interface OfferWriter {
  write(input: OfferEmailInput): Promise<OfferEmail>;
}

const COMPANY = 'Latin Prime';

function usd(n: number): string {
  return `$${Math.round(n).toLocaleString('en-US')}`;
}

export function buildPrompt(input: OfferEmailInput, fromEmail: string): { system: string; user: string } {
  const { contact, record, offer } = input;
  const system = [
    `You write a preliminary cash-offer email on behalf of ${COMPANY}, a U.S. real-estate investment company, to a homeowner who requested an offer on their property.`,
    `Write in warm, professional, plain Spanish (the audience is Hispanic homeowners in the U.S.).`,
    `The offer figures are FIXED and provided below — never invent, recompute, or change any number.`,
    `MANDATORY: state clearly that the offer is PRELIMINARY and NON-BINDING, and SUBJECT TO INSPECTION and verification of the property.`,
    `Keep it concise (under ~180 words), no markdown, plain-text body. Invite the homeowner to reply or call to move forward.`,
    `Sign as ${COMPANY} (${fromEmail}).`,
  ].join('\n');
  const user = [
    `Homeowner: ${contact.firstName} ${contact.lastName}`,
    `Property: ${record.address.oneLine}`,
    `Estimated market value (ATTOM AVM): ${usd(offer.avmValue)}`,
    `Our preliminary cash offer range: ${usd(offer.low)} – ${usd(offer.high)} (target ${usd(offer.value)})`,
    record.characteristics.beds != null
      ? `Characteristics: ${record.characteristics.beds} bd / ${record.characteristics.baths ?? '—'} ba`
      : '',
  ]
    .filter(Boolean)
    .join('\n');
  return { system, user };
}
