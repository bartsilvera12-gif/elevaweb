import { sql } from '../../lib/db.js';
import { sendJson } from '../../lib/auth.js';

export default async function handler(req, res) {
  const { slug } = req.query;
  if (req.method === 'GET') {
    const { rows } = await sql`SELECT * FROM products WHERE slug = ${slug} LIMIT 1`;
    if (!rows.length) return sendJson(res, 404, { error: 'Not found' });
    return sendJson(res, 200, { product: rows[0] });
  }
  sendJson(res, 405, { error: 'Method not allowed' });
}
