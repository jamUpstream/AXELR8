import { createClient } from "@/lib/supabase-browser";

/**
 * Uploads a file to a Storage bucket as the logged-in admin.
 *
 * Storage writes are gated by RLS (`to authenticated`). If the browser session
 * has expired, the request silently downgrades to the anon role and Supabase
 * returns a 403 "row violates row-level security policy". We check the session
 * first so the user gets a clear message instead of a cryptic 403.
 */
export async function uploadToBucket(
  bucket: string,
  path: string,
  file: File,
  opts: { upsert?: boolean } = {}
): Promise<{ url?: string; error?: string }> {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    return { error: "Your session has expired. Please sign in again to upload." };
  }

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: opts.upsert ?? false });

  if (error) {
    const msg = /row-level security|Unauthorized|403/i.test(error.message)
      ? "Upload was rejected — your session may have expired. Sign in again and retry."
      : error.message;
    return { error: msg };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(path);
  return { url: publicUrl };
}
