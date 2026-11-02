-- Run this entire file in Supabase > SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title_en text not null,
  title_ar text not null,
  description_en text not null,
  description_ar text not null,
  category text not null default 'Website',
  image_url text,
  demo_url text,
  github_url text,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;
alter table public.projects enable row level security;

drop policy if exists "Public can view published projects" on public.projects;
create policy "Public can view published projects"
on public.projects for select
using (published = true or exists (
  select 1 from public.admins where user_id = auth.uid()
));

drop policy if exists "Admins can insert projects" on public.projects;
create policy "Admins can insert projects"
on public.projects for insert to authenticated
with check (exists (select 1 from public.admins where user_id = auth.uid()));

drop policy if exists "Admins can update projects" on public.projects;
create policy "Admins can update projects"
on public.projects for update to authenticated
using (exists (select 1 from public.admins where user_id = auth.uid()))
with check (exists (select 1 from public.admins where user_id = auth.uid()));

drop policy if exists "Admins can delete projects" on public.projects;
create policy "Admins can delete projects"
on public.projects for delete to authenticated
using (exists (select 1 from public.admins where user_id = auth.uid()));

-- After creating your account in Supabase Authentication, add its UUID:
-- insert into public.admins (user_id) values ('YOUR-AUTH-USER-UUID');
