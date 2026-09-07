"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useMyProducts } from "@/lib/hooks/use-products";
import { createClient } from "@/lib/supabase/client";
import { formatGs } from "@/lib/utils";
import { Plus, Search, MoreHorizontal, Pencil, Trash2, Eye, EyeOff, AlertTriangle, Loader2 } from "lucide-react";

export default function VendedorProductos() {
  const { products, loading, refresh } = useMyProducts();
  const [q, setQ] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const filtered = products.filter((p) => !q || p.name.toLowerCase().includes(q.toLowerCase()) || (p.category || "").toLowerCase().includes(q.toLowerCase()));

  const toggle = async (slug: string, active: boolean) => {
    await createClient().from("products").update({ active }).eq("slug", slug);
    setOpenMenu(null);
    refresh();
  };

  const remove = async (slug: string, name: string) => {
    if (!confirm(`¿Eliminar "${name}"?`)) return;
    await createClient().from("products").delete().eq("slug", slug);
    setOpenMenu(null);
    refresh();
  };

  return (
    <div>
      <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">Productos</h1>
          <p className="text-sm text-[color:var(--color-muted)] mt-1">{filtered.length} productos tuyos publicados</p>
        </div>
        <Link href="/vendedor/productos/nuevo" className="btn-primary"><Plus size={16} /> Nuevo producto</Link>
      </div>

      <div className="card-flat p-3 mb-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--color-muted)]" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar producto o categoría…" className="w-full pl-9 pr-3 py-2 text-sm border border-[color:var(--color-line)] rounded focus:outline-none focus:border-[color:var(--color-brand)]" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12 text-[color:var(--color-muted)]"><Loader2 size={20} className="animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="card-flat p-10 text-center">
          <p className="text-[color:var(--color-ink-soft)]">Todavía no publicaste productos.</p>
          <Link href="/vendedor/productos/nuevo" className="btn-primary mt-4 inline-flex">Crear primero</Link>
        </div>
      ) : (
        <div className="card-flat overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[color:var(--color-line-soft)] text-[color:var(--color-ink-soft)] uppercase text-[11px] tracking-wider">
                <th className="text-left px-4 py-3 font-bold">Producto</th>
                <th className="text-left px-4 py-3 font-bold hidden md:table-cell">Categoría</th>
                <th className="text-right px-4 py-3 font-bold">Precio</th>
                <th className="text-right px-4 py-3 font-bold hidden md:table-cell">Stock</th>
                <th className="text-left px-4 py-3 font-bold hidden lg:table-cell">Ubicación</th>
                <th className="text-right px-4 py-3 font-bold">Estado</th>
                <th className="w-10 px-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[color:var(--color-line-soft)]">
              {filtered.map((p) => {
                const lowStock = p.stock_minimo > 0 && p.stock <= p.stock_minimo;
                return (
                  <tr key={p.slug} className="hover:bg-[color:var(--color-line-soft)]/40">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-11 h-11 rounded overflow-hidden bg-[color:var(--color-line-soft)] shrink-0">
                          {p.image_url && (p.image_url.startsWith("data:") ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" /> : <Image src={p.image_url} alt={p.name} fill sizes="44px" className="object-cover" />)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-[color:var(--color-brand)] line-clamp-1">{p.name}</div>
                          <div className="text-[11px] text-[color:var(--color-muted)]">/{p.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell capitalize text-[color:var(--color-ink-soft)]">{p.category}</td>
                    <td className="px-4 py-3 text-right font-semibold">{formatGs(p.price_cents)}</td>
                    <td className="px-4 py-3 text-right hidden md:table-cell">
                      <span className={lowStock ? "text-yellow-700 font-bold flex items-center gap-1 justify-end" : "text-[color:var(--color-ink-soft)]"}>
                        {lowStock && <AlertTriangle size={12} />}
                        {p.stock} {p.unit}
                      </span>
                      {p.stock_minimo > 0 && <div className="text-[10px] text-[color:var(--color-muted)]">mín {p.stock_minimo}</div>}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-xs text-[color:var(--color-muted)]">{p.ubicacion || "—"}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={"inline-flex text-xs font-semibold px-2 py-0.5 rounded " + (p.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600")}>{p.active ? "Activo" : "Pausado"}</span>
                    </td>
                    <td className="px-2 py-3 text-right relative">
                      <button onClick={() => setOpenMenu(openMenu === p.slug ? null : p.slug)} className="p-1.5 rounded hover:bg-[color:var(--color-line-soft)] text-[color:var(--color-muted)]"><MoreHorizontal size={16} /></button>
                      {openMenu === p.slug && (
                        <>
                          <div className="fixed inset-0 z-20" onClick={() => setOpenMenu(null)} />
                          <div className="absolute right-2 top-10 z-30 bg-white border border-[color:var(--color-line)] rounded shadow-xl w-44 py-1 text-left">
                            <Link href={`/producto?slug=${p.slug}`} target="_blank" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-[color:var(--color-line-soft)]"><Eye size={14} /> Ver en tienda</Link>
                            <Link href={`/vendedor/productos/editar?slug=${p.slug}`} onClick={() => setOpenMenu(null)} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-[color:var(--color-line-soft)]"><Pencil size={14} /> Editar</Link>
                            <button onClick={() => toggle(p.slug, !p.active)} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-[color:var(--color-line-soft)]">
                              {p.active ? <><EyeOff size={14} /> Pausar</> : <><Eye size={14} /> Activar</>}
                            </button>
                            <button onClick={() => remove(p.slug, p.name)} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"><Trash2 size={14} /> Eliminar</button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
