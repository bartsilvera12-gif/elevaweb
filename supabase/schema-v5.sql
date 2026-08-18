-- ELEVA schema v5 — curación de destacados, aprobación de vendedores, storage
-- Correr entero en Supabase → SQL Editor. Idempotente.

-- ============================================
-- 1) Destacados: ELEVA marca qué productos aparecen en el home
-- ============================================
alter table eleva.products add column if not exists is_featured boolean default false;
create index if not exists products_featured_idx on eleva.products(is_featured) where is_featured = true;

-- ============================================
-- 2) Aprobación de vendedores: hasta que ELEVA no aprueba, sus productos no salen
-- ============================================
alter table eleva.profiles add column if not exists is_approved boolean default false;

-- Los vendedores ya cargados se dan por aprobados (compatibilidad).
update eleva.profiles set is_approved = true where is_seller = true and is_approved is null;
update eleva.profiles set is_approved = true where is_admin = true;

-- Que el vendedor NO pueda dejar activo un producto si no está aprobado:
-- lo forzamos a inactivo en el insert/update mientras is_approved = false.
create or replace function eleva.gate_product_active()
returns trigger language plpgsql security definer set search_path = eleva, public as $$
begin
  if new.seller_id is not null and new.active = true then
    if not exists (select 1 from eleva.profiles p where p.id = new.seller_id and p.is_approved = true) then
      new.active := false;
    end if;
  end if;
  return new;
end; $$;

drop trigger if exists gate_product_active on eleva.products;
create trigger gate_product_active
  before insert or update on eleva.products
  for each row execute function eleva.gate_product_active();

-- ============================================
-- 3) Storage: bucket "products" público para las fotos
--    (esto lo tiene que crear el bucket una sola vez; después las policies)
-- ============================================
insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do update set public = true;

-- Cualquiera lee las fotos (el bucket es público de todos modos)
drop policy if exists "products_read" on storage.objects;
create policy "products_read" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'products');

-- Solo el dueño de la carpeta (== su user_id) puede subir/editar/borrar
drop policy if exists "products_write" on storage.objects;
create policy "products_write" on storage.objects
  for all to authenticated
  using (bucket_id = 'products' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'products' and (storage.foldername(name))[1] = auth.uid()::text);

notify pgrst, 'reload schema';
