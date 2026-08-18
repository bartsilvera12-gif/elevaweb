"use client";
import { useState } from "react";
import { useCoupons } from "@/lib/hooks/use-platform";
import type { DBCoupon } from "@/lib/types";
import { Tag, Plus, Trash2, Copy, Check, Loader2 } from "lucide-react";
import { formatGs } from "@/lib/utils";

const kindLabel: Record<DBCoupon["kind"], string> = {
  percent: "Porcentaje",
  flat: "Descuento fijo",
  shipping: "Envío gratis",
};

export default function AdminCupones() {
  const { coupons: items, loading, create, remove: removeCoupon } = useCoupons(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [newCoupon, setNewCoupon] = useState({ code: "", label: "", kind: "percent" as DBCoupon["kind"], value: 10, minCents: 0 });
  const [showForm, setShowForm] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const copy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 1500);
  };

  const remove = async (code: string) => {
    if (!confirm(`¿Eliminar cupón "${code}"?`)) return;
    setErr(await removeCoupon(code));
  };

  const add = async () => {
    if (!newCoupon.code || !newCoupon.label) return;
    const error = await create({
      code: newCoupon.code.toUpperCase(),
      label: newCoupon.label,
      kind: newCoupon.kind,
      value: newCoupon.kind === "shipping" ? 0 : newCoupon.value,
      min_cents: newCoupon.minCents || 0,
    });
    setErr(error);
    if (error) return;
    setNewCoupon({ code: "", label: "", kind: "percent", value: 10, minCents: 0 });
    setShowForm(false);
  };

  if (loading) return <div className="flex justify-center py-12 text-[color:var(--color-muted)]"><Loader2 size={20} className="animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">Cupones</h1>
          <p className="text-sm text-[color:var(--color-muted)] mt-1">{items.length} cupones · valen para todo el marketplace</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary"><Plus size={16} /> Nuevo cupón</button>
      </div>

      {err && <div className="mb-4 text-sm bg-red-50 text-red-700 border border-red-200 rounded p-3">{err}</div>}

      {showForm && (
        <div className="card-flat p-5 mb-4 bg-[color:var(--color-brand-100)]/30">
          <h3 className="font-bold text-sm uppercase tracking-wider text-[color:var(--color-brand)] mb-3">Nuevo cupón</h3>
          <div className="grid md:grid-cols-2 gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-[color:var(--color-ink-soft)]">Código</span>
              <input value={newCoupon.code} onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })} placeholder="VERANO25" className="border border-[color:var(--color-line)] rounded px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-[color:var(--color-brand)]" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-[color:var(--color-ink-soft)]">Descripción</span>
              <input value={newCoupon.label} onChange={(e) => setNewCoupon({ ...newCoupon, label: e.target.value })} placeholder="25% en toda la tienda" className="border border-[color:var(--color-line)] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[color:var(--color-brand)]" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-[color:var(--color-ink-soft)]">Tipo</span>
              <select value={newCoupon.kind} onChange={(e) => setNewCoupon({ ...newCoupon, kind: e.target.value as DBCoupon["kind"] })} className="border border-[color:var(--color-line)] rounded px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-[color:var(--color-brand)]">
                <option value="percent">Porcentaje (%)</option>
                <option value="flat">Descuento fijo (Gs.)</option>
                <option value="shipping">Envío gratis</option>
              </select>
            </label>
            {newCoupon.kind !== "shipping" && (
              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-[color:var(--color-ink-soft)]">Valor {newCoupon.kind === "percent" ? "(%)" : "(Gs.)"}</span>
                <input type="number" value={newCoupon.value} onChange={(e) => setNewCoupon({ ...newCoupon, value: Number(e.target.value) })} className="border border-[color:var(--color-line)] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[color:var(--color-brand)]" />
              </label>
            )}
            <label className="flex flex-col gap-1 md:col-span-2">
              <span className="text-xs font-semibold text-[color:var(--color-ink-soft)]">Compra mínima (Gs.) — opcional</span>
              <input type="number" value={newCoupon.minCents} onChange={(e) => setNewCoupon({ ...newCoupon, minCents: Number(e.target.value) })} placeholder="0" className="border border-[color:var(--color-line)] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[color:var(--color-brand)]" />
            </label>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={add} className="btn-primary">Crear cupón</button>
            <button onClick={() => setShowForm(false)} className="btn-outline">Cancelar</button>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-3">
        {items.map((c) => (
          <div key={c.code} className="card-flat p-5 relative border-l-4 border-[color:var(--color-accent)]">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded bg-[color:var(--color-accent)]/10 text-[color:var(--color-accent)] flex items-center justify-center shrink-0">
                  <Tag size={20} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <code className="font-mono text-lg font-black text-[color:var(--color-brand)]">{c.code}</code>
                    <button onClick={() => copy(c.code)} className="p-1 rounded hover:bg-[color:var(--color-line-soft)] text-[color:var(--color-muted)]">
                      {copied === c.code ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                    </button>
                  </div>
                  <div className="text-sm text-[color:var(--color-ink-soft)] mt-0.5">{c.label}</div>
                </div>
              </div>
              <button onClick={() => remove(c.code)} className="text-[color:var(--color-muted)] hover:text-red-600 p-1"><Trash2 size={14} /></button>
            </div>
            <div className="mt-4 pt-4 border-t border-[color:var(--color-line-soft)] flex items-center justify-between text-xs">
              <span className="text-[color:var(--color-muted)]">{kindLabel[c.kind]}</span>
              <span className="font-bold text-[color:var(--color-brand)]">
                {c.kind === "percent" ? `${c.value}%` : c.kind === "flat" ? formatGs(c.value) : "Envío gratis"}
                {c.min_cents ? ` · desde ${formatGs(c.min_cents)}` : ""}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
