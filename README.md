# OCC — Oragon Commodity Center

Marketing site and content studio for an Ethiopian agricultural commodity
exporter: coffee, oilseeds, pulses and cereals sold to international buyers.

Built with TanStack Start, React, TypeScript, Tailwind CSS and Supabase.

## Run it locally

Needs Node.js and npm.

```sh
git clone https://github.com/biniyaminr/OCC.git
cd OCC
npm install
npm run dev
```

The public site works immediately with no configuration — product photography
is committed to the repository, and the catalog falls back to the content in
`src/data/` whenever Supabase is unreachable. Only the studio at `/admin`
needs credentials.

## Configure Supabase

Two variables, both safe to expose — the publishable key is designed to ship
in the browser bundle, and row-level security is what protects the data.

```sh
cp .env.example .env.local
```

```
VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

Vite only exposes variables prefixed `VITE_`. The `NEXT_PUBLIC_*` names in
Supabase's Next.js guide read as `undefined` here — this is not a Next.js app.

### Deploying

Set the same two variables in the host's environment settings (Vercel, Lovable,
Netlify — wherever the site runs). `.env.local` is deliberately gitignored, so
a deployment that skips this step will serve the public site correctly but
lock the studio with "Studio is not configured". That is intentional: missing
credentials fail closed rather than opening an unprotected admin.

### Database

Run `supabase/schema.sql` once in the Supabase SQL editor (SQL Editor → New
query → paste → Run). It is idempotent. It creates `categories`, `products`,
`partners`, `site_content`, `messages` and `admins`, enables row-level
security on all of them, and creates a public `media` storage bucket.

Then, per the notes at the end of that file:

1. Create your user — Authentication → Users → Add user, with **Auto Confirm**.
2. Add it to the allowlist:
   ```sql
   insert into public.admins (user_id, email)
   select id, email from auth.users
   where lower(email) = lower('you@example.com')
   on conflict (user_id) do nothing;
   ```
3. Turn off public signup — Authentication → Sign In / Providers → Email →
   disable "Allow new users to sign up".

Step 3 matters: signing in is not the same as being an admin. Every write
policy calls `public.is_admin()`, so an account that is not allowlisted can
read the public catalog and nothing more.

## The content studio

`/admin`, behind Supabase auth. Edits save to Supabase and appear for every
visitor. Manages products, commodity categories, partner profiles, homepage
copy and images, and holds an inbox for inquiries submitted through the
contact form and the RFQ modal.

Uploaded images go to the `media` storage bucket and are stored as public
URLs. Products created but never named stay out of the public site, and
untouched ones are cleaned up on load.

## Languages

English and Chinese, switched from the header. The studio edits English —
that is the source of truth — and Chinese is overlaid from `src/lib/i18n/`.
Anything without a translation falls back to English rather than disappearing.

## Layout

```
src/
  components/occ/     public site
  components/admin/   studio-only (its own palette; the public site is tokenized)
  data/               shipped catalog, used as the fallback layer
  lib/i18n/           English and Chinese strings
  lib/supabase/       browser and server clients, auth
  routes/             /, /partners, /products/$slug, /admin
supabase/schema.sql   tables, RLS policies, storage bucket
```
