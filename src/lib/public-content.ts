import { defaultSiteContent, loadFresh } from "@/lib/site-content";
import { hasSupabaseCredentials, supabaseCredentials } from "@/lib/supabase/env";

/** Anonymous, read-only snapshot shared by SSR, metadata and the sitemap.
 * Never uses an admin session or a service-role key.
 */
export async function loadPublicContent() {
  if (!hasSupabaseCredentials()) return { content: defaultSiteContent, available: true };
  try {
    const { url, key } = supabaseCredentials();
    const endpoint = new URL("/rest/v1/site_content", url);
    endpoint.searchParams.set("select", "value");
    endpoint.searchParams.set("key", "eq.site");
    const response = await fetch(endpoint, {
      headers: {
        apikey: key,
        // Legacy anon keys are JWTs; modern publishable keys are not bearer tokens.
        ...(key.startsWith("eyJ") ? { Authorization: `Bearer ${key}` } : {}),
      },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error(`Public catalog returned ${response.status}`);
    const rows = await response.json();
    if (!Array.isArray(rows)) throw new Error("Invalid public catalog response");
    return {
      content: rows[0]?.value ? loadFresh(rows[0].value) : defaultSiteContent,
      available: true,
    };
  } catch (error) {
    console.error("Public catalog unavailable; using the bundled catalog.", error);
    return { content: defaultSiteContent, available: false };
  }
}
