"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { LeadStatus } from "@/types";
import { sendEmail, isEmailConfigured } from "@/lib/email";
import { composedReplyEmail } from "@/lib/email-templates";
import type { LeadEmailRow } from "@/types";

/**
 * Mutations run through the authenticated server client so RLS enforces that
 * only a signed-in admin can write. Each revalidates the affected public paths.
 *
 * IMPORTANT: under RLS, a write the policy rejects returns NO error and simply
 * affects 0 rows. So every mutation must (a) confirm an authenticated user and
 * (b) verify rows were actually affected — otherwise a blocked delete/update
 * looks like success while the row survives.
 */

/** Returns the authed client, or an error result if no admin session. */
async function requireAdmin(): Promise<
  { supabase: SupabaseClient } | { error: string }
> {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    return { error: "Not authenticated. Please sign in again." };
  }
  return { supabase };
}

function revalidatePublic() {
  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath("/services");
}

// ---------------------------------------------------------------- projects ---

export interface ProjectInput {
  slug: string;
  title: string;
  client_name: string;
  industry: string;
  summary: string;
  cover_image: string | null;
  tools: string[];
  published: boolean;
  what_business_does: string;
  problem_before_automation: string;
  pain_manual_work: string;
  pain_repetitive_tasks: string;
  pain_mistakes_or_delays: string;
  pain_bottlenecks: string;
  automation_description: string;
  flow_diagram_image: string | null;
  tool_connections: string;
  value_time_saved: string | null;
  value_manual_work_removed: string | null;
  value_errors_reduced: string | null;
  value_client_experience: string | null;
  value_revenue_impact: string | null;
  skills_showcased: string[];
}

export async function upsertProject(
  input: ProjectInput,
  originalSlug?: string
): Promise<{ error?: string }> {
  const auth = await requireAdmin();
  if ("error" in auth) return auth;
  const { supabase } = auth;

  if (originalSlug) {
    const { error, count } = await supabase
      .from("projects")
      .update(input, { count: "exact" })
      .eq("slug", originalSlug);
    if (error) return { error: error.message };
    if (!count) return { error: "Update affected no rows (permission denied?)." };
  } else {
    const { error } = await supabase.from("projects").insert(input);
    if (error) return { error: error.message };
  }

  revalidatePublic();
  revalidatePath(`/work/${input.slug}`);
  revalidatePath("/admin/projects");
  return {};
}

export async function deleteProject(slug: string): Promise<{ error?: string }> {
  const auth = await requireAdmin();
  if ("error" in auth) return auth;
  const { supabase } = auth;

  const { error, count } = await supabase
    .from("projects")
    .delete({ count: "exact" })
    .eq("slug", slug);
  if (error) return { error: error.message };
  if (!count) {
    return { error: "Delete affected no rows — the row may be protected by RLS." };
  }
  revalidatePublic();
  revalidatePath("/admin/projects");
  return {};
}

export async function toggleProjectPublished(
  slug: string,
  published: boolean
): Promise<{ error?: string }> {
  const auth = await requireAdmin();
  if ("error" in auth) return auth;
  const { supabase } = auth;

  const { error, count } = await supabase
    .from("projects")
    .update({ published }, { count: "exact" })
    .eq("slug", slug);
  if (error) return { error: error.message };
  if (!count) return { error: "Update affected no rows (permission denied?)." };
  revalidatePublic();
  revalidatePath("/admin/projects");
  return {};
}

export async function duplicateProject(
  slug: string
): Promise<{ error?: string }> {
  const auth = await requireAdmin();
  if ("error" in auth) return auth;
  const { supabase } = auth;

  const { data, error } = await supabase
    .from("projects")
    .select("*, project_media ( type, src, caption, sort_order )")
    .eq("slug", slug)
    .single();
  if (error || !data) return { error: error?.message ?? "Not found" };

  const { id, created_at, updated_at, project_media, ...rest } = data as Record<
    string,
    unknown
  > & { project_media?: unknown[] };
  void id;
  void created_at;
  void updated_at;

  const copy = {
    ...rest,
    slug: `${rest.slug}-copy-${Date.now().toString(36)}`,
    title: `${rest.title} (Copy)`,
    published: false,
  };

  const { data: inserted, error: insErr } = await supabase
    .from("projects")
    .insert(copy)
    .select("id")
    .single();
  if (insErr || !inserted) return { error: insErr?.message };

  if (Array.isArray(project_media) && project_media.length) {
    await supabase.from("project_media").insert(
      project_media.map((m) => ({
        ...(m as object),
        project_id: inserted.id,
      }))
    );
  }

  revalidatePath("/admin/projects");
  return {};
}

