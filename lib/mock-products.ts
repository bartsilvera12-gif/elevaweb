import type { ProductCard } from "@/components/home/ProductRow";

export interface Category {
  slug: string;
  name: string;
  icon: string;
  count: number;
}

export const categories: Category[] = [
  { slug: "moda", name: "Moda y accesorios", icon: "👗", count: 128 },
  { slug: "belleza", name: "Belleza y cuidado", icon: "💄", count: 84 },
  { slug: "hogar", name: "Hogar y deco", icon: "🛋️", count: 96 },
  { slug: "electronica", name: "Electrónica", icon: "📱", count: 72 },
  { slug: "audio", name: "Audio", icon: "🎧", count: 38 },
  { slug: "wearables", name: "Wearables", icon: "⌚", count: 24 },
  { slug: "deportes", name: "Deportes y outdoor", icon: "🏃", count: 56 },
  { slug: "ninos", name: "Niños y bebés", icon: "🧸", count: 44 },
  { slug: "libros", name: "Libros y papelería", icon: "📚", count: 61 },
  { slug: "gourmet", name: "Gourmet y bebidas", icon: "🍷", count: 33 },
  { slug: "mascotas", name: "Mascotas", icon: "🐾", count: 27 },
  { slug: "auto", name: "Auto y viajes", icon: "🚗", count: 19 },
];

export interface FullProduct extends ProductCard {
  category: string;
  compare_cents?: number;
}

export const products: FullProduct[] = [
  { slug: "vestido-midi-floral", name: "Vestido midi floral de verano", price_cents: 189000, compare_cents: 240000, rating: 4.6, sold: 230, badge: "masvendido", discPct: 21, in_stock: true, category: "moda" },
  { slug: "zapatillas-urbanas", name: "Zapatillas urbanas unisex", price_cents: 320000, rating: 4.7, sold: 95, badge: "nuevo", in_stock: true, category: "moda" },
  { slug: "skincare-nocturno", name: "Set de skincare facial nocturno", price_cents: 155000, compare_cents: 210000, rating: 4.8, sold: 180, discPct: 26, in_stock: true, category: "belleza" },
  { slug: "perfume-floral", name: "Perfume floral 50 ml", price_cents: 280000, rating: 4.9, sold: 66, badge: "nuevo", in_stock: true, category: "belleza" },
  { slug: "mochila-viajero", name: "Mochila viajero 30L", price_cents: 420000, rating: 4.5, sold: 42, badge: "nuevo", in_stock: true, category: "deportes" },
  { slug: "auriculares-inal", name: "Auriculares inalámbricos", price_cents: 350000, rating: 4.6, sold: 88, badge: "nuevo", in_stock: true, category: "audio" },
  { slug: "termo-1l", name: "Termo acero 1L", price_cents: 95000, rating: 4.7, sold: 210, badge: "nuevo", in_stock: true, category: "hogar" },
  { slug: "lampara-mesa", name: "Lámpara de mesa minimalista", price_cents: 178000, rating: 4.6, sold: 34, badge: "nuevo", in_stock: true, category: "hogar" },
  { slug: "notebook-14", name: 'Notebook 14"', price_cents: 4290000, compare_cents: 4990000, rating: 4.8, sold: 12, discPct: 14, in_stock: true, category: "electronica" },
  { slug: "smartwatch-sport", name: "Smartwatch Sport GPS", price_cents: 650000, rating: 4.7, sold: 87, badge: "masvendido", in_stock: true, category: "wearables" },
  { slug: "parlante-portatil", name: "Parlante portátil IPX7", price_cents: 420000, compare_cents: 520000, rating: 4.7, sold: 145, discPct: 19, in_stock: true, category: "audio" },
  { slug: "silla-oficina", name: "Silla ergonómica de oficina", price_cents: 890000, rating: 4.5, sold: 22, in_stock: true, category: "hogar" },
  { slug: "vino-malbec", name: "Vino Malbec reserva", price_cents: 145000, rating: 4.8, sold: 340, badge: "masvendido", in_stock: true, category: "gourmet" },
  { slug: "cafe-100g", name: "Café de especialidad 100g", price_cents: 38000, rating: 4.9, sold: 560, badge: "masvendido", in_stock: true, category: "gourmet" },
  { slug: "juguete-madera", name: "Juguete didáctico de madera", price_cents: 85000, rating: 4.6, sold: 42, in_stock: true, category: "ninos" },
  { slug: "libro-novela", name: "Novela contemporánea", price_cents: 65000, rating: 4.5, sold: 88, in_stock: true, category: "libros" },
  { slug: "collar-perro", name: "Collar ajustable para perros", price_cents: 55000, rating: 4.6, sold: 130, in_stock: true, category: "mascotas" },
  { slug: "cargador-auto", name: "Cargador USB-C para auto", price_cents: 42000, compare_cents: 60000, rating: 4.4, sold: 210, discPct: 30, in_stock: true, category: "auto" },
];

export const featured: ProductCard[] = products.filter((p) => (p.rating ?? 0) >= 4.6).slice(0, 4);
export const nuevos: ProductCard[] = products.filter((p) => p.badge === "nuevo").slice(0, 4);
export const ofertas: ProductCard[] = products.filter((p) => p.discPct && p.discPct > 0).slice(0, 4);
