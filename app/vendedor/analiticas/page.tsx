"use client";
import { motion } from "motion/react";
import { TrendingUp, TrendingDown, Eye, ShoppingCart, Heart, MousePointerClick } from "lucide-react";
import { formatGs } from "@/lib/utils";
import { products } from "@/lib/mock-products";

const salesLast30 = [
  120, 145, 132, 189, 165, 198, 234, 187, 156, 203,
  178, 245, 289, 267, 234, 198, 245, 289, 312, 278,
  245, 289, 334, 298, 356, 401, 378, 342, 389, 421,
];

const visits = 12483;
const conversion = 3.4;
const cartAdds = 892;
const revenue = 42958000;

export default function AdminAnaliticas() {
  const maxSale = Math.max(...salesLast30);
  const topProducts = [...products].sort((a, b) => (b.sold ?? 0) - (a.sold ?? 0)).slice(0, 5);

  return (
    <div>
      <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">Analíticas</h1>
          <p className="text-sm text-[color:var(--color-muted)] mt-1">Últimos 30 días</p>
        </div>
        <select className="border border-[color:var(--color-line)] rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-[color:var(--color-brand)]">
          <option>Últimos 30 días</option>
          <option>Últimos 7 días</option>
          <option>Este mes</option>
          <option>Últimos 3 meses</option>
        </select>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Kpi icon={ShoppingCart} label="Ventas" value={formatGs(revenue)} delta="+38%" trend="up" />
        <Kpi icon={Eye} label="Visitas" value={visits.toLocaleString("es-PY")} delta="+12%" trend="up" />
        <Kpi icon={MousePointerClick} label="Conversión" value={`${conversion}%`} delta="+0.4pp" trend="up" />
        <Kpi icon={Heart} label="Favoritos" value="1.284" delta="-3%" trend="down" />
      </div>

      {/* Bar chart */}
      <div className="card-flat p-5 mt-4">
        <div className="flex items-baseline justify-between mb-4">
          <h3 className="font-bold text-[color:var(--color-brand-900)]">Ventas por día</h3>
          <div className="text-xs text-[color:var(--color-muted)]">30 días</div>
        </div>
        <div className="flex items-end gap-1 h-48 border-b border-[color:var(--color-line-soft)] pb-1">
          {salesLast30.map((v, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${(v / maxSale) * 100}%` }}
              transition={{ delay: i * 0.015, duration: 0.5, ease: "easeOut" }}
              className={`flex-1 rounded-t transition-colors group relative ${i >= salesLast30.length - 7 ? "bg-[color:var(--color-accent)]" : "bg-[color:var(--color-brand)]/60 hover:bg-[color:var(--color-brand)]"}`}
              title={`Día ${i + 1}: ${v}k`}
            />
          ))}
        </div>
        <div className="flex items-center justify-between mt-3 text-[10px] font-bold uppercase tracking-wider text-[color:var(--color-muted)]">
          <span>Hace 30 días</span>
          <span className="text-[color:var(--color-accent)]">Últimos 7 días</span>
          <span>Hoy</span>
        </div>
      </div>

      {/* Two cols */}
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        {/* Top productos */}
        <div className="card-flat p-5">
          <h3 className="font-bold text-[color:var(--color-brand-900)] mb-4">Top productos por ventas</h3>
          <div className="flex flex-col gap-3">
            {topProducts.map((p, i) => {
              const max = topProducts[0].sold ?? 1;
              const pct = ((p.sold ?? 0) / max) * 100;
              return (
                <div key={p.slug}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs font-black text-[color:var(--color-muted)] w-4">{i + 1}</span>
                      <span className="font-medium truncate">{p.name}</span>
                    </div>
                    <span className="font-bold text-[color:var(--color-brand)] shrink-0 ml-2">{p.sold} vendidos</span>
                  </div>
                  <div className="h-1.5 bg-[color:var(--color-line-soft)] rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: 0.2 + i * 0.08, duration: 0.6 }} className="h-full bg-[color:var(--color-brand)] rounded-full" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fuentes de tráfico */}
        <div className="card-flat p-5">
          <h3 className="font-bold text-[color:var(--color-brand-900)] mb-4">De dónde vienen tus visitas</h3>
          <div className="flex flex-col gap-3">
            {[
              { s: "Búsqueda en ELEVA", v: 42, c: "bg-[color:var(--color-brand)]" },
              { s: "Categorías", v: 24, c: "bg-[color:var(--color-accent)]" },
              { s: "Google", v: 18, c: "bg-purple-400" },
              { s: "Instagram", v: 9, c: "bg-pink-400" },
              { s: "Directo", v: 7, c: "bg-slate-400" },
            ].map((r) => (
              <div key={r.s}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium">{r.s}</span>
                  <span className="font-bold text-[color:var(--color-brand)]">{r.v}%</span>
                </div>
                <div className="h-2 bg-[color:var(--color-line-soft)] rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${r.v}%` }} transition={{ duration: 0.6 }} className={`h-full rounded-full ${r.c}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Funnel */}
      <div className="card-flat p-5 mt-4">
        <h3 className="font-bold text-[color:var(--color-brand-900)] mb-4">Embudo de conversión</h3>
        <div className="grid grid-cols-4 gap-2">
          {[
            { l: "Visitas", v: visits, pct: 100 },
            { l: "Vieron producto", v: 4218, pct: 34 },
            { l: "Agregaron al carrito", v: cartAdds, pct: 7.1 },
            { l: "Compraron", v: 424, pct: 3.4 },
          ].map((f, i) => (
            <div key={f.l} className="text-center">
              <div className={`mx-auto rounded ${i === 0 ? "bg-[color:var(--color-brand)]" : i === 3 ? "bg-[color:var(--color-accent)]" : "bg-[color:var(--color-brand)]/60"} text-white p-4 flex flex-col items-center justify-center`} style={{ width: `${100 - i * 5}%`, minHeight: 80 }}>
                <div className="text-lg md:text-2xl font-black leading-none">{f.v.toLocaleString("es-PY")}</div>
                <div className="text-[10px] mt-1 opacity-80">{f.pct}%</div>
              </div>
              <div className="text-[11px] font-semibold text-[color:var(--color-ink-soft)] mt-2">{f.l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Kpi({ icon: Icon, label, value, delta, trend }: { icon: React.ComponentType<{ size?: number; className?: string }>; label: string; value: string; delta: string; trend: "up" | "down" }) {
  const Trend = trend === "up" ? TrendingUp : TrendingDown;
  return (
    <div className="card-flat p-4">
      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[color:var(--color-muted)]">
        <Icon size={12} /> {label}
      </div>
      <div className="text-xl md:text-2xl font-black text-[color:var(--color-brand)] mt-1.5">{value}</div>
      <div className={"text-[11px] font-bold mt-1 flex items-center gap-1 " + (trend === "up" ? "text-green-700" : "text-red-600")}>
        <Trend size={11} /> {delta} vs período anterior
      </div>
    </div>
  );
}
