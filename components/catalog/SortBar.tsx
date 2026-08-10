"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUpDown } from "lucide-react";

const options = [
  { v: "relevancia", l: "Relevancia" },
  { v: "precio-asc", l: "Precio: menor a mayor" },
  { v: "precio-desc", l: "Precio: mayor a menor" },
  { v: "vendidos", l: "Más vendidos" },
  { v: "rating", l: "Mejor rating" },
  { v: "nuevos", l: "Más nuevos" },
];

export default function SortBar({ count }: { count: number }) {
  const router = useRouter();
  const sp = useSearchParams();
  const value = sp.get("sort") || "relevancia";
  const onChange = (v: string) => {
    const p = new URLSearchParams(sp.toString());
    if (v === "relevancia") p.delete("sort");
    else p.set("sort", v);
    router.push(`/catalogo?${p.toString()}`);
  };
  return (
    <div className="flex items-center justify-between gap-3 mb-4">
      <div className="text-sm text-[color:var(--color-muted)]">{count} productos</div>
      <label className="flex items-center gap-2 text-sm">
        <ArrowUpDown size={14} className="text-[color:var(--color-muted)]" />
        <span className="text-[color:var(--color-ink-soft)] hidden md:inline">Ordenar por</span>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="border border-[color:var(--color-line)] rounded px-3 py-2 bg-white text-sm text-[color:var(--color-ink)] focus:outline-none focus:border-[color:var(--color-brand)]"
        >
          {options.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
        </select>
      </label>
    </div>
  );
}
