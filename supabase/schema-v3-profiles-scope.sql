-- v3: que eleva.profiles solo tenga usuarios de ELEVA
--
-- Problema: auth.users es de TODA la instancia self-hosted (la comparten otras apps
-- / otros schemas). El trigger de schema.sql estaba sobre auth.users sin filtrar, así
-- que cada signup de cualquier app creaba una fila en eleva.profiles.
--
-- Además el trigger se llamaba "on_auth_user_created" (nombre genérico) y el script
-- hacía "drop trigger if exists" sobre él -> si otra app usó ese mismo nombre, se lo
-- borró. Por eso acá el trigger pasa a llamarse "on_auth_user_created_eleva" y NO se
-- dropea el genérico.
--
-- Correr en Supabase -> SQL Editor.

-- ============================================
-- 1) Trigger nuevo, con nombre propio y filtrado por metadata app = 'eleva'
--    (el front manda options.data = { name, app: 'eleva' } en signUp)
-- ============================================
create or replace function eleva.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = eleva, public
as $$
begin
  insert into eleva.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Sacar el trigger viejo de ELEVA (sin filtro). Ojo: si otra app tuya usa este mismo
-- nombre, revisá antes con el query de diagnóstico de abajo.
drop trigger if exists on_auth_user_created on auth.users;

drop trigger if exists on_auth_user_created_eleva on auth.users;
create trigger on_auth_user_created_eleva
  after insert on auth.users
  for each row
  when (new.raw_user_meta_data->>'app' = 'eleva')
  execute procedure eleva.handle_new_user();

-- ============================================
-- 2) DIAGNOSTICO: qué triggers hay hoy sobre auth.users (de todas las apps)
-- ============================================
-- select t.tgname, p.pronamespace::regnamespace as schema_de_la_funcion, p.proname
-- from pg_trigger t join pg_proc p on p.oid = t.tgfoid
-- where t.tgrelid = 'auth.users'::regclass and not t.tgisinternal;

-- ============================================
-- 3) DIAGNOSTICO: qué profiles son realmente de ELEVA y cuáles se colaron
-- ============================================
-- select p.id, u.email, u.raw_user_meta_data->>'app' as app,
--        p.is_seller, p.store_name, p.created_at,
--        (select count(*) from eleva.products pr where pr.seller_id = p.id) as productos,
--        (select count(*) from eleva.orders o where o.user_id = p.id) as pedidos
-- from eleva.profiles p
-- join auth.users u on u.id = p.id
-- order by p.created_at;

-- ============================================
-- 4) LIMPIEZA (revisá primero el query 3). Borra los profiles que NO son de ELEVA:
--    sin metadata app='eleva', sin productos y sin pedidos.
--    Descomentá recién cuando hayas visto la lista.
-- ============================================
-- delete from eleva.profiles p
-- using auth.users u
-- where u.id = p.id
--   and coalesce(u.raw_user_meta_data->>'app', '') <> 'eleva'
--   and not exists (select 1 from eleva.products pr where pr.seller_id = p.id)
--   and not exists (select 1 from eleva.orders o where o.user_id = p.id);
