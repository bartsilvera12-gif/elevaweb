import FiltersSidebar from "@/components/catalog/FiltersSidebar";
import CatalogGrid from "@/components/catalog/CatalogGrid";
import { products, categories } from "@/lib/mock-products";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default async function CatalogoPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const cat = sp.cat;
  const q = (sp.q || "").toLowerCase();
  const filtered = products.filter((p) => {
    if (cat && p.category !== cat) return false;
    if (sp.stock === "1" && !p.in_stock) return false;
    if (sp.ofertas === "1" && !(p.discPct && p.discPct > 0)) return false;
    if (sp.nuevo === "1" && p.badge !== "nuevo") return false;
    if (sp.best === "1" && p.badge !== "masvendido") return false;
    if (q && !p.name.toLowerCase().includes(q)) return false;
    return true;
  });

  const catName = cat ? categories.find((c) => c.slug === cat)?.name : null;

  return (
    <div className="container-eleva pt-6">
      <nav className="text-xs text-[color:var(--color-muted)] flex items-center gap-1.5">
        <Link href="/" className="hover:text-[color:var(--color-brand)]">Inicio</Link>
        <ChevronRight size={12} />
        <Link href="/catalogo" className="hover:text-[color:var(--color-brand)]">Catálogo</Link>
        {catName && (
          <>
            <ChevronRight size={12} />
            <span className="text-[color:var(--color-ink-soft)]">{catName}</span>
          </>
        )}
      </nav>

      <div className="flex items-end justify-between mt-3 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">{catName || "Catálogo"}</h1>
          <p className="text-sm text-[color:var(--color-muted)] mt-1">{filtered.length} productos</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <FiltersSidebar />
        <div className="flex-1 min-w-0">
          <CatalogGrid products={filtered} />
        </div>
      </div>
    </div>
  );
}
