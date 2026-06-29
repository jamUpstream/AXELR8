# Supabase Setup — AXLER8 Phase 2

One-time setup to take the site live on Supabase. Steps 1–4 happen in the
Supabase dashboard; steps 5–6 run locally.

## 1. Create the project
1. Go to [supabase.com](https://supabase.com) → **New project**.
2. Once provisioned, open **Project Settings → API** and copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (server-only, secret)

## 2. Environment variables
Copy `.env.local.example` to `.env.local` and paste the three values in.

## 3. Run the schema
In the dashboard **SQL Editor**, paste and run, in order:
1. `supabase/schema.sql` — tables, triggers, RLS policies
2. `supabase/seed-site-content.sql` — homepage copy
3. `supabase/migration-projects-sort-order.sql` — manual project ordering
4. `supabase/migration-leads.sql` — contact-form leads + RLS
5. `supabase/migration-lead-emails.sql` — admin reply history per lead
6. `supabase/storage-policies.sql` — lets the admin upload to buckets

## 4. Create Storage buckets
**Storage → New bucket**, all marked **Public**:

| Bucket | Purpose |
|---|---|
| `project-assets` | Cover images, flow diagrams, media gallery |
| `avatars` | Testimonial author avatars |
| `brand` | Logo / brand backups |

Path conventions used by the admin uploader:
```
project-assets/covers/[slug]-cover.[ext]
project-assets/diagrams/[slug]-flow.[ext]
project-assets/media/[slug]/[filename]
avatars/[timestamp]-[filename]
```

## 5. Create the admin user
**Authentication → Users → Add user** → set an email + password.
This is the single account that can log in at `/admin/login`.

> The `next.config.mjs` `images.remotePatterns` must include your Supabase
> hostname (`your-project-ref.supabase.co`) so `next/image` can render stored
> media. Add it before deploying — see the note in that file.

## 6. Seed the projects
With `.env.local` filled in and the schema applied:
```bash
npm run seed
```
This migrates the 5 Phase 1 projects + their media, the 3 services, and the
testimonials. It is idempotent (upserts by slug), so it's safe to re-run.

## 7. Verify
- `npm run dev` → the public pages now read from Supabase.
- `/admin/login` → sign in with the user from step 5.

## Notes
- `/data/*.ts` is now **seed reference only** — public pages read from Supabase.
- Deploy to Vercel with the same three env vars set in the project settings.
