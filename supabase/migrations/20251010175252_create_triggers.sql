-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
security definer
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Triggers for updated_at
create trigger set_updated_at_users
  before update on public.users
  for each row
  execute function public.handle_updated_at();

create trigger set_updated_at_research_lines
  before update on public.research_lines
  for each row
  execute function public.handle_updated_at();

create trigger set_updated_at_releases
  before update on public.releases
  for each row
  execute function public.handle_updated_at();

create trigger set_updated_at_release_sections
  before update on public.release_sections
  for each row
  execute function public.handle_updated_at();

-- Function to create user profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, full_name, role, membership_tier)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', null),
    'user',
    'free'
  )
  on conflict (id) do nothing;
  
  return new;
end;
$$;

-- Trigger to auto-create user profile
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
