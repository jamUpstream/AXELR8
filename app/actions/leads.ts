"use server";

import { createAnonClient, getAdminEmails } from "@/lib/supabase-admin";
import { sendEmail } from "@/lib/email";
import {
  adminLeadEmail,
  leadAutoReplyEmail,
  type LeadEmailData,
} from "@/lib/email-templates";

export interface LeadSubmission {
  name: string;
  email: string;
  company: string;
  message: string;
  tools: string[];
  tools_other: string;
  service_slugs: string[];
}

/**
 * Public contact-form submission. Runs as anon; the leads RLS policy permits
 * inserts only with status 'new'. No auth required.
 *
 * After saving, fires two emails best-effort (admins + auto-reply). Email
 * failures never fail the submission — the lead is already persisted.
 */
export async function submitLead(
  input: LeadSubmission
): Promise<{ error?: string }> {
  const supabase = createAnonClient();
  if (!supabase) {
    return { error: "Submissions are temporarily unavailable." };
  }

  const name = input.name.trim();
  const email = input.email.trim();
  const message = input.message.trim();

  if (!name || !email || !message) {
    return { error: "Name, email, and message are required." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  const { error } = await supabase.from("leads").insert({
    name,
    email,
    company: input.company.trim() || null,
    message,
    tools: input.tools,
    tools_other: input.tools_other.trim() || null,
    service_slugs: input.service_slugs,
    status: "new",
  });

  if (error) return { error: error.message };

  // Await so the serverless runtime doesn't terminate before emails send.
  // Wrapped to never fail the submission — the lead is already persisted.
  await sendLeadEmails({ ...input, name, email, message }, supabase);

  return {};
}

async function sendLeadEmails(
  input: LeadSubmission,
  supabase: NonNullable<ReturnType<typeof createAnonClient>>
) {
  try {
    // Resolve service slugs → titles for readable emails.
    let serviceTitles: string[] = input.service_slugs;
    if (input.service_slugs.length) {
      const { data } = await supabase
        .from("services")
        .select("slug, title")
        .in("slug", input.service_slugs);
      if (data) {
        const map = new Map(data.map((s) => [s.slug as string, s.title as string]));
        serviceTitles = input.service_slugs.map((s) => map.get(s) ?? s);
      }
    }

    const data: LeadEmailData = {
      name: input.name,
      email: input.email,
      company: input.company.trim(),
      message: input.message,
      tools: input.tools,
      toolsOther: input.tools_other.trim(),
      serviceTitles,
    };

    // 1) Notify all admins.
    const admins = await getAdminEmails();
    if (admins.length) {
      const { subject, html } = adminLeadEmail(data);
      await sendEmail({ to: admins, subject, html, replyTo: input.email });
    }

    // 2) Auto-reply to the lead.
    const reply = leadAutoReplyEmail(data);
    await sendEmail({
      to: input.email,
      subject: reply.subject,
      html: reply.html,
    });
  } catch (e) {
    console.error("[leads] email side-effect failed:", e);
  }
}
