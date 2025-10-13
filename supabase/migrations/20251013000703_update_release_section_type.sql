-- Align release section type naming from "implementacion" to "industria"
alter table public.release_sections
  drop constraint if exists release_sections_section_type_check;

update public.release_sections
set section_type = 'industria'
where section_type = 'implementacion';

alter table public.release_sections
  add constraint release_sections_section_type_check
  check (section_type in ('actualidad', 'industria', 'academico'));
