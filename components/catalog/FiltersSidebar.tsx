"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { categories } from "@/lib/mock-products";
import { Check } from "lucide-react";

export default function FiltersSidebar() {
  const router = useRouter();
  const sp = useSearchParams();
  const currentCat = sp.get("cat");
  const inStock = sp.get("stock") === "1";
  const ofertas = sp.get("ofertas") === "1";
  const nuevo = sp.get("nuevo") === "1";
  const best = sp.get("best") === "1";

  const update = useCallback(
    (patch: Record<string, string | null>) => {
      const p = new URLSearchParams(sp.toString());
      Object.entries(patch).forEach(([k, v]) => {
        if (v === null) p.delete(k);
        else p.set(k, v);
      });
      router.push(`/catalogo?${p.toString()}`);
    },
    [router, sp]
  );

  return (
    <aside className="w-full md:w-64 shrink-0">
      <div className="card-flat p-5">
        <h3 className="font-bold text-sm uppercase tracking-wider text-[color:var(--color-brand)] mb-3">Categoría</h3>
        <div className="flex flex-col gap-1 max-h-72 overflow-auto pr-1">
          <button onClick={() => update({ cat: null })} className={`text-left text-sm px-2 py-1.5 rounded ${!currentCat ? "bg-[color:var(--color-brand-100)] text-[color:var(--color-brand)] font-semibold" : "text-[color:var(--color-ink-soft)] hover:bg-[color:var(--color-line-soft)]"}`}>
            Todas
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              onClick={() => update({ cat: c.slug })}
              className={`flex items-center justify-between text-left text-sm px-2 py-1.5 rounded ${currentCat === c.slug ? "bg-[color:var(--color-brand-100)] text-[color:var(--color-brand)] font-semibold" : "text-[color:var(--color-ink-soft)] hover:bg-[color:var(--color-line-soft)]"}`}
            >
              <span>{c.name}</span>
              <span className="text-[10px] text-[color:var(--color-muted)]">{c.count}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="card-flat p-5 mt-4">
        <h3 className="font-bold text-sm uppercase tracking-wider text-[color:var(--color-brand)] mb-3">Filtros</h3>
        <div className="flex flex-col gap-1">
          <Toggle label="Solo con stock" checked={inStock} onChange={(v) => update({ stock: v ? "1" : null })} />
          <Toggle label="En oferta" checked={ofertas} onChange={(v) => update({ ofertas: v ? "1" : null })} />
          <Toggle label="Productos nuevos" checked={nuevo} onChange={(v) => update({ nuevo: v ? "1" : null })} />
          <Toggle label="Más vendidos" checked={best} onChange={(v) => update({ best: v ? "1" : null })} />
        </div>
      </div>
    </aside>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!checked)} className="flex items-center gap-2.5 text-left px-2 py-2 rounded hover:bg-[color:var(--color-line-soft)]">
      <span className={`w-[18px] h-[18px] rounded border flex items-center justify-center ${checked ? "bg-[color:var(--color-brand)] border-[color:var(--color-brand)]" : "border-[color:var(--color-line)] bg-white"}`}>
        {checked && <Check size={12} className="text-white" strokeWidth={3} />}
      </span>
      <span className="text-sm text-[color:var(--color-ink-soft)]">{label}</span>
    </button>
  );
}