// ----------------------------------------------------------- project media ---

export async function addProjectMedia(input: {
  project_id: string;
  type: "image" | "gif" | "video";
  src: string;
  caption: string;
  sort_order: number;
}): Promise<{ error?: string; id?: string }> {
  const auth = await requireAdmin();
  if ("error" in auth) return auth;
  const { data, error } = await auth.supabase
    .from("project_media")
    .insert(input)
    .select("id")
    .single();
  if (error || !data) return { error: error?.message ?? "Insert failed" };
  revalidatePath("/admin/projects");
  return { id: data.id as string };
}

export async function updateProjectMediaCaption(
  id: string,
  caption: string
): Promise<{ error?: string }> {
  const auth = await requireAdmin();
  if ("error" in auth) return auth;
  const { error, count } = await auth.supabase
    .from("project_media")
    .update({ caption }, { count: "exact" })
    .eq("id", id);
  if (error) return { error: error.message };
  if (!count) return { error: "Update affected no rows (permission denied?)." };
  revalidatePublic();
  revalidatePath("/admin/projects");
  return {};
}

export async function reorderProjectMedia(
  orderedIds: string[]
): Promise<{ error?: string }> {
  const auth = await requireAdmin();
  if ("error" in auth) return auth;
  const { supabase } = auth;
  for (let i = 0; i < orderedIds.length; i++) {
    const { error } = await supabase
      .from("project_media")
      .update({ sort_order: i })
      .eq("id", orderedIds[i]);
    if (error) return { error: error.message };
  }
  revalidatePublic();
  revalidatePath("/admin/projects");
  return {};
}

export async function deleteProjectMedia(
  id: string
): Promise<{ error?: string }> {
  const auth = await requireAdmin();
  if ("error" in auth) return auth;
  const { error } = await auth.supabase
    .from("project_media")
    .delete()
    .eq("id", id);
  if (error) return { error: error.message };
  return {};
}

// ---------------------------------------------------------------- services ---

export interface ServiceInput {
  slug: string;
  title: string;
  description: string;
  details: string[];
  icon: string;
  published: boolean;
  sort_order: number;
}

export async function saveService(
  input: ServiceInput,
  id?: string
): Promise<{ error?: string }> {
  const auth = await requireAdmin();
  if ("error" in auth) return auth;
  const { supabase } = auth;
  if (id) {
    const { error, count } = await supabase
      .from("services")
      .update(input, { count: "exact" })
      .eq("id", id);
    if (error) return { error: error.message };
    if (!count) return { error: "Update affected no rows (permission denied?)." };
  } else {
    const { error } = await supabase.from("services").insert(input);
    if (error) return { error: error.message };
  }
  revalidatePublic();
  revalidatePath("/admin/services");
  return {};
}

export async function deleteService(id: string): Promise<{ error?: string }> {
  const auth = await requireAdmin();
  if ("error" in auth) return auth;
  const { error, count } = await auth.supabase
    .from("services")
    .delete({ count: "exact" })
    .eq("id", id);
  if (error) return { error: error.message };
  if (!count) return { error: "Delete affected no rows — protected by RLS?" };
  revalidatePublic();
  revalidatePath("/admin/services");
  return {};
}

// ------------------------------------------------------------ testimonials ---

export interface TestimonialInput {
  quote: string;
  author_name: string;
  company: string | null;
  avatar_url: string | null;
  published: boolean;
  sort_order: number;
}

