/**
 * Branded HTML email templates (AXLER8 dark theme).
 * Inline styles only — email clients ignore <style> and external CSS.
 */

const BRAND = "#a3c9ff";
const BG = "#0d0e0f";
const CARD = "#161616";
const TEXT = "#e3e2e2";
const MUTED = "#8a919f";
const BORDER = "#2a2a2a";

function shell(title: string, body: string, footnote?: string): string {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:${BG};font-family:Inter,Arial,Helvetica,sans-serif;color:${TEXT};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BG};padding:32px 16px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${CARD};border:1px solid ${BORDER};">
          <tr><td style="padding:28px 32px;border-bottom:1px solid ${BORDER};">
            <span style="font-size:20px;font-weight:700;letter-spacing:0.04em;color:${TEXT};">AXLER8</span>
            <span style="display:block;margin-top:4px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:${BRAND};">${title}</span>
          </td></tr>
          <tr><td style="padding:32px;">${body}</td></tr>
          ${
            footnote
              ? `<tr><td style="padding:20px 32px;border-top:1px solid ${BORDER};font-size:12px;color:${MUTED};">${footnote}</td></tr>`
              : ""
          }
        </table>
        <p style="max-width:560px;margin:16px auto 0;font-size:11px;color:${MUTED};">AXLER8 Automation · Aerospace-grade automation systems</p>
      </td></tr>
    </table>
  </body>
</html>`;
}

function row(label: string, value: string): string {
  if (!value) return "";
  return `<tr>
    <td style="padding:6px 0;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:${MUTED};width:140px;vertical-align:top;">${label}</td>
    <td style="padding:6px 0;font-size:14px;color:${TEXT};">${escapeHtml(value)}</td>
  </tr>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export interface LeadEmailData {
  name: string;
  email: string;
  company: string;
  message: string;
  tools: string[];
  toolsOther: string;
  serviceTitles: string[];
}

/** Notification sent to admins when a new lead arrives. */
export function adminLeadEmail(d: LeadEmailData): { subject: string; html: string } {
  const toolsLine = [...d.tools, ...(d.toolsOther ? [`${d.toolsOther} (other)`] : [])].join(
    ", "
  );
  const body = `
    <p style="margin:0 0 20px;font-size:16px;line-height:1.6;color:${TEXT};">
      New lead from <strong>${escapeHtml(d.name)}</strong>.
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
      ${row("Name", d.name)}
      ${row("Email", d.email)}
      ${row("Company", d.company || "—")}
      ${row("Tools", toolsLine || "—")}
      ${row("Services", d.serviceTitles.join(", ") || "—")}
    </table>
    <div style="margin-top:20px;padding:16px;border-left:2px solid ${BRAND};background:${BG};">
      <span style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:${MUTED};">Message</span>
      <p style="margin:8px 0 0;font-size:14px;line-height:1.6;color:${TEXT};white-space:pre-wrap;">${escapeHtml(
        d.message
      )}</p>
    </div>
    <p style="margin:24px 0 0;">
      <a href="mailto:${escapeHtml(d.email)}" style="display:inline-block;background:${BRAND};color:#00315d;font-size:12px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;text-decoration:none;padding:12px 24px;">Reply to ${escapeHtml(
        d.name
      )}</a>
    </p>`;
  return {
    subject: `New lead: ${d.name}${d.company ? ` (${d.company})` : ""}`,
    html: shell("New Lead", body, "View and manage this lead in your admin panel."),
  };
}

/** Auto-reply sent to the person who submitted the form. */
export function leadAutoReplyEmail(d: LeadEmailData): {
  subject: string;
  html: string;
} {
  const body = `
    <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:${TEXT};">
      Hi ${escapeHtml(d.name.split(" ")[0] || d.name)},
    </p>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:${TEXT};">
      Thanks for reaching out to AXLER8 — we've received your message and a member
      of our team will be in touch within one business day to schedule your
      mission review.
    </p>
    <div style="margin:20px 0;padding:16px;border-left:2px solid ${BRAND};background:${BG};">
      <span style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:${MUTED};">Your message</span>
      <p style="margin:8px 0 0;font-size:14px;line-height:1.6;color:${TEXT};white-space:pre-wrap;">${escapeHtml(
        d.message
      )}</p>
    </div>
    <p style="margin:16px 0 0;font-size:15px;line-height:1.6;color:${TEXT};">
      — The AXLER8 Team
    </p>`;
  return {
    subject: "We received your message — AXLER8",
    html: shell(
      "Thank You",
      body,
      "If you didn't submit this, you can safely ignore this email."
    ),
  };
}

/**
 * Admin-composed reply. The rich-text HTML (from the editor) is dropped into
 * the branded shell so it matches the look of the auto emails.
 */
export function composedReplyEmail(bodyHtml: string): string {
  // Scope link/heading colors to match the brand inside the email body.
  const styled = `<div style="font-size:15px;line-height:1.6;color:${TEXT};">${bodyHtml}</div>`;
  return shell("A Message From AXLER8", styled);
}
