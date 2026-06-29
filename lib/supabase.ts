/**
 * Legacy entrypoint kept for import stability.
 * Phase 2 split the client by environment:
 *   - Server Components / route handlers → ./supabase-server
 *   - Client Components (admin, auth, uploads) → ./supabase-browser
 *   - Privileged server writes / seed → ./supabase-admin
 */
export { createClient as createBrowserClient } from "./supabase-browser";
