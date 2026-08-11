import Link from "next/link";
import { brands } from "@/lib/mock-products";

export default function BrandsSection() {
  return (
    <section className="container-eleva pt-12">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold">Marcas que ya están en ELEVA</h2>
        </div>
        <Link href="/catalogo" className="text-sm font-semibold text-[color:var(--color-brand)] hover:text-[color:var(--color-accent)]">Ver productos</Link>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {brands.map((b) => {
          const bigger = ["samsung", "sony", "panasonic", "lenovo"].includes(b.slug);
          return (
            <Link
              key={b.slug}
              href={`/catalogo?q=${b.slug}`}
              className="card-flat aspect-[4/3] flex items-center justify-center p-5 hover:border-[color:var(--color-accent)] hover:shadow-md transition"
            >
              {}
              <img
                src={`https://cdn.simpleicons.org/${b.slug}/240453`}
                alt={b.name}
                className={`${bigger ? "max-h-14" : "max-h-10"} w-auto opacity-80 hover:opacity-100 transition`}
                loading="lazy"
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
