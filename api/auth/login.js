import bcrypt from 'bcryptjs';
import { sql } from '../../lib/db.js';
import { signToken, sendJson } from '../../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed' });
  const { email, password } = req.body || {};
  if (!email || !password) return sendJson(res, 400, { error: 'email y password requeridos' });
  const { rows } = await sql`SELECT id, email, name, password_hash FROM users WHERE email = ${email} LIMIT 1`;
  if (!rows.length) return sendJson(res, 401, { error: 'Credenciales inválidas' });
  const u = rows[0];
  const ok = await bcrypt.compare(password, u.password_hash);
  if (!ok) return sendJson(res, 401, { error: 'Credenciales inválidas' });
  const token = signToken({ uid: u.id, email: u.email });
  sendJson(res, 200, { user: { id: u.id, email: u.email, name: u.name }, token });
}
