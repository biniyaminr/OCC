import { createServerClient } from "@supabase/ssr";
import { getCookies, setCookie } from "@tanstack/react-start/server";
import { supabaseCredentials } from "./env";

/**
 * Supabase client for server-side rendering and server functions.
 *
 * TanStack Start's equivalent of Next's `cookies()` is `getCookies`/`setCookie`
 * from `@tanstack/react-start/server`, so no cookie store has to be threaded
 * through by hand the way the Next.js guide does it.
 */
export function createClient() {
  const { url, key } = supabaseCredentials();
  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return Object.entries(getCookies()).map(([name, value]) => ({
          name,
          value: value ?? "",
        }));
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => setCookie(name, value, options));
        } catch {
          // Called outside a request scope (e.g. during prerender).
          // Safe to ignore: the session refreshes on the next request.
        }
      },
    },
  });
}
