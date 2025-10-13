-- Create subscriptions table to link users with the research lines they follow
create table if not exists public.research_line_subscriptions (
  id uuid primary key default extensions.gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  research_line_id uuid not null references public.research_lines(id) on delete cascade,
  is_active boolean not null default true,
  subscribed_at timestamptz not null default now(),
  unsubscribed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, research_line_id)
);

create index if not exists idx_research_line_subscriptions_user
  on public.research_line_subscriptions(user_id);

create index if not exists idx_research_line_subscriptions_research_line
  on public.research_line_subscriptions(research_line_id);

create index if not exists idx_research_line_subscriptions_active
  on public.research_line_subscriptions(user_id, research_line_id)
  where is_active = true;

-- Keep updated_at fresh on subscription changes
create trigger set_updated_at_research_line_subscriptions
  before update on public.research_line_subscriptions
  for each row
  execute function public.handle_updated_at();

-- Secure the subscriptions data with RLS
alter table public.research_line_subscriptions enable row level security;

create policy "Users can view their research line subscriptions"
  on public.research_line_subscriptions for select
  using (auth.uid() = user_id);

create policy "Users can insert their research line subscriptions"
  on public.research_line_subscriptions for insert
  with check (auth.uid() = user_id);

create policy "Users can update their research line subscriptions"
  on public.research_line_subscriptions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their research line subscriptions"
  on public.research_line_subscriptions for delete
  using (auth.uid() = user_id);

create policy "Admins can manage all research line subscriptions"
  on public.research_line_subscriptions
  using (public.is_admin())
  with check (public.is_admin());

-- Tighten release access so only subscribed users (or admins) can see content
drop policy if exists "Anyone can view published releases" on public.releases;

create policy "Users can view releases they subscribe to"
  on public.releases for select
  using (
    is_published = true
    and exists (
      select 1
      from public.research_line_subscriptions s
      where s.research_line_id = public.releases.research_line_id
        and s.user_id = auth.uid()
        and s.is_active = true
    )
  );

create policy "Admins can view all releases"
  on public.releases for select
  using (public.is_admin());

drop policy if exists "Anyone can view sections of published releases" on public.release_sections;

create policy "Users can view sections of subscribed releases"
  on public.release_sections for select
  using (
    exists (
      select 1
      from public.releases r
      join public.research_line_subscriptions s
        on s.research_line_id = r.research_line_id
      where r.id = release_sections.release_id
        and r.is_published = true
        and s.user_id = auth.uid()
        and s.is_active = true
    )
  );

create policy "Admins can view all release sections"
  on public.release_sections for select
  using (public.is_admin());
