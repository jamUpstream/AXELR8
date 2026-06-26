import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase client — configured but NOT yet used.
 *
 * Phase 2 (see the build prompt): replace static imports from `/data/*`
 * with `supabase.from('projects').select(...)` queries in server components.
 * The `Project` type in `/types` already matches the intended table shape.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) {
    // Not configured yet — static data layer is in use.
    return null;
  }
  if (!client) {
    client = createClient(supabaseUrl, supabaseAnonKey);
  }
  return client;
}
