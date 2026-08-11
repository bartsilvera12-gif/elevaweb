"use client";
import { useState } from "react";
import Image from "next/image";
import { useProducts, useLowStock } from "@/lib/hooks/use-products";
import { formatGs } from "@/lib/utils";
import { AlertTriangle, Search, Boxes, Loader2 } from "lucide-react";

export default function AdminInventario() {
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"todos" | "bajo">("bajo");
  const { products, loading } = useProducts({});
  const { items: lowStock } = useLowStock();

  const list = tab === "bajo" ? lowStock : products;
  const filtered = list.filter((p) => !q || p.name.toLowerCase().includes(q.toLowerCase()) || (p.category || "").toLowerCase().includes(q.toLowerCase()) || (p.ubicacion || "").toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">Inventario</h1>
          <p className="text-sm text-[color:var(--color-muted)] mt-1">Control de stock consolidado de toda la plataforma</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <Kpi icon={Boxes} label="Productos totales" value={String(products.length)} />
        <Kpi icon={AlertTriangle} label="Stock bajo" value={String(lowStock.length)} warn={lowStock.length > 0} />
        <Kpi icon={Boxes} label="Sin stock" value={String(products.filter((p) => p.stock === 0).length)} warn={products.some((p) => p.stock === 0)} />
      </div>

      <div className="flex items-center gap-3 mb-3 flex-wrap">
        <div className="flex gap-1">
          {(["bajo", "todos"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={"text-xs font-semibold px-3 py-2 rounded capitalize " + (tab === t ? "bg-[color:var(--color-brand)] text-white" : "text-[color:var(--color-ink-soft)] hover:bg-[color:var(--color-line-soft)]")}>
              {t === "bajo" ? `Stock bajo (${lowStock.length})` : `Todos (${products.length})`}
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-[220px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--color-muted)]" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar producto, categoría o ubicación…" className="w-full pl-9 pr-3 py-2 text-sm border border-[color:var(--color-line)] rounded focus:outline-none focus:border-[color:var(--color-brand)]" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12 text-[color:var(--color-muted)]"><Loader2 size={20} className="animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="card-flat p-10 text-center text-[color:var(--color-ink-soft)]">
          {tab === "bajo" ? "🎉 No hay productos con stock bajo. Todo bien." : "No se encontraron productos."}
        </div>
      ) : (
        <div className="card-flat overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[color:var(--color-line-soft)] text-[color:var(--color-ink-soft)] uppercase text-[11px] tracking-wider">
                <th className="text-left px-4 py-3 font-bold">Producto</th>
                <th className="text-left px-4 py-3 font-bold hidden md:table-cell">Categoría</th>
                <th className="text-right px-4 py-3 font-bold">Stock</th>
                <th className="text-right px-4 py-3 font-bold hidden md:table-cell">Mínimo</th>
                <th className="text-left px-4 py-3 font-bold hidden lg:table-cell">Ubicación</th>
                <th className="text-right px-4 py-3 font-bold">Precio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[color:var(--color-line-soft)]">
              {filtered.map((p) => {
                const lowFlag = p.stock_minimo > 0 && p.stock <= p.stock_minimo;
                const empty = p.stock === 0;
                return (
                  <tr key={p.slug} className={"hover:bg-[color:var(--color-line-soft)]/40 " + (empty ? "bg-red-50/40" : lowFlag ? "bg-yellow-50/40" : "")}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded overflow-hidden bg-[color:var(--color-line-soft)] shrink-0">
                          {p.image_url && (p.image_url.startsWith("data:") ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" /> : <Image src={p.image_url} alt={p.name} fill sizes="40px" className="object-cover" />)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-[color:var(--color-brand)] line-clamp-1">{p.name}</div>
                          <div className="text-[11px] text-[color:var(--color-muted)]">/{p.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell capitalize text-[color:var(--color-ink-soft)]">{p.category}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={"font-bold " + (empty ? "text-red-600" : lowFlag ? "text-yellow-700" : "text-[color:var(--color-brand)]")}>
                        {p.stock} {p.unit}
                      </span>
                      {empty && <div className="text-[10px] text-red-600 font-bold">SIN STOCK</div>}
                      {lowFlag && !empty && <div className="text-[10px] text-yellow-700 font-bold">BAJO</div>}
                    </td>
                    <td className="px-4 py-3 text-right hidden md:table-cell text-[color:var(--color-muted)] text-xs">{p.stock_minimo}</td>
                    <td className="px-4 py-3 hidden lg:table-cell text-xs text-[color:var(--color-muted)]">{p.ubicacion || "—"}</td>
                    <td className="px-4 py-3 text-right font-semibold">{formatGs(p.price_cents)}</td>
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

function Kpi({ icon: Icon, label, value, warn }: { icon: React.ComponentType<{ size?: number; className?: string }>; label: string; value: string; warn?: boolean }) {
  return (
    <div className={"card-flat p-4 " + (warn ? "border-l-4 border-yellow-400" : "")}>
      <div className={"flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider " + (warn ? "text-yellow-700" : "text-[color:var(--color-muted)]")}>
        <Icon size={13} /> {label}
      </div>
      <div className={"text-2xl font-black mt-1.5 " + (warn ? "text-yellow-700" : "text-[color:var(--color-brand)]")}>{value}</div>
    </div>
  );
}
