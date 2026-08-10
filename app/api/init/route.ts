import { NextRequest, NextResponse } from "next/server";
import { sql, ensureSchema } from "@/lib/db";

const SEED = [
  { slug: "notebook-14", name: 'Notebook 14"', description: "Portátil liviana para uso diario", price_cents: 2990000, image_url: "/uploads/pasted-1786362669730-0.png", stock: 12, category: "electronica" },
  { slug: "auriculares-bt", name: "Auriculares Bluetooth", description: "Cancelación de ruido activa", price_cents: 350000, image_url: "/uploads/pasted-1786364111184-0.png", stock: 40, category: "audio" },
  { slug: "smartwatch", name: "Smartwatch Sport", description: "GPS y monitor de ritmo cardíaco", price_cents: 650000, image_url: "/uploads/pasted-1786364239300-0.png", stock: 25, category: "wearables" },
  { slug: "parlante", name: "Parlante Portátil", description: "Resistente al agua, 20h batería", price_cents: 420000, image_url: "/uploads/pasted-1786364248850-0.png", stock: 30, category: "audio" },
];

export async function POST(req: NextRequest) {
  const key = req.headers.get("x-init-key");
  if (!process.env.INIT_KEY || key !== process.env.INIT_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await ensureSchema();
  for (const p of SEED) {
    await sql`INSERT INTO products (slug, name, description, price_cents, image_url, stock, category)
      VALUES (${p.slug}, ${p.name}, ${p.description}, ${p.price_cents}, ${p.image_url}, ${p.stock}, ${p.category})
      ON CONFLICT (slug) DO NOTHING`;
  }
  const { rows } = await sql`SELECT COUNT(*)::int AS n FROM products`;
  return NextResponse.json({ ok: true, products: rows[0].n });
}
