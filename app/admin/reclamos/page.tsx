"use client";
import { useState } from "react";
import { complaints as initial } from "@/lib/platform-data";
import { AlertTriangle, Check, MessageCircle } from "lucide-react";

export default function AdminReclamos() {
  const [items, setItems] = useState(initial);
  const [filter, setFilter] = useState<"todos" | "abierto" | "resuelto">("todos");
  const filtered = filter === "todos" ? items : items.filter((c) => c.status === filter);

  const resolve = (id: string) => {
    setItems(items.map((c) => (c.id === id ? { ...c, status: "resuelto" as const } : c)));
  };

  return (
    <div>
      <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">Reclamos</h1>
          <p className="text-sm text-[color:var(--color-muted)] mt-1">
            {items.filter((c) => c.status === "abierto").length} abiertos · {items.length} totales
          </p>
        </div>
        <div className="flex gap-1">
          {(["todos", "abierto", "resuelto"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={"text-xs font-semibold px-3 py-2 rounded capitalize " + (filter === f ? "bg-[color:var(--color-brand)] text-white" : "text-[color:var(--color-ink-soft)] hover:bg-[color:var(--color-line-soft)]")}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {filtered.length === 0 && (
          <div className="card-flat p-10 text-center">
            <AlertTriangle size={40} className="mx-auto text-[color:var(--color-brand-200)]" />
            <p className="mt-3 text-[color:var(--color-ink-soft)]">Sin reclamos.</p>
          </div>
        )}
        {filtered.map((c) => (
          <div key={c.id} className={"card-flat p-5 " + (c.status === "abierto" ? "border-l-4 border-red-400" : "")}>
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-sm font-bold text-[color:var(--color-brand)]">{c.orderId}</span>
                  <span className={"text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded " + (c.status === "abierto" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800")}>{c.status}</span>
                  <span className="text-[11px] text-[color:var(--color-muted)]">{new Date(c.date).toLocaleDateString("es-PY", { day: "2-digit", month: "long" })}</span>
                </div>
                <div className="text-[color:var(--color-ink)] mt-2 font-medium">{c.reason}</div>
                <div className="text-sm text-[color:var(--color-ink-soft)] mt-1">
                  <strong className="text-[color:var(--color-brand)]">{c.buyer}</strong> vs <strong className="text-[color:var(--color-brand)]">{c.seller}</strong>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button className="btn-outline text-sm"><MessageCircle size={14} /> Contactar</button>
                {c.status === "abierto" && (
                  <button onClick={() => resolve(c.id)} className="btn-primary text-sm"><Check size={14} /> Resolver</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
