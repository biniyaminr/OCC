-- OCC schema. Run in the Supabase SQL editor (Dashboard -> SQL -> New query).
--
-- Shapes mirror src/data/products.ts and src/lib/site-content.tsx so the
-- existing content maps across without reshaping it.
--
-- SECURITY NOTE: the publishable key ships inside the browser bundle and this
-- repository is public. Row-level security is therefore the only thing
-- separating "anyone may read the catalog" from "anyone may rewrite it".
-- Every table below enables RLS.

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
-- Brand block and the seven homepage sections, keyed exactly as the studio
-- addresses them: 'brand', 'home.hero', 'home.about', 'home.products', ...
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

-- =============================================================== row security
alter table categories   enable row level security;
alter table products     enable row level security;
alter table partners     enable row level security;
alter table site_content enable row level security;
alter table messages     enable row level security;

-- Public site: anyone may read live records. Nobody anonymous may write.
create policy "public reads live categories" on categories
  for select using (not deleted);
create policy "public reads live products" on products
  for select using (not deleted);
create policy "public reads live partners" on partners
  for select using (not deleted);
create policy "public reads site content" on site_content
  for select using (true);

-- Studio: signed-in users manage everything.
create policy "authenticated manages categories" on categories
  for all to authenticated using (true) with check (true);
create policy "authenticated manages products" on products
  for all to authenticated using (true) with check (true);
create policy "authenticated manages partners" on partners
  for all to authenticated using (true) with check (true);
create policy "authenticated manages site content" on site_content
  for all to authenticated using (true) with check (true);

-- Messages are deliberately asymmetric: a buyer may submit an inquiry but
-- must never be able to read anyone else's. This is what makes inquiries
-- actually reach OCC instead of dying in the visitor's own browser.
create policy "anyone submits an inquiry" on messages
  for insert to anon, authenticated with check (true);
create policy "only the studio reads inquiries" on messages
  for select to authenticated using (true);
create policy "only the studio updates inquiries" on messages
  for update to authenticated using (true) with check (true);
create policy "only the studio deletes inquiries" on messages
  for delete to authenticated using (true);

-- ================================================================== storage
-- Product and partner photography. Public read, authenticated write.
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "public reads media" on storage.objects
  for select using (bucket_id = 'media');
create policy "authenticated writes media" on storage.objects
  for insert to authenticated with check (bucket_id = 'media');
create policy "authenticated updates media" on storage.objects
  for update to authenticated using (bucket_id = 'media');
create policy "authenticated deletes media" on storage.objects
  for delete to authenticated using (bucket_id = 'media');
