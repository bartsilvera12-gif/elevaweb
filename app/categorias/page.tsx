import Link from "next/link";
import { categories } from "@/lib/mock-products";

export default function CategoriasPage() {
  return (
    <div className="container-eleva pt-8">
      <div className="text-xs font-bold tracking-widest uppercase text-[color:var(--color-accent)]">Explorá</div>
      <h1 className="text-3xl md:text-4xl font-extrabold mt-1">Todas las categorías</h1>
      <p className="text-sm text-[color:var(--color-ink-soft)] mt-2 max-w-xl">
        Elegí una categoría para ver los productos de nuestros emprendedores.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/catalogo?cat=${c.slug}`}
            className="card-flat p-5 flex items-center gap-4 hover:border-[color:var(--color-accent)] hover:shadow-md transition"
          >
            <span className="text-4xl leading-none">{c.icon}</span>
            <div className="min-w-0">
              <div className="font-bold text-[color:var(--color-brand)] truncate">{c.name}</div>
              <div className="text-xs text-[color:var(--color-muted)] mt-0.5">{c.count} productos</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
