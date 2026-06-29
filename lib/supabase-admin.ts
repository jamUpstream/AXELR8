import { createClient } from "@supabase/supabase-js";

/**
 * Cookieless anon client for contexts without a request scope (e.g.
 * generateStaticParams at build time, where calling next/headers cookies()
 * throws). Reads only public, RLS-protected data.
 */
/** Emails of all Supabase Auth users (the admin accounts). Server-only. */
export async function getAdminEmails(): Promise<string[]> {
  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return [];
  }
  const { data, error } = await admin.auth.admin.listUsers();
  if (error) {
    console.error("getAdminEmails:", error.message);
    return [];
  }
  return (data.users ?? [])
    .map((u) => u.email)
    .filter((e): e is string => Boolean(e));
}

export function createAnonClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return createClient(url, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/**
 * Service-role Supabase client. Bypasses RLS — SERVER ONLY.
 * Never import this into a client component or expose the key to the browser.
 *
 * Used for privileged admin writes (and the seed script) where we act on
 * behalf of the single admin without per-request auth context.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase admin client requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
