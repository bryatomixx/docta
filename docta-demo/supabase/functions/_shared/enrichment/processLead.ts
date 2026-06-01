import type { EnrichDeps, EnrichedProperty } from './types';
import type { Offer } from './offer';
import type { Contact, OfferEmail, OfferWriter } from './offerEmail';
import type { EmailSender } from './emailSender';
import { enrichProperty } from './enrichProperty';
import { buildOffer } from './offer';

export interface LeadEmailRepository {
  saveEmail(email: string): Promise<void>;
}

export interface LeadInput {
  address: string;
  contact: Contact;
}

export interface LeadResult {
  record: EnrichedProperty;
  offer: Offer | null;
  email: OfferEmail | null;
  emailSent: boolean;
  leadSaved: boolean;
}

export interface LeadDeps extends EnrichDeps {
  writer: OfferWriter;
  emailSender: EmailSender;
  leads: LeadEmailRepository;
  fromEmail: string;
  offerFactor?: number;
}

/**
 * Full lead flow: capture the email → enrich the property → compute the offer →
 * have Claude write the email → send it (preview for now). Per current scope we
 * persist ONLY the email; the email save is best-effort so a missing `leads`
 * table never blocks the offer.
 */
export async function processLead(input: LeadInput, deps: LeadDeps): Promise<LeadResult> {
  let leadSaved = false;
  try {
    await deps.leads.saveEmail(input.contact.email);
    leadSaved = true;
  } catch (err) {
    deps.logger.log({
      event: 'enrichment',
      inputAddress: input.address,
      attomId: null,
      outcome: 'error',
      durationMs: 0,
      error: `lead save failed: ${err instanceof Error ? err.message : String(err)}`,
    });
  }

  const record = await enrichProperty(input.address, deps);
  const offer = buildOffer(record, deps.offerFactor);

  let email: OfferEmail | null = null;
  let emailSent = false;
  if (offer) {
    email = await deps.writer.write({ contact: input.contact, record, offer });
    const res = await deps.emailSender.send({
      ...email,
      to: input.contact.email,
      from: deps.fromEmail,
    });
    emailSent = res.sent;
  }

  return { record, offer, email, emailSent, leadSaved };
}
