-- ============================================================
-- MOHSIN PORTFOLIO — INITIAL SCHEMA
-- Paste this whole file into Supabase SQL Editor and run it.
-- ============================================================

create extension if not exists "uuid-ossp";

-- ============================================================
-- 1. PROFILES (links auth.users -> role)
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'viewer' check (role in ('admin', 'viewer')),
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where user_id = auth.uid() and role = 'admin'
  );
$$;

-- ============================================================
-- 2. PROJECTS
-- ============================================================
create table if not exists public.projects (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  short_description text,
  description text,
  category text not null default 'Web' check (category in ('Web', 'AI', 'Tools', 'Experiments', 'Other')),
  image_url text,
  github_url text,
  live_url text,
  technologies text[] not null default '{}',
  featured boolean not null default false,
  published boolean not null default false,
  display_order integer not null default 0,
  project_date date,
  role text,
  client_type text default 'Personal' check (client_type in ('Personal', 'Client')),
  key_features text,
  challenges text,
  solution text,
  results text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_projects_published on public.projects (published);
create index if not exists idx_projects_slug on public.projects (slug);
create index if not exists idx_projects_order on public.projects (display_order);
create index if not exists idx_projects_featured on public.projects (featured);

-- ============================================================
-- 3. SKILLS
-- ============================================================
create table if not exists public.skills (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  category text not null default 'General',
  icon text,
  description text,
  display_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- 4. SERVICES
-- ============================================================
create table if not exists public.services (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  icon text,
  display_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- 5. EXPERIENCE
-- ============================================================
create table if not exists public.experience (
  id uuid primary key default uuid_generate_v4(),
  year text not null,
  title text not null,
  description text,
  company text,
  technologies text[] not null default '{}',
  display_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- 6. MESSAGES (contact form submissions)
-- ============================================================
create table if not exists public.messages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  project_type text,
  message text not null,
  status text not null default 'NEW' check (status in ('NEW', 'READ', 'ARCHIVED')),
  created_at timestamptz not null default now()
);

create index if not exists idx_messages_status on public.messages (status);

-- ============================================================
-- 7. SITE SETTINGS (single row)
-- ============================================================
create table if not exists public.site_settings (
  id integer primary key default 1,
  name text default 'Mohsin',
  role text default 'AI / Full-Stack Developer',
  bio text,
  email text,
  github_url text,
  linkedin_url text,
  youtube_url text,
  instagram_url text,
  location text,
  availability_status text default 'Available for opportunities',
  hero_heading text default 'I build digital experiences, intelligent systems, and products that matter.',
  hero_description text,
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);

insert into public.site_settings (id) values (1) on conflict (id) do nothing;

-- ============================================================
-- UPDATED_AT TRIGGER HELPER
-- ============================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_projects_updated on public.projects;
create trigger trg_projects_updated before update on public.projects
  for each row execute function public.set_updated_at();

drop trigger if exists trg_skills_updated on public.skills;
create trigger trg_skills_updated before update on public.skills
  for each row execute function public.set_updated_at();

drop trigger if exists trg_services_updated on public.services;
create trigger trg_services_updated before update on public.services
  for each row execute function public.set_updated_at();

drop trigger if exists trg_experience_updated on public.experience;
create trigger trg_experience_updated before update on public.experience
  for each row execute function public.set_updated_at();

drop trigger if exists trg_settings_updated on public.site_settings;
create trigger trg_settings_updated before update on public.site_settings
  for each row execute function public.set_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.skills enable row level security;
alter table public.services enable row level security;
alter table public.experience enable row level security;
alter table public.messages enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "profiles_admin_all" on public.profiles;
create policy "profiles_admin_all" on public.profiles
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "projects_public_read" on public.projects;
create policy "projects_public_read" on public.projects
  for select using (published = true or public.is_admin());

drop policy if exists "projects_admin_write" on public.projects;
create policy "projects_admin_write" on public.projects
  for insert with check (public.is_admin());

drop policy if exists "projects_admin_update" on public.projects;
create policy "projects_admin_update" on public.projects
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "projects_admin_delete" on public.projects;
create policy "projects_admin_delete" on public.projects
  for delete using (public.is_admin());

drop policy if exists "skills_public_read" on public.skills;
create policy "skills_public_read" on public.skills
  for select using (published = true or public.is_admin());
drop policy if exists "skills_admin_write" on public.skills;
create policy "skills_admin_write" on public.skills for insert with check (public.is_admin());
drop policy if exists "skills_admin_update" on public.skills;
create policy "skills_admin_update" on public.skills for update using (public.is_admin()) with check (public.is_admin());
drop policy if exists "skills_admin_delete" on public.skills;
create policy "skills_admin_delete" on public.skills for delete using (public.is_admin());

drop policy if exists "services_public_read" on public.services;
create policy "services_public_read" on public.services
  for select using (published = true or public.is_admin());
drop policy if exists "services_admin_write" on public.services;
create policy "services_admin_write" on public.services for insert with check (public.is_admin());
drop policy if exists "services_admin_update" on public.services;
create policy "services_admin_update" on public.services for update using (public.is_admin()) with check (public.is_admin());
drop policy if exists "services_admin_delete" on public.services;
create policy "services_admin_delete" on public.services for delete using (public.is_admin());

drop policy if exists "experience_public_read" on public.experience;
create policy "experience_public_read" on public.experience
  for select using (published = true or public.is_admin());
drop policy if exists "experience_admin_write" on public.experience;
create policy "experience_admin_write" on public.experience for insert with check (public.is_admin());
drop policy if exists "experience_admin_update" on public.experience;
create policy "experience_admin_update" on public.experience for update using (public.is_admin()) with check (public.is_admin());
drop policy if exists "experience_admin_delete" on public.experience;
create policy "experience_admin_delete" on public.experience for delete using (public.is_admin());

drop policy if exists "messages_public_insert" on public.messages;
create policy "messages_public_insert" on public.messages
  for insert with check (true);

drop policy if exists "messages_admin_select" on public.messages;
create policy "messages_admin_select" on public.messages
  for select using (public.is_admin());

drop policy if exists "messages_admin_update" on public.messages;
create policy "messages_admin_update" on public.messages
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "messages_admin_delete" on public.messages;
create policy "messages_admin_delete" on public.messages
  for delete using (public.is_admin());

drop policy if exists "settings_public_read" on public.site_settings;
create policy "settings_public_read" on public.site_settings
  for select using (true);

drop policy if exists "settings_admin_update" on public.site_settings;
create policy "settings_admin_update" on public.site_settings
  for update using (public.is_admin()) with check (public.is_admin());

-- ============================================================
-- STORAGE: bucket + policies
-- ============================================================
insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do nothing;

drop policy if exists "project_images_public_read" on storage.objects;
create policy "project_images_public_read" on storage.objects
  for select using (bucket_id = 'project-images');

drop policy if exists "project_images_admin_insert" on storage.objects;
create policy "project_images_admin_insert" on storage.objects
  for insert with check (bucket_id = 'project-images' and public.is_admin());

drop policy if exists "project_images_admin_update" on storage.objects;
create policy "project_images_admin_update" on storage.objects
  for update using (bucket_id = 'project-images' and public.is_admin())
  with check (bucket_id = 'project-images' and public.is_admin());

drop policy if exists "project_images_admin_delete" on storage.objects;
create policy "project_images_admin_delete" on storage.objects
  for delete using (bucket_id = 'project-images' and public.is_admin());

-- ============================================================
-- HOW TO CREATE YOUR ADMIN USER (run AFTER creating the user in
-- Supabase Auth -> Users -> Add User):
--
--   insert into public.profiles (user_id, full_name, role)
--   values ('PASTE-USER-UUID-HERE', 'Mohsin', 'admin');
--
-- See README.md for the full step-by-step walkthrough.
-- ============================================================
