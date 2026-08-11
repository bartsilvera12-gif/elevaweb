import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const category = req.nextUrl.searchParams.get("category");
  let q = supabase.from("products").select("*").eq("active", true).order("id");
  if (category) q = q.eq("category", category);
  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ products: data ?? [] });
}
