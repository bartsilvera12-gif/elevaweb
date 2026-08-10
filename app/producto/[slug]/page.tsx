import Link from "next/link";
import { notFound } from "next/navigation";
import { formatGs } from "@/lib/utils";
import { products } from "@/lib/mock-products";
import { ShoppingCart, Heart, Shield, Truck, ChevronRight, Store } from "lucide-react";
import CatalogGrid from "@/components/catalog/CatalogGrid";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = products.find((x) => x.slug === slug);
  if (!p) notFound();
  const related = products.filter((x) => x.category === p.category && x.slug !== p.slug).slice(0, 3);

  return (
    <div className="container-eleva pt-6">
      <nav className="text-xs text-[color:var(--color-muted)] flex items-center gap-1.5 mb-4">
        <Link href="/" className="hover:text-[color:var(--color-brand)]">Inicio</Link>
        <ChevronRight size={12} />
        <Link href="/catalogo" className="hover:text-[color:var(--color-brand)]">Catálogo</Link>
        <ChevronRight size={12} />
        <Link href={`/catalogo?cat=${p.category}`} className="hover:text-[color:var(--color-brand)] capitalize">{p.category}</Link>
        <ChevronRight size={12} />
        <span className="text-[color:var(--color-ink-soft)] line-clamp-1">{p.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="flex flex-col gap-3">
          <div className="aspect-square bg-gradient-to-br from-[#F1EAFB] via-[#E3D0F5] to-[#FFD9C2] rounded flex items-center justify-center text-[color:var(--color-brand)]/60 px-6 text-center">
            {p.name}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square bg-[color:var(--color-line-soft)] rounded border border-[color:var(--color-line)]" />
            ))}
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
                <span className="bg-[color:var(--color-accent)] text-white text-xs font-extrabold px-2 py-1 rounded">-{p.discPct}%</span>
              </>
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

          <div className="flex gap-2 mt-4">
            <button className="btn-primary flex-1 justify-center"><ShoppingCart size={18} /> Agregar al carrito</button>
            <button className="btn-outline" aria-label="Favorito"><Heart size={18} /></button>
          </div>

          <div className="card-flat p-5 mt-2">
            <h3 className="font-bold text-sm uppercase tracking-wider text-[color:var(--color-brand)] mb-2">Descripción</h3>
            <p className="text-sm text-[color:var(--color-ink-soft)]">
              {p.name}. Producto seleccionado por nuestro equipo. Envío coordinado a todo el país. Consultas por WhatsApp.
            </p>
          </div>

          <div className="card-flat p-5">
            <h3 className="font-bold text-sm uppercase tracking-wider text-[color:var(--color-brand)] mb-3">Detalles</h3>
            <dl className="text-sm divide-y divide-[color:var(--color-line-soft)]">
              <Row k="Categoría" v={p.category} />
              <Row k="Stock" v={p.in_stock ? "Disponible" : "Sin stock"} />
              <Row k="Rating" v={`${p.rating?.toFixed(1) ?? "-"} / 5`} />
              <Row k="Unidades vendidas" v={String(p.sold ?? 0)} />
            </dl>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-extrabold mb-4">También te puede interesar</h2>
          <CatalogGrid products={related} />
        </section>
      )}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4 py-2.5">
      <dt className="text-[color:var(--color-muted)]">{k}</dt>
      <dd className="text-[color:var(--color-ink)] font-medium capitalize">{v}</dd>
    </div>
  );
}
