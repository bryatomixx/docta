import type { OfferEmail } from './offerEmail';

export interface EmailMessage extends OfferEmail {
  to: string;
  from: string;
}

export interface EmailSendResult {
  sent: boolean;
  preview: boolean;
}

export interface EmailSender {
  send(msg: EmailMessage): Promise<EmailSendResult>;
}

/**
 * Pluggable email send. No real delivery yet — awaiting Workspace credentials.
 * Logs the would-be send and reports it as a preview, so the rest of the
 * pipeline runs end-to-end. Swap for a Workspace/transactional sender later.
 */
export function createPreviewSender(): EmailSender {
  return {
    async send(msg) {
      console.log(
        JSON.stringify({ event: 'offer_email_preview', to: msg.to, from: msg.from, subject: msg.subject }),
      );
      return { sent: false, preview: true };
    },
  };
}
