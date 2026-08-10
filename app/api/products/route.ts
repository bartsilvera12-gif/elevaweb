import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get("category");
  const { rows } = category
    ? await sql`SELECT * FROM products WHERE category = ${category} ORDER BY id`
    : await sql`SELECT * FROM products ORDER BY id`;
  return NextResponse.json({ products: rows });
}
