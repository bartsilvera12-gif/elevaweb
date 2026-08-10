import type { ProductCard } from "@/components/home/ProductRow";

export const featured: ProductCard[] = [
  { slug: "vestido-midi-floral", name: "Vestido midi floral de verano", price_cents: 189000, compare_cents: 240000, rating: 4.6, sold: 230, badge: "masvendido", discPct: 21, in_stock: true },
  { slug: "zapatillas-urbanas", name: "Zapatillas urbanas unisex", price_cents: 320000, rating: 4.7, sold: 95, badge: "nuevo", in_stock: true },
  { slug: "skincare-nocturno", name: "Set de skincare facial nocturno", price_cents: 155000, compare_cents: 210000, rating: 4.8, sold: 180, discPct: 26, in_stock: true },
  { slug: "perfume-floral", name: "Perfume floral 50 ml", price_cents: 280000, rating: 4.9, sold: 66, badge: "nuevo", in_stock: true },
];

export const nuevos: ProductCard[] = [
  { slug: "mochila-viajero", name: "Mochila viajero 30L", price_cents: 420000, rating: 4.5, sold: 42, badge: "nuevo" },
  { slug: "auriculares-inal", name: "Auriculares inalámbricos", price_cents: 350000, rating: 4.6, sold: 88, badge: "nuevo" },
  { slug: "termo-1l", name: "Termo acero 1L", price_cents: 95000, rating: 4.7, sold: 210, badge: "nuevo" },
  { slug: "lampara-mesa", name: "Lámpara de mesa minimalista", price_cents: 178000, rating: 4.6, sold: 34, badge: "nuevo" },
];
