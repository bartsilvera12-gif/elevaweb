import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getUserFromReq } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = getUserFromReq(req);
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  const { rows } = await sql`SELECT id, email, name, created_at FROM users WHERE id = ${user.uid} LIMIT 1`;
  if (!rows.length) return NextResponse.json({ error: "Usuario no existe" }, { status: 404 });
  return NextResponse.json({ user: rows[0] });
}
