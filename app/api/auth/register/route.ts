import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sql, ensureSchema } from "@/lib/db";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  await ensureSchema();
  const { email, password, name } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: "email y password requeridos" }, { status: 400 });
  }
  const hash = await bcrypt.hash(password, 10);
  try {
    const { rows } = await sql`INSERT INTO users (email, password_hash, name)
      VALUES (${email}, ${hash}, ${name || null})
      RETURNING id, email, name`;
    const user = rows[0];
    const token = signToken({ uid: user.id, email: user.email });
    return NextResponse.json({ user, token });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "error";
    if (msg.includes("duplicate")) {
      return NextResponse.json({ error: "Email ya registrado" }, { status: 409 });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
