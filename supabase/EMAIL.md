# Email Notifications (Resend)

When someone submits the contact form, AXLER8 sends two emails:

1. **Admin notification** → every Supabase Auth user (your admin accounts), with
   the full lead details and a reply-to set to the lead's address.
2. **Auto-reply** → the person who submitted, confirming you got their message.

Both are best-effort: if email fails or isn't configured, the lead is still
saved and visible in `/admin/leads`.

## Setup

1. Create a free account at [resend.com](https://resend.com).
2. **API Keys → Create** → copy the key.
3. In `.env.local`:
   ```
   RESEND_API_KEY=re_xxxxxxxx
   EMAIL_FROM="AXLER8 <onboarding@resend.dev>"
   ```
4. Restart the dev server.

## The domain situation (important)

Resend (like all email providers) needs a **verified domain** to send mail from
your own address and reliably reach inboxes.

### Without a domain (now)
Using the shared sender `onboarding@resend.dev`:
- ✅ **Admin notifications work** — but Resend's shared sender can only deliver
  to **the email that owns your Resend account**. So if you sign up for Resend
  with your admin email, you'll receive lead notifications.
- ⚠️ **Auto-replies to leads will NOT deliver** — the shared sender can't send to
  arbitrary external addresses. The code still runs; the email just won't arrive.

### With a domain (later)
1. Buy a domain (Namecheap, Cloudflare, etc.).
2. In Resend: **Domains → Add Domain**, add the DNS records it gives you
   (SPF, DKIM) at your registrar.
3. Once verified, set:
   ```
   EMAIL_FROM="AXLER8 <hello@yourdomain.com>"
   ```
4. Now **both** emails deliver to anyone, landing in inboxes (not spam).

No code changes needed — only the `EMAIL_FROM` env var.

## Who receives admin notifications

Every user in **Supabase → Authentication → Users**. Add a teammate there and
they automatically start receiving lead notifications too.
