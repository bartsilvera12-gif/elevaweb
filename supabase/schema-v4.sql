-- ELEVA schema v4 — modelo real de operación
--
-- Cambio de modelo respecto de v1-v3:
--   * Los productos son del emprendedor, pero el stock está físicamente en ELEVA.
--   * El cliente compra por la web y le paga DIRECTO al emprendedor (ELEVA no toca esa plata).
--   * El emprendedor confirma que cobró; recién ahí ELEVA empaqueta y despacha.
--   * El emprendedor le debe a ELEVA: comisión por venta + mensualidad de depósito.
--
-- Como cada emprendedor cobra por su cuenta, un carrito con productos de dos
-- emprendedores se divide en un pedido por emprendedor (cada uno con su pago).
--
-- Correr entero en Supabase -> SQL Editor. Idempotente.

-- ============================================
-- SETTINGS: parámetros globales editables desde /admin/configuracion
-- ============================================
create table if not exists eleva.settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);

insert into eleva.settings (key, value) values
  ('comision_pct', '12'::jsonb),
  ('envio_cents', '25000'::jsonb),
  ('envio_gratis_desde_cents', '500000'::jsonb),
  ('mensualidad_default_cents', '0'::jsonb),
  ('notificar_email', 'true'::jsonb),
  ('notificar_whatsapp', 'true'::jsonb),
  ('mantenimiento', 'false'::jsonb)
on conflict (key) do nothing;

alter table eleva.settings enable row level security;

drop policy if exists "settings_public_read" on eleva.settings;
create policy "settings_public_read" on eleva.settings for select using (true);

drop policy if exists "settings_admin_write" on eleva.settings;
create policy "settings_admin_write" on eleva.settings for all to authenticated
  using (eleva.is_admin()) with check (eleva.is_admin());

grant select on eleva.settings to anon, authenticated;
grant insert, update, delete on eleva.settings to authenticated;

