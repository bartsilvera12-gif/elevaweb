# ELEVA — Storefront (Next.js 15 + TS + Tailwind 4)

Storefront paraguayo con backend serverless en Vercel.

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 4** (theme-first, CSS-only config en `app/globals.css`)
- **Vercel Postgres** (`@vercel/postgres`) + JWT auth (bcryptjs, jsonwebtoken)
- **motion** para animaciones (marquee de marcas)
- **lucide-react** para iconos

## Estructura

```
app/
  layout.tsx           Header + Footer + fonts
  page.tsx             Home (hero, trust, marquee de marcas, filas de productos)
  catalogo/            Catálogo
  producto/[slug]/     Detalle de producto
  carrito/, checkout/  Checkout flow
  ingresar/, registro/ Auth
  como-comprar/, vender/
  api/                 Route handlers (products, auth, orders, me, init)
components/
  layout/              Header, Footer
  home/                Hero, TrustStrip, BrandMarquee, ProductRow
  ui/                  marquee-along-svg-path (shadcn-style path)
lib/                   utils.ts, db.ts, auth.ts, mock-products.ts
public/                Logos, uploads del manual de marca
```

## Dev

```bash
npm install
npm run dev
```

## Deploy en Vercel

1. https://vercel.com/new → importar `bartsilvera12-gif/elevaweb`. Framework: **Next.js** (autodetect).
2. **Storage → Create Database → Postgres** (Neon). Setea `POSTGRES_URL` solo.
3. **Env vars:** `JWT_SECRET` (aleatorio), `INIT_KEY` (aleatorio, protege `/api/init`).
4. Deploy.
5. Init DB (una vez):
   ```bash
   curl -X POST https://<app>.vercel.app/api/init -H "X-Init-Key: $INIT_KEY"
   ```

## API

| Método | Ruta | Auth | Body |
| --- | --- | --- | --- |
| POST | `/api/init` | X-Init-Key | — |
| GET | `/api/products` | — | ?category= |
| GET | `/api/products/[slug]` | — | — |
| POST | `/api/auth/register` | — | {email,password,name} |
| POST | `/api/auth/login` | — | {email,password} |
| GET | `/api/me` | Bearer | — |
| GET | `/api/orders` | Bearer | — |
| POST | `/api/orders` | Bearer | {items,shipping_address} |
