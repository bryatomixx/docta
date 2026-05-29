create table if not exists public.enriched_properties (
  id                uuid primary key default gen_random_uuid(),
  attom_id          text not null,
  fips              text,
  apn               text,
  address_line1     text,
  address_line2     text,
  address_one_line  text,
  beds              integer,
  baths             numeric,
  sqft              integer,
  year_built        integer,
  lot_size_sqft     integer,
  avm_value         numeric,
  avm_high          numeric,
  avm_low           numeric,
  assessed_value    numeric,
  market_value      numeric,
  tax_amount        numeric,
  tax_year          integer,
  sale_history      jsonb not null default '[]'::jsonb,
  raw               jsonb,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- Row Level Security: lock the table to server-side only. The Edge Function
-- uses the service_role / secret key, which bypasses RLS, so it keeps full
-- access; with no policies, anon/authenticated (public) keys are denied.
alter table public.enriched_properties enable row level security;

-- attom_id is unique per property: enables upsert (onConflict: attom_id) and
-- fast lookups for future enrichment reuse.
create unique index if not exists enriched_properties_attom_id_key
  on public.enriched_properties (attom_id);
