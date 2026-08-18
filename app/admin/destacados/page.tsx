"use client";
import { useMemo, useState } from "react";
import Image from "next/image";
import { useProducts } from "@/lib/hooks/use-products";
import { createClient } from "@/lib/supabase/client";
import { formatGs } from "@/lib/utils";
import { Star, Percent, Search, Loader2, Save, X } from "lucide-react";
import type { DBProduct } from "@/lib/types";

export default function AdminDestacados() {
  const { products, loading } = useProducts({});
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"todos" | "destacados" | "ofertas">("todos");
  const [edits, setEdits] = useState<Record<number, { is_featured?: boolean; disc_pct?: number | null }>>({});
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  const merged = useMemo(() => products.map((p) => ({
    ...p,
    is_featured: edits[p.id]?.is_featured ?? p.is_featured,
    disc_pct: edits[p.id]?.disc_pct !== undefined ? edits[p.id]!.disc_pct! : p.disc_pct,
  })), [products, edits]);

  const filtered = useMemo(() => merged.filter((p) => {
    if (q && !p.name.toLowerCase().includes(q.toLowerCase())) return false;
    if (tab === "destacados") return p.is_featured;
    if (tab === "ofertas") return (p.disc_pct ?? 0) > 0;
    return true;
  }), [merged, q, tab]);

  const toggleFeatured = (p: DBProduct) =>
    setEdits((e) => ({ ...e, [p.id]: { ...e[p.id], is_featured: !p.is_featured } }));

  const setDisc = (p: DBProduct, value: string) => {
    const n = value === "" ? null : Math.max(0, Math.min(90, Number(value) || 0));
    setEdits((e) => ({ ...e, [p.id]: { ...e[p.id], disc_pct: n } }));
  };

  const guardar = async () => {
    setSaving(true);
    setErr(null);
    const supabase = createClient();
    const rows = Object.entries(edits).map(([id, patch]) => ({ id: Number(id), ...patch }));
    for (const r of rows) {
      const { id, ...patch } = r;
      const { error } = await supabase.from("products").update(patch).eq("id", id);
      if (error) { setErr(error.message); setSaving(false); return; }
    }
    setSaving(false);
    setEdits({});
    setOk(true);
    setTimeout(() => setOk(false), 2500);
  };

  const cambios = Object.keys(edits).length;

  if (loading) return <div className="flex justify-center py-12 text-[color:var(--color-muted)]"><Loader2 size={20} className="animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">Destacados y ofertas</h1>
          <p className="text-sm text-[color:var(--color-muted)] mt-1">
            Marcá qué productos aparecen en el home y ponéles descuento. Novedades y más vendidos son automáticos.
          </p>
        </div>
        {cambios > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-[color:var(--color-accent)] font-semibold">{cambios} sin guardar</span>
            <button onClick={() => setEdits({})} className="btn-outline text-sm"><X size={14} /> Descartar</button>
            <button onClick={guardar} disabled={saving} className="btn-primary text-sm disabled:opacity-50">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Guardar cambios
            </button>
          </div>
        )}
      </div>

      {err && <div className="mb-4 text-sm bg-red-50 text-red-700 border border-red-200 rounded p-3">{err}</div>}
      {ok && <div className="mb-4 text-sm bg-green-50 text-green-700 border border-green-200 rounded p-3">Cambios guardados</div>}

      <div className="flex gap-3 mb-4 flex-wrap items-center">
        <div className="flex gap-1">
          {(["todos", "destacados", "ofertas"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={"text-xs font-semibold px-3 py-2 rounded capitalize " +
                (tab === t ? "bg-[color:var(--color-brand)] text-white" : "text-[color:var(--color-ink-soft)] hover:bg-[color:var(--color-line-soft)]")}>
              {t}
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-[220px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--color-muted)]" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar producto…"
            className="w-full pl-9 pr-3 py-2 text-sm border border-[color:var(--color-line)] rounded focus:outline-none focus:border-[color:var(--color-brand)]" />
        </div>
      </div>

      <div className="card-flat overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[color:var(--color-line-soft)] text-[color:var(--color-ink-soft)] uppercase text-[11px] tracking-wider">
              <th className="text-left px-4 py-3 font-bold">Producto</th>
              <th className="text-right px-4 py-3 font-bold hidden sm:table-cell">Precio</th>
              <th className="text-center px-4 py-3 font-bold" style={{ width: 120 }}>Destacar</th>
              <th className="text-center px-4 py-3 font-bold" style={{ width: 120 }}>% Off</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[color:var(--color-line-soft)]">
            {filtered.map((p) => (
              <tr key={p.id} className={edits[p.id] ? "bg-[color:var(--color-brand-100)]/30" : ""}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded overflow-hidden bg-[color:var(--color-line-soft)] shrink-0">
                      {p.image_url && <Image src={p.image_url} alt={p.name} fill sizes="40px" className="object-cover" />}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-[color:var(--color-brand)] truncate">{p.name}</div>
                      <div className="text-[11px] text-[color:var(--color-muted)]">{p.category} · {p.sold} vendidos</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-semibold hidden sm:table-cell">{formatGs(p.price_cents)}</td>
                <td className="px-4 py-3 text-center">
                  <button onClick={() => toggleFeatured(p)}
                    className={"inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-semibold border " +
                      (p.is_featured ? "bg-[color:var(--color-brand)] text-white border-[color:var(--color-brand)]"
                                     : "text-[color:var(--color-muted)] border-[color:var(--color-line)] hover:border-[color:var(--color-brand)]")}>
                    <Star size={13} fill={p.is_featured ? "currentColor" : "none"} />
                    {p.is_featured ? "Sí" : "No"}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="relative w-20 mx-auto">
                    <Percent size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-[color:var(--color-muted)]" />
                    <input type="number" min={0} max={90} value={p.disc_pct ?? ""} onChange={(e) => setDisc(p, e.target.value)}
                      placeholder="0" className="w-full pr-6 pl-2 py-1.5 text-sm border border-[color:var(--color-line)] rounded text-right focus:outline-none focus:border-[color:var(--color-brand)]" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!filtered.length && <p className="text-center py-10 text-sm text-[color:var(--color-ink-soft)]">Sin productos.</p>}
      </div>
    </div>
  );
}
