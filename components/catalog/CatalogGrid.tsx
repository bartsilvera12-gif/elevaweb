import Link from "next/link";
import Image from "next/image";
import { formatGs } from "@/lib/utils";
import type { FullProduct } from "@/lib/mock-products";
import FavoriteButton from "@/components/product/FavoriteButton";
import AddToCartButton from "@/components/product/AddToCartButton";

export default function CatalogGrid({ products }: { products: FullProduct[] }) {
  if (!products.length) {
    return (
      <div className="card-flat p-10 text-center text-[color:var(--color-ink-soft)]">
        No encontramos productos con esos filtros.
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {products.map((p) => {
        const hasVariants = !!p.variants;
        return (
          <Link key={p.slug} href={`/producto/${p.slug}`} className="card-flat hover:shadow-md transition-shadow flex flex-col overflow-hidden group">
            <div className="relative aspect-[4/3] bg-[color:var(--color-line-soft)]">
              <Image src={p.image} alt={p.name} fill sizes="(max-width:768px) 50vw, 33vw" className="object-cover" />
              {p.discPct ? (
                <span className="absolute top-2.5 left-2.5 bg-[color:var(--color-accent)] text-white font-extrabold text-xs px-2 py-1 rounded z-10">-{p.discPct}%</span>
              ) : null}
              {p.badge === "nuevo" && !p.discPct && (
                <span className="absolute top-2.5 left-2.5 bg-[color:var(--color-brand)] text-white font-bold text-[11px] px-2 py-1 rounded uppercase z-10">Nuevo</span>
              )}
              {p.badge === "masvendido" && !p.discPct && (
                <span className="absolute top-2.5 left-2.5 bg-white text-[color:var(--color-brand)] font-bold text-[11px] px-2 py-1 rounded uppercase border z-10">Más vendido</span>
              )}
              <FavoriteButton slug={p.slug} floating />
            </div>
            <div className="p-3.5 flex flex-col gap-1.5">
              {p.rating != null && (
                <div className="text-xs text-[color:var(--color-muted)]">★ {p.rating.toFixed(1)} · {p.sold ?? 0} vendidos</div>
              )}
              <div className="font-semibold text-sm line-clamp-2">{p.name}</div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-extrabold text-lg text-[color:var(--color-brand)]">{formatGs(p.price_cents)}</span>
                {p.compare_cents && p.compare_cents > p.price_cents && (
                  <span className="text-xs text-[color:var(--color-muted)] line-through">{formatGs(p.compare_cents)}</span>
                )}
              </div>
              {hasVariants ? (
                <Link href={`/producto/${p.slug}`} className="btn-dark w-full justify-center mt-2 text-sm">Elegir opciones</Link>
              ) : (
                <AddToCartButton slug={p.slug} name={p.name} price_cents={p.price_cents} image={p.image} className="mt-2" />
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
