"use client";
import Hero from "@/components/home/Hero";
import TrustStrip from "@/components/home/TrustStrip";
import ProductRow from "@/components/home/ProductRow";
import CategoriesGrid from "@/components/home/CategoriesGrid";
import BrandsSection from "@/components/home/BrandsSection";
import { useProducts } from "@/lib/hooks/use-products";
import type { DBProduct } from "@/lib/types";

export default function HomePage() {
  const { products } = useProducts({});

  const ofertas = products.filter((p) => p.disc_pct && p.disc_pct > 0).slice(0, 4);
  const ofSet = new Set(ofertas.map((p) => p.slug));
  const nuevos = products.filter((p) => p.badge === "nuevo" && !ofSet.has(p.slug)).slice(0, 4);
  const nSet = new Set(nuevos.map((p) => p.slug));
  const featured = products
    .filter((p) => (p.rating ?? 0) >= 4.6 && !ofSet.has(p.slug) && !nSet.has(p.slug))
    .slice(0, 4);

  return (
    <>
      <Hero />
      <TrustStrip />
      <CategoriesGrid />
      <ProductRow title="Productos destacados" viewAllHref="/catalogo" products={featured.map(mapCard)} />
      <ProductRow title="Ofertas del día" viewAllHref="/catalogo?ofertas=1" products={ofertas.map(mapCard)} />
      <BrandsSection />
      <ProductRow title="Novedades de la semana" viewAllHref="/catalogo?nuevo=1" products={nuevos.map(mapCard)} />
    </>
  );
}

function mapCard(p: DBProduct) {
  return {
    slug: p.slug,
    name: p.name,
    price_cents: p.price_cents,
    compare_cents: p.compare_cents ?? undefined,
    rating: p.rating ?? undefined,
    sold: p.sold,
    badge: p.badge,
    discPct: p.disc_pct ?? undefined,
    in_stock: p.stock > 0,
    image: p.image_url ?? "",
  };
}
