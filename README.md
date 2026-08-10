# ELEVA — Storefront + API

Frontend estático (`ELEVA Storefront.dc.html`) + backend serverless en Vercel (`/api`) con Postgres.

## Endpoints

| Método | Ruta | Descripción |
| --- | --- | --- |
| POST | `/api/init` | Crea tablas + seed. Header `X-Init-Key: $INIT_KEY` |
| GET  | `/api/products` | Lista productos (query `?category=`) |
| GET  | `/api/products/[slug]` | Detalle |
| POST | `/api/auth/register` | `{ email, password, name }` → `{ user, token }` |
| POST | `/api/auth/login` | `{ email, password }` → `{ user, token }` |
| GET  | `/api/me` | Auth: `Authorization: Bearer <token>` |
| GET  | `/api/orders` | Órdenes del usuario |
| POST | `/api/orders` | `{ items:[{product_id,quantity}], shipping_address }` |

## Deploy en Vercel (5 pasos)

1. Entrá a https://vercel.com/new e importá el repo `bartsilvera12-gif/elevaweb`.
2. Framework preset: **Other**. Build command: vacío. Output dir: `.`
3. En el proyecto → **Storage → Create Database → Postgres** (Neon). Vercel setea `POSTGRES_URL` solo.
4. En **Settings → Environment Variables** agregá:
   - `JWT_SECRET` = string aleatorio largo
   - `INIT_KEY` = string aleatorio (para proteger `/api/init`)
5. Deploy. Después, una única vez:
   ```bash
   curl -X POST https://<tu-app>.vercel.app/api/init -H "X-Init-Key: <INIT_KEY>"
   ```

## Dev local

```bash
npm install
npm i -g vercel
vercel link
vercel env pull .env.local
vercel dev
```
