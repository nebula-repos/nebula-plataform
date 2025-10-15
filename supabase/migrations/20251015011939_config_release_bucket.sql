-- Ensure the storage bucket for release assets exists and is public
insert into storage.buckets (id, name, public)
values ('research-release-assets', 'research-release-assets', true)
on conflict (id) do update
set public = true;

-- Allow anyone to read published release assets
do $$
begin
  create policy "Public can read release assets"
    on storage.objects for select
    using (bucket_id = 'research-release-assets');
exception
  when duplicate_object then null;
end $$;

-- Allow admins to upload new release assets
do $$
begin
  create policy "Admins can upload release assets"
    on storage.objects for insert
    with check (
      bucket_id = 'research-release-assets'
      and public.is_admin()
    );
exception
  when duplicate_object then null;
end $$;

-- Allow admins to update existing release assets
do $$
begin
  create policy "Admins can update release assets"
    on storage.objects for update
    using (
      bucket_id = 'research-release-assets'
      and public.is_admin()
    )
    with check (
      bucket_id = 'research-release-assets'
      and public.is_admin()
    );
exception
  when duplicate_object then null;
end $$;

-- Allow admins to delete release assets
do $$
begin
  create policy "Admins can delete release assets"
    on storage.objects for delete
    using (
      bucket_id = 'research-release-assets'
      and public.is_admin()
    );
exception
  when duplicate_object then null;
end $$;
