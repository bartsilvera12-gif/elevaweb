import ProductRow from "@/components/home/ProductRow";
import { featured, nuevos } from "@/lib/mock-products";

export default function CatalogoPage({ searchParams }: { searchParams: Promise<{ q?: string; ofertas?: string; nuevo?: string }> }) {
  return (
    <>
      <div className="container-eleva pt-8">
        <h1 className="text-3xl font-extrabold">Catálogo</h1>
        <p className="text-sm text-[color:var(--color-muted)] mt-1">Explorá todos los productos publicados en ELEVA.</p>
      </div>
      <ProductRow kicker="Todos" title="Productos" viewAllHref="/catalogo" products={[...featured, ...nuevos]} />
    </>
  );
}
