"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { products as mockProducts } from "@/lib/mock-products";
import { useSeller } from "@/lib/seller-store";
import { useHydrated } from "@/lib/store";
import { formatGs } from "@/lib/utils";
import { Plus, Search, MoreHorizontal, Pencil, Trash2, Eye, EyeOff } from "lucide-react";

export default function AdminProductos() {
  const hydrated = useHydrated();
  const sellerProducts = useSeller((s) => s.products);
  const remove = useSeller((s) => s.remove);
  const update = useSeller((s) => s.update);
  const [q, setQ] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const combined = [
    ...sellerProducts.map((p) => ({ ...p, isSeller: true })),
    ...mockProducts.map((p) => ({ ...p, isSeller: false, active: true, description: "", created_at: "" })),
  ].filter((p) => {
    if (!q) return true;
    return p.name.toLowerCase().includes(q.toLowerCase()) || p.category.toLowerCase().includes(q.toLowerCase());
  });

  return (
    <div>
      <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">Productos</h1>
          <p className="text-sm text-[color:var(--color-muted)] mt-1">{combined.length} productos en el catálogo</p>
        </div>
        <Link href="/vendedor/productos/nuevo" className="btn-primary"><Plus size={16} /> Nuevo producto</Link>
      </div>

      <div className="card-flat p-3 mb-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--color-muted)]" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar producto o categoría…" className="w-full pl-9 pr-3 py-2 text-sm border border-[color:var(--color-line)] rounded focus:outline-none focus:border-[color:var(--color-brand)]" />
        </div>
      </div>

      <div className="card-flat overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[color:var(--color-line-soft)] text-[color:var(--color-ink-soft)] uppercase text-[11px] tracking-wider">
              <th className="text-left px-4 py-3 font-bold">Producto</th>
              <th className="text-left px-4 py-3 font-bold hidden md:table-cell">Categoría</th>
              <th className="text-right px-4 py-3 font-bold">Precio</th>
              <th className="text-right px-4 py-3 font-bold hidden md:table-cell">Stock</th>
              <th className="text-right px-4 py-3 font-bold">Estado</th>
              <th className="w-10 px-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[color:var(--color-line-soft)]">
            {combined.map((p) => (
              <tr key={p.slug} className="hover:bg-[color:var(--color-line-soft)]/40">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-11 h-11 rounded overflow-hidden bg-[color:var(--color-line-soft)] shrink-0">
                      {p.image && (p.image.startsWith("data:") ? (
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <Image src={p.image} alt={p.name} fill sizes="44px" className="object-cover" />
                      ))}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-[color:var(--color-brand)] line-clamp-1 flex items-center gap-2">
                        {p.name}
                        {hydrated && p.isSeller && <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-[color:var(--color-accent)]/10 text-[color:var(--color-accent)]">TUYO</span>}
                      </div>
                      <div className="text-[11px] text-[color:var(--color-muted)]">/{p.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell capitalize text-[color:var(--color-ink-soft)]">{p.category}</td>
                <td className="px-4 py-3 text-right font-semibold">{formatGs(p.price_cents)}</td>
                <td className="px-4 py-3 text-right hidden md:table-cell text-[color:var(--color-ink-soft)]">{"stock" in p ? p.stock : p.in_stock ? "∞" : 0}</td>
                <td className="px-4 py-3 text-right">
                  <span className={"inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded " + (p.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600")}>
                    {p.active ? "Activo" : "Pausado"}
                  </span>
                </td>
                <td className="px-2 py-3 text-right relative">
                  <button onClick={() => setOpenMenu(openMenu === p.slug ? null : p.slug)} className="p-1.5 rounded hover:bg-[color:var(--color-line-soft)] text-[color:var(--color-muted)]"><MoreHorizontal size={16} /></button>
                  {hydrated && openMenu === p.slug && (
                    <>
                      <div className="fixed inset-0 z-20" onClick={() => setOpenMenu(null)} />
                      <div className="absolute right-2 top-10 z-30 bg-white border border-[color:var(--color-line)] rounded shadow-xl w-44 py-1 text-left">
                        <Link href={`/producto/${p.slug}`} target="_blank" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-[color:var(--color-line-soft)]"><Eye size={14} /> Ver en tienda</Link>
                        {p.isSeller && (
                          <>
                            <Link href={`/vendedor/productos/${p.slug}`} onClick={() => setOpenMenu(null)} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-[color:var(--color-line-soft)]"><Pencil size={14} /> Editar</Link>
                            <button onClick={() => { update(p.slug, { active: !p.active }); setOpenMenu(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-[color:var(--color-line-soft)]">
                              {p.active ? <><EyeOff size={14} /> Pausar</> : <><Eye size={14} /> Activar</>}
                            </button>
                            <button onClick={() => { if (confirm(`¿Eliminar "${p.name}"?`)) { remove(p.slug); setOpenMenu(null); } }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"><Trash2 size={14} /> Eliminar</button>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
