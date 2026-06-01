// Vercel Serverless Function — POST /api/offer
// Full lead flow: enrich + compute offer + write the email with Claude.
// Reads keys from process.env (set in Vercel → Settings → Environment Variables).
import { createLeadDeps } from '../supabase/functions/_shared/enrichment/deps.ts';
import { processLead } from '../supabase/functions/_shared/enrichment/processLead.ts';

export const config = { maxDuration: 60 };

// Classic Vercel Node handler (req, res) — most compatible signature.
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method not allowed' });
    return;
  }

  const body = typeof req.body === 'string' ? safeParse(req.body) : (req.body ?? {});
  const address = typeof body.address === 'string' ? body.address.trim() : '';
  if (!address || !body.contact?.email) {
    res.status(400).json({ error: 'address and contact.email are required' });
    return;
  }

  try {
    const result = await processLead({ address, contact: body.contact }, createLeadDeps());
    res.status(200).json(result);
  } catch (err) {
    const e = err as { name?: string; message?: string };
    const status = e?.name === 'AttomNotFoundError' ? 404 : 502;
    res.status(status).json({ error: e?.message ?? 'internal error', name: e?.name });
  }
}

function safeParse(s: string): any {
  try {
    return JSON.parse(s || '{}');
  } catch {
    return {};
  }
}