create or replace function eleva.setting_int(p_key text, p_default integer)
returns integer language sql stable security definer set search_path = eleva, public as $$
  select coalesce((select (value #>> '{}')::integer from eleva.settings where key = p_key), p_default);
$$;
grant execute on function eleva.setting_int(text, integer) to anon, authenticated;

-- ============================================
-- PROFILES: datos de cobro del emprendedor + mensualidad pactada
-- ============================================
alter table eleva.profiles
  add column if not exists pago_titular text,
  add column if not exists pago_banco text,
  add column if not exists pago_cuenta text,
  add column if not exists pago_alias text,
  add column if not exists pago_telefono text,
  add column if not exists pago_notas text,
  add column if not exists instagram text,
  add column if not exists tiktok text,
  add column if not exists store_desc text,
  add column if not exists mensualidad_cents integer default 0;

comment on column eleva.profiles.pago_notas is 'Instrucciones libres de pago que ve el cliente al confirmar la compra';
comment on column eleva.profiles.mensualidad_cents is 'Mensualidad pactada por ocupar depósito de ELEVA';

-- El comprador necesita ver los datos de cobro del vendedor de su pedido.
-- Se expone SOLO lo necesario, via view, sin abrir toda la tabla profiles.
create or replace view eleva.sellers_public as
  select id, coalesce(store_name, name) as store_name, city, store_desc,
         pago_titular, pago_banco, pago_cuenta, pago_alias, pago_telefono, pago_notas,
         instagram, tiktok
  from eleva.profiles
  where is_seller = true;

grant select on eleva.sellers_public to anon, authenticated;

-- ============================================
-- ORDERS: un pedido por emprendedor, con estado de pago propio
-- ============================================
alter table eleva.orders
  add column if not exists seller_id uuid references eleva.profiles(id) on delete set null,
  add column if not exists payment_status text default 'pendiente',
  add column if not exists paid_at timestamptz,
  add column if not exists commission_pct numeric,
  add column if not exists commission_cents integer default 0;

comment on column eleva.orders.payment_status is 'pendiente | cobrado — lo confirma el emprendedor cuando le entra la plata';
comment on column eleva.orders.commission_cents is 'Lo que este pedido le genera a ELEVA (snapshot al momento de la venta)';

create index if not exists orders_seller_idx on eleva.orders(seller_id);
create index if not exists orders_payment_status_idx on eleva.orders(payment_status);

-- El emprendedor ve y toca las órdenes que son suyas
drop policy if exists "orders_seller_read" on eleva.orders;
create policy "orders_seller_read" on eleva.orders for select to authenticated
  using (auth.uid() = seller_id);

grant update on eleva.orders to authenticated;

-- ============================================
-- CUENTA CORRIENTE del emprendedor con ELEVA
-- ============================================
create table if not exists eleva.seller_charges (
  id bigserial primary key,
  seller_id uuid not null references eleva.profiles(id) on delete cascade,
  kind text not null check (kind in ('comision', 'mensualidad', 'pago', 'ajuste')),
  amount_cents integer not null,           -- positivo = el emprendedor debe; negativo = pagó
  order_id text references eleva.orders(id) on delete set null,
  period text,                             -- 'YYYY-MM' para las mensualidades
  note text,
  created_at timestamptz default now()
);

create index if not exists seller_charges_seller_idx on eleva.seller_charges(seller_id);
create unique index if not exists seller_charges_comision_unica on eleva.seller_charges(order_id) where kind = 'comision';
create unique index if not exists seller_charges_mensualidad_unica on eleva.seller_charges(seller_id, period) where kind = 'mensualidad';

alter table eleva.seller_charges enable row level security;

drop policy if exists "charges_own_read" on eleva.seller_charges;
create policy "charges_own_read" on eleva.seller_charges for select to authenticated
  using (auth.uid() = seller_id or eleva.is_admin());

drop policy if exists "charges_admin_write" on eleva.seller_charges;
create policy "charges_admin_write" on eleva.seller_charges for all to authenticated
  using (eleva.is_admin()) with check (eleva.is_admin());

grant select, insert, update, delete on eleva.seller_charges to authenticated;
grant usage, select on sequence eleva.seller_charges_id_seq to authenticated;

-- Saldo por emprendedor
create or replace view eleva.seller_accounts as
  select p.id as seller_id,
         coalesce(p.store_name, p.name) as store_name,
         p.mensualidad_cents,
         coalesce(sum(c.amount_cents) filter (where c.kind = 'comision'), 0) as comisiones_cents,
         coalesce(sum(c.amount_cents) filter (where c.kind = 'mensualidad'), 0) as mensualidades_cents,
         coalesce(-sum(c.amount_cents) filter (where c.kind = 'pago'), 0) as pagado_cents,
         coalesce(sum(c.amount_cents), 0) as saldo_cents
  from eleva.profiles p
  left join eleva.seller_charges c on c.seller_id = p.id
  where p.is_seller = true
    and (p.id = auth.uid() or eleva.is_admin())   -- la view corre con permisos del owner: filtramos a mano
  group by p.id, p.store_name, p.name, p.mensualidad_cents;

grant select on eleva.seller_accounts to authenticated;

-- ============================================
-- MENSAJES entre ELEVA (admin) y el emprendedor
-- ============================================
create table if not exists eleva.mensajes (
  id bigserial primary key,
  seller_id uuid not null references eleva.profiles(id) on delete cascade,
  from_admin boolean not null default false,
  body text not null,
  read_at timestamptz,
  created_at timestamptz default now()
);

create index if not exists mensajes_seller_idx on eleva.mensajes(seller_id, created_at);

alter table eleva.mensajes enable row level security;

drop policy if exists "mensajes_read" on eleva.mensajes;
create policy "mensajes_read" on eleva.mensajes for select to authenticated
  using (auth.uid() = seller_id or eleva.is_admin());

drop policy if exists "mensajes_insert" on eleva.mensajes;
create policy "mensajes_insert" on eleva.mensajes for insert to authenticated
  with check ((auth.uid() = seller_id and from_admin = false) or (eleva.is_admin() and from_admin = true));

drop policy if exists "mensajes_update" on eleva.mensajes;
create policy "mensajes_update" on eleva.mensajes for update to authenticated
  using (auth.uid() = seller_id or eleva.is_admin());

grant select, insert, update on eleva.mensajes to authenticated;
grant usage, select on sequence eleva.mensajes_id_seq to authenticated;

-- ============================================
-- CUPONES en base (antes estaban hardcodeados en el front)
-- ============================================
create table if not exists eleva.cupones (
  code text primary key,
  label text not null,
  kind text not null check (kind in ('percent', 'shipping', 'flat')),
  value integer not null default 0,
  min_cents integer default 0,
  active boolean default true,
  created_at timestamptz default now()
);

insert into eleva.cupones (code, label, kind, value, min_cents) values
  ('ELEVA10', '10% de descuento', 'percent', 10, 0),
  ('NUEVO5', '5% para clientes nuevos', 'percent', 5, 0),
  ('ENVIOGRATIS', 'Envío gratis', 'shipping', 0, 0),
  ('MENOS20K', '-Gs. 20.000 en compras +100k', 'flat', 20000, 100000)
on conflict (code) do nothing;

alter table eleva.cupones enable row level security;

drop policy if exists "cupones_public_read" on eleva.cupones;
create policy "cupones_public_read" on eleva.cupones for select using (active = true);

drop policy if exists "cupones_admin_write" on eleva.cupones;
create policy "cupones_admin_write" on eleva.cupones for all to authenticated
  using (eleva.is_admin()) with check (eleva.is_admin());

grant select on eleva.cupones to anon, authenticated;
grant insert, update, delete on eleva.cupones to authenticated;

-- ============================================
-- CATEGORIAS en base
-- ============================================
create table if not exists eleva.categorias (
  slug text primary key,
  name text not null,
  image_url text,
  orden integer default 0,
  active boolean default true
);

insert into eleva.categorias (slug, name, image_url, orden) values
  ('moda', 'Moda', '/categorias/moda.jpg', 1),
  ('belleza', 'Belleza', '/categorias/belleza.avif', 2),
  ('electronica', 'Electrónica', '/categorias/electronica.jpg', 3),
  ('hogar', 'Hogar', '/categorias/hogar.jpg', 4),
  ('deportes', 'Deportes', '/categorias/deportes.jpg', 5),
  ('gourmet', 'Gourmet', '/categorias/gourmet.jpg', 6),
  ('mascotas', 'Mascotas', '/categorias/mascotas.jpg', 7),
  ('ninos', 'Niños', '/categorias/ninos.png', 8),
  ('libros', 'Libros', '/categorias/libros.jpg', 9),
  ('audio', 'Audio', '/categorias/audio.jpeg', 10),
  ('wearables', 'Wearables', '/categorias/wearables.jpg', 11)
on conflict (slug) do nothing;

alter table eleva.categorias enable row level security;

drop policy if exists "categorias_public_read" on eleva.categorias;
create policy "categorias_public_read" on eleva.categorias for select using (active = true);

drop policy if exists "categorias_admin_write" on eleva.categorias;
create policy "categorias_admin_write" on eleva.categorias for all to authenticated
  using (eleva.is_admin()) with check (eleva.is_admin());

grant select on eleva.categorias to anon, authenticated;
grant insert, update, delete on eleva.categorias to authenticated;

-- ============================================
-- RECLAMOS: que el emprendedor pueda responder/cerrar los suyos
-- ============================================
alter table eleva.reclamos
  add column if not exists respuesta text;

-- ============================================
-- CREATE ORDER v4: divide el carrito en un pedido por emprendedor
-- ============================================
drop function if exists eleva.create_order(text, integer, integer, integer, integer, text, jsonb, jsonb);

create or replace function eleva.create_order(
  p_prefix text,        -- ej: 'ELV-8F2K1P'; cada pedido queda <prefix>-1, <prefix>-2...
  p_coupon text,
  p_shipping jsonb,
  p_items jsonb         -- [{slug, qty, variant}] — el precio se toma de la DB, no del cliente
) returns setof eleva.orders
language plpgsql
security definer
set search_path = eleva, public
as $$
declare
  v_pct numeric := eleva.setting_int('comision_pct', 12);
  v_envio integer := eleva.setting_int('envio_cents', 25000);
  v_envio_gratis integer := eleva.setting_int('envio_gratis_desde_cents', 500000);
  v_cupon eleva.cupones%rowtype;
  v_subtotal_total integer := 0;
  v_seller record;
  v_order eleva.orders;
  v_n integer := 0;
  v_order_id text;
  v_subtotal integer;
  v_discount integer;
  v_ship integer;
  v_total integer;
begin
  if auth.uid() is null then
    raise exception 'Necesitás iniciar sesión para comprar';
  end if;

  -- Items pedidos, resueltos contra la DB (precio y vendedor reales)
  create temp table _items on commit drop as
  select pr.id as product_id, pr.slug, pr.name, pr.seller_id, pr.image_url,
         (it->>'qty')::integer as qty,
         pr.price_cents,
         nullif(it->>'variant', '') as variant,
         pr.price_cents * (it->>'qty')::integer as line_cents
  from jsonb_array_elements(p_items) it
  join eleva.products pr on pr.slug = (it->>'slug')
  where pr.active = true;

  if not exists (select 1 from _items) then
    raise exception 'No hay productos válidos en el pedido';
  end if;

  select coalesce(sum(line_cents), 0) into v_subtotal_total from _items;

  if p_coupon is not null then
    select * into v_cupon from eleva.cupones where code = upper(p_coupon) and active = true;
    if found and coalesce(v_cupon.min_cents, 0) > v_subtotal_total then
      v_cupon := null;
    end if;
  end if;

  -- Un pedido por emprendedor
  for v_seller in
    select seller_id, sum(line_cents)::integer as subtotal from _items group by seller_id order by seller_id
  loop
    v_n := v_n + 1;
    v_order_id := p_prefix || '-' || v_n;
    v_subtotal := v_seller.subtotal;

    -- El descuento del cupón se prorratea entre los pedidos según su subtotal
    v_discount := 0;
    if v_cupon.code is not null then
      if v_cupon.kind = 'percent' then
        v_discount := round(v_subtotal * v_cupon.value / 100.0);
      elsif v_cupon.kind = 'flat' then
        v_discount := round(v_cupon.value::numeric * v_subtotal / nullif(v_subtotal_total, 0));
      end if;
    end if;

    v_ship := case when v_subtotal >= v_envio_gratis then 0 else v_envio end;
    if v_cupon.code is not null and v_cupon.kind = 'shipping' then
      v_ship := 0;
    end if;

    v_total := greatest(0, v_subtotal - v_discount + v_ship);

    insert into eleva.orders (
      id, user_id, seller_id, subtotal_cents, discount_cents, shipping_cents, total_cents,
      coupon, shipping, status, payment_status, commission_pct, commission_cents
    ) values (
      v_order_id, auth.uid(), v_seller.seller_id, v_subtotal, v_discount, v_ship, v_total,
      v_cupon.code, p_shipping, 'pending', 'pendiente', v_pct,
      round((v_subtotal - v_discount) * v_pct / 100.0)
    )
    returning * into v_order;

    insert into eleva.order_items (
      order_id, product_slug, product_name, qty, unit_price_cents, variant, seller_id, product_image
    )
    select v_order_id, slug, name, qty, price_cents, variant, seller_id, image_url
    from _items where seller_id is not distinct from v_seller.seller_id;

    -- Reservar stock (la mercadería está en el depósito de ELEVA)
    update eleva.products pr
    set stock = greatest(0, pr.stock - i.qty), sold = coalesce(pr.sold, 0) + i.qty
    from _items i
    where pr.slug = i.slug and i.seller_id is not distinct from v_seller.seller_id;

    return next v_order;
  end loop;

  return;
end;
$$;

grant execute on function eleva.create_order(text, text, jsonb, jsonb) to authenticated;

-- ============================================
-- El emprendedor confirma que el cliente le pagó.
-- Ahí se le carga la comisión a su cuenta con ELEVA y ELEVA puede empaquetar.
-- ============================================
create or replace function eleva.confirmar_pago(p_order_id text)
returns eleva.orders
language plpgsql
security definer
set search_path = eleva, public
as $$
declare
  v_order eleva.orders;
begin
  select * into v_order from eleva.orders where id = p_order_id;
  if not found then
    raise exception 'Pedido inexistente';
  end if;
  if v_order.seller_id is distinct from auth.uid() and not eleva.is_admin() then
    raise exception 'Solo el emprendedor dueño del pedido puede confirmar el cobro';
  end if;
  if v_order.payment_status = 'cobrado' then
    return v_order;
  end if;

  update eleva.orders
  set payment_status = 'cobrado', paid_at = now(), status = 'paid'
  where id = p_order_id
  returning * into v_order;

  insert into eleva.seller_charges (seller_id, kind, amount_cents, order_id, note)
  values (v_order.seller_id, 'comision', v_order.commission_cents, v_order.id,
          'Comisión ' || coalesce(v_order.commission_pct, 0) || '% sobre ' || v_order.id)
  on conflict (order_id) where kind = 'comision' do nothing;

  return v_order;
end;
$$;

grant execute on function eleva.confirmar_pago(text) to authenticated;

-- ============================================
-- ELEVA (admin) mueve el pedido: empaquetado -> enviado -> entregado
-- ============================================
create or replace function eleva.set_order_status(p_order_id text, p_status text)
returns eleva.orders
language plpgsql
security definer
set search_path = eleva, public
as $$
declare
  v_order eleva.orders;
begin
  if not eleva.is_admin() then
    raise exception 'Solo ELEVA puede cambiar el estado de despacho';
  end if;
  if p_status not in ('pending', 'paid', 'shipped', 'delivered') then
    raise exception 'Estado inválido: %', p_status;
  end if;

  select * into v_order from eleva.orders where id = p_order_id;
  if v_order.payment_status <> 'cobrado' and p_status in ('shipped', 'delivered') then
    raise exception 'No se puede despachar un pedido que el emprendedor todavía no cobró';
  end if;

  update eleva.orders set status = p_status where id = p_order_id returning * into v_order;
  return v_order;
end;
$$;

grant execute on function eleva.set_order_status(text, text) to authenticated;

-- ============================================
-- Mensualidades del mes + registrar un pago del emprendedor (admin)
-- ============================================
create or replace function eleva.cobrar_mensualidades(p_period text)
returns integer
language plpgsql
security definer
set search_path = eleva, public
as $$
declare
  v_count integer;
begin
  if not eleva.is_admin() then
    raise exception 'Solo ELEVA puede generar las mensualidades';
  end if;

  insert into eleva.seller_charges (seller_id, kind, amount_cents, period, note)
  select p.id, 'mensualidad', p.mensualidad_cents, p_period, 'Depósito ' || p_period
  from eleva.profiles p
  where p.is_seller = true and coalesce(p.mensualidad_cents, 0) > 0
  on conflict (seller_id, period) where kind = 'mensualidad' do nothing;

  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

grant execute on function eleva.cobrar_mensualidades(text) to authenticated;

create or replace function eleva.registrar_pago(p_seller_id uuid, p_amount_cents integer, p_note text)
returns eleva.seller_charges
language plpgsql
security definer
set search_path = eleva, public
as $$
declare
  v_row eleva.seller_charges;
begin
  if not eleva.is_admin() then
    raise exception 'Solo ELEVA puede registrar pagos';
  end if;

  insert into eleva.seller_charges (seller_id, kind, amount_cents, note)
  values (p_seller_id, 'pago', -abs(p_amount_cents), coalesce(p_note, 'Pago recibido'))
  returning * into v_row;

  return v_row;
end;
$$;

grant execute on function eleva.registrar_pago(uuid, integer, text) to authenticated;
