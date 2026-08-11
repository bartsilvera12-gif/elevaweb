"use client";
import FiltersSidebar from "@/components/catalog/FiltersSidebar";
import CatalogGrid from "@/components/catalog/CatalogGrid";
import SortBar from "@/components/catalog/SortBar";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Loader2 } from "lucide-react";
import { useProducts } from "@/lib/hooks/use-products";
import { useCategoriesWithCounts } from "@/lib/hooks/use-categories";

export default function CatalogoPage() {
  const sp = useSearchParams();
  const cat = sp.get("cat") || undefined;
  const q = sp.get("q") || undefined;
  const sort = (sp.get("sort") || "relevancia") as "relevancia" | "precio-asc" | "precio-desc" | "vendidos" | "rating" | "nuevos";
  const minPrice = sp.get("min") ? Number(sp.get("min")) : undefined;
  const maxPrice = sp.get("max") ? Number(sp.get("max")) : undefined;
  const onlyStock = sp.get("stock") === "1";
  const onlyOffers = sp.get("ofertas") === "1";
  const onlyNew = sp.get("nuevo") === "1";
  const onlyBest = sp.get("best") === "1";

  const { products, loading } = useProducts({ category: cat, q, sort, minPrice, maxPrice, onlyStock, onlyOffers, onlyNew, onlyBest });
  const { categories } = useCategoriesWithCounts();
  const catName = cat ? categories.find((c) => c.slug === cat)?.name : null;

  return (
    <div className="container-eleva pt-6">
      <nav className="text-xs text-[color:var(--color-muted)] flex items-center gap-1.5">
        <Link href="/" className="hover:text-[color:var(--color-brand)]">Inicio</Link>
        <ChevronRight size={12} />
        <Link href="/catalogo" className="hover:text-[color:var(--color-brand)]">Catálogo</Link>
        {catName && (<><ChevronRight size={12} /><span className="text-[color:var(--color-ink-soft)]">{catName}</span></>)}
      </nav>

      <div className="flex items-end justify-between mt-3 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">{catName || "Catálogo"}</h1>
          {q && <p className="text-sm text-[color:var(--color-muted)] mt-1">Resultados para “<strong>{q}</strong>”</p>}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <FiltersSidebar />
        <div className="flex-1 min-w-0">
          <SortBar count={products.length} />
          {loading ? (
            <div className="flex justify-center items-center py-20 text-[color:var(--color-muted)]">
              <Loader2 size={20} className="animate-spin" />
            </div>
          ) : (
            <CatalogGrid products={products.map((p) => ({
              slug: p.slug,
              name: p.name,
              price_cents: p.price_cents,
              compare_cents: p.compare_cents ?? undefined,
              rating: p.rating ?? undefined,
              sold: p.sold,
              badge: p.badge,
              discPct: p.disc_pct ?? undefined,
              in_stock: p.stock > 0,
              category: p.category,
              image: p.image_url ?? "",
              variants: undefined,
            }))} />
          )}
        </div>
      </div>
    </div>
  );
}
