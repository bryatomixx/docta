-- Minimal lead capture: per current scope we persist ONLY the email.
create table if not exists public.leads (
  id          uuid primary key default gen_random_uuid(),
  email       text not null,
  created_at  timestamptz not null default now()
);

-- Server-side only (the Edge Function / dev endpoint writes via the service key,
-- which bypasses RLS); public anon/authenticated keys are denied.
alter table public.leads enable row level security;
