import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseKey, getSupabaseUrl } from "./connect";

export function createClient() {
  const SUPABASE_URL = getSupabaseUrl();
  const SUPABASE_KEY = getSupabaseKey();
  return createBrowserClient(SUPABASE_URL, SUPABASE_KEY);
}
