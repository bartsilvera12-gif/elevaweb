import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface OrderItemIn {
  product_slug: string;
  product_name: string;
  qty: number;
  unit_price_cents: number;
  variant?: string;
}

interface OrderIn {
  items: OrderItemIn[];
  subtotal_cents: number;
  discount_cents?: number;
  shipping_cents?: number;
  total_cents: number;
  coupon?: string;
  shipping: Record<string, unknown>;
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ orders: data ?? [] });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const body = (await req.json()) as OrderIn;
  if (!body.items?.length) return NextResponse.json({ error: "items requeridos" }, { status: 400 });

  const id = "ELV-" + Math.random().toString(36).slice(2, 8).toUpperCase();
  const { error: orderErr } = await supabase.from("orders").insert({
    id,
    user_id: user.id,
    subtotal_cents: body.subtotal_cents,
    discount_cents: body.discount_cents ?? 0,
    shipping_cents: body.shipping_cents ?? 0,
    total_cents: body.total_cents,
    coupon: body.coupon,
    shipping: body.shipping,
    status: "paid",
  });
  if (orderErr) return NextResponse.json({ error: orderErr.message }, { status: 500 });

  const itemsPayload = body.items.map((it) => ({
    order_id: id,
    product_slug: it.product_slug,
    product_name: it.product_name,
    qty: it.qty,
    unit_price_cents: it.unit_price_cents,
    variant: it.variant,
  }));
  const { error: itemsErr } = await supabase.from("order_items").insert(itemsPayload);
  if (itemsErr) return NextResponse.json({ error: itemsErr.message }, { status: 500 });

  return NextResponse.json({ order: { id, ...body } });
}
