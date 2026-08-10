import Link from "next/link";
import { popularSearches } from "@/lib/popular";

const letters = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");

export default function PopularProducts() {
  return (
    <section className="bg-white border-t border-[color:var(--color-line)]">
      <div className="container-eleva py-10">
        <h3 className="font-bold text-sm text-[color:var(--color-brand-900)] mb-4">Productos más buscados</h3>
        <p className="text-[13px] text-[color:var(--color-ink-soft)] leading-relaxed">
          {popularSearches.map((term, i) => (
            <span key={term}>
              <Link href={`/catalogo?q=${encodeURIComponent(term)}`} className="text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-accent)] hover:underline">
                {term}
              </Link>
              {i < popularSearches.length - 1 && <span className="text-[color:var(--color-muted)]"> · </span>}
            </span>
          ))}
        </p>

        <h3 className="font-bold text-sm text-[color:var(--color-brand-900)] mt-8 mb-3">Buscar productos por letra inicial</h3>
        <div className="flex flex-wrap gap-x-2 gap-y-1.5 text-sm">
          {letters.map((l, i) => (
            <span key={l} className="flex items-center gap-2">
              <Link href={`/catalogo?letter=${l}`} className="text-[color:var(--color-brand)] font-semibold hover:text-[color:var(--color-accent)] hover:underline">
                {l}
              </Link>
              {i < letters.length - 1 && <span className="text-[color:var(--color-muted)]">-</span>}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
