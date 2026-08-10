import type { ProductCard } from "@/components/home/ProductRow";

export interface Category {
  slug: string;
  name: string;
  image: string;
}

const rawCategories: Category[] = [
  { slug: "moda", name: "Moda y accesorios", image: "/categorias/moda.jpg" },
  { slug: "belleza", name: "Belleza y cuidado", image: "/categorias/belleza.avif" },
  { slug: "hogar", name: "Hogar y deco", image: "/categorias/hogar.jpg" },
  { slug: "electronica", name: "Electrónica", image: "/categorias/electronica.jpg" },
  { slug: "audio", name: "Audio", image: "/categorias/audio.jpeg" },
  { slug: "wearables", name: "Wearables", image: "/categorias/wearables.jpg" },
  { slug: "deportes", name: "Deportes y outdoor", image: "/categorias/deportes.jpg" },
  { slug: "ninos", name: "Niños y bebés", image: "/categorias/ninos.png" },
  { slug: "libros", name: "Libros y papelería", image: "/categorias/libros.jpg" },
  { slug: "gourmet", name: "Gourmet y bebidas", image: "/categorias/gourmet.jpg" },
  { slug: "mascotas", name: "Mascotas", image: "/categorias/mascotas.jpg" },
  { slug: "videojuegos", name: "Videojuegos", image: "/categorias/videojuegos.jpg" },
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

export const products: FullProduct[] = [
  { slug: "vestido-midi-floral", name: "Vestido midi floral de verano", price_cents: 189000, compare_cents: 240000, rating: 4.6, sold: 230, badge: "masvendido", discPct: 21, in_stock: true, category: "moda", image: "/productos/vestido-midi-floral.jpg", variants: { label: "Talle", options: ["XS", "S", "M", "L", "XL"] } },
  { slug: "zapatillas-urbanas", name: "Zapatillas urbanas unisex", price_cents: 320000, rating: 4.7, sold: 95, badge: "nuevo", in_stock: true, category: "moda", image: "/productos/zapatillas-urbanas.webp", variants: { label: "Talle", options: ["37", "38", "39", "40", "41", "42", "43", "44"] } },
  { slug: "skincare-nocturno", name: "Set de skincare facial nocturno", price_cents: 155000, compare_cents: 210000, rating: 4.8, sold: 180, discPct: 26, in_stock: true, category: "belleza", image: "/productos/skincare-nocturno.jpeg" },
  { slug: "perfume-floral", name: "Perfume floral 50 ml", price_cents: 280000, rating: 4.9, sold: 66, badge: "nuevo", in_stock: true, category: "belleza", image: "/productos/perfume-floral.jpg" },
  { slug: "mochila-viajero", name: "Mochila viajero 30L", price_cents: 420000, rating: 4.5, sold: 42, badge: "nuevo", in_stock: true, category: "deportes", image: "/productos/mochila-viajero.jpeg", variants: { label: "Color", options: ["Negro", "Azul", "Verde militar"] } },
  { slug: "auriculares-inal", name: "Auriculares inalámbricos", price_cents: 350000, rating: 4.6, sold: 88, badge: "nuevo", in_stock: true, category: "audio", image: "/productos/auriculares-inal.jpeg" },
  { slug: "termo-1l", name: "Termo acero 1L", price_cents: 95000, rating: 4.7, sold: 210, badge: "nuevo", in_stock: true, category: "hogar", image: "/productos/termo-1l.webp" },
  { slug: "lampara-mesa", name: "Lámpara de mesa minimalista", price_cents: 178000, rating: 4.6, sold: 34, badge: "nuevo", in_stock: true, category: "hogar", image: "/productos/lampara-mesa.jpg" },
  { slug: "notebook-14", name: 'Notebook 14"', price_cents: 4290000, compare_cents: 4990000, rating: 4.8, sold: 12, discPct: 14, in_stock: true, category: "electronica", image: "/productos/notebook-14.png" },
  { slug: "smartwatch-sport", name: "Smartwatch Sport GPS", price_cents: 650000, rating: 4.7, sold: 87, badge: "masvendido", in_stock: true, category: "wearables", image: "/productos/smartwatch-sport.jpg" },
  { slug: "parlante-portatil", name: "Parlante portátil IPX7", price_cents: 420000, compare_cents: 520000, rating: 4.7, sold: 145, discPct: 19, in_stock: true, category: "audio", image: "/productos/parlante-portatil.jpeg" },
  { slug: "silla-oficina", name: "Silla ergonómica de oficina", price_cents: 890000, rating: 4.5, sold: 22, in_stock: true, category: "hogar", image: "/productos/silla-oficina.jpeg" },
  { slug: "vino-malbec", name: "Vino Malbec reserva", price_cents: 145000, rating: 4.8, sold: 340, badge: "masvendido", in_stock: true, category: "gourmet", image: "/productos/vino-malbec.jpeg" },
  { slug: "cafe-100g", name: "Café de especialidad 100g", price_cents: 38000, rating: 4.9, sold: 560, badge: "masvendido", in_stock: true, category: "gourmet", image: "/productos/cafe-100g.jpg" },
  { slug: "juguete-madera", name: "Juguete didáctico de madera", price_cents: 85000, rating: 4.6, sold: 42, in_stock: true, category: "ninos", image: "/productos/juguete-madera.jpg" },
  { slug: "collar-perro", name: "Collar ajustable para perros", price_cents: 55000, rating: 4.6, sold: 130, in_stock: true, category: "mascotas", image: "/productos/collar-perro.jpeg", variants: { label: "Talle", options: ["Chico", "Mediano", "Grande"] } },
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
