import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseKey, getSupabaseUrl } from "./connect";

export async function createClient(cookieStore?: any) {
  const SUPABASE_URL = getSupabaseUrl();
  const SUPABASE_KEY = getSupabaseKey();
  const STORE = cookieStore || (await cookies());

  return createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll() {
        return STORE.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            STORE.set(name, value, options),
          );
        } catch {}
      },
    },
  });
}
