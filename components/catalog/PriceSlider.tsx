"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formatGs } from "@/lib/utils";

const MIN = 0;
const MAX = 5000000;
const STEP = 50000;

export default function PriceSlider() {
  const router = useRouter();
  const sp = useSearchParams();
  const initialLo = Math.max(MIN, Math.min(MAX, Number(sp.get("min") ?? MIN)));
  const initialHi = Math.max(MIN, Math.min(MAX, Number(sp.get("max") ?? MAX)));

  const [lo, setLo] = useState(initialLo);
  const [hi, setHi] = useState(initialHi);

  useEffect(() => {
    setLo(Math.max(MIN, Math.min(MAX, Number(sp.get("min") ?? MIN))));
    setHi(Math.max(MIN, Math.min(MAX, Number(sp.get("max") ?? MAX))));
  }, [sp]);

  const loPct = ((lo - MIN) / (MAX - MIN)) * 100;
  const hiPct = ((hi - MIN) / (MAX - MIN)) * 100;

  const apply = () => {
    const p = new URLSearchParams(sp.toString());
    if (lo > MIN) p.set("min", String(lo));
    else p.delete("min");
    if (hi < MAX) p.set("max", String(hi));
    else p.delete("max");
    router.push(`/catalogo?${p.toString()}`);
  };

  return (
    <div>
      <div className="text-sm text-[color:var(--color-ink)] font-semibold mb-2">
        Desde <span className="text-[color:var(--color-brand)]">{formatGs(lo)}</span> hasta <span className="text-[color:var(--color-brand)]">{formatGs(hi)}{hi === MAX ? "+" : ""}</span>
      </div>
      <div className="relative h-6 flex items-center">
        <div className="absolute inset-x-0 h-1 bg-[color:var(--color-line)] rounded" />
        <div className="absolute h-1 bg-[color:var(--color-brand)] rounded" style={{ left: `${loPct}%`, width: `${hiPct - loPct}%` }} />
        <input
          type="range"
          min={MIN}
          max={MAX}
          step={STEP}
          value={lo}
          onChange={(e) => setLo(Math.min(+e.target.value, hi - STEP))}
          className="dual-range absolute inset-x-0 h-6 w-full appearance-none bg-transparent"
          style={{ zIndex: lo > MAX - STEP * 2 ? 5 : 3 }}
        />
        <input
          type="range"
          min={MIN}
          max={MAX}
          step={STEP}
          value={hi}
          onChange={(e) => setHi(Math.max(+e.target.value, lo + STEP))}
          className="dual-range absolute inset-x-0 h-6 w-full appearance-none bg-transparent"
          style={{ zIndex: 4 }}
        />
      </div>
      <div className="flex items-center justify-between text-[10px] text-[color:var(--color-muted)] mt-1">
        <span>{formatGs(MIN)}</span>
        <span>{formatGs(MAX)}+</span>
      </div>
      <button onClick={apply} className="mt-3 w-full text-sm font-semibold bg-[color:var(--color-brand-100)] text-[color:var(--color-brand)] rounded px-3 py-2 hover:bg-[color:var(--color-brand-200)] transition">
        Aplicar precio
      </button>
    </div>
  );
}
