import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { formatGs } from "@/lib/utils";
import FavoriteButton from "@/components/product/FavoriteButton";
import AddToCartButton from "@/components/product/AddToCartButton";

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
  image?: string;
}

export default function ProductRow({ title, viewAllHref, products }: {
  title: string; viewAllHref: string; products: ProductCard[];
}) {
  if (!products.length) return null;
  return (
    <section className="container-eleva pt-12">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold">{title}</h2>
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
  const image = p.image || "";
  return (
    <Link href={`/producto?slug=${p.slug}`} className="card-flat hover:shadow-md transition-shadow flex flex-col overflow-hidden group">
      <div className="relative aspect-[4/3] bg-[color:var(--color-line-soft)]">
        {image && <Image src={image} alt={p.name} fill sizes="(max-width:768px) 50vw, 25vw" className="object-cover" />}
        {p.discPct && (
          <span className="absolute top-2.5 left-2.5 bg-[color:var(--color-accent)] text-white font-extrabold text-xs px-2 py-1 rounded z-10">-{p.discPct}%</span>
        )}
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
        <div className="font-semibold text-sm line-clamp-2 text-[color:var(--color-ink)]">{p.name}</div>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="font-extrabold text-lg text-[color:var(--color-brand)]">{formatGs(p.price_cents)}</span>
          {p.compare_cents && p.compare_cents > p.price_cents && (
            <span className="text-xs text-[color:var(--color-muted)] line-through">{formatGs(p.compare_cents)}</span>
          )}
        </div>
        <AddToCartButton slug={p.slug} name={p.name} price_cents={p.price_cents} image={image} className="mt-2" />
      </div>
    </Link>
  );
}
