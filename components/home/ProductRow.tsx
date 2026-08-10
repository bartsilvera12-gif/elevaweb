import Link from "next/link";
import { ChevronRight, ShoppingCart } from "lucide-react";
import { formatGs } from "@/lib/utils";

export interface ProductCard {
  slug: string;
  name: string;
  price_cents: number;
  compare_cents?: number;
  rating?: number;
  sold?: number;
  badge?: "nuevo" | "masvendido" | null;
  discPct?: number | null;
  in_stock?: boolean;
}

export default function ProductRow({ kicker, title, viewAllHref, products }: {
  kicker: string; title: string; viewAllHref: string; products: ProductCard[];
}) {
  return (
    <section className="container-eleva pt-12">
      <div className="flex items-end justify-between mb-6">
        <div>
          <div className="text-xs font-bold tracking-widest uppercase text-[color:var(--color-accent)]">{kicker}</div>
          <h2 className="text-2xl md:text-3xl font-extrabold mt-1">{title}</h2>
        </div>
        <Link href={viewAllHref} className="text-sm font-semibold text-[color:var(--color-brand)] hover:text-[color:var(--color-accent)] flex items-center gap-1">
          Ver todo <ChevronRight size={16} />
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((p) => <Card key={p.slug} p={p} />)}
      </div>
    </section>
  );
}

function Card({ p }: { p: ProductCard }) {
  return (
    <Link href={`/producto/${p.slug}`} className="card-flat hover:shadow-md transition-shadow flex flex-col">
      <div className="relative aspect-[4/3] bg-gradient-to-br from-[#F1EAFB] via-[#E3D0F5] to-[#FFD9C2] flex items-center justify-center text-[color:var(--color-brand)]/60 text-sm px-3 text-center">
        {p.discPct && (
          <span className="absolute top-2.5 left-2.5 bg-[color:var(--color-accent)] text-white font-extrabold text-xs px-2 py-1 rounded">
            -{p.discPct}%
          </span>
        )}
        {p.badge === "nuevo" && (
          <span className="absolute top-2.5 left-2.5 bg-[color:var(--color-brand)] text-white font-bold text-[11px] px-2 py-1 rounded uppercase">Nuevo</span>
        )}
        {p.badge === "masvendido" && (
          <span className="absolute top-2.5 left-2.5 bg-white text-[color:var(--color-brand)] font-bold text-[11px] px-2 py-1 rounded uppercase border">Más vendido</span>
        )}
        <span className="font-medium">{p.name}</span>
      </div>
      <div className="p-3.5 flex flex-col gap-1.5">
        {p.rating && (
          <div className="text-xs text-[color:var(--color-muted)]">
            ★ {p.rating.toFixed(1)} · {p.sold ?? 0} vendidos
          </div>
        )}
        <div className="font-semibold text-sm line-clamp-2 text-[color:var(--color-ink)]">{p.name}</div>
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
  );
}
