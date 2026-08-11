# ELEVA — Storefront (Next.js 15 + Supabase)

Marketplace paraguayo con Next.js 15, TypeScript, Tailwind 4 y **Supabase** (Auth + Postgres + RLS).

## Setup

### 1) Instalar
```bash
npm install
```

### 2) Configurar Supabase

1. Creá un proyecto en [supabase.com](https://supabase.com).
2. Copiá `.env.example` a `.env.local` y completá con **Project Settings → API**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (solo server, nunca exponer)
3. Andá al **SQL Editor** de Supabase y corré el contenido de [`supabase/schema.sql`](./supabase/schema.sql) una vez. Eso crea el schema `eleva` con las tablas `profiles`, `products`, `orders`, `order_items`, las políticas RLS, el trigger de auto-profile y hace el seed con 16 productos.
4. **Settings → API → Exposed schemas** — agregá `eleva` a la lista (queda: `public, storage, graphql_public, eleva`). Sin esto la API pública no ve las tablas.
5. En Vercel: **Settings → Environment Variables** — pegá las mismas 3 variables.

### 3) Correr
```bash
npm run dev
```

## Arquitectura

- `@supabase/ssr` con cookies para auth (funciona en server components y route handlers)
- **Row Level Security** activa: cada usuario solo ve/edita sus propios pedidos, perfiles, productos (si es vendedor)
- Products públicos (`active = true`), órdenes privadas por `user_id = auth.uid()`
- Trigger `handle_new_user()` crea profile automáticamente al registrarse

## Estructura

```
app/
  layout.tsx           Header + Footer
  page.tsx             Home
  catalogo/            Catálogo con filtros
  producto/[slug]/     Detalle
  carrito/, checkout/  Flow
  ingresar/, registro/ Auth (Supabase)
  vendedor/            Panel del emprendedor (7 secciones, clave: eleva2026)
  admin/               Panel staff ELEVA (7 secciones, clave: eleva-staff-2026)
  api/                 Route handlers → Supabase
lib/
  supabase/            client.ts (browser) · server.ts (SSR) · admin.ts (service role)
  hooks/use-user.ts    Hook de sesión + logout
  store.ts             Zustand: cart, favorites, orders locales
components/
  layout/, home/, catalog/, product/
supabase/
  schema.sql           SQL para correr una vez
middleware.ts          Refresca cookies de sesión en cada request
```

## API

| Método | Ruta | Auth |
| --- | --- | --- |
| POST | `/api/auth/register` | — |
| POST | `/api/auth/login` | — |
| POST | `/api/auth/logout` | — |
| GET | `/api/me` | Cookie |
| GET | `/api/products` | Público |
| GET | `/api/products/[slug]` | Público |
| GET | `/api/orders` | Cookie |
| POST | `/api/orders` | Cookie |
