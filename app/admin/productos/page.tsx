"use client";
import Image from "next/image";
import { products } from "@/lib/mock-products";
import { formatGs } from "@/lib/utils";
import { Plus, Pencil, MoreHorizontal } from "lucide-react";

export default function AdminProductos() {
  return (
    <div>
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">Productos</h1>
          <p className="text-sm text-[color:var(--color-muted)] mt-1">{products.length} productos en el catálogo</p>
        </div>
        <button className="btn-primary"><Plus size={16} /> Nuevo producto</button>
      </div>

      <div className="card-flat overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[color:var(--color-line-soft)] text-[color:var(--color-ink-soft)] uppercase text-[11px] tracking-wider">
              <th className="text-left px-4 py-3 font-bold">Producto</th>
              <th className="text-left px-4 py-3 font-bold hidden md:table-cell">Categoría</th>
              <th className="text-right px-4 py-3 font-bold">Precio</th>
              <th className="text-right px-4 py-3 font-bold hidden md:table-cell">Vendidos</th>
              <th className="text-right px-4 py-3 font-bold">Stock</th>
              <th className="w-10 px-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[color:var(--color-line-soft)]">
            {products.map((p) => (
              <tr key={p.slug} className="hover:bg-[color:var(--color-line-soft)]/40">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-11 h-11 rounded overflow-hidden bg-[color:var(--color-line-soft)] shrink-0">
                      <Image src={p.image} alt={p.name} fill sizes="44px" className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-[color:var(--color-brand)] line-clamp-1">{p.name}</div>
                      <div className="text-[11px] text-[color:var(--color-muted)]">/{p.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell capitalize text-[color:var(--color-ink-soft)]">{p.category}</td>
                <td className="px-4 py-3 text-right font-semibold">{formatGs(p.price_cents)}</td>
                <td className="px-4 py-3 text-right hidden md:table-cell text-[color:var(--color-ink-soft)]">{p.sold ?? 0}</td>
                <td className="px-4 py-3 text-right">
                  <span className={"inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded " + (p.in_stock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800")}>
                    {p.in_stock ? "Activo" : "Sin stock"}
                  </span>
                </td>
                <td className="px-2 py-3 text-right">
                  <button className="p-1.5 rounded hover:bg-[color:var(--color-line-soft)] text-[color:var(--color-muted)]"><MoreHorizontal size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
