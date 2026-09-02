import { createBrowserClient } from "@supabase/ssr";
import { supabaseCredentials } from "./env";

/**
 * Supabase client for the browser.
 *
 * Safe to call repeatedly — `createBrowserClient` reuses one underlying
 * instance per set of credentials, so components can call it freely.
 */
export function createClient() {
  const { url, key } = supabaseCredentials();
  return createBrowserClient(url, key);
}
