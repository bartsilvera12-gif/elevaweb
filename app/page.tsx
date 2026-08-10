import Hero from "@/components/home/Hero";
import TrustStrip from "@/components/home/TrustStrip";
import BrandMarquee from "@/components/home/BrandMarquee";
import ProductRow from "@/components/home/ProductRow";
import { featured, nuevos } from "@/lib/mock-products";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <BrandMarquee />
      <ProductRow kicker="Seleccionados para vos" title="Productos destacados" viewAllHref="/catalogo" products={featured} />
      <ProductRow kicker="Recién llegados" title="Novedades de la semana" viewAllHref="/catalogo?nuevo=1" products={nuevos} />
    </>
  );
}
