-- ELEVA — Supabase schema
-- Correlo en SQL Editor de Supabase (una sola vez).

-- ============================================
-- PROFILES: extiende auth.users
-- ============================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  phone text,
  city text default 'Asunción',
  is_seller boolean default false,
  store_name text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- Trigger: crear profile automáticamente al registrarse
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- PRODUCTS
-- ============================================
create table if not exists public.products (
  id bigserial primary key,
  seller_id uuid references public.profiles(id) on delete set null,
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

create index if not exists products_category_idx on public.products(category);
create index if not exists products_active_idx on public.products(active);
create index if not exists products_seller_idx on public.products(seller_id);

alter table public.products enable row level security;

drop policy if exists "products_public_read" on public.products;
create policy "products_public_read" on public.products for select using (active = true);

drop policy if exists "products_seller_write" on public.products;
create policy "products_seller_write" on public.products for all
  using (auth.uid() = seller_id) with check (auth.uid() = seller_id);

-- ============================================
-- ORDERS + ORDER ITEMS
-- ============================================
create table if not exists public.orders (
  id text primary key,
  user_id uuid references public.profiles(id) on delete set null,
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

create index if not exists orders_user_idx on public.orders(user_id);
create index if not exists orders_created_idx on public.orders(created_at desc);

alter table public.orders enable row level security;

drop policy if exists "orders_own_read" on public.orders;
create policy "orders_own_read" on public.orders for select using (auth.uid() = user_id);

drop policy if exists "orders_own_insert" on public.orders;
create policy "orders_own_insert" on public.orders for insert with check (auth.uid() = user_id);

create table if not exists public.order_items (
  id bigserial primary key,
  order_id text references public.orders(id) on delete cascade,
  product_slug text,
  product_name text,
  qty integer not null,
  unit_price_cents integer not null,
  variant text
);

alter table public.order_items enable row level security;

drop policy if exists "order_items_own_read" on public.order_items;
create policy "order_items_own_read" on public.order_items for select using (
  exists (select 1 from public.orders o where o.id = order_items.order_id and o.user_id = auth.uid())
);

drop policy if exists "order_items_own_insert" on public.order_items;
create policy "order_items_own_insert" on public.order_items for insert with check (
  exists (select 1 from public.orders o where o.id = order_items.order_id and o.user_id = auth.uid())
);

-- ============================================
-- SEED: productos iniciales del catálogo
-- (sin seller_id para que sean "de la casa")
-- ============================================
insert into public.products (slug, name, description, price_cents, compare_cents, image_url, stock, category, rating, sold, badge, disc_pct) values
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
