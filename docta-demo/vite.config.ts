import { defineConfig, loadEnv, type PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

// Dev-only API so the SPA can call the REAL enrichment locally, without
// deploying the Edge Function (no Docker, no PAT). It runs the same
// `enrichProperty` module the Edge Function uses, reading keys from
// supabase/functions/.env. In production the SPA should call the deployed
// Edge Function instead.
function enrichDevApi(): PluginOption {
  return {
    name: 'enrich-dev-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/enrich', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'method not allowed' }));
          return;
        }
        let body = '';
        req.on('data', (chunk) => (body += chunk));
        req.on('end', async () => {
          res.setHeader('content-type', 'application/json');
          try {
            const { address } = JSON.parse(body || '{}');
            if (!address || typeof address !== 'string') {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'address is required' }));
              return;
            }
            const env = loadEnv('development', path.resolve(import.meta.dirname, 'supabase/functions'), '');
            const { createDefaultDeps } = await server.ssrLoadModule(
              '/supabase/functions/_shared/enrichment/deps.ts',
            );
            const { enrichProperty } = await server.ssrLoadModule(
              '/supabase/functions/_shared/enrichment/enrichProperty.ts',
            );
            const record = await enrichProperty(address, createDefaultDeps(env));
            res.statusCode = 200;
            res.end(JSON.stringify(record));
          } catch (err) {
            const e = err as { name?: string; message?: string };
            res.statusCode = e?.name === 'AttomNotFoundError' ? 404 : 502;
            res.end(JSON.stringify({ error: e?.message ?? 'internal error', name: e?.name }));
          }
        });
      });

      // Full lead flow: enrich + compute offer + write the email with Claude.
      server.middlewares.use('/api/offer', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'method not allowed' }));
          return;
        }
        let body = '';
        req.on('data', (chunk) => (body += chunk));
        req.on('end', async () => {
          res.setHeader('content-type', 'application/json');
          try {
            const { address, contact } = JSON.parse(body || '{}');
            if (!address || typeof address !== 'string' || !contact?.email) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'address and contact.email are required' }));
              return;
            }
            const env = loadEnv('development', path.resolve(import.meta.dirname, 'supabase/functions'), '');
            const { createLeadDeps } = await server.ssrLoadModule(
              '/supabase/functions/_shared/enrichment/deps.ts',
            );
            const { processLead } = await server.ssrLoadModule(
              '/supabase/functions/_shared/enrichment/processLead.ts',
            );
            const result = await processLead({ address, contact }, createLeadDeps(env));
            res.statusCode = 200;
            res.end(JSON.stringify(result));
          } catch (err) {
            const e = err as { name?: string; message?: string };
            res.statusCode = e?.name === 'AttomNotFoundError' ? 404 : 502;
            res.end(JSON.stringify({ error: e?.message ?? 'internal error', name: e?.name }));
          }
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), enrichDevApi()],
  css: { postcss: {} },
});
