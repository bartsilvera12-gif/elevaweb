-- ELEVA schema v2 — Migración aditiva (correr después del schema.sql)
-- Agrega: stock_minimo, unit, ubicacion; profiles.is_admin; tabla reclamos; helper views.

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

drop policy if exists "reclamos_own_read" on eleva.reclamos;
create policy "reclamos_own_read" on eleva.reclamos for select using (
  auth.uid() = buyer_id or auth.uid() = seller_id or exists (
    select 1 from eleva.profiles p where p.id = auth.uid() and p.is_admin = true
  )
);

drop policy if exists "reclamos_buyer_insert" on eleva.reclamos;
create policy "reclamos_buyer_insert" on eleva.reclamos for insert with check (auth.uid() = buyer_id);

drop policy if exists "reclamos_admin_update" on eleva.reclamos;
create policy "reclamos_admin_update" on eleva.reclamos for update using (
  exists (select 1 from eleva.profiles p where p.id = auth.uid() and p.is_admin = true)
);

grant select, insert on eleva.reclamos to authenticated;
grant update on eleva.reclamos to authenticated;
grant usage, select on sequence eleva.reclamos_id_seq to authenticated;

-- ============================================
-- ORDER ITEMS: agregar seller_id denormalizado para performance de queries
-- (así el seller puede ver sus ventas sin joinear siempre por products.seller_id)
-- ============================================
alter table eleva.order_items
  add column if not exists seller_id uuid references eleva.profiles(id) on delete set null,
  add column if not exists product_image text;

create index if not exists order_items_seller_idx on eleva.order_items(seller_id);

-- Que el vendedor pueda ver los items de sus ventas
drop policy if exists "order_items_seller_read" on eleva.order_items;
create policy "order_items_seller_read" on eleva.order_items for select using (
  auth.uid() = seller_id
);

-- ============================================
-- ORDERS: permitir al vendedor ver órdenes que contienen sus productos
-- ============================================
drop policy if exists "orders_seller_read" on eleva.orders;
create policy "orders_seller_read" on eleva.orders for select using (
  exists (
    select 1 from eleva.order_items oi
    where oi.order_id = orders.id and oi.seller_id = auth.uid()
  )
);

-- ============================================
-- ADMIN: policies para is_admin
-- ============================================
drop policy if exists "profiles_admin_read_all" on eleva.profiles;
create policy "profiles_admin_read_all" on eleva.profiles for select using (
  exists (select 1 from eleva.profiles p where p.id = auth.uid() and p.is_admin = true)
);

drop policy if exists "products_admin_all" on eleva.products;
create policy "products_admin_all" on eleva.products for all using (
  exists (select 1 from eleva.profiles p where p.id = auth.uid() and p.is_admin = true)
);

drop policy if exists "orders_admin_read_all" on eleva.orders;
create policy "orders_admin_read_all" on eleva.orders for select using (
  exists (select 1 from eleva.profiles p where p.id = auth.uid() and p.is_admin = true)
);

drop policy if exists "order_items_admin_read_all" on eleva.order_items;
create policy "order_items_admin_read_all" on eleva.order_items for select using (
  exists (select 1 from eleva.profiles p where p.id = auth.uid() and p.is_admin = true)
);

-- ============================================
-- FUNCION: crear orden + items en una transacción, autocompletando seller_id + product_image
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

    -- Descontar stock
    update eleva.products set stock = stock - (v_item->>'qty')::integer where slug = (v_item->>'slug');
    -- Contar venta
    update eleva.products set sold = coalesce(sold, 0) + (v_item->>'qty')::integer where slug = (v_item->>'slug');
  end loop;

  return v_order;
end;
$$;

grant execute on function eleva.create_order to authenticated;

-- ============================================
-- VIEW: conteo de productos por categoría (para admin/home)
-- ============================================
create or replace view eleva.category_counts as
  select category, count(*)::integer as count
  from eleva.products
  where active = true
  group by category;

grant select on eleva.category_counts to anon, authenticated;

-- ============================================
-- VIEW: productos con stock bajo (stock <= stock_minimo)
-- ============================================
create or replace view eleva.low_stock as
  select id, slug, name, seller_id, category, stock, stock_minimo, unit, ubicacion, image_url
  from eleva.products
  where active = true
    and stock_minimo > 0
    and stock <= stock_minimo
  order by (stock::float / nullif(stock_minimo, 0)) asc, stock asc;

grant select on eleva.low_stock to authenticated;

-- ============================================
-- SEED: setear stock_minimo default 5 para los productos existentes (opcional)
-- ============================================
update eleva.products set stock_minimo = 5 where stock_minimo = 0 or stock_minimo is null;
update eleva.products set unit = 'unidad' where unit is null;
