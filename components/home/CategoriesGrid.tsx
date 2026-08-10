import Link from "next/link";
import Image from "next/image";
import { categories } from "@/lib/mock-products";
import { categoryIcon } from "@/lib/category-icons";

export default function CategoriesGrid() {
  return (
    <section className="container-eleva pt-12">
      <div className="flex items-end justify-between mb-6">
        <div>
          <div className="text-xs font-bold tracking-widest uppercase text-[color:var(--color-accent)]">Explorá</div>
          <h2 className="text-2xl md:text-3xl font-extrabold mt-1">Categorías</h2>
        </div>
        <Link href="/categorias" className="text-sm font-semibold text-[color:var(--color-brand)] hover:text-[color:var(--color-accent)]">Ver todas</Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {categories.slice(0, 6).map((c) => {
          const Icon = categoryIcon(c.slug);
          return (
            <Link
              key={c.slug}
              href={`/catalogo?cat=${c.slug}`}
              className="card-flat overflow-hidden hover:shadow-md hover:border-[color:var(--color-accent)] transition"
            >
              <div className="relative aspect-[4/3] bg-[color:var(--color-line-soft)]">
                <Image src={c.image} alt={c.name} fill sizes="(max-width:768px) 50vw, 16vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <span className="absolute top-2 left-2 w-8 h-8 rounded bg-white/95 flex items-center justify-center text-[color:var(--color-brand)]">
                  <Icon size={16} />
                </span>
              </div>
              <div className="p-3">
                <div className="text-sm font-bold text-[color:var(--color-brand)] truncate">{c.name}</div>
                <div className="text-[11px] text-[color:var(--color-muted)] mt-0.5">{c.count} productos</div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
