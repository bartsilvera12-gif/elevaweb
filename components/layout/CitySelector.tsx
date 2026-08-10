"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, ChevronDown, Search, Check } from "lucide-react";
import { depts } from "@/lib/cities";
import { useCity } from "@/lib/city-store";
import { useHydrated } from "@/lib/store";

export default function CitySelector() {
  const hydrated = useHydrated();
  const city = useCity((s) => s.city);
  const setCity = useCity((s) => s.setCity);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const filtered = useMemo(() => {
    if (!q.trim()) return depts;
    const s = q.toLowerCase();
    return depts
      .map((d) => ({ ...d, cities: d.cities.filter((c) => c.toLowerCase().includes(s)) }))
      .filter((d) => d.cities.length > 0 || d.name.toLowerCase().includes(s));
  }, [q]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-2 rounded text-sm text-[color:var(--color-brand)] hover:bg-[color:var(--color-brand-100)] transition-colors"
      >
        <MapPin size={16} className="text-[color:var(--color-accent)]" />
        <span className="text-[color:var(--color-muted)]">
          Enviar a <strong className="text-[color:var(--color-brand)]">{hydrated ? city : "Asunción"}</strong>
        </span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={14} />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-1 w-80 max-h-[420px] bg-white border border-[color:var(--color-line)] rounded shadow-xl z-50 flex flex-col"
          >
            <div className="p-3 border-b border-[color:var(--color-line-soft)]">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[color:var(--color-muted)] mb-2">Elegí tu departamento y ciudad</div>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--color-muted)]" />
                <input
                  autoFocus
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Buscar ciudad…"
                  className="w-full pl-8 pr-3 py-2 text-sm border border-[color:var(--color-line)] rounded focus:outline-none focus:border-[color:var(--color-brand)]"
                />
              </div>
            </div>
            <div className="overflow-y-auto p-2 flex-1">
              {filtered.length === 0 ? (
                <div className="text-sm text-[color:var(--color-muted)] p-4 text-center">Sin resultados</div>
              ) : (
                filtered.map((d) => (
                  <div key={d.name} className="mb-2">
                    <div className="px-2 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[color:var(--color-brand-200)]">{d.name}</div>
                    {d.cities.map((c) => {
                      const active = c === city;
                      return (
                        <button
                          key={c}
                          onClick={() => {
                            setCity(c);
                            setOpen(false);
                            setQ("");
                          }}
                          className={`w-full text-left flex items-center justify-between px-2 py-1.5 rounded text-sm transition-colors ${
                            active
                              ? "bg-[color:var(--color-brand-100)] text-[color:var(--color-brand)] font-semibold"
                              : "text-[color:var(--color-ink-soft)] hover:bg-[color:var(--color-line-soft)]"
                          }`}
                        >
                          <span>{c}</span>
                          {active && <Check size={14} className="text-[color:var(--color-accent)]" />}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
