"use client";
import Hero from "@/components/home/Hero";
import TrustStrip from "@/components/home/TrustStrip";
import ProductRow from "@/components/home/ProductRow";
import CategoriesGrid from "@/components/home/CategoriesGrid";
import BrandsSection from "@/components/home/BrandsSection";
import { useDestacados, useNovedades, useOfertas, useMasVendidos } from "@/lib/hooks/use-products";
import type { DBProduct } from "@/lib/types";

export default function HomePage() {
  // Cada fila tiene su fuente:
  //   Destacados y Ofertas: los elige ELEVA en /admin/destacados
  //   Novedades: automático por fecha de creación
  //   Más vendidos: automático por unidades vendidas
  const { products: destacados } = useDestacados(4);
  const { products: ofertas } = useOfertas(4);
  const { products: nuevos } = useNovedades(4);
  const { products: masVendidos } = useMasVendidos(4);

  return (
    <>
      <Hero />
      <TrustStrip />
      <CategoriesGrid />
      {destacados.length > 0 && <ProductRow title="Productos destacados" viewAllHref="/catalogo" products={destacados.map(mapCard)} />}
      {ofertas.length > 0 && <ProductRow title="Ofertas del día" viewAllHref="/catalogo?ofertas=1" products={ofertas.map(mapCard)} />}
      <BrandsSection />
      {nuevos.length > 0 && <ProductRow title="Novedades de la semana" viewAllHref="/catalogo?nuevo=1" products={nuevos.map(mapCard)} />}
      {masVendidos.length > 0 && <ProductRow title="Más vendidos" viewAllHref="/catalogo?best=1" products={masVendidos.map(mapCard)} />}
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
    category: p.category,
  };
}
