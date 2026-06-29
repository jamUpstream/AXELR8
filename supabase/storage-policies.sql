-- ============================================================================
-- Storage RLS policies for AXLER8 buckets.
-- Run once in the Supabase SQL editor (after creating the buckets).
--
-- Public buckets already allow public READ of objects. These policies let the
-- authenticated admin WRITE (upload / overwrite / delete) within our buckets.
-- ============================================================================

-- Authenticated users can upload to our buckets.
create policy "Admin upload to app buckets"
  on storage.objects for insert
  to authenticated
  with check (bucket_id in ('project-assets', 'avatars', 'brand'));

-- Authenticated users can overwrite (upsert) within our buckets.
create policy "Admin update app buckets"
  on storage.objects for update
  to authenticated
  using (bucket_id in ('project-assets', 'avatars', 'brand'))
  with check (bucket_id in ('project-assets', 'avatars', 'brand'));

-- Authenticated users can delete from our buckets.
create policy "Admin delete from app buckets"
  on storage.objects for delete
  to authenticated
  using (bucket_id in ('project-assets', 'avatars', 'brand'));
