-- ELEVA — schema v2 completo + fix de recursión RLS (42P17)
-- Reemplaza a schema-v2.sql: mismo contenido, pero las policies de admin usan
-- eleva.is_admin() (SECURITY DEFINER) en vez de "exists (select from eleva.profiles ...)",
-- que sobre la propia tabla profiles causaba:
--   42P17: infinite recursion detected in policy for relation "profiles"
-- Correr entero en Supabase -> SQL Editor. Es idempotente.

-- ============================================
-- PRODUCTS: nuevos campos
-- ============================================
alter table eleva.products
  add column if not exists stock_minimo integer default 0,
  add column if not exists unit text default 'unidad',
  add column if not exists ubicacion text;

comment on column eleva.products.stock_minimo is 'Umbral que dispara alerta de stock bajo';
comment on column eleva.products.unit is 'Unidad de medida: unidad, kg, g, litro, ml, par, docena, metro, cm';
comment on column eleva.products.ubicacion is 'Ubicación en depósito: pasillo/estante/zona';

-- ============================================
-- PROFILES: is_admin
-- ============================================
alter table eleva.profiles
  add column if not exists is_admin boolean default false;

comment on column eleva.profiles.is_admin is 'Staff de ELEVA (acceso a /admin)';

-- ============================================
-- HELPER: ¿es admin? SECURITY DEFINER = no dispara RLS, por eso no recursa
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
-- ORDER ITEMS: seller_id denormalizado + imagen
-- ============================================
alter table eleva.order_items
  add column if not exists seller_id uuid references eleva.profiles(id) on delete set null,
  add column if not exists product_image text;

create index if not exists order_items_seller_idx on eleva.order_items(seller_id);

-- ============================================
-- RECLAMOS
-- ============================================
create table if not exists eleva.reclamos (
  id bigserial primary key,
  order_id text references eleva.orders(id) on delete set null,
  buyer_id uuid references eleva.profiles(id) on delete set null,
  seller_id uuid references eleva.profiles(id) on delete set null,
  motivo text not null,
  detalle text,
  status text default 'abierto',
  created_at timestamptz default now(),
  resolved_at timestamptz
);

create index if not exists reclamos_status_idx on eleva.reclamos(status);
create index if not exists reclamos_seller_idx on eleva.reclamos(seller_id);

alter table eleva.reclamos enable row level security;

grant select, insert, update on eleva.reclamos to authenticated;
grant usage, select on sequence eleva.reclamos_id_seq to authenticated;

-- ============================================
-- POLICIES
-- ============================================
drop policy if exists "reclamos_own_read" on eleva.reclamos;
create policy "reclamos_own_read" on eleva.reclamos
  for select to authenticated
  using (auth.uid() = buyer_id or auth.uid() = seller_id or eleva.is_admin());

drop policy if exists "reclamos_buyer_insert" on eleva.reclamos;
create policy "reclamos_buyer_insert" on eleva.reclamos
  for insert to authenticated
  with check (auth.uid() = buyer_id);

drop policy if exists "reclamos_admin_update" on eleva.reclamos;
create policy "reclamos_admin_update" on eleva.reclamos
  for update to authenticated
  using (eleva.is_admin());

drop policy if exists "order_items_seller_read" on eleva.order_items;
create policy "order_items_seller_read" on eleva.order_items
  for select to authenticated
  using (auth.uid() = seller_id);

drop policy if exists "orders_seller_read" on eleva.orders;
create policy "orders_seller_read" on eleva.orders
  for select to authenticated
  using (
    exists (
      select 1 from eleva.order_items oi
      where oi.order_id = orders.id and oi.seller_id = auth.uid()
    )
  );

-- Admin: todas via eleva.is_admin(), y limitadas a authenticated para que el rol
-- anon (catálogo público) ni siquiera las evalúe.
drop policy if exists "profiles_admin_read_all" on eleva.profiles;
create policy "profiles_admin_read_all" on eleva.profiles
  for select to authenticated
  using (eleva.is_admin());

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

-- ============================================
-- FUNCION: crear orden + items en una transacción
-- ============================================
create or replace function eleva.create_order(
  p_id text,
  p_subtotal_cents integer,
  p_discount_cents integer,
  p_shipping_cents integer,
  p_total_cents integer,
  p_coupon text,
  p_shipping jsonb,
  p_items jsonb
) returns eleva.orders
language plpgsql
security invoker
as $$
declare
  v_order eleva.orders;
  v_item jsonb;
begin
  insert into eleva.orders (
    id, user_id, subtotal_cents, discount_cents, shipping_cents, total_cents, coupon, shipping, status
  ) values (
    p_id, auth.uid(), p_subtotal_cents, coalesce(p_discount_cents, 0), coalesce(p_shipping_cents, 0),
    p_total_cents, p_coupon, p_shipping, 'paid'
  )
  returning * into v_order;

  for v_item in select * from jsonb_array_elements(p_items) loop
    insert into eleva.order_items (
      order_id, product_slug, product_name, qty, unit_price_cents, variant, seller_id, product_image
    )
    select
      p_id,
      (v_item->>'slug'),
      (v_item->>'name'),
      (v_item->>'qty')::integer,
      (v_item->>'price_cents')::integer,
      (v_item->>'variant'),
      pr.seller_id,
      pr.image_url
    from eleva.products pr
    where pr.slug = (v_item->>'slug');

    update eleva.products set stock = stock - (v_item->>'qty')::integer where slug = (v_item->>'slug');
    update eleva.products set sold = coalesce(sold, 0) + (v_item->>'qty')::integer where slug = (v_item->>'slug');
  end loop;

  return v_order;
end;
$$;

grant execute on function eleva.create_order to authenticated;

-- ============================================
-- VIEWS
-- ============================================
create or replace view eleva.category_counts as
  select category, count(*)::integer as count
  from eleva.products
  where active = true
  group by category;

grant select on eleva.category_counts to anon, authenticated;

create or replace view eleva.low_stock as
  select id, slug, name, seller_id, category, stock, stock_minimo, unit, ubicacion, image_url
  from eleva.products
  where active = true
    and stock_minimo > 0
    and stock <= stock_minimo
  order by (stock::float / nullif(stock_minimo, 0)) asc, stock asc;

grant select on eleva.low_stock to authenticated;

-- ============================================
-- SEED de defaults
-- ============================================
update eleva.products set stock_minimo = 5 where stock_minimo = 0 or stock_minimo is null;
update eleva.products set unit = 'unidad' where unit is null;
