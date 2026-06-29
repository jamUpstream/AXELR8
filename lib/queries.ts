import { createAnonClient } from "@/lib/supabase-admin";
import {
  mapProject,
  mapService,
  mapTestimonial,
  mapSiteContent,
} from "@/lib/mappers";
import type {
  Project,
  Service,
  Testimonial,
  SiteContent,
  ProjectRow,
  ServiceRow,
  TestimonialRow,
  SiteContentRow,
} from "@/types";

/**
 * Public read queries. These read only published (RLS-public) data, so they
 * use the cookieless anon client. That also makes them safe to call from
 * generateStaticParams / static generation, where next/headers cookies()
 * would throw ("called outside a request scope").
 */

const PROJECT_LIST_FIELDS =
  "slug, title, client_name, industry, cover_image, summary, tools, skills_showcased, project_media ( type, src, caption, sort_order )";

/** All published projects in manual order (falls back to newest-first). */
export async function getPublishedProjects(): Promise<Project[]> {
  const supabase = createAnonClient();
  if (!supabase) return [];

  // Prefer manual sort_order; gracefully fall back if the column isn't there
  // yet (before the migration is applied).
  let { data, error } = await supabase
    .from("projects")
    .select(PROJECT_LIST_FIELDS)
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    ({ data, error } = await supabase
      .from("projects")
      .select(PROJECT_LIST_FIELDS)
      .eq("published", true)
      .order("created_at", { ascending: false }));
  }

  if (error) {
    console.error("getPublishedProjects:", error.message);
    return [];
  }
  return ((data as unknown as ProjectRow[]) ?? []).map(mapProject);
}

/**
 * Slugs of published projects — for generateStaticParams.
 */
export async function getPublishedProjectSlugs(): Promise<string[]> {
  const supabase = createAnonClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("projects")
    .select("slug")
    .eq("published", true);
  if (error) {
    console.error("getPublishedProjectSlugs:", error.message);
    return [];
  }
  return (data ?? []).map((r) => r.slug as string);
}

/** Single published project by slug (full detail + media). */
export async function getProjectBySlug(
  slug: string
): Promise<Project | null> {
  const supabase = createAnonClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("projects")
    .select("*, project_media ( * )")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error || !data) return null;
  return mapProject(data as unknown as ProjectRow);
}

/** Published services, ordered. */
export async function getServices(): Promise<Service[]> {
  const supabase = createAnonClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("getServices:", error.message);
    return [];
  }
  return ((data as ServiceRow[]) ?? []).map(mapService);
}

/** Published testimonials, ordered. */
export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = createAnonClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("getTestimonials:", error.message);
    return [];
  }
  return ((data as TestimonialRow[]) ?? []).map(mapTestimonial);
}

/** All site_content as a key → value map. */
export async function getSiteContent(): Promise<SiteContent> {
  const supabase = createAnonClient();
  if (!supabase) return {};
  const { data, error } = await supabase.from("site_content").select("*");
  if (error) {
    console.error("getSiteContent:", error.message);
    return {};
  }
  return mapSiteContent((data as SiteContentRow[]) ?? []);
}
