-- ELEVA v7 — Barra promocional administrable
-- Correr en Supabase → SQL Editor. Idempotente.
--
-- Aditivo: agrega dos claves a eleva.settings para controlar la franja
-- superior de la web desde /admin/configuracion. NO toca tablas, funciones,
-- RLS ni políticas existentes (la lectura pública y la escritura admin vía
-- eleva.is_admin() ya están definidas en schema-v4.sql y se mantienen).

insert into eleva.settings (key, value) values
  ('promo_banner_text', '"Todo lo que buscás, en un solo lugar"'::jsonb),
  ('promo_banner_active', 'true'::jsonb)
on conflict (key) do nothing;
