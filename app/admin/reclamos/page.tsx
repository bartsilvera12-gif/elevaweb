"use client";
import { useState } from "react";
import { useReclamos, useSellers } from "@/lib/hooks/use-platform";
import { AlertTriangle, Check, Loader2 } from "lucide-react";

export default function AdminReclamos() {
  const { reclamos, loading, resolver } = useReclamos();
  const { sellers } = useSellers();
  const [filter, setFilter] = useState<"todos" | "abierto" | "resuelto">("todos");
  const [respondiendo, setRespondiendo] = useState<number | null>(null);
  const [respuesta, setRespuesta] = useState("");
  const [working, setWorking] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const filtered = filter === "todos" ? reclamos : reclamos.filter((c) => c.status === filter);
  const tienda = (id: string | null) => {
    const s = sellers.find((x) => x.id === id);
    return s?.store_name || s?.name || "—";
  };

  const cerrar = async (id: number) => {
    setWorking(true);
    setErr(await resolver(id, respuesta));
    setWorking(false);
    setRespondiendo(null);
    setRespuesta("");
  };

  if (loading) return <div className="flex justify-center py-12 text-[color:var(--color-muted)]"><Loader2 size={20} className="animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">Reclamos</h1>
          <p className="text-sm text-[color:var(--color-muted)] mt-1">
            {reclamos.filter((c) => c.status === "abierto").length} abiertos · {reclamos.length} totales
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

      {err && <div className="mb-4 text-sm bg-red-50 text-red-700 border border-red-200 rounded p-3">{err}</div>}

      <div className="flex flex-col gap-3">
        {filtered.length === 0 && (
          <div className="card-flat p-10 text-center">
            <AlertTriangle size={40} className="mx-auto text-[color:var(--color-brand-200)]" />
            <p className="mt-3 text-[color:var(--color-ink-soft)]">
              {reclamos.length ? "Sin reclamos en este filtro." : "Todavía no hay reclamos."}
            </p>
          </div>
        )}
        {filtered.map((c) => (
          <div key={c.id} className={"card-flat p-5 " + (c.status === "abierto" ? "border-l-4 border-red-400" : "")}>
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-sm font-bold text-[color:var(--color-brand)]">{c.order_id ?? "sin pedido"}</span>
                  <span className={"text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded " + (c.status === "abierto" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800")}>{c.status}</span>
                  <span className="text-[11px] text-[color:var(--color-muted)]">
                    {new Date(c.created_at).toLocaleDateString("es-PY", { day: "2-digit", month: "long" })}
                  </span>
                </div>
                <div className="text-[color:var(--color-ink)] mt-2 font-medium">{c.motivo}</div>
                {c.detalle && <p className="text-sm text-[color:var(--color-ink-soft)] mt-1 whitespace-pre-line">{c.detalle}</p>}
                <div className="text-xs text-[color:var(--color-muted)] mt-2">Emprendedor: <strong className="text-[color:var(--color-brand)]">{tienda(c.seller_id)}</strong></div>
                {c.respuesta && (
                  <div className="mt-3 text-sm bg-[color:var(--color-line-soft)] rounded p-3">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--color-muted)] mb-1">Respuesta de ELEVA</div>
                    {c.respuesta}
                  </div>
                )}
              </div>
              {c.status === "abierto" && respondiendo !== c.id && (
                <button onClick={() => { setRespondiendo(c.id); setRespuesta(""); }} className="btn-primary text-sm shrink-0">
                  <Check size={14} /> Resolver
                </button>
              )}
            </div>

            {respondiendo === c.id && (
              <div className="mt-4 pt-4 border-t border-[color:var(--color-line-soft)]">
                <textarea
                  autoFocus
                  rows={3}
                  value={respuesta}
                  onChange={(e) => setRespuesta(e.target.value)}
                  placeholder="Cómo se resolvió…"
                  className="w-full border border-[color:var(--color-line)] rounded px-3.5 py-2.5 text-sm focus:outline-none focus:border-[color:var(--color-brand)]"
                />
                <div className="flex gap-2 mt-3">
                  <button onClick={() => cerrar(c.id)} disabled={working} className="btn-primary text-sm disabled:opacity-50">
                    {working ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Marcar resuelto
                  </button>
                  <button onClick={() => setRespondiendo(null)} className="btn-outline text-sm">Cancelar</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
