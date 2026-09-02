import { useState, type FormEvent, type ReactNode } from "react";
import { AlertTriangle, Loader2, Lock, LogIn } from "lucide-react";
import { useAdminAuth, useSignIn, type AdminAuth } from "@/lib/supabase/auth";

/** Shared shell so every gate state matches the studio's look. */
function GateShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative grid min-h-screen place-items-center px-5 text-[#162019]">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(60rem 40rem at 12% -10%, rgba(29,74,44,0.13), transparent 60%)," +
            "radial-gradient(45rem 35rem at 100% 0%, rgba(216,168,78,0.20), transparent 55%)," +
            "linear-gradient(180deg, #f7f9f4 0%, #eef2e9 55%, #e9efe4 100%)",
        }}
      />
      <div className="w-full max-w-sm rounded-2xl border border-[#dce2db]/90 bg-white/90 p-7 shadow-[0_18px_45px_-25px_rgba(24,39,28,0.35)] backdrop-blur-sm">
        {children}
      </div>
    </div>
  );
}

function SignInForm() {
  const { signIn, pending, error, setError } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }
    await signIn(email.trim(), password);
    // A success flips the session, and the gate re-renders into the studio.
  };

  const field =
    "w-full rounded-xl border border-[#d5ddd6] bg-[#fbfcfa] px-3.5 py-3 text-sm text-[#1c271f] outline-none transition focus:border-[#688270] focus:ring-2 focus:ring-[#688270]/15";

  return (
    <GateShell>
      <div className="flex items-center gap-2.5">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#1d4a2c] text-white">
          <Lock className="h-4 w-4" />
        </span>
        <div>
          <h1 className="text-sm font-bold tracking-tight">OCC Content Studio</h1>
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#718076]">
            Authorized access only
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="mt-6 grid gap-4" noValidate>
        <label className="block">
          <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-[#718076]">
            Email
          </span>
          <input
            type="email"
            name="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={field}
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-[#718076]">
            Password
          </span>
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={field}
          />
        </label>

        {error && (
          <p role="alert" className="text-xs font-semibold text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1d4a2c] px-4 py-3 text-xs font-semibold text-white transition-colors hover:bg-[#173d24] disabled:opacity-60"
        >
          {pending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <LogIn className="h-3.5 w-3.5" />
          )}
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-5 text-[11px] leading-relaxed text-[#8b968d]">
        Accounts are created by the site owner in Supabase. There is no public sign-up.
      </p>
    </GateShell>
  );
}

function NotAuthorized({ email }: { email: string | null }) {
  return (
    <GateShell>
      <div className="flex items-start gap-2.5">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#9a6e22]" />
        <div>
          <h1 className="text-sm font-bold tracking-tight">Not an administrator</h1>
          <p className="mt-2 text-xs leading-relaxed text-[#68746b]">
            {email ? <span className="font-semibold">{email}</span> : "This account"} is signed in
            but is not on the studio allowlist, so it cannot read inquiries or change content.
          </p>
          <p className="mt-3 text-[11px] leading-relaxed text-[#8b968d]">
            To grant access, add the account to the <code className="font-mono">admins</code> table
            as described at the end of <code className="font-mono">supabase/schema.sql</code>.
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => void import("@/lib/supabase/auth").then((m) => m.signOut())}
        className="mt-5 w-full rounded-xl border border-[#d5ddd6] bg-white px-4 py-2.5 text-xs font-semibold text-[#58655b] hover:border-[#a5b1a7]"
      >
        Sign out
      </button>
    </GateShell>
  );
}

function NotConfigured() {
  return (
    <GateShell>
      <div className="flex items-start gap-2.5">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-700" />
        <div>
          <h1 className="text-sm font-bold tracking-tight">Studio is not configured</h1>
          <p className="mt-2 text-xs leading-relaxed text-[#68746b]">
            Supabase credentials are missing, so the studio cannot verify who you are. It stays
            locked rather than opening unprotected.
          </p>
          <p className="mt-3 text-[11px] leading-relaxed text-[#8b968d]">
            Copy <code className="font-mono">.env.example</code> to{" "}
            <code className="font-mono">.env.local</code> and set{" "}
            <code className="font-mono">VITE_SUPABASE_URL</code> and{" "}
            <code className="font-mono">VITE_SUPABASE_PUBLISHABLE_KEY</code>.
          </p>
        </div>
      </div>
    </GateShell>
  );
}

/**
 * Wraps the studio. Fails closed: any state other than "signed in and
 * allowlisted" renders an explanation instead of the editor.
 */
export function AdminGate({ children }: { children: (auth: AdminAuth) => ReactNode }) {
  const auth = useAdminAuth();

  if (auth.loading) {
    return (
      <GateShell>
        <p className="flex items-center justify-center gap-2 py-4 text-xs font-medium text-[#587060]">
          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Checking access…
        </p>
      </GateShell>
    );
  }
  if (!auth.configured) return <NotConfigured />;
  if (!auth.session) return <SignInForm />;
  if (!auth.isAdmin) return <NotAuthorized email={auth.email} />;

  return <>{children(auth)}</>;
}
