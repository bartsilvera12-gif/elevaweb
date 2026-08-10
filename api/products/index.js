import { sql } from '../../lib/db.js';
import { sendJson } from '../../lib/auth.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const category = req.query.category;
    const { rows } = category
      ? await sql`SELECT * FROM products WHERE category = ${category} ORDER BY id`
      : await sql`SELECT * FROM products ORDER BY id`;
    return sendJson(res, 200, { products: rows });
  }
  sendJson(res, 405, { error: 'Method not allowed' });
}
