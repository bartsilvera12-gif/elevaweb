import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sql } from "@/lib/db";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: "email y password requeridos" }, { status: 400 });
  }
  const { rows } = await sql`SELECT id, email, name, password_hash FROM users WHERE email = ${email} LIMIT 1`;
  if (!rows.length) return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
  const u = rows[0];
  const ok = await bcrypt.compare(password, u.password_hash);
  if (!ok) return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
  const token = signToken({ uid: u.id, email: u.email });
  return NextResponse.json({ user: { id: u.id, email: u.email, name: u.name }, token });
}
