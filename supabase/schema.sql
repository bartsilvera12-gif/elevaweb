-- ELEVA — Supabase schema (schema: eleva)
-- Correlo en SQL Editor de Supabase (una sola vez).
-- Despues: Settings -> API -> Exposed schemas -> agregar "eleva" (queda: public, storage, graphql_public, eleva)

-- ============================================
-- SCHEMA
-- ============================================
create schema if not exists eleva;

-- Permitir a los roles de PostgREST usar el schema
grant usage on schema eleva to anon, authenticated, service_role;
grant all on all tables in schema eleva to service_role;
grant all on all sequences in schema eleva to service_role;
alter default privileges in schema eleva grant all on tables to service_role;
alter default privileges in schema eleva grant all on sequences to service_role;

-- ============================================
-- PROFILES: extiende auth.users
-- ============================================
create table if not exists eleva.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  phone text,
  city text default 'Asunción',
  is_seller boolean default false,
  store_name text,
  created_at timestamptz default now()
);

alter table eleva.profiles enable row level security;

drop policy if exists "profiles_select_own" on eleva.profiles;
create policy "profiles_select_own" on eleva.profiles for select using (auth.uid() = id);

drop policy if exists "profiles_update_own" on eleva.profiles;
create policy "profiles_update_own" on eleva.profiles for update using (auth.uid() = id);

-- Trigger: crear profile automáticamente al registrarse
create or replace function eleva.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = eleva, public
as $$
begin
  insert into eleva.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure eleva.handle_new_user();

grant select, insert, update on eleva.profiles to authenticated;
grant usage on schema eleva to authenticated;

-- ============================================
-- PRODUCTS
-- ============================================
create table if not exists eleva.products (
  id bigserial primary key,
  seller_id uuid references eleva.profiles(id) on delete set null,
  slug text unique not null,
  name text not null,
  description text,
  price_cents integer not null,
  compare_cents integer,
  currency text default 'PYG',
  image_url text,
  stock integer default 0,
  category text,
  active boolean default true,
  rating numeric(2,1),
  sold integer default 0,
  badge text,
  disc_pct integer,
  created_at timestamptz default now()
);

create index if not exists products_category_idx on eleva.products(category);
create index if not exists products_active_idx on eleva.products(active);
create index if not exists products_seller_idx on eleva.products(seller_id);

alter table eleva.products enable row level security;

drop policy if exists "products_public_read" on eleva.products;
create policy "products_public_read" on eleva.products for select using (active = true);

drop policy if exists "products_seller_write" on eleva.products;
create policy "products_seller_write" on eleva.products for all
  using (auth.uid() = seller_id) with check (auth.uid() = seller_id);

grant select on eleva.products to anon, authenticated;
grant insert, update, delete on eleva.products to authenticated;
grant usage, select on sequence eleva.products_id_seq to authenticated;

-- ============================================
-- ORDERS + ORDER ITEMS
-- ============================================
create table if not exists eleva.orders (
  id text primary key,
  user_id uuid references eleva.profiles(id) on delete set null,
  subtotal_cents integer not null,
  discount_cents integer default 0,
  shipping_cents integer default 0,
  total_cents integer not null,
  currency text default 'PYG',
  status text default 'paid',
  coupon text,
  shipping jsonb,
  created_at timestamptz default now()
);

create index if not exists orders_user_idx on eleva.orders(user_id);
create index if not exists orders_created_idx on eleva.orders(created_at desc);

alter table eleva.orders enable row level security;

drop policy if exists "orders_own_read" on eleva.orders;
create policy "orders_own_read" on eleva.orders for select using (auth.uid() = user_id);

drop policy if exists "orders_own_insert" on eleva.orders;
create policy "orders_own_insert" on eleva.orders for insert with check (auth.uid() = user_id);

grant select, insert on eleva.orders to authenticated;

create table if not exists eleva.order_items (
  id bigserial primary key,
  order_id text references eleva.orders(id) on delete cascade,
  product_slug text,
  product_name text,
  qty integer not null,
  unit_price_cents integer not null,
  variant text
);

alter table eleva.order_items enable row level security;

drop policy if exists "order_items_own_read" on eleva.order_items;
create policy "order_items_own_read" on eleva.order_items for select using (
  exists (select 1 from eleva.orders o where o.id = order_items.order_id and o.user_id = auth.uid())
);

