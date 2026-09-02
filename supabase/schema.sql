-- ===========================================================================
-- OCC — website database schema
-- Run in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.
-- Safe to re-run; every statement is idempotent.
--
-- SECURITY MODEL
--   The publishable key ships inside the browser bundle and this repository is
--   public, so row-level security is the real boundary — not the admin UI.
--   "Signed in" is NOT enough to write: a writer must appear in `admins`,
--   because Supabase email signup lets anyone create an account.
-- ===========================================================================

-- ---------------------------------------------------------------- categories
create table if not exists categories (
  id          text primary key,               -- 'coffee', 'oilseeds', ...
  title       text        not null,
  blurb       text        not null default '',
  icon        text        not null default '📦',
  sort_order  int         not null default 0,
  deleted     boolean     not null default false,
  updated_at  timestamptz not null default now()
);

-- ------------------------------------------------------------------ products
create table if not exists products (
  slug        text primary key,               -- 'yirgacheffe-coffee'
  category_id text        references categories(id) on delete set null,
  name        text        not null,
  tagline     text        not null default '',
  overview    text        not null default '',
  image       text,                           -- Storage public URL
  gallery     text[]      not null default '{}',
  regions     text[]      not null default '{}',
  specs       jsonb       not null default '[]'::jsonb,   -- [{label,value}]
  packaging   text[]      not null default '{}',
  uses        text[]      not null default '{}',
  sort_order  int         not null default 0,
  deleted     boolean     not null default false,
  updated_at  timestamptz not null default now()
);
create index if not exists products_category_idx on products (category_id);

-- ------------------------------------------------------------------ partners
create table if not exists partners (
  slug             text primary key,
  name             text        not null,
  category         text        not null default '',
  url              text        not null default '',
  tagline          text        not null default '',
  long_description text        not null default '',
  image            text,
  gallery          jsonb       not null default '[]'::jsonb,  -- [{name,image}]
  highlights       text[]      not null default '{}',
  serves           text[]      not null default '{}',
  offerings        jsonb       not null default '[]'::jsonb,
  sort_order       int         not null default 0,
  deleted          boolean     not null default false,
  updated_at       timestamptz not null default now()
);

-- -------------------------------------------------------------- site_content
-- Brand block and the homepage sections, keyed as the studio addresses them:
-- 'brand', 'home.hero', 'home.about', 'home.products', 'home.contact', ...
create table if not exists site_content (
  key        text primary key,
  value      jsonb       not null,
  updated_at timestamptz not null default now()
);

-- ------------------------------------------------------------------ messages
create table if not exists messages (
  id         uuid primary key default gen_random_uuid(),
  kind       text        not null check (kind in ('contact', 'rfq')),
  created_at timestamptz not null default now(),
  read       boolean     not null default false,
  subject    text,
  name       text,
  email      text,
  company    text,
  country    text,
  fields     jsonb       not null default '[]'::jsonb        -- [{label,value}]
);
create index if not exists messages_created_idx on messages (created_at desc);

-- ======================================================== admin allowlist ===
-- Being authenticated only proves someone signed up. Membership here is what
-- grants write access, so a stranger creating an account gains nothing.
create table if not exists admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  email      text,
  created_at timestamptz not null default now()
);

-- SECURITY DEFINER so the check itself is not blocked by RLS on `admins`.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- =============================================================== row security
alter table categories   enable row level security;
alter table products     enable row level security;
alter table partners     enable row level security;
alter table site_content enable row level security;
alter table messages     enable row level security;
alter table admins       enable row level security;

drop policy if exists "public reads live categories"      on categories;
drop policy if exists "public reads live products"        on products;
drop policy if exists "public reads live partners"        on partners;
drop policy if exists "public reads site content"         on site_content;
drop policy if exists "authenticated manages categories"  on categories;
drop policy if exists "authenticated manages products"    on products;
drop policy if exists "authenticated manages partners"    on partners;
drop policy if exists "authenticated manages site content" on site_content;
drop policy if exists "anyone submits an inquiry"         on messages;
drop policy if exists "only the studio reads inquiries"   on messages;
drop policy if exists "only the studio updates inquiries" on messages;
drop policy if exists "only the studio deletes inquiries" on messages;

-- Public site: anyone may read live rows.
create policy "public reads live categories" on categories
  for select using (not deleted);
create policy "public reads live products" on products
  for select using (not deleted);
create policy "public reads live partners" on partners
  for select using (not deleted);
create policy "public reads site content" on site_content
  for select using (true);

-- Studio: only allowlisted admins may write.
create policy "admins manage categories" on categories
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins manage products" on products
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins manage partners" on partners
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins manage site content" on site_content
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Messages are asymmetric on purpose: a buyer submits but can never read
-- anyone's inquiries — including their own.
create policy "anyone submits an inquiry" on messages
  for insert to anon, authenticated with check (true);
create policy "admins read inquiries" on messages
  for select to authenticated using (public.is_admin());
create policy "admins update inquiries" on messages
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete inquiries" on messages
  for delete to authenticated using (public.is_admin());

-- An admin may confirm their own membership (drives the studio's gate).
create policy "admins read own row" on admins
  for select to authenticated using (user_id = auth.uid());

-- =================================================================== storage
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "public reads media"        on storage.objects;
drop policy if exists "authenticated writes media" on storage.objects;
drop policy if exists "authenticated updates media" on storage.objects;
drop policy if exists "authenticated deletes media" on storage.objects;

create policy "public reads media" on storage.objects
  for select using (bucket_id = 'media');
create policy "admins write media" on storage.objects
  for insert to authenticated with check (bucket_id = 'media' and public.is_admin());
create policy "admins update media" on storage.objects
  for update to authenticated using (bucket_id = 'media' and public.is_admin());
create policy "admins delete media" on storage.objects
  for delete to authenticated using (bucket_id = 'media' and public.is_admin());

-- ===========================================================================
-- AFTER RUNNING THIS
--
-- 1. Create your admin user:
--      Dashboard -> Authentication -> Users -> Add user
--      Enter your email, set a password, tick "Auto Confirm User".
--
-- 2. Grant it admin rights (replace the address with the one you just used):
--
--      insert into public.admins (user_id, email)
--      select id, email from auth.users where email = 'you@example.com'
--      on conflict (user_id) do nothing;
--
-- 3. Turn OFF public signup, so nobody else can create an account:
--      Dashboard -> Authentication -> Sign In / Providers -> Email
--      -> disable "Allow new users to sign up".
--
-- 4. Confirm it worked — this must return true while signed in as you:
--      select public.is_admin();
-- ===========================================================================
