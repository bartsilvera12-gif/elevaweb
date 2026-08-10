import bcrypt from 'bcryptjs';
import { sql, ensureSchema } from '../../lib/db.js';
import { signToken, sendJson } from '../../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed' });
  await ensureSchema();
  const { email, password, name } = req.body || {};
  if (!email || !password) return sendJson(res, 400, { error: 'email y password requeridos' });
  const hash = await bcrypt.hash(password, 10);
  try {
    const { rows } = await sql`INSERT INTO users (email, password_hash, name)
      VALUES (${email}, ${hash}, ${name || null})
      RETURNING id, email, name`;
    const user = rows[0];
    const token = signToken({ uid: user.id, email: user.email });
    return sendJson(res, 200, { user, token });
  } catch (e) {
    if (String(e.message).includes('duplicate')) return sendJson(res, 409, { error: 'Email ya registrado' });
    return sendJson(res, 500, { error: e.message });
  }
}
