-- Public bucket for admin product image uploads
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Public read product images'
  ) then
    create policy "Public read product images"
      on storage.objects for select
      using (bucket_id = 'product-images');
  end if;
end $$;
