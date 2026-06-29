import { Resend } from "resend";

/**
 * Thin wrapper around Resend. SERVER ONLY.
 *
 * If RESEND_API_KEY is not set, sending is a no-op (logs a warning) so the app
 * works without email configured. Swap providers by changing only this file.
 */

const apiKey = process.env.RESEND_API_KEY;
const from = process.env.EMAIL_FROM || "AXLER8 <onboarding@resend.dev>";

let resend: Resend | null = null;
function client(): Resend | null {
  if (!apiKey) return null;
  if (!resend) resend = new Resend(apiKey);
  return resend;
}

export function isEmailConfigured() {
  return Boolean(apiKey);
}

export interface SendEmailInput {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail(
  input: SendEmailInput
): Promise<{ error?: string }> {
  const c = client();
  if (!c) {
    console.warn(
      `[email] RESEND_API_KEY not set — skipped sending "${input.subject}".`
    );
    return {};
  }

  const recipients = Array.isArray(input.to) ? input.to : [input.to];
  if (recipients.length === 0) return {};

  const { error } = await c.emails.send({
    from,
    to: recipients,
    subject: input.subject,
    html: input.html,
    ...(input.replyTo ? { replyTo: input.replyTo } : {}),
  });

  if (error) {
    console.error("[email] send failed:", error);
    return { error: error.message };
  }
  return {};
}
