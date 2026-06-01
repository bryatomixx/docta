// Vercel Serverless Function — POST /api/offer
// Full lead flow: enrich + compute offer + write the email with Claude.
// Reads keys from process.env (set in Vercel → Settings → Environment Variables).
import { createLeadDeps } from '../supabase/functions/_shared/enrichment/deps.ts';
import { processLead } from '../supabase/functions/_shared/enrichment/processLead.ts';

export const config = { runtime: 'nodejs' };

function json(data: unknown, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') return json({ error: 'method not allowed' }, 405);

  let body: { address?: string; contact?: { email?: string } };
  try {
    body = await req.json();
  } catch {
    return json({ error: 'invalid json body' }, 400);
  }

  const address = typeof body.address === 'string' ? body.address.trim() : '';
  if (!address || !body.contact?.email) {
    return json({ error: 'address and contact.email are required' }, 400);
  }

  try {
    const result = await processLead({ address, contact: body.contact as never }, createLeadDeps());
    return json(result, 200);
  } catch (err) {
    const e = err as { name?: string; message?: string };
    const status = e?.name === 'AttomNotFoundError' ? 404 : 502;
    return json({ error: e?.message ?? 'internal error', name: e?.name }, status);
  }
}
