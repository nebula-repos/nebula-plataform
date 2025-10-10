-- Define a reusable admin check that bypasses RLS
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    exists (
      select 1
      from public.users
      where id = auth.uid() and role = 'admin'
    ),
    false
  );
$$;

-- Update admin policies to reference the helper
alter policy "Admins can view all users"
  on public.users using (public.is_admin());

alter policy "Admins can update all users"
  on public.users using (public.is_admin());

alter policy "Admins can insert research lines"
  on public.research_lines with check (public.is_admin());

alter policy "Admins can update research lines"
  on public.research_lines using (public.is_admin());

alter policy "Admins can delete research lines"
  on public.research_lines using (public.is_admin());

alter policy "Admins can insert releases"
  on public.releases with check (public.is_admin());

alter policy "Admins can update releases"
  on public.releases using (public.is_admin());

alter policy "Admins can delete releases"
  on public.releases using (public.is_admin());

alter policy "Admins can insert release sections"
  on public.release_sections with check (public.is_admin());

alter policy "Admins can update release sections"
  on public.release_sections using (public.is_admin());

alter policy "Admins can delete release sections"
  on public.release_sections using (public.is_admin());

alter policy "Admins can view audit logs"
  on public.audit_logs using (public.is_admin());

alter policy "Admins can insert audit logs"
  on public.audit_logs with check (public.is_admin());

alter policy "Admins can view all events"
  on public.events using (public.is_admin());
