import { createClient } from "@/lib/supabase-server";
import type {
  ProjectRow,
  ServiceRow,
  TestimonialRow,
  SiteContentRow,
  LeadRow,
} from "@/types";

/**
 * Admin reads use the authenticated server client; RLS "Admin full access"
 * policies grant authenticated users full visibility (including drafts).
 */

export async function getAdminProjects(): Promise<ProjectRow[]> {
  const supabase = createClient();
  // Manual order; fall back to updated_at if sort_order column isn't there yet.
  let { data, error } = await supabase
    .from("projects")
    .select("*, project_media ( * )")
    .order("sort_order", { ascending: true })
    .order("updated_at", { ascending: false });
  if (error) {
    ({ data, error } = await supabase
      .from("projects")
      .select("*, project_media ( * )")
      .order("updated_at", { ascending: false }));
  }
  if (error) {
    console.error("getAdminProjects:", error.message);
    return [];
  }
  return (data as unknown as ProjectRow[]) ?? [];
}

export async function getAdminProjectBySlug(
  slug: string
): Promise<ProjectRow | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*, project_media ( * )")
    .eq("slug", slug)
    .single();
  if (error) return null;
  return (data as unknown as ProjectRow) ?? null;
}

export async function getAdminServices(): Promise<ServiceRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) {
    console.error("getAdminServices:", error.message);
    return [];
  }
  return (data as ServiceRow[]) ?? [];
}

export async function getAdminTestimonials(): Promise<TestimonialRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) {
    console.error("getAdminTestimonials:", error.message);
    return [];
  }
  return (data as TestimonialRow[]) ?? [];
}

export async function getAdminSiteContent(): Promise<SiteContentRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("site_content")
    .select("*")
    .order("key", { ascending: true });
  if (error) {
    console.error("getAdminSiteContent:", error.message);
    return [];
  }
  return (data as SiteContentRow[]) ?? [];
}

export async function getAdminLeads(): Promise<LeadRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("getAdminLeads:", error.message);
    return [];
  }
  return (data as LeadRow[]) ?? [];
}
