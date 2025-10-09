-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table (extends auth.users)
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  role text not null default 'user' check (role in ('user', 'admin')),
  membership_tier text not null default 'free' check (membership_tier in ('free', 'member')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Research lines table
create table if not exists public.research_lines (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  title text not null,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Releases table
create table if not exists public.releases (
  id uuid primary key default uuid_generate_v4(),
  research_line_id uuid not null references public.research_lines(id) on delete cascade,
  slug text not null,
  title text not null,
  published_at timestamptz,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(research_line_id, slug)
);

-- Release sections table (Actualidad, Implementación, Académico)
create table if not exists public.release_sections (
  id uuid primary key default uuid_generate_v4(),
  release_id uuid not null references public.releases(id) on delete cascade,
  section_type text not null check (section_type in ('actualidad', 'implementacion', 'academico')),
  title text not null,
  content_teaser text not null, -- visible to free users
  content_full text not null, -- visible to members only
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(release_id, section_type)
);

-- Audit log table
create table if not exists public.audit_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  details jsonb,
  created_at timestamptz not null default now()
);

-- Event tracking table
create table if not exists public.events (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete set null,
  event_type text not null,
  event_data jsonb,
  created_at timestamptz not null default now()
);

-- Create indexes for better query performance
create index if not exists idx_releases_research_line on public.releases(research_line_id);
create index if not exists idx_releases_published on public.releases(is_published, published_at);
create index if not exists idx_release_sections_release on public.release_sections(release_id);
create index if not exists idx_audit_logs_user on public.audit_logs(user_id, created_at desc);
create index if not exists idx_events_user on public.events(user_id, created_at desc);
create index if not exists idx_events_type on public.events(event_type, created_at desc);
