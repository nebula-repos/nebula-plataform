-- Enable Row Level Security on all tables
alter table public.users enable row level security;
alter table public.research_lines enable row level security;
alter table public.releases enable row level security;
alter table public.release_sections enable row level security;
alter table public.audit_logs enable row level security;
alter table public.events enable row level security;

-- Users table policies
create policy "Users can view their own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.users for update
  using (auth.uid() = id);

create policy "Admins can view all users"
  on public.users for select
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can update all users"
  on public.users for update
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

-- Research lines policies (public read, admin write)
create policy "Anyone can view active research lines"
  on public.research_lines for select
  using (is_active = true or auth.uid() is not null);

create policy "Admins can insert research lines"
  on public.research_lines for insert
  with check (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can update research lines"
  on public.research_lines for update
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can delete research lines"
  on public.research_lines for delete
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

-- Releases policies (public read for published, admin write)
create policy "Anyone can view published releases"
  on public.releases for select
  using (is_published = true or auth.uid() is not null);

create policy "Admins can insert releases"
  on public.releases for insert
  with check (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can update releases"
  on public.releases for update
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can delete releases"
  on public.releases for delete
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

-- Release sections policies (public read for published, admin write)
create policy "Anyone can view sections of published releases"
  on public.release_sections for select
  using (
    exists (
      select 1 from public.releases
      where id = release_sections.release_id and is_published = true
    ) or auth.uid() is not null
  );

create policy "Admins can insert release sections"
  on public.release_sections for insert
  with check (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can update release sections"
  on public.release_sections for update
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can delete release sections"
  on public.release_sections for delete
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

-- Audit logs policies (admin only)
create policy "Admins can view audit logs"
  on public.audit_logs for select
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can insert audit logs"
  on public.audit_logs for insert
  with check (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

-- Events policies (users can view their own, admins can view all)
create policy "Users can view their own events"
  on public.events for select
  using (user_id = auth.uid());

create policy "Admins can view all events"
  on public.events for select
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Anyone can insert events"
  on public.events for insert
  with check (true);
