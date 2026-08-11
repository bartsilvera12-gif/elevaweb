import { createClient as _createClient } from "@supabase/supabase-js";

// Cliente con service role — SOLO para uso server-side (route handlers, server actions)
// NUNCA exponer al browser.
export function createAdminClient() {
  return _createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      db: { schema: "eleva" },
      auth: { autoRefreshToken: false, persistSession: false },
    }
  );
}
