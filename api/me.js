import { sql } from '../lib/db.js';
import { getUserFromReq, sendJson } from '../lib/auth.js';

export default async function handler(req, res) {
  const user = getUserFromReq(req);
  if (!user) return sendJson(res, 401, { error: 'No autenticado' });
  const { rows } = await sql`SELECT id, email, name, created_at FROM users WHERE id = ${user.uid} LIMIT 1`;
  if (!rows.length) return sendJson(res, 404, { error: 'Usuario no existe' });
  sendJson(res, 200, { user: rows[0] });
}
