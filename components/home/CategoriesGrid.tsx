import Link from "next/link";
import { categories } from "@/lib/mock-products";

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
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {categories.slice(0, 12).map((c) => (
          <Link
            key={c.slug}
            href={`/catalogo?cat=${c.slug}`}
            className="card-flat px-3 py-4 flex flex-col items-center gap-2 hover:border-[color:var(--color-accent)] hover:shadow-md transition"
          >
            <span className="text-3xl leading-none">{c.icon}</span>
            <span className="text-xs font-semibold text-center text-[color:var(--color-ink)]">{c.name}</span>
            <span className="text-[10px] text-[color:var(--color-muted)]">{c.count} productos</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
