"use client";
import Link from "next/link";
import Image from "next/image";
import { formatGs } from "@/lib/utils";
import { useProducts } from "@/lib/hooks/use-products";
import { useFavorites, useHydrated } from "@/lib/store";
import FavoriteButton from "@/components/product/FavoriteButton";
import AddToCartButton from "@/components/product/AddToCartButton";
import { Heart, Loader2 } from "lucide-react";

export default function FavoritosPage() {
  const hydrated = useHydrated();
  const slugs = useFavorites((s) => s.slugs);
  const { products, loading } = useProducts({});
  const items = products.filter((p) => slugs.includes(p.slug));

  if (!hydrated || loading) return <div className="container-eleva pt-16 flex justify-center min-h-[400px] items-center text-[color:var(--color-muted)]"><Loader2 size={20} className="animate-spin" /></div>;

  return (
    <div className="container-eleva pt-6">
      <h1 className="text-3xl font-extrabold">Tus favoritos</h1>
      <p className="text-sm text-[color:var(--color-muted)] mt-1">{items.length} {items.length === 1 ? "producto" : "productos"} guardados</p>

      {!items.length ? (
        <div className="mt-8 card-flat p-10 text-center">
          <Heart size={48} className="mx-auto text-[color:var(--color-brand-200)]" />
          <p className="mt-4 text-[color:var(--color-ink-soft)]">Todavía no tenés favoritos.</p>
          <Link href="/catalogo" className="btn-primary mt-6 inline-flex">Ir al catálogo</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {items.map((p) => (
            <Link key={p.slug} href={`/producto/${p.slug}/`} className="card-flat hover:shadow-md transition-shadow flex flex-col overflow-hidden">
              <div className="relative aspect-[4/3] bg-[color:var(--color-line-soft)]">
                {p.image_url && <Image src={p.image_url} alt={p.name} fill sizes="(max-width:768px) 50vw, 25vw" className="object-cover" />}
                <FavoriteButton slug={p.slug} floating />
              </div>
              <div className="p-3.5 flex flex-col gap-1.5">
                <div className="font-semibold text-sm line-clamp-2">{p.name}</div>
                <div className="font-extrabold text-lg text-[color:var(--color-brand)]">{formatGs(p.price_cents)}</div>
                <AddToCartButton slug={p.slug} name={p.name} price_cents={p.price_cents} image={p.image_url ?? ""} className="mt-2" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
