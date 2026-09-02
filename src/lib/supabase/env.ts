/**
 * Vite only exposes variables prefixed `VITE_` to the bundle, so the
 * `NEXT_PUBLIC_*` names from Supabase's Next.js guide read as undefined here.
 * Same values, different prefix.
 *
 * Credentials are resolved lazily rather than at module load: a top-level
 * throw would fail any build performed without the env file present.
 */
export type SupabaseCredentials = { url: string; key: string };

export function supabaseCredentials(): SupabaseCredentials {
  const url = import.meta.env["VITE_SUPABASE_URL"];
  const key = import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) {
    throw new Error(
      "Missing Supabase credentials. Copy .env.example to .env.local and set " +
        "VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.",
    );
  }
  return { url, key };
}

/** True when the app is configured to talk to Supabase at all. */
export function hasSupabaseCredentials() {
  return Boolean(
    import.meta.env["VITE_SUPABASE_URL"] && import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"],
  );
}
