import { createClient } from '@supabase/supabase-js';
import type { EnrichDeps, HttpClient } from './types';
import { ATTOM_CONFIG } from './config';
import { createAttomClient } from './attomClient';
import { SupabaseRepository, SupabaseLeadRepository } from './persistence';
import { consoleLogger } from './logger';
import { createAnthropicWriter } from './anthropicWriter';
import { createPreviewSender } from './emailSender';
import type { LeadDeps } from './processLead';

export const realHttp: HttpClient = async (url, init) => {
  const res = await fetch(url, { method: init.method ?? 'GET', headers: init.headers, signal: init.signal });
  return { status: res.status, ok: res.ok, json: () => res.json() };
};

function readEnv(): Record<string, string | undefined> {
  const g = globalThis as {
    Deno?: { env: { toObject(): Record<string, string> } };
    process?: { env: Record<string, string | undefined> };
  };
  if (g.Deno?.env) return g.Deno.env.toObject();
  return g.process?.env ?? {};
}

function required(env: Record<string, string | undefined>, key: string): string {
  const value = env[key];
  if (!value) throw new Error(`Missing required env var: ${key}`);
  return value;
}

export function createDefaultDeps(env: Record<string, string | undefined> = readEnv()): EnrichDeps {
  const apiKey = required(env, 'ATTOM_API_KEY');
  const supabaseUrl = required(env, 'SUPABASE_URL');
  const serviceRole = required(env, 'SUPABASE_SERVICE_ROLE_KEY');

  const attom = createAttomClient(apiKey, { http: realHttp, config: ATTOM_CONFIG });
  const supabase = createClient(supabaseUrl, serviceRole);

  return {
    attom,
    repo: new SupabaseRepository(supabase as never),
    logger: consoleLogger,
    config: ATTOM_CONFIG,
  };
}

/**
 * Lead pipeline deps: everything in EnrichDeps plus the Claude offer-email
 * writer, the (preview) email sender, and the leads repository.
 */
export function createLeadDeps(env: Record<string, string | undefined> = readEnv()): LeadDeps {
  const base = createDefaultDeps(env);
  const anthropicKey = required(env, 'ANTHROPIC_API_KEY');
  const fromEmail = env.OFFER_FROM_EMAIL ?? 'abryan@latinprimefg.com';
  const supabase = createClient(
    required(env, 'SUPABASE_URL'),
    required(env, 'SUPABASE_SERVICE_ROLE_KEY'),
  );
  return {
    ...base,
    writer: createAnthropicWriter(anthropicKey, fromEmail),
    emailSender: createPreviewSender(),
    leads: new SupabaseLeadRepository(supabase as never),
    fromEmail,
    offerFactor: env.OFFER_FACTOR ? Number(env.OFFER_FACTOR) : undefined,
  };
}
