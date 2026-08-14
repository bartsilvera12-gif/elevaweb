-- v3: arreglar "infinite recursion detected in policy for relation profiles" (42P17)
--
-- Causa: en schema-v2.sql, la policy "profiles_admin_read_all" está SOBRE eleva.profiles
-- y adentro hace "select from eleva.profiles" -> para evaluar esa policy Postgres tiene
-- que volver a evaluar la misma policy -> recursión. Como products_admin_all / orders_*
-- también consultan profiles, cualquier query (incluso anónima al catálogo) tira 500.
--
-- Fix: una función SECURITY DEFINER que lee profiles salteando RLS, y usarla en todas
-- las policies en vez del "exists (select 1 from eleva.profiles ...)".
--
-- Correr entero en Supabase -> SQL Editor.

-- ============================================
-- 1) Helper: es admin? (SECURITY DEFINER = no dispara RLS -> no recursa)
-- ============================================
create or replace function eleva.is_admin()
returns boolean
language sql
stable
security definer
set search_path = eleva, public
as $$
  select coalesce((select p.is_admin from eleva.profiles p where p.id = auth.uid()), false);
$$;

revoke all on function eleva.is_admin() from public;
grant execute on function eleva.is_admin() to authenticated;

-- ============================================
-- 2) PROFILES: la policy recursiva se reemplaza por la función
-- ============================================
drop policy if exists "profiles_admin_read_all" on eleva.profiles;
create policy "profiles_admin_read_all" on eleva.profiles
  for select to authenticated
  using (eleva.is_admin());

-- ============================================
-- 3) Resto de policies admin: misma función + "to authenticated"
--    (sin el "to authenticated", el rol anon también evalúa estas policies
--     y paga el costo/el error de consultar profiles)
-- ============================================
drop policy if exists "products_admin_all" on eleva.products;
create policy "products_admin_all" on eleva.products
  for all to authenticated
  using (eleva.is_admin()) with check (eleva.is_admin());

drop policy if exists "orders_admin_read_all" on eleva.orders;
create policy "orders_admin_read_all" on eleva.orders
  for select to authenticated
  using (eleva.is_admin());

drop policy if exists "order_items_admin_read_all" on eleva.order_items;
create policy "order_items_admin_read_all" on eleva.order_items
  for select to authenticated
  using (eleva.is_admin());

drop policy if exists "reclamos_own_read" on eleva.reclamos;
create policy "reclamos_own_read" on eleva.reclamos
  for select to authenticated
  using (auth.uid() = buyer_id or auth.uid() = seller_id or eleva.is_admin());

drop policy if exists "reclamos_admin_update" on eleva.reclamos;
create policy "reclamos_admin_update" on eleva.reclamos
  for update to authenticated
  using (eleva.is_admin());

-- ============================================
-- 4) Check: esto tiene que devolver filas sin error
-- ============================================
-- select slug, name, image_url from eleva.products where active = true limit 5;
