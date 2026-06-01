// Vercel Serverless Function — POST /api/enrich
// Reuses the same enrichment module the Vite dev middleware uses. Reads keys
// from process.env (set in Vercel → Settings → Environment Variables).
import { createDefaultDeps } from '../supabase/functions/_shared/enrichment/deps.ts';
import { enrichProperty } from '../supabase/functions/_shared/enrichment/enrichProperty.ts';

export const config = { runtime: 'nodejs' };

function json(data: unknown, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') return json({ error: 'method not allowed' }, 405);

  let body: { address?: string };
  try {
    body = await req.json();
  } catch {
    return json({ error: 'invalid json body' }, 400);
  }

  const address = body.address?.trim();
  if (!address) return json({ error: 'address is required' }, 400);

  try {
    const record = await enrichProperty(address, createDefaultDeps());
    return json(record, 200);
  } catch (err) {
    const e = err as { name?: string; message?: string };
    const status = e?.name === 'AttomNotFoundError' ? 404 : 502;
    return json({ error: e?.message ?? 'internal error', name: e?.name }, status);
  }
}
