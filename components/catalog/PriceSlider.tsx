"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const MIN = 0;
const MAX = 5000000;
const STEP = 50000;

const fmt = (n: number) => new Intl.NumberFormat("es-PY").format(n);
const parse = (s: string) => Number(s.replace(/\D/g, "")) || 0;

export default function PriceSlider() {
  const router = useRouter();
  const sp = useSearchParams();

  const [lo, setLo] = useState(0);
  const [hi, setHi] = useState(MAX);

  useEffect(() => {
    setLo(Math.max(MIN, Math.min(MAX, Number(sp.get("min") ?? MIN))));
    setHi(Math.max(MIN, Math.min(MAX, Number(sp.get("max") ?? MAX))));
  }, [sp]);

  const loPct = ((lo - MIN) / (MAX - MIN)) * 100;
  const hiPct = ((hi - MIN) / (MAX - MIN)) * 100;

  const apply = () => {
    const p = new URLSearchParams(sp.toString());
    const clampedLo = Math.max(MIN, Math.min(hi, lo));
    const clampedHi = Math.max(clampedLo, Math.min(MAX, hi));
    if (clampedLo > MIN) p.set("min", String(clampedLo)); else p.delete("min");
    if (clampedHi < MAX) p.set("max", String(clampedHi)); else p.delete("max");
    router.push(`/catalogo?${p.toString()}`);
  };

  const reset = () => {
    setLo(MIN); setHi(MAX);
    const p = new URLSearchParams(sp.toString());
    p.delete("min"); p.delete("max");
    router.push(`/catalogo?${p.toString()}`);
  };

  return (
    <div>
      {/* Slider */}
      <div className="px-[11px]">
        <div className="relative h-6 select-none">
          {/* Track base */}
          <div className="absolute top-1/2 -translate-y-1/2 inset-x-0 h-[3px] bg-[color:var(--color-line)] rounded-full pointer-events-none" />
          {/* Track fill */}
          <div
            className="absolute top-1/2 -translate-y-1/2 h-[3px] bg-[color:var(--color-brand)] rounded-full pointer-events-none"
            style={{ left: `${loPct}%`, right: `${100 - hiPct}%` }}
          />
          {/* Range inputs */}
          <input
            type="range"
            min={MIN}
            max={MAX}
            step={STEP}
            value={lo}
            onChange={(e) => setLo(Math.min(+e.target.value, hi - STEP))}
            aria-label="Precio mínimo"
            className="dual-range absolute inset-0 w-full h-full appearance-none bg-transparent"
            style={{ zIndex: lo >= hi - STEP ? 5 : 3 }}
          />
          <input
            type="range"
            min={MIN}
            max={MAX}
            step={STEP}
            value={hi}
            onChange={(e) => setHi(Math.max(+e.target.value, lo + STEP))}
            aria-label="Precio máximo"
            className="dual-range absolute inset-0 w-full h-full appearance-none bg-transparent"
            style={{ zIndex: 4 }}
          />
        </div>
      </div>

      {/* Inputs Desde / Hasta */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        <label className="flex flex-col gap-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--color-muted)]">Desde</span>
          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-[color:var(--color-muted)] font-semibold">Gs.</span>
            <input
              inputMode="numeric"
              value={fmt(lo)}
              onChange={(e) => setLo(Math.min(parse(e.target.value), hi - STEP))}
              className="w-full pl-7 pr-1.5 py-2 text-[13px] tabular-nums border border-[color:var(--color-line)] rounded focus:outline-none focus:border-[color:var(--color-brand)]"
            />
          </div>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--color-muted)]">Hasta</span>
          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-[color:var(--color-muted)] font-semibold">Gs.</span>
            <input
              inputMode="numeric"
              value={fmt(hi)}
              onChange={(e) => setHi(Math.max(parse(e.target.value), lo + STEP))}
              className="w-full pl-7 pr-1.5 py-2 text-[13px] tabular-nums border border-[color:var(--color-line)] rounded focus:outline-none focus:border-[color:var(--color-brand)]"
            />
          </div>
        </label>
      </div>

      <div className="flex gap-2 mt-3">
        <button
          onClick={apply}
          className="flex-1 text-sm font-semibold bg-[color:var(--color-brand)] text-white rounded px-3 py-2 hover:brightness-110 transition"
        >
          Aplicar
        </button>
        {(sp.get("min") || sp.get("max")) && (
          <button
            onClick={reset}
            className="text-xs text-[color:var(--color-muted)] hover:text-[color:var(--color-accent)] px-2"
          >
            Limpiar
          </button>
        )}
      </div>
    </div>
  );
}
