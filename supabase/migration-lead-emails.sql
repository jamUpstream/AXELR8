-- ============================================================================
-- Lead email history — replies composed and sent from the admin.
-- Run once in the Supabase SQL editor.
-- ============================================================================

create table if not exists lead_emails (
  id          uuid primary key default gen_random_uuid(),
  lead_id     uuid references leads(id) on delete cascade,
  to_email    text not null,
  subject     text not null,
  body_html   text not null,
  error       text,                  -- non-null if the send failed
  sent_at     timestamptz default now()
);

create index if not exists lead_emails_lead_id_idx on lead_emails (lead_id);

alter table lead_emails enable row level security;

-- Admin-only: only authenticated users can read/insert.
create policy "Admin read lead emails"
  on lead_emails for select
  to authenticated
  using (true);

create policy "Admin insert lead emails"
  on lead_emails for insert
  to authenticated
  with check (true);

create policy "Admin delete lead emails"
  on lead_emails for delete
  to authenticated
  using (true);
