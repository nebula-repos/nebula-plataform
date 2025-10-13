-- Store metadata for release PDF attachments managed via Supabase Storage
create table if not exists public.release_documents (
  id uuid primary key default extensions.gen_random_uuid(),
  release_id uuid not null references public.releases(id) on delete cascade,
  bucket_id text not null,
  object_path text not null,
  display_name text not null,
  file_size bigint,
  content_type text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(release_id, object_path)
);

create index if not exists idx_release_documents_release
  on public.release_documents(release_id);

create index if not exists idx_release_documents_bucket
  on public.release_documents(bucket_id);

create trigger set_updated_at_release_documents
  before update on public.release_documents
  for each row
  execute function public.handle_updated_at();

alter table public.release_documents enable row level security;

create policy "Admins can manage release documents"
  on public.release_documents
  using (public.is_admin())
  with check (public.is_admin());

create policy "Users can view documents of subscribed releases"
  on public.release_documents for select
  using (
    public.is_admin()
    or exists (
      select 1
      from public.releases r
      join public.research_line_subscriptions s
        on s.research_line_id = r.research_line_id
      where r.id = release_documents.release_id
        and r.is_published = true
        and s.user_id = auth.uid()
        and s.is_active = true
    )
  );
