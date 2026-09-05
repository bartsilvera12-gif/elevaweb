"use client";
import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useProducts } from "@/lib/hooks/use-products";
import { useSellers, useCategorias } from "@/lib/hooks/use-platform";
import { createClient } from "@/lib/supabase/client";
import { formatGs } from "@/lib/utils";
import { Search, Plus, Eye, Pencil, Trash2, Loader2, EyeOff } from "lucide-react";
import type { DBProduct } from "@/lib/types";

export default function AdminProductos() {
  const { products, loading } = useProducts({});
  const { sellers } = useSellers();
  const { categorias } = useCategorias();
  const [q, setQ] = useState("");
  const [sellerFilter, setSellerFilter] = useState<string>("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const nameOf = (id: string | null) => {
    if (!id) return "— sin dueño —";
    const s = sellers.find((x) => x.id === id);
    return s?.store_name || s?.name || id.slice(0, 8);
  };
  const catName = (slug: string) => categorias.find((c) => c.slug === slug)?.name || slug;

  const filtered = useMemo(() => products.filter((p) => {
    if (sellerFilter && p.seller_id !== sellerFilter) return false;
    if (q && !p.name.toLowerCase().includes(q.toLowerCase()) && !p.slug.includes(q.toLowerCase())) return false;
    return true;
  }), [products, q, sellerFilter]);

  const toggle = async (p: DBProduct) => {
    setBusy(p.slug);
    const { error } = await createClient().from("products").update({ active: !p.active }).eq("slug", p.slug);
    setBusy(null);
    setMsg(error ? error.message : p.active ? "Pausado" : "Activado");
    setTimeout(() => setMsg(null), 2500);
  };

  const remove = async (p: DBProduct) => {
    if (!confirm(`¿Eliminar "${p.name}"? No se puede deshacer.`)) return;
    setBusy(p.slug);
    const { error } = await createClient().from("products").delete().eq("slug", p.slug);
    setBusy(null);
    setMsg(error ? error.message : "Eliminado");
    setTimeout(() => setMsg(null), 2500);
  };

  if (loading) return <div className="flex justify-center py-12 text-[color:var(--color-muted)]"><Loader2 size={20} className="animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">Productos</h1>
          <p className="text-sm text-[color:var(--color-muted)] mt-1">
            {filtered.length} de {products.length} · vos cargás los productos por los emprendedores
          </p>
        </div>
        <Link href="/admin/productos/editar" className="btn-primary"><Plus size={16} /> Nuevo producto</Link>
      </div>

      {msg && <div className="mb-3 text-sm bg-[color:var(--color-brand-100)] border border-[color:var(--color-line)] rounded p-2">{msg}</div>}

      <div className="grid md:grid-cols-[1fr_260px] gap-3 mb-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--color-muted)]" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nombre o slug…" className="w-full pl-10 pr-3 py-2.5 text-sm border border-[color:var(--color-line)] rounded focus:outline-none focus:border-[color:var(--color-brand)]" />
        </div>
        <select value={sellerFilter} onChange={(e) => setSellerFilter(e.target.value)} className="border border-[color:var(--color-line)] rounded px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-[color:var(--color-brand)]">
          <option value="">Todos los emprendedores</option>
          {sellers.map((s) => <option key={s.id} value={s.id}>{s.store_name || s.name}</option>)}
        </select>
      </div>

      {!filtered.length ? (
        <div className="card-flat p-10 text-center text-sm text-[color:var(--color-ink-soft)]">
          Sin productos que coincidan.
        </div>
      ) : (
        <div className="card-flat overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[color:var(--color-line-soft)] text-[color:var(--color-ink-soft)] uppercase text-[11px] tracking-wider">
                <th className="text-left px-4 py-3 font-bold">Producto</th>
                <th className="text-left px-4 py-3 font-bold hidden md:table-cell">Emprendedor</th>
                <th className="text-right px-4 py-3 font-bold">Precio</th>
                <th className="text-right px-4 py-3 font-bold hidden lg:table-cell">Stock</th>
                <th className="text-right px-4 py-3 font-bold">Estado</th>
                <th className="w-24 px-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[color:var(--color-line-soft)]">
              {filtered.map((p) => (
                <tr key={p.slug} className="hover:bg-[color:var(--color-line-soft)]/40">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded overflow-hidden bg-[color:var(--color-line-soft)] shrink-0">
                        {p.image_url && (p.image_url.startsWith("data:")
                          ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                          : <Image src={p.image_url} alt={p.name} fill sizes="40px" className="object-cover" />)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-[color:var(--color-brand)] truncate">{p.name}</div>
                        <div className="text-[11px] text-[color:var(--color-muted)]">{catName(p.category)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-[color:var(--color-ink-soft)]">{nameOf(p.seller_id)}</td>
                  <td className="px-4 py-3 text-right font-semibold">{formatGs(p.price_cents)}</td>
                  <td className="px-4 py-3 text-right hidden lg:table-cell">{p.stock} {p.unit}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={"inline-flex text-xs font-semibold px-2 py-0.5 rounded " + (p.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600")}>{p.active ? "Activo" : "Pausado"}</span>
                  </td>
                  <td className="px-2 py-3 text-right whitespace-nowrap">
                    <Link href={`/producto?slug=${p.slug}`} target="_blank" className="p-1.5 rounded hover:bg-[color:var(--color-line-soft)] text-[color:var(--color-muted)] inline-flex" title="Ver"><Eye size={14} /></Link>
                    <Link href={`/admin/productos/editar?slug=${p.slug}`} className="p-1.5 rounded hover:bg-[color:var(--color-line-soft)] text-[color:var(--color-muted)] inline-flex" title="Editar"><Pencil size={14} /></Link>
                    <button onClick={() => toggle(p)} disabled={busy === p.slug} className="p-1.5 rounded hover:bg-[color:var(--color-line-soft)] text-[color:var(--color-muted)] disabled:opacity-50" title={p.active ? "Pausar" : "Activar"}>
                      {p.active ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    <button onClick={() => remove(p)} disabled={busy === p.slug} className="p-1.5 rounded hover:bg-red-50 text-[color:var(--color-muted)] hover:text-red-600 disabled:opacity-50" title="Eliminar"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
