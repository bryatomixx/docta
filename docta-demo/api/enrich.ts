// Vercel Serverless Function — POST /api/enrich
// Reuses the same enrichment module the Vite dev middleware uses. Reads keys
// from process.env (set in Vercel → Settings → Environment Variables).
import { createDefaultDeps } from '../supabase/functions/_shared/enrichment/deps.ts';
import { enrichProperty } from '../supabase/functions/_shared/enrichment/enrichProperty.ts';

export const config = { maxDuration: 60 };

// Classic Vercel Node handler (req, res) — most compatible signature.
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method not allowed' });
    return;
  }

  const body = typeof req.body === 'string' ? safeParse(req.body) : (req.body ?? {});
  const address = typeof body.address === 'string' ? body.address.trim() : '';
  if (!address) {
    res.status(400).json({ error: 'address is required' });
    return;
  }

  try {
    const record = await enrichProperty(address, createDefaultDeps());
    res.status(200).json(record);
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
