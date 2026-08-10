import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { formatGs } from "@/lib/utils";
import type { FullProduct } from "@/lib/mock-products";

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
      {products.map((p) => (
        <Link key={p.slug} href={`/producto/${p.slug}`} className="card-flat hover:shadow-md transition-shadow flex flex-col">
          <div className="relative aspect-[4/3] bg-gradient-to-br from-[#F1EAFB] via-[#E3D0F5] to-[#FFD9C2] flex items-center justify-center text-[color:var(--color-brand)]/60 text-sm px-3 text-center">
            {p.discPct ? (
              <span className="absolute top-2.5 left-2.5 bg-[color:var(--color-accent)] text-white font-extrabold text-xs px-2 py-1 rounded">-{p.discPct}%</span>
            ) : null}
            {p.badge === "nuevo" && (
              <span className="absolute top-2.5 left-2.5 bg-[color:var(--color-brand)] text-white font-bold text-[11px] px-2 py-1 rounded uppercase">Nuevo</span>
            )}
            {p.badge === "masvendido" && (
              <span className="absolute top-2.5 left-2.5 bg-white text-[color:var(--color-brand)] font-bold text-[11px] px-2 py-1 rounded uppercase border">Más vendido</span>
            )}
            <span className="font-medium">{p.name}</span>
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
            <button className="btn-dark w-full justify-center mt-2 text-sm">
              <ShoppingCart size={16} /> Agregar
            </button>
          </div>
        </Link>
      ))}
    </div>
  );
}
