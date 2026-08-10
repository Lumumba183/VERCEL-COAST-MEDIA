-- ============================================================
-- The Coast Media Group — Supabase schema
-- Run this entire file in Supabase → SQL Editor → New Query
-- ============================================================

create extension if not exists "uuid-ossp";

-- ---------- ARTICLES ----------
create table if not exists articles (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  excerpt text default '',
  content text default '',
  category text not null default 'National News',
  image_url text,
  author text default 'Coast Editorial',
  featured boolean default false,
  published boolean default true,
  views integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ---------- PROGRAMME SCHEDULE ----------
create table if not exists schedule (
  id uuid primary key default uuid_generate_v4(),
  day text not null,
  start_time text not null,
  end_time text not null,
  show_name text not null,
  host text default '',
  description text default '',
  created_at timestamptz default now()
);

-- ---------- PUBLIC REPORTS (story submissions) ----------
create table if not exists reports (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  phone text,
  subject text not null,
  location text,
  message text not null,
  status text not null default 'new' check (status in ('new','reviewed','resolved')),
  created_at timestamptz default now()
);

-- ---------- SITE SETTINGS (key/value) ----------
create table if not exists settings (
  key text primary key,
  value text default '',
  updated_at timestamptz default now()
);

-- ---------- APP USERS (roles & permissions; ids come from Clerk) ----------
create table if not exists app_users (
  id text primary key,               -- Clerk user id (user_...)
  email text unique not null,
  full_name text default '',
  role text not null default 'user' check (role in ('admin','editor','user')),
  allowed_areas text[] default '{}',
  created_at timestamptz default now()
);

-- ---------- BRIEF SLIDER (homepage ticker) ----------
create table if not exists brief_items (
  id uuid primary key default uuid_generate_v4(),
  text text not null,
  article_id uuid references articles(id) on delete set null,
  position integer default 0,
  active boolean default true,
  created_at timestamptz default now()
);

-- ---------- updated_at trigger ----------
create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists articles_updated_at on articles;
create trigger articles_updated_at before update on articles
  for each row execute function set_updated_at();

drop trigger if exists settings_updated_at on settings;
create trigger settings_updated_at before update on settings
  for each row execute function set_updated_at();

-- ---------- ROW LEVEL SECURITY ----------
alter table articles enable row level security;
alter table schedule enable row level security;
alter table reports enable row level security;
alter table settings enable row level security;
alter table app_users enable row level security;
alter table brief_items enable row level security;

-- Public reads for published content
create policy "public read articles" on articles
  for select using (published = true);

create policy "public read schedule" on schedule
  for select using (true);

create policy "public read brief items" on brief_items
  for select using (active = true);

create policy "public read settings" on settings
  for select using (true);

-- Anyone can submit a report (public form)
create policy "public insert reports" on reports
  for insert with check (true);

-- Everything else (admin writes, reports reads, user management)
-- is performed server-side via the service role key, which bypasses RLS.

-- ---------- DEFAULT SETTINGS ----------
insert into settings (key, value) values
  ('stream_url', ''),
  ('tv_provider', 'youtube'),        -- 'youtube' or 'twitch'
  ('youtube_channel_id', ''),
  ('twitch_channel', ''),
  ('site_tagline', 'Kenya''s Leading Coastal News, Radio & TV Platform')
on conflict (key) do nothing;

-- ---------- FIRST ADMIN ----------
-- The first admin is created automatically on first sign-in when their email
-- matches the ADMIN_EMAIL environment variable (smartsolutions870@gmail.com).
-- This row pre-provisions the same admin — the Clerk user id binds
-- automatically on first login:
insert into app_users (id, email, full_name, role, allowed_areas)
values ('pending:smartsolutions870@gmail.com', 'smartsolutions870@gmail.com', 'Site Administrator', 'admin', ARRAY['all'])
on conflict (email) do update set role = 'admin', allowed_areas = ARRAY['all'];

-- ---------- STORAGE: media bucket for article image uploads ----------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Anyone can read uploaded media (public bucket)
drop policy if exists "public read media" on storage.objects;
create policy "public read media" on storage.objects
  for select using (bucket_id = 'media');

-- Allow uploads from the site (article images via the admin panel)
drop policy if exists "public upload media" on storage.objects;
create policy "public upload media" on storage.objects
  for insert with check (bucket_id = 'media');

-- Allow replacing/removing own uploads
drop policy if exists "public update media" on storage.objects;
create policy "public update media" on storage.objects
  for update using (bucket_id = 'media');

drop policy if exists "public delete media" on storage.objects;
create policy "public delete media" on storage.objects
  for delete using (bucket_id = 'media');
