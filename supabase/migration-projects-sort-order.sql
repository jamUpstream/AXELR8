-- ============================================================================
-- Add manual ordering to projects.
-- Run once in the Supabase SQL editor.
-- ============================================================================

alter table projects
  add column if not exists sort_order int not null default 0;

-- Seed initial order from newest → oldest so the current display order is kept.
with ranked as (
  select id, row_number() over (order by created_at desc) - 1 as rn
  from projects
)
update projects p
set sort_order = ranked.rn
from ranked
where ranked.id = p.id;
