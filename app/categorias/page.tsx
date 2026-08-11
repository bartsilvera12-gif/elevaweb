"use client";
import Link from "next/link";
import Image from "next/image";
import { useCategoriesWithCounts } from "@/lib/hooks/use-categories";
import { categoryIcon } from "@/lib/category-icons";

export default function CategoriasPage() {
  const { categories } = useCategoriesWithCounts();

  return (
    <div className="container-eleva pt-8">
      <h1 className="text-3xl md:text-4xl font-extrabold">Todas las categorías</h1>
      <p className="text-sm text-[color:var(--color-ink-soft)] mt-2 max-w-xl">
        Elegí una categoría para ver los productos de nuestros emprendedores.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        {categories.map((c) => {
          const Icon = categoryIcon(c.slug);
          return (
            <Link key={c.slug} href={`/catalogo?cat=${c.slug}`} className="card-flat overflow-hidden hover:border-[color:var(--color-accent)] hover:shadow-md transition">
              <div className="relative aspect-[4/3] bg-[color:var(--color-line-soft)]">
                <Image src={c.image} alt={c.name} fill sizes="(max-width:768px) 50vw, 25vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <span className="absolute top-3 left-3 w-10 h-10 rounded bg-white/95 flex items-center justify-center text-[color:var(--color-brand)]">
                  <Icon size={20} />
                </span>
              </div>
              <div className="p-4">
                <div className="font-bold text-[color:var(--color-brand)]">{c.name}</div>
                <div className="text-xs text-[color:var(--color-muted)] mt-0.5">{c.count} productos</div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
