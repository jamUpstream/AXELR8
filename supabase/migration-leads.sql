-- ============================================================================
-- Leads (contact form submissions). Run once in the Supabase SQL editor.
-- ============================================================================

create table if not exists leads (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  email           text not null,
  company         text,
  message         text not null,
  tools           text[] default '{}',   -- selected tool checkboxes
  tools_other     text,                  -- free-text "Other" tool
  service_slugs   text[] default '{}',   -- chosen service slugs (from services)
  status          text not null default 'new'
                    check (status in ('new','contacted','qualified','won','lost')),
  created_at      timestamptz default now()
);

create index if not exists leads_created_at_idx on leads (created_at desc);
create index if not exists leads_status_idx on leads (status);

alter table leads enable row level security;

-- Anyone (anon) may submit a lead — but only insert, and never with a
-- pre-set status other than the default 'new'.
create policy "Public can submit leads"
  on leads for insert
  to anon, authenticated
  with check (status = 'new');

-- Only the authenticated admin can read / update / delete leads.
create policy "Admin read leads"
  on leads for select
  to authenticated
  using (true);

create policy "Admin update leads"
  on leads for update
  to authenticated
  using (true)
  with check (true);

create policy "Admin delete leads"
  on leads for delete
  to authenticated
  using (true);
