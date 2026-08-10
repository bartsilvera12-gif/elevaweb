import Hero from "@/components/home/Hero";
import TrustStrip from "@/components/home/TrustStrip";
import ProductRow from "@/components/home/ProductRow";
import CategoriesGrid from "@/components/home/CategoriesGrid";
import BrandsSection from "@/components/home/BrandsSection";
import { featured, nuevos, ofertas } from "@/lib/mock-products";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <CategoriesGrid />
      <ProductRow kicker="Seleccionados para vos" title="Productos destacados" viewAllHref="/catalogo" products={featured} />
      <ProductRow kicker="Hasta -40%" title="Ofertas del día" viewAllHref="/catalogo?ofertas=1" products={ofertas} />
      <BrandsSection />
      <ProductRow kicker="Recién llegados" title="Novedades de la semana" viewAllHref="/catalogo?nuevo=1" products={nuevos} />
    </>
  );
}
