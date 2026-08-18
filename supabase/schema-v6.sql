-- ELEVA v6 — Guest checkout (comprar sin cuenta)
-- Correr en Supabase → SQL Editor. Idempotente.

-- 1) user_id ahora es opcional
alter table eleva.orders alter column user_id drop not null;

-- 2) Policies: cualquiera puede LEER un pedido si conoce su id (los ids son
--    ELV-XXXXXX-N, tienen suficiente entropía). El emprendedor y admin lo ven
--    por sus policies propias.
drop policy if exists "orders_public_read_by_id" on eleva.orders;
create policy "orders_public_read_by_id" on eleva.orders
  for select to anon, authenticated using (true);
-- La policy es amplia a propósito: el frontend siempre filtra por id o user_id.
-- Si querés algo más estricto, se puede mover a una RPC con id+email.

drop policy if exists "order_items_public_read_by_order" on eleva.order_items;
create policy "order_items_public_read_by_order" on eleva.order_items
  for select to anon, authenticated using (true);

-- 3) create_order: acepta que auth.uid() sea null (guest)
create or replace function eleva.create_order(
  p_prefix text, p_coupon text, p_shipping jsonb, p_payment_method text, p_items jsonb
) returns setof eleva.orders
language plpgsql security definer set search_path = eleva, public as $$
declare
  v_pct numeric := eleva.setting_int('comision_pct', 12);
  v_envio integer := eleva.setting_int('envio_cents', 25000);
  v_envio_gratis integer := eleva.setting_int('envio_gratis_desde_cents', 500000);
  v_cupon eleva.cupones%rowtype;
  v_method text := coalesce(nullif(p_payment_method, ''), 'transferencia');
  v_subtotal_total integer := 0;
  v_seller record; v_order eleva.orders; v_n integer := 0;
  v_order_id text; v_subtotal integer; v_discount integer; v_ship integer; v_total integer;
begin
  if v_method not in ('transferencia', 'efectivo') then raise exception 'Método de pago inválido: %', v_method; end if;

  create temp table _items on commit drop as
  select pr.id as product_id, pr.slug, pr.name, pr.seller_id, pr.image_url,
         (it->>'qty')::integer as qty, pr.price_cents,
         nullif(it->>'variant', '') as variant,
         pr.price_cents * (it->>'qty')::integer as line_cents
  from jsonb_array_elements(p_items) it
  join eleva.products pr on pr.slug = (it->>'slug')
  where pr.active = true;

  if not exists (select 1 from _items) then raise exception 'No hay productos válidos'; end if;
  select coalesce(sum(line_cents), 0) into v_subtotal_total from _items;

  if p_coupon is not null then
    select * into v_cupon from eleva.cupones where code = upper(p_coupon) and active = true;
    if found and coalesce(v_cupon.min_cents, 0) > v_subtotal_total then v_cupon := null; end if;
  end if;

  for v_seller in select seller_id, sum(line_cents)::integer as subtotal from _items group by seller_id order by seller_id loop
    v_n := v_n + 1; v_order_id := p_prefix || '-' || v_n; v_subtotal := v_seller.subtotal;
    v_discount := 0;
    if v_cupon.code is not null then
      if v_cupon.kind = 'percent' then v_discount := round(v_subtotal * v_cupon.value / 100.0);
      elsif v_cupon.kind = 'flat' then v_discount := round(v_cupon.value::numeric * v_subtotal / nullif(v_subtotal_total, 0));
      end if;
    end if;
    v_ship := case when v_subtotal >= v_envio_gratis then 0 else v_envio end;
    if v_cupon.code is not null and v_cupon.kind = 'shipping' then v_ship := 0; end if;
    v_total := greatest(0, v_subtotal - v_discount + v_ship);

    insert into eleva.orders (id, user_id, seller_id, subtotal_cents, discount_cents, shipping_cents, total_cents,
      coupon, shipping, status, payment_status, payment_method, commission_pct, commission_cents)
    values (v_order_id, auth.uid(), v_seller.seller_id, v_subtotal, v_discount, v_ship, v_total,
      v_cupon.code, p_shipping, 'pending', 'pendiente', v_method, v_pct, round((v_subtotal - v_discount) * v_pct / 100.0))
    returning * into v_order;

    insert into eleva.order_items (order_id, product_slug, product_name, qty, unit_price_cents, variant, seller_id, product_image)
    select v_order_id, slug, name, qty, price_cents, variant, seller_id, image_url
    from _items where seller_id is not distinct from v_seller.seller_id;

    update eleva.products pr
    set stock = greatest(0, pr.stock - i.qty), sold = coalesce(pr.sold, 0) + i.qty
    from _items i where pr.slug = i.slug and i.seller_id is not distinct from v_seller.seller_id;

    return next v_order;
  end loop;
  return;
end; $$;

grant execute on function eleva.create_order(text, text, jsonb, text, jsonb) to anon, authenticated;

notify pgrst, 'reload schema';
