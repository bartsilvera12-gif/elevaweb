import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getUserFromReq } from "@/lib/auth";

interface OrderItemInput { product_id: number; quantity: number; }

export async function GET(req: NextRequest) {
  const user = getUserFromReq(req);
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  const { rows } = await sql`SELECT * FROM orders WHERE user_id = ${user.uid} ORDER BY created_at DESC`;
  return NextResponse.json({ orders: rows });
}

export async function POST(req: NextRequest) {
  const user = getUserFromReq(req);
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  const { items, shipping_address } = (await req.json()) as {
    items: OrderItemInput[];
    shipping_address?: Record<string, unknown>;
  };
  if (!Array.isArray(items) || !items.length) {
    return NextResponse.json({ error: "items requeridos" }, { status: 400 });
  }
  const ids = items.map((i) => Number(i.product_id));
  const { rows: prods } = await sql`SELECT id, price_cents, stock FROM products WHERE id = ANY(${ids as unknown as string})`;
  const map = new Map<number, { id: number; price_cents: number; stock: number }>(
    prods.map((p) => [p.id as number, p as { id: number; price_cents: number; stock: number }])
  );
  let total = 0;
  for (const it of items) {
    const p = map.get(Number(it.product_id));
    if (!p) return NextResponse.json({ error: `Producto ${it.product_id} no existe` }, { status: 400 });
    if (p.stock < it.quantity) return NextResponse.json({ error: `Sin stock: ${it.product_id}` }, { status: 400 });
    total += p.price_cents * it.quantity;
  }
  const { rows: [order] } = await sql`INSERT INTO orders (user_id, total_cents, shipping_address)
    VALUES (${user.uid}, ${total}, ${JSON.stringify(shipping_address || {})})
    RETURNING *`;
  for (const it of items) {
    const p = map.get(Number(it.product_id))!;
    await sql`INSERT INTO order_items (order_id, product_id, quantity, unit_price_cents)
      VALUES (${order.id}, ${p.id}, ${it.quantity}, ${p.price_cents})`;
    await sql`UPDATE products SET stock = stock - ${it.quantity} WHERE id = ${p.id}`;
  }
  return NextResponse.json({ order });
}
