import { createClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "./connect";

export function createServiceClient() {
  return createClient(
    getSupabaseUrl(),
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}
