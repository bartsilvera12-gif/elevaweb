import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(_: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const { rows } = await sql`SELECT * FROM products WHERE slug = ${slug} LIMIT 1`;
  if (!rows.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ product: rows[0] });
}
