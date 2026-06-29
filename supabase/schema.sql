-- ============================================================================
-- AXLER8 — Phase 2 schema
-- Run this in the Supabase SQL editor (one time).
--
-- Deviations from the Phase 2 prompt (intentional, to match the live UI):
--   * services keeps `slug` and `details text[]` — the /services page renders
--     a bullet list and anchors cards by slug.
--   * testimonials uses author_name / company / avatar_url per the chosen
--     schema; the Testimonials section was redesigned to match.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- projects
-- ---------------------------------------------------------------------------
create table if not exists projects (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  title         text not null,
  client_name   text not null,
  industry      text not null,
  cover_image   text,
  summary       text,
  tools         text[] default '{}',
  published     boolean default false,
  sort_order    int not null default 0,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now(),

  -- Overview
  what_business_does          text,
  problem_before_automation   text,

  -- Pain points
  pain_manual_work            text,
  pain_repetitive_tasks       text,
  pain_mistakes_or_delays     text,
  pain_bottlenecks            text,

  -- Automation built
  automation_description      text,
  flow_diagram_image          text,
  tool_connections            text,

  -- Value created
  value_time_saved            text,
  value_manual_work_removed   text,
  value_errors_reduced        text,
  value_client_experience     text,
  value_revenue_impact        text,

  -- Skills
  skills_showcased            text[] default '{}'
);

-- Keep updated_at fresh on every row change.
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists projects_set_updated_at on projects;
create trigger projects_set_updated_at
  before update on projects
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- project_media
-- ---------------------------------------------------------------------------
create table if not exists project_media (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid references projects(id) on delete cascade,
  type        text check (type in ('image', 'gif', 'video')),
  src         text not null,
  caption     text,
  sort_order  int default 0,
  created_at  timestamptz default now()
);

create index if not exists project_media_project_id_idx
  on project_media(project_id);

-- ---------------------------------------------------------------------------
-- services  (+ slug, details — added vs. prompt to match the live UI)
-- ---------------------------------------------------------------------------
create table if not exists services (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  title       text not null,
  description text,
  details     text[] default '{}',
  icon        text,                    -- Lucide icon name, mapped client-side
  sort_order  int default 0,
  published   boolean default true,
  created_at  timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- testimonials  (author/company/avatar per chosen schema)
-- ---------------------------------------------------------------------------
create table if not exists testimonials (
  id          uuid primary key default gen_random_uuid(),
  quote       text not null,
  author_name text not null,
  company     text,
  avatar_url  text,
  published   boolean default true,
  sort_order  int default 0,
  created_at  timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- site_content  (editable homepage copy)
-- ---------------------------------------------------------------------------
create table if not exists site_content (
  id         uuid primary key default gen_random_uuid(),
  key        text unique not null,
  value      text not null,
  updated_at timestamptz default now()
);

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table projects       enable row level security;
alter table project_media  enable row level security;
alter table services       enable row level security;
alter table testimonials   enable row level security;
alter table site_content   enable row level security;

-- Public read (published only) -------------------------------------------------
create policy "Public read published projects"
  on projects for select
  using (published = true);

create policy "Public read project media"
  on project_media for select
  using (
    exists (
      select 1 from projects
      where projects.id = project_media.project_id
        and projects.published = true
    )
  );

create policy "Public read published services"
  on services for select
  using (published = true);

create policy "Public read published testimonials"
  on testimonials for select
  using (published = true);

create policy "Public read site content"
  on site_content for select
  using (true);

-- Authenticated admin full access ---------------------------------------------
create policy "Admin full access projects"
  on projects for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Admin full access media"
  on project_media for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Admin full access services"
  on services for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Admin full access testimonials"
  on testimonials for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Admin full access site content"
  on site_content for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
