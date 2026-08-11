"use client";
import Image from "next/image";
import { categories } from "@/lib/mock-products";
import { categoryIcon } from "@/lib/category-icons";
import { Pencil, Plus } from "lucide-react";

export default function AdminCategorias() {
  return (
    <div>
      <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">Categorías</h1>
          <p className="text-sm text-[color:var(--color-muted)] mt-1">{categories.length} categorías en el catálogo</p>
        </div>
        <button className="btn-primary"><Plus size={16} /> Nueva categoría</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {categories.map((c) => {
          const Icon = categoryIcon(c.slug);
          return (
            <div key={c.slug} className="card-flat overflow-hidden">
              <div className="relative aspect-[4/3] bg-[color:var(--color-line-soft)]">
                <Image src={c.image} alt={c.name} fill sizes="(max-width:768px) 50vw, 33vw" className="object-cover" />
                <span className="absolute top-2 left-2 w-8 h-8 rounded bg-white/95 text-[color:var(--color-brand)] flex items-center justify-center">
                  <Icon size={16} />
                </span>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <div className="font-bold text-[color:var(--color-brand)] truncate">{c.name}</div>
                    <div className="text-[11px] text-[color:var(--color-muted)] mt-0.5">/{c.slug} · {c.count} productos</div>
                  </div>
                  <button className="p-1.5 rounded hover:bg-[color:var(--color-line-soft)] text-[color:var(--color-muted)]"><Pencil size={14} /></button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
