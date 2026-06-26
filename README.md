# AXLER8 — Automation Agency Website

Aerospace-grade automation agency site. **Next.js 14 (App Router)** · **TypeScript** · **Tailwind CSS** · **Framer Motion** · **Lucide**. Supabase is wired as a stub for Phase 2 CMS integration.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Design Source of Truth

The visual system follows `/design/DESIGN.md` and `/design/code.html` (the "Aerospace Industrial" theme), which **take precedence** over any conflicting tokens. Key tokens:

- Background: pure black `#000000`; surfaces in deep charcoals
- Primary (electric blue): `#a3c9ff`, container `#1493ff`
- Fonts: **Inter** (display/body) + **Geist Mono** (labels/data) via `next/font/google`
- Sharp 0px corners everywhere except pills/buttons; hairline borders

## Structure

```
app/                 Routes: / , /work , /work/[slug] , /services , /about , /contact
components/layout/   Navbar, Footer
components/sections/ Homepage + reusable sections
components/projects/ ProjectCard, ProjectDetail
components/ui/        Button, Pill, Reveal (Framer Motion), PageHeader
data/                Static typed content (projects, services, testimonials)
types/               Shared TypeScript interfaces
lib/supabase.ts      Supabase client stub (Phase 2)
public/logo/         Brand logo assets
```

## Content / CMS

All copy lives in `/data/*` as typed objects matching `/types`. No strings are
hardcoded inline in JSX. For Phase 2, swap the static imports for Supabase
queries — the `Project` interface already matches the intended table shape.
Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (see
`.env.local.example`) to activate the client.

## Notes

- Cover/media images use remote placeholders (Unsplash + the mockup's CDN),
  whitelisted in `next.config.mjs`. Replace with real assets in `/public/images`.
- The contact form is client-side only; wire it to Supabase/email in Phase 2.
```
