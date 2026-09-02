import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { createClient } from "./client";
import { hasSupabaseCredentials } from "./env";

export type AdminAuth = {
  /** Still determining the session — render nothing decisive yet. */
  loading: boolean;
  session: Session | null;
  email: string | null;
  /** Signed in AND present in the `admins` allowlist. */
  isAdmin: boolean;
  /** Supabase is not wired up at all (missing env vars). */
  configured: boolean;
  error: string;
};

const INITIAL: AdminAuth = {
  loading: true,
  session: null,
  email: null,
  isAdmin: false,
  configured: true,
  error: "",
};

/**
 * Tracks the studio session.
 *
 * This gate is a usability boundary, not the security boundary — a determined
 * visitor can render any component they like. What actually protects the data
 * is row-level security: every write policy calls `public.is_admin()`, so a
 * session that is not allowlisted can read the public catalog and nothing more.
 */
export function useAdminAuth(): AdminAuth {
  const [state, setState] = useState<AdminAuth>(INITIAL);

  useEffect(() => {
    if (!hasSupabaseCredentials()) {
      setState({ ...INITIAL, loading: false, configured: false });
      return;
    }

    let active = true;
    const supabase = createClient();

    /** Membership is confirmed by the database, never by client-side state. */
    const resolve = async (session: Session | null) => {
      if (!session) {
        if (active) setState({ ...INITIAL, loading: false, session: null });
        return;
      }
      const { data, error } = await supabase.rpc("is_admin");
      if (!active) return;
      setState({
        loading: false,
        session,
        email: session.user.email ?? null,
        isAdmin: data === true,
        configured: true,
        error: error ? "Could not verify admin access. Has schema.sql been run?" : "",
      });
    };

    void supabase.auth.getSession().then(({ data }) => resolve(data.session));

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      void resolve(session);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return state;
}

export function useSignIn() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const signIn = useCallback(async (email: string, password: string) => {
    setPending(true);
    setError("");
    try {
      const { error } = await createClient().auth.signInWithPassword({ email, password });
      if (error) {
        // Supabase deliberately does not reveal which half was wrong.
        setError(
          error.message === "Invalid login credentials"
            ? "That email and password combination was not recognised."
            : error.message,
        );
        return false;
      }
      return true;
    } catch {
      setError("Could not reach the authentication service.");
      return false;
    } finally {
      setPending(false);
    }
  }, []);

  return { signIn, pending, error, setError };
}

export async function signOut() {
  await createClient().auth.signOut();
}
