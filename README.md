# ELEVA — Storefront (Next.js 15 · Static export · Supabase)

Marketplace paraguayo. Frontend: Next.js 15 + TypeScript + Tailwind 4, buildado como **HTML estático** (compatible con hosting compartido tipo Hostinger). Backend: **Supabase** (Auth + Postgres + RLS).

## 1. Setup Supabase

1. Creá un proyecto en [supabase.com](https://supabase.com).
2. **SQL Editor** → correr una vez el contenido de [`supabase/schema.sql`](./supabase/schema.sql). Crea schema `eleva`, tablas, RLS, trigger de auto-profile y seed de 16 productos.
3. **Project Settings → API → Exposed schemas** → agregar `eleva` (queda: `public, storage, graphql_public, eleva`).
4. **Project Settings → API** → copiar Project URL y anon key.

## 2. Variables de entorno

`.env.local` (basado en `.env.example`):
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

En export estático, todo lo que empieza con `NEXT_PUBLIC_` se inlinea en el build. **No pongas el service role key** — la app no lo usa (todo respeta RLS con la anon key).

## 3. Build

```bash
npm install
npm run build
```

Genera la carpeta `out/` con todos los HTML/CSS/JS estáticos.

## 4. Subir a Hostinger

1. Entrá al **File Manager** de Hostinger (o por FTP).
2. Andá a `public_html/`.
3. Subí **el contenido de `out/`** (no la carpeta, el contenido: `index.html`, `_next/`, `productos/`, etc.).
4. Asegurate de subir también el archivo `.htaccess` (viene de `public/.htaccess`).
5. Listo — entrá a tu dominio.

## Estructura del proyecto

```
app/
  page.tsx             Home
  catalogo/            Catálogo con filtros
  producto/[slug]/     Detalle (pre-generado en build via generateStaticParams)
  carrito/, checkout/  Flow completo
  pedido/              Detalle de pedido (?id=ELV-XXXXXX en query string)
  mis-pedidos/         Historial
  ingresar/, registro/ Auth Supabase (client-side)
  vendedor/            Panel del emprendedor (clave: eleva2026)
  admin/               Panel staff ELEVA (clave: eleva-staff-2026)
lib/
  supabase/client.ts   Único cliente (browser)
  hooks/use-user.ts    Sesión con onAuthStateChange
  store.ts             Zustand: cart, favorites, orders locales
components/
  layout/, home/, catalog/, product/
supabase/
  schema.sql           Correr una vez
public/
  .htaccess            Config para Apache/Hostinger
```

## Limitaciones del export estático

- **No hay route handlers `/api/*`** — todo pasa por el cliente Supabase directo.
- **No hay middleware** — la sesión se refresca automáticamente por el cliente Supabase en el browser.
- **No hay next/image optimización** — imágenes se sirven tal cual desde `/public`.
- Las páginas dinámicas usan **query params** (`/pedido?id=ELV-XXX`) o **generateStaticParams** (`/producto/[slug]`).

## Dev local

```bash
npm run dev
# → http://localhost:3000
```
