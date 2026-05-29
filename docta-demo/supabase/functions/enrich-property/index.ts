import { enrichProperty } from '../_shared/enrichment/enrichProperty.ts';
import { AttomApiError, AttomNotFoundError, AttomRequestError } from '../_shared/enrichment/errors.ts';

function json(data: unknown, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

Deno.serve(async (req: Request) => {
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
    const record = await enrichProperty(address);
    return json(record, 200);
  } catch (err) {
    if (err instanceof AttomNotFoundError) return json({ error: 'address not found', address }, 404);
    if (err instanceof AttomApiError) return json({ error: err.message }, 502);
    if (err instanceof AttomRequestError) return json({ error: err.message }, 504);
    return json({ error: 'internal error' }, 500);
  }
});