drop policy if exists "order_items_own_insert" on eleva.order_items;
create policy "order_items_own_insert" on eleva.order_items for insert with check (
  exists (select 1 from eleva.orders o where o.id = order_items.order_id and o.user_id = auth.uid())
);

grant select, insert on eleva.order_items to authenticated;
grant usage, select on sequence eleva.order_items_id_seq to authenticated;

-- ============================================
-- SEED: 16 productos del catálogo
-- ============================================
insert into eleva.products (slug, name, description, price_cents, compare_cents, image_url, stock, category, rating, sold, badge, disc_pct) values
  ('vestido-midi-floral', 'Vestido midi floral de verano', 'Vestido midi de tela liviana con estampado floral, corte favorecedor.', 189000, 240000, '/productos/vestido-midi-floral.jpg', 12, 'moda', 4.6, 230, 'masvendido', 21),
  ('zapatillas-urbanas', 'Zapatillas urbanas unisex', 'Suela flexible, plantilla acolchada. Diseño urbano moderno.', 320000, null, '/productos/zapatillas-urbanas.webp', 40, 'moda', 4.7, 95, 'nuevo', null),
  ('skincare-nocturno', 'Set de skincare facial nocturno', 'Rutina completa nocturna: limpiador, serum y crema.', 155000, 210000, '/productos/skincare-nocturno.jpeg', 25, 'belleza', 4.8, 180, null, 26),
  ('perfume-floral', 'Perfume floral 50 ml', 'Fragancia floral fresca de larga duración.', 280000, null, '/productos/perfume-floral.jpg', 15, 'belleza', 4.9, 66, 'nuevo', null),
  ('mochila-viajero', 'Mochila viajero 30L', 'Mochila resistente con múltiples compartimentos.', 420000, null, '/productos/mochila-viajero.jpeg', 20, 'deportes', 4.5, 42, 'nuevo', null),
  ('auriculares-inal', 'Auriculares inalámbricos', 'Cancelación de ruido activa, 30h de batería.', 350000, null, '/productos/auriculares-inal.jpeg', 30, 'audio', 4.6, 88, 'nuevo', null),
  ('termo-1l', 'Termo acero 1L', 'Acero inoxidable, mantiene temperatura 24hs.', 95000, null, '/productos/termo-1l.webp', 60, 'hogar', 4.7, 210, 'nuevo', null),
  ('lampara-mesa', 'Lámpara de mesa minimalista', 'Diseño escandinavo, luz cálida regulable.', 178000, null, '/productos/lampara-mesa.jpg', 18, 'hogar', 4.6, 34, 'nuevo', null),
  ('notebook-14', 'Notebook 14"', 'Portátil liviana para uso profesional y estudio.', 4290000, 4990000, '/productos/notebook-14.png', 8, 'electronica', 4.8, 12, null, 14),
  ('smartwatch-sport', 'Smartwatch Sport GPS', 'GPS integrado, monitor de ritmo cardíaco.', 650000, null, '/productos/smartwatch-sport.jpg', 22, 'wearables', 4.7, 87, 'masvendido', null),
  ('parlante-portatil', 'Parlante portátil IPX7', 'Resistente al agua, 20h de batería.', 420000, 520000, '/productos/parlante-portatil.jpeg', 35, 'audio', 4.7, 145, null, 19),
  ('silla-oficina', 'Silla ergonómica de oficina', 'Soporte lumbar ajustable, reposabrazos 3D.', 890000, null, '/productos/silla-oficina.jpeg', 10, 'hogar', 4.5, 22, null, null),
  ('vino-malbec', 'Vino Malbec reserva', 'Cosecha 2022. Notas de frutos rojos y roble.', 145000, null, '/productos/vino-malbec.jpeg', 40, 'gourmet', 4.8, 340, 'masvendido', null),
  ('cafe-100g', 'Café de especialidad 100g', 'Tostado artesanal. Origen paraguayo.', 38000, null, '/productos/cafe-100g.jpg', 80, 'gourmet', 4.9, 560, 'masvendido', null),
  ('juguete-madera', 'Juguete didáctico de madera', 'Encastres educativos para 2 a 5 años.', 85000, null, '/productos/juguete-madera.jpg', 30, 'ninos', 4.6, 42, null, null),
  ('collar-perro', 'Collar ajustable para perros', 'Nylon reforzado con hebilla de seguridad.', 55000, null, '/productos/collar-perro.jpeg', 50, 'mascotas', 4.6, 130, null, null)
on conflict (slug) do nothing;
