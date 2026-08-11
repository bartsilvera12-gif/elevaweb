"use client";
import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatGs } from "@/lib/utils";
import { useProduct, useProducts } from "@/lib/hooks/use-products";
import { Shield, Truck, ChevronRight, Store, Loader2 } from "lucide-react";
import CatalogGrid from "@/components/catalog/CatalogGrid";
import ProductActions from "@/components/product/ProductActions";
import { categories as staticCategories } from "@/lib/mock-products";
import { products as fallbackProducts } from "@/lib/mock-products";

export function generateStaticParams() {
  return fallbackProducts.map((p) => ({ slug: p.slug }));
}

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { product: p, loading } = useProduct(slug);
  const { products: related } = useProducts({ category: p?.category, onlyStock: false });

  if (loading) {
    return (
      <div className="container-eleva pt-16 flex justify-center min-h-[400px] items-center text-[color:var(--color-muted)]">
        <Loader2 size={20} className="animate-spin" />
      </div>
    );
  }
  if (!p) {
    return (
      <div className="container-eleva pt-16">
        <h1 className="text-2xl font-extrabold">Producto no encontrado</h1>
        <Link href="/catalogo" className="btn-primary mt-6 inline-flex">Ir al catálogo</Link>
      </div>
    );
  }

  const catName = staticCategories.find((c) => c.slug === p.category)?.name || p.category;
  const relatedFiltered = related.filter((x) => x.slug !== p.slug).slice(0, 3);
  const lowStock = p.stock > 0 && p.stock <= (p.stock_minimo || 0);

  return (
    <div className="container-eleva pt-6">
      <nav className="text-xs text-[color:var(--color-muted)] flex items-center gap-1.5 mb-4">
        <Link href="/" className="hover:text-[color:var(--color-brand)]">Inicio</Link>
        <ChevronRight size={12} />
        <Link href="/catalogo" className="hover:text-[color:var(--color-brand)]">Catálogo</Link>
        <ChevronRight size={12} />
        <Link href={`/catalogo?cat=${p.category}`} className="hover:text-[color:var(--color-brand)] capitalize">{catName}</Link>
        <ChevronRight size={12} />
        <span className="text-[color:var(--color-ink-soft)] line-clamp-1">{p.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="flex flex-col gap-3">
          <div className="relative aspect-square rounded overflow-hidden bg-[color:var(--color-line-soft)]">
            {p.image_url && <Image src={p.image_url} alt={p.name} fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover" priority />}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="text-xs text-[color:var(--color-muted)] flex items-center gap-3">
            <span>★ {p.rating?.toFixed(1) ?? "-"} · {p.sold ?? 0} vendidos</span>
            {p.badge === "nuevo" && <span className="bg-[color:var(--color-brand)] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">Nuevo</span>}
            {p.badge === "masvendido" && <span className="bg-white text-[color:var(--color-brand)] text-[10px] font-bold px-2 py-0.5 rounded uppercase border">Más vendido</span>}
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">{p.name}</h1>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl md:text-4xl font-extrabold text-[color:var(--color-brand)]">{formatGs(p.price_cents)}</span>
            {p.compare_cents && p.compare_cents > p.price_cents && (
              <>
                <span className="text-base text-[color:var(--color-muted)] line-through">{formatGs(p.compare_cents)}</span>
                <span className="bg-[color:var(--color-accent)] text-white text-xs font-extrabold px-2 py-1 rounded">-{p.disc_pct}%</span>
              </>
            )}
          </div>

          <div className="text-xs text-[color:var(--color-muted)]">
            {p.stock > 0 ? (
              <span className={lowStock ? "text-[color:var(--color-accent)] font-semibold" : ""}>
                {lowStock ? `Últimas ${p.stock} ${p.unit}` : `Disponible · ${p.stock} ${p.unit}`}
              </span>
            ) : (
              <span className="text-red-600 font-semibold">Sin stock</span>
            )}
          </div>

          <div className="text-sm text-[color:var(--color-ink-soft)] flex items-center gap-2">
            <Store size={16} className="text-[color:var(--color-accent)]" />
            Vendido por <strong className="text-[color:var(--color-brand)]">Emprendedor ELEVA</strong>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-2">
            <div className="card-flat p-3 flex items-center gap-2 text-sm text-[color:var(--color-ink-soft)]">
              <Truck size={16} className="text-[color:var(--color-accent)]" /> Entrega coordinada
            </div>
            <div className="card-flat p-3 flex items-center gap-2 text-sm text-[color:var(--color-ink-soft)]">
              <Shield size={16} className="text-[color:var(--color-accent)]" /> Pago protegido
            </div>
          </div>

          <ProductActions p={{
            slug: p.slug,
            name: p.name,
            price_cents: p.price_cents,
            image: p.image_url ?? "",
            category: p.category,
            variants: undefined,
          }} />

          {p.description && (
            <div className="card-flat p-5 mt-2">
              <h3 className="font-bold text-sm uppercase tracking-wider text-[color:var(--color-brand)] mb-2">Descripción</h3>
              <p className="text-sm text-[color:var(--color-ink-soft)] whitespace-pre-line">{p.description}</p>
            </div>
          )}
        </div>
      </div>

      {relatedFiltered.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-extrabold mb-4">También te puede interesar</h2>
          <CatalogGrid products={relatedFiltered.map((x) => ({
            slug: x.slug,
            name: x.name,
            price_cents: x.price_cents,
            compare_cents: x.compare_cents ?? undefined,
            rating: x.rating ?? undefined,
            sold: x.sold,
            badge: x.badge,
            discPct: x.disc_pct ?? undefined,
            in_stock: x.stock > 0,
            image: x.image_url ?? "",
            category: x.category,
          }))} />
        </section>
      )}
    </div>
  );
}
