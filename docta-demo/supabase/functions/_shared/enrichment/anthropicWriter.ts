import Anthropic from '@anthropic-ai/sdk';
import type { OfferEmail, OfferEmailInput, OfferWriter } from './offerEmail';
import { buildPrompt } from './offerEmail';

const SCHEMA = {
  type: 'object',
  properties: {
    subject: { type: 'string' },
    body: { type: 'string' },
  },
  required: ['subject', 'body'],
  additionalProperties: false,
} as const;

/**
 * Real OfferWriter: asks Claude (Opus 4.8) to phrase the email around the
 * code-computed offer, returning {subject, body} via structured outputs.
 */
export function createAnthropicWriter(apiKey: string, fromEmail: string): OfferWriter {
  const client = new Anthropic({ apiKey });
  return {
    async write(input: OfferEmailInput): Promise<OfferEmail> {
      const { system, user } = buildPrompt(input, fromEmail);
      const res = await client.messages.create({
        model: 'claude-opus-4-8',
        max_tokens: 2000,
        thinking: { type: 'adaptive' },
        output_config: { effort: 'low', format: { type: 'json_schema', schema: SCHEMA } },
        system,
        messages: [{ role: 'user', content: user }],
      } as never);
      const block = (res.content as Array<{ type: string; text?: string }>).find(
        (b) => b.type === 'text',
      );
      const parsed = JSON.parse(block?.text ?? '{}') as Partial<OfferEmail>;
      return { subject: String(parsed.subject ?? ''), body: String(parsed.body ?? '') };
    },
  };
}
