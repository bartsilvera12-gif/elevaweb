import { sql } from '../lib/db.js';
import { getUserFromReq, sendJson } from '../lib/auth.js';

export default async function handler(req, res) {
  const user = getUserFromReq(req);
  if (!user) return sendJson(res, 401, { error: 'No autenticado' });

  if (req.method === 'GET') {
    const { rows } = await sql`SELECT * FROM orders WHERE user_id = ${user.uid} ORDER BY created_at DESC`;
    return sendJson(res, 200, { orders: rows });
  }

  if (req.method === 'POST') {
    const { items, shipping_address } = req.body || {};
    if (!Array.isArray(items) || !items.length) return sendJson(res, 400, { error: 'items requeridos' });

    const ids = items.map(i => Number(i.product_id));
    const { rows: prods } = await sql`SELECT id, price_cents, stock FROM products WHERE id = ANY(${ids})`;
    const map = new Map(prods.map(p => [p.id, p]));

    let total = 0;
    for (const it of items) {
      const p = map.get(Number(it.product_id));
      if (!p) return sendJson(res, 400, { error: `Producto ${it.product_id} no existe` });
      if (p.stock < it.quantity) return sendJson(res, 400, { error: `Sin stock: ${it.product_id}` });
      total += p.price_cents * it.quantity;
    }

    const { rows: [order] } = await sql`INSERT INTO orders (user_id, total_cents, shipping_address)
      VALUES (${user.uid}, ${total}, ${JSON.stringify(shipping_address || {})})
      RETURNING *`;

    for (const it of items) {
      const p = map.get(Number(it.product_id));
      await sql`INSERT INTO order_items (order_id, product_id, quantity, unit_price_cents)
        VALUES (${order.id}, ${p.id}, ${it.quantity}, ${p.price_cents})`;
      await sql`UPDATE products SET stock = stock - ${it.quantity} WHERE id = ${p.id}`;
    }

    return sendJson(res, 200, { order });
  }

  sendJson(res, 405, { error: 'Method not allowed' });
}