export async function saveTestimonial(
  input: TestimonialInput,
  id?: string
): Promise<{ error?: string }> {
  const auth = await requireAdmin();
  if ("error" in auth) return auth;
  const { supabase } = auth;
  if (id) {
    const { error, count } = await supabase
      .from("testimonials")
      .update(input, { count: "exact" })
      .eq("id", id);
    if (error) return { error: error.message };
    if (!count) return { error: "Update affected no rows (permission denied?)." };
  } else {
    const { error } = await supabase.from("testimonials").insert(input);
    if (error) return { error: error.message };
  }
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
  return {};
}

export async function deleteTestimonial(
  id: string
): Promise<{ error?: string }> {
  const auth = await requireAdmin();
  if ("error" in auth) return auth;
  const { error, count } = await auth.supabase
    .from("testimonials")
    .delete({ count: "exact" })
    .eq("id", id);
  if (error) return { error: error.message };
  if (!count) return { error: "Delete affected no rows — protected by RLS?" };
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
  return {};
}

// ------------------------------------------------------------ site content ---

export async function saveSiteContent(
  entries: { key: string; value: string }[]
): Promise<{ error?: string }> {
  const auth = await requireAdmin();
  if ("error" in auth) return auth;
  const { error } = await auth.supabase
    .from("site_content")
    .upsert(entries, { onConflict: "key" });
  if (error) return { error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/site-content");
  return {};
}

// ------------------------------------------------------------ bulk actions ---

/** Generic bulk delete by a key column. */
async function bulkDelete(
  table: "projects" | "services" | "testimonials" | "leads",
  keyColumn: "id" | "slug",
  keys: string[]
): Promise<{ error?: string; count?: number }> {
  const auth = await requireAdmin();
  if ("error" in auth) return auth;
  if (keys.length === 0) return { count: 0 };
  const { error, count } = await auth.supabase
    .from(table)
    .delete({ count: "exact" })
    .in(keyColumn, keys);
  if (error) return { error: error.message };
  return { count: count ?? 0 };
}

export async function bulkDeleteProjects(
  slugs: string[]
): Promise<{ error?: string }> {
  const res = await bulkDelete("projects", "slug", slugs);
  if (res.error) return res;
  revalidatePublic();
  revalidatePath("/admin/projects");
  return {};
}

export async function bulkSetProjectsPublished(
  slugs: string[],
  published: boolean
): Promise<{ error?: string }> {
  const auth = await requireAdmin();
  if ("error" in auth) return auth;
  if (slugs.length === 0) return {};
  const { error } = await auth.supabase
    .from("projects")
    .update({ published })
    .in("slug", slugs);
  if (error) return { error: error.message };
  revalidatePublic();
  revalidatePath("/admin/projects");
  return {};
}

export async function bulkDeleteServices(
  ids: string[]
): Promise<{ error?: string }> {
  const res = await bulkDelete("services", "id", ids);
  if (res.error) return res;
  revalidatePublic();
  revalidatePath("/admin/services");
  return {};
}

export async function bulkDeleteTestimonials(
  ids: string[]
): Promise<{ error?: string }> {
  const res = await bulkDelete("testimonials", "id", ids);
  if (res.error) return res;
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
  return {};
}

export async function bulkDeleteLeads(
  ids: string[]
): Promise<{ error?: string }> {
  const res = await bulkDelete("leads", "id", ids);
  if (res.error) return res;
  revalidatePath("/admin/leads");
  return {};
}

export async function bulkSetLeadStatus(
  ids: string[],
  status: LeadStatus
): Promise<{ error?: string }> {
  const auth = await requireAdmin();
  if ("error" in auth) return auth;
  if (ids.length === 0) return {};
  const { error } = await auth.supabase
    .from("leads")
    .update({ status })
    .in("id", ids);
  if (error) return { error: error.message };
  revalidatePath("/admin/leads");
  return {};
}

// --------------------------------------------------------------- reordering ---

/**
 * Persist a new display order. `orderedKeys` is the full list of row keys in
 * the desired order; each row's sort_order is set to its index. `keyColumn`
 * is the column those keys match (id for services/testimonials, slug for
 * projects).
 */
async function reorder(
  table: "services" | "testimonials" | "projects",
  keyColumn: "id" | "slug",
  orderedKeys: string[]
): Promise<{ error?: string }> {
  const auth = await requireAdmin();
  if ("error" in auth) return auth;
  const { supabase } = auth;

  // Sequential updates keep it simple and RLS-safe.
  for (let i = 0; i < orderedKeys.length; i++) {
    const { error } = await supabase
      .from(table)
      .update({ sort_order: i })
      .eq(keyColumn, orderedKeys[i]);
    if (error) return { error: error.message };
  }
  return {};
}

export async function reorderServices(
  orderedIds: string[]
): Promise<{ error?: string }> {
  const res = await reorder("services", "id", orderedIds);
  if (res.error) return res;
  revalidatePublic();
  revalidatePath("/admin/services");
  return {};
}

export async function reorderProjects(
  orderedSlugs: string[]
): Promise<{ error?: string }> {
  const res = await reorder("projects", "slug", orderedSlugs);
  if (res.error) return res;
  revalidatePublic();
  revalidatePath("/admin/projects");
  return {};
}

export async function reorderTestimonials(
  orderedIds: string[]
): Promise<{ error?: string }> {
  const res = await reorder("testimonials", "id", orderedIds);
  if (res.error) return res;
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
  return {};
}

// ------------------------------------------------------------------- leads ---

export async function updateLeadStatus(
  id: string,
  status: LeadStatus
): Promise<{ error?: string }> {
  const auth = await requireAdmin();
  if ("error" in auth) return auth;
  const { error, count } = await auth.supabase
    .from("leads")
    .update({ status }, { count: "exact" })
    .eq("id", id);
  if (error) return { error: error.message };
  if (!count) return { error: "Update affected no rows (permission denied?)." };
  revalidatePath("/admin/leads");
  return {};
}

export async function deleteLead(id: string): Promise<{ error?: string }> {
  const auth = await requireAdmin();
  if ("error" in auth) return auth;
  const { error, count } = await auth.supabase
    .from("leads")
    .delete({ count: "exact" })
    .eq("id", id);
  if (error) return { error: error.message };
  if (!count) return { error: "Delete affected no rows — protected by RLS?" };
  revalidatePath("/admin/leads");
  return {};
}

/**
 * Compose-and-send a reply to a lead. Sends via Resend (branded shell), logs
 * the attempt to lead_emails, and bumps a 'new' lead to 'contacted'.
 */
export async function sendLeadReply(input: {
  leadId: string;
  toEmail: string;
  subject: string;
  bodyHtml: string;
}): Promise<{ error?: string }> {
  const auth = await requireAdmin();
  if ("error" in auth) return auth;
  const { supabase } = auth;

  const subject = input.subject.trim();
  const bodyText = input.bodyHtml.replace(/<[^>]*>/g, "").trim();
  if (!subject) return { error: "Subject is required." };
  if (!bodyText) return { error: "Message body is required." };

  if (!isEmailConfigured()) {
    return {
      error:
        "Email isn't configured. Set RESEND_API_KEY in your environment to send.",
    };
  }

  const html = composedReplyEmail(input.bodyHtml);
  const sendRes = await sendEmail({
    to: input.toEmail,
    subject,
    html,
  });

  // Log the attempt (success or failure) for history.
  await supabase.from("lead_emails").insert({
    lead_id: input.leadId,
    to_email: input.toEmail,
    subject,
    body_html: input.bodyHtml,
    error: sendRes.error ?? null,
  });

  if (sendRes.error) {
    revalidatePath("/admin/leads");
    return { error: `Send failed: ${sendRes.error}` };
  }

  // Move a brand-new lead into the pipeline.
  await supabase
    .from("leads")
    .update({ status: "contacted" })
    .eq("id", input.leadId)
    .eq("status", "new");

  revalidatePath("/admin/leads");
  return {};
}

/** Email history for a lead (most recent first). */
export async function getLeadEmails(
  leadId: string
): Promise<LeadEmailRow[]> {
  const auth = await requireAdmin();
  if ("error" in auth) return [];
  const { data, error } = await auth.supabase
    .from("lead_emails")
    .select("*")
    .eq("lead_id", leadId)
    .order("sent_at", { ascending: false });
  if (error) return [];
  return (data as LeadEmailRow[]) ?? [];
}

// -------------------------------------------------------------------- nav ----

export async function redirectToProjects() {
  redirect("/admin/projects");
}
