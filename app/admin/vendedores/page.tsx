"use client";
import { useState } from "react";
import { platformSellers, type PlatformSeller } from "@/lib/platform-data";
import { formatGs } from "@/lib/utils";
import { Search, Star, MoreHorizontal } from "lucide-react";

const statusStyle: Record<PlatformSeller["status"], string> = {
  activo: "bg-green-100 text-green-800",
  revision: "bg-yellow-100 text-yellow-800",
  pausado: "bg-gray-100 text-gray-700",
};

export default function AdminVendedores() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"todos" | PlatformSeller["status"]>("todos");
  const filtered = platformSellers.filter((s) => {
    if (status !== "todos" && s.status !== status) return false;
    if (q && !s.name.toLowerCase().includes(q.toLowerCase()) && !s.storeName.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">Vendedores</h1>
          <p className="text-sm text-[color:var(--color-muted)] mt-1">{filtered.length} de {platformSellers.length} emprendedores</p>
        </div>
      </div>

      <div className="card-flat p-3 mb-3 flex gap-2 flex-wrap items-center">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--color-muted)]" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar nombre o tienda…" className="w-full pl-9 pr-3 py-2 text-sm border border-[color:var(--color-line)] rounded focus:outline-none focus:border-[color:var(--color-brand)]" />
        </div>
        <div className="flex gap-1">
          {(["todos", "activo", "revision", "pausado"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={"text-xs font-semibold px-2.5 py-2 rounded capitalize " + (status === s ? "bg-[color:var(--color-brand)] text-white" : "text-[color:var(--color-ink-soft)] hover:bg-[color:var(--color-line-soft)]")}
            >
              {s === "todos" ? "Todos" : s}
            </button>
          ))}
        </div>
      </div>

      <div className="card-flat overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[color:var(--color-line-soft)] text-[color:var(--color-ink-soft)] uppercase text-[11px] tracking-wider">
              <th className="text-left px-4 py-3 font-bold">Vendedor</th>
              <th className="text-left px-4 py-3 font-bold hidden md:table-cell">Ciudad</th>
              <th className="text-right px-4 py-3 font-bold hidden md:table-cell">Productos</th>
              <th className="text-right px-4 py-3 font-bold">GMV</th>
              <th className="text-right px-4 py-3 font-bold hidden md:table-cell">Rating</th>
              <th className="text-right px-4 py-3 font-bold hidden md:table-cell">Reclamos</th>
              <th className="text-right px-4 py-3 font-bold">Estado</th>
              <th className="w-10 px-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[color:var(--color-line-soft)]">
            {filtered.map((s) => (
              <tr key={s.id} className="hover:bg-[color:var(--color-line-soft)]/40">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[color:var(--color-brand)] to-[color:var(--color-accent)] text-white font-bold flex items-center justify-center shrink-0">
                      {s.storeName[0]}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-[color:var(--color-brand)] truncate">{s.storeName}</div>
                      <div className="text-[11px] text-[color:var(--color-muted)]">{s.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-[color:var(--color-ink-soft)]">{s.city}</td>
                <td className="px-4 py-3 text-right hidden md:table-cell font-medium">{s.products}</td>
                <td className="px-4 py-3 text-right font-bold text-[color:var(--color-brand)]">{formatGs(s.gmvCents)}</td>
                <td className="px-4 py-3 text-right hidden md:table-cell">
                  {s.rating > 0 ? (
                    <span className="inline-flex items-center gap-1 text-sm"><Star size={12} className="text-[color:var(--color-accent)]" fill="currentColor" /> {s.rating}</span>
                  ) : <span className="text-[color:var(--color-muted)]">—</span>}
                </td>
                <td className="px-4 py-3 text-right hidden md:table-cell">
                  {s.reclamos > 0 ? <span className={"text-xs font-bold " + (s.reclamos >= 3 ? "text-red-600" : "text-yellow-700")}>{s.reclamos}</span> : <span className="text-[color:var(--color-muted)]">0</span>}
                </td>
                <td className="px-4 py-3 text-right">
                  <span className={"inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded uppercase " + statusStyle[s.status]}>{s.status}</span>
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
