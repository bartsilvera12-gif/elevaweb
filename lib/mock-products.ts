import type { ProductCard } from "@/components/home/ProductRow";

export interface Category {
  slug: string;
  name: string;
  icon: string;
  image: string;
}

const catImg = (seed: string) => `https://picsum.photos/seed/eleva-cat-${seed}/600/400`;

const rawCategories: Category[] = [
  { slug: "moda", name: "Moda y accesorios", icon: "👗", image: catImg("moda") },
  { slug: "belleza", name: "Belleza y cuidado", icon: "💄", image: catImg("belleza") },
  { slug: "hogar", name: "Hogar y deco", icon: "🛋️", image: catImg("hogar") },
  { slug: "electronica", name: "Electrónica", icon: "📱", image: catImg("electronica") },
  { slug: "audio", name: "Audio", icon: "🎧", image: catImg("audio") },
  { slug: "wearables", name: "Wearables", icon: "⌚", image: catImg("wearables") },
  { slug: "deportes", name: "Deportes y outdoor", icon: "🏃", image: catImg("deportes") },
  { slug: "ninos", name: "Niños y bebés", icon: "🧸", image: catImg("ninos") },
  { slug: "libros", name: "Libros y papelería", icon: "📚", image: catImg("libros") },
  { slug: "gourmet", name: "Gourmet y bebidas", icon: "🍷", image: catImg("gourmet") },
  { slug: "mascotas", name: "Mascotas", icon: "🐾", image: catImg("mascotas") },
  { slug: "auto", name: "Auto y viajes", icon: "🚗", image: catImg("auto") },
];

export interface VariantGroup {
  label: string;
  options: string[];
}

export interface FullProduct extends ProductCard {
  category: string;
  compare_cents?: number;
  image: string;
  variants?: VariantGroup;
}

const img = (seed: string) => `https://picsum.photos/seed/eleva-${seed}/600/450`;

export const products: FullProduct[] = [
  { slug: "vestido-midi-floral", name: "Vestido midi floral de verano", price_cents: 189000, compare_cents: 240000, rating: 4.6, sold: 230, badge: "masvendido", discPct: 21, in_stock: true, category: "moda", image: img("vestido-midi-floral"), variants: { label: "Talle", options: ["XS", "S", "M", "L", "XL"] } },
  { slug: "zapatillas-urbanas", name: "Zapatillas urbanas unisex", price_cents: 320000, rating: 4.7, sold: 95, badge: "nuevo", in_stock: true, category: "moda", image: img("zapatillas-urbanas"), variants: { label: "Talle", options: ["37", "38", "39", "40", "41", "42", "43", "44"] } },
  { slug: "skincare-nocturno", name: "Set de skincare facial nocturno", price_cents: 155000, compare_cents: 210000, rating: 4.8, sold: 180, discPct: 26, in_stock: true, category: "belleza", image: img("skincare-nocturno") },
  { slug: "perfume-floral", name: "Perfume floral 50 ml", price_cents: 280000, rating: 4.9, sold: 66, badge: "nuevo", in_stock: true, category: "belleza", image: img("perfume-floral") },
  { slug: "mochila-viajero", name: "Mochila viajero 30L", price_cents: 420000, rating: 4.5, sold: 42, badge: "nuevo", in_stock: true, category: "deportes", image: img("mochila-viajero"), variants: { label: "Color", options: ["Negro", "Azul", "Verde militar"] } },
  { slug: "auriculares-inal", name: "Auriculares inalámbricos", price_cents: 350000, rating: 4.6, sold: 88, badge: "nuevo", in_stock: true, category: "audio", image: img("auriculares-inal") },
  { slug: "termo-1l", name: "Termo acero 1L", price_cents: 95000, rating: 4.7, sold: 210, badge: "nuevo", in_stock: true, category: "hogar", image: img("termo-1l") },
  { slug: "lampara-mesa", name: "Lámpara de mesa minimalista", price_cents: 178000, rating: 4.6, sold: 34, badge: "nuevo", in_stock: true, category: "hogar", image: img("lampara-mesa") },
  { slug: "notebook-14", name: 'Notebook 14"', price_cents: 4290000, compare_cents: 4990000, rating: 4.8, sold: 12, discPct: 14, in_stock: true, category: "electronica", image: img("notebook-14") },
  { slug: "smartwatch-sport", name: "Smartwatch Sport GPS", price_cents: 650000, rating: 4.7, sold: 87, badge: "masvendido", in_stock: true, category: "wearables", image: img("smartwatch-sport") },
  { slug: "parlante-portatil", name: "Parlante portátil IPX7", price_cents: 420000, compare_cents: 520000, rating: 4.7, sold: 145, discPct: 19, in_stock: true, category: "audio", image: img("parlante-portatil") },
  { slug: "silla-oficina", name: "Silla ergonómica de oficina", price_cents: 890000, rating: 4.5, sold: 22, in_stock: true, category: "hogar", image: img("silla-oficina") },
  { slug: "vino-malbec", name: "Vino Malbec reserva", price_cents: 145000, rating: 4.8, sold: 340, badge: "masvendido", in_stock: true, category: "gourmet", image: img("vino-malbec") },
  { slug: "cafe-100g", name: "Café de especialidad 100g", price_cents: 38000, rating: 4.9, sold: 560, badge: "masvendido", in_stock: true, category: "gourmet", image: img("cafe-100g") },
  { slug: "juguete-madera", name: "Juguete didáctico de madera", price_cents: 85000, rating: 4.6, sold: 42, in_stock: true, category: "ninos", image: img("juguete-madera") },
  { slug: "libro-novela", name: "Novela contemporánea", price_cents: 65000, rating: 4.5, sold: 88, in_stock: true, category: "libros", image: img("libro-novela") },
  { slug: "collar-perro", name: "Collar ajustable para perros", price_cents: 55000, rating: 4.6, sold: 130, in_stock: true, category: "mascotas", image: img("collar-perro"), variants: { label: "Talle", options: ["Chico", "Mediano", "Grande"] } },
  { slug: "cargador-auto", name: "Cargador USB-C para auto", price_cents: 42000, compare_cents: 60000, rating: 4.4, sold: 210, discPct: 30, in_stock: true, category: "auto", image: img("cargador-auto") },
];

export const brands = [
  { slug: "samsung", name: "Samsung" },
  { slug: "apple", name: "Apple" },
  { slug: "nike", name: "Nike" },
  { slug: "adidas", name: "Adidas" },
  { slug: "sony", name: "Sony" },
  { slug: "lg", name: "LG" },
  { slug: "xiaomi", name: "Xiaomi" },
  { slug: "hp", name: "HP" },
  { slug: "dell", name: "Dell" },
  { slug: "huawei", name: "Huawei" },
  { slug: "panasonic", name: "Panasonic" },
  { slug: "lenovo", name: "Lenovo" },
];

export type ProductWithImage = FullProduct;

export const categories: (Category & { count: number })[] = rawCategories.map((c) => ({
  ...c,
  count: products.filter((p) => p.category === c.slug).length,
}));

export const featured = products.filter((p) => (p.rating ?? 0) >= 4.6).slice(0, 4);
export const nuevos = products.filter((p) => p.badge === "nuevo").slice(0, 4);
export const ofertas = products.filter((p) => p.discPct && p.discPct > 0).slice(0, 4);
