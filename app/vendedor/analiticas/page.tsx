"use client";
import { motion } from "motion/react";
import { TrendingUp, TrendingDown, Eye, ShoppingCart, Heart, MousePointerClick } from "lucide-react";
import { formatGs } from "@/lib/utils";
import { useMyProducts } from "@/lib/hooks/use-products";
import { useSellerOrders } from "@/lib/hooks/use-orders";

export default function VendedorAnaliticas() {
  const { products } = useMyProducts();
  const { orders } = useSellerOrders();

  const revenue = orders.reduce((n, o) => n + o.total_cents, 0);
  const totalOrders = orders.length;
  const topProducts = [...products].sort((a, b) => (b.sold ?? 0) - (a.sold ?? 0)).slice(0, 5);
  const maxSold = topProducts[0]?.sold || 1;

  return (
    <div>
      <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">Analíticas</h1>
          <p className="text-sm text-[color:var(--color-muted)] mt-1">Comportamiento de tus productos</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Kpi icon={ShoppingCart} label="Ventas" value={formatGs(revenue)} />
        <Kpi icon={Eye} label="Pedidos" value={String(totalOrders)} />
        <Kpi icon={MousePointerClick} label="Ticket promedio" value={formatGs(totalOrders ? Math.round(revenue / totalOrders) : 0)} />
        <Kpi icon={Heart} label="Productos" value={String(products.length)} />
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <div className="card-flat p-5">
          <h3 className="font-bold text-[color:var(--color-brand-900)] mb-4">Top productos por ventas</h3>
          {topProducts.length === 0 ? (
            <p className="text-sm text-[color:var(--color-muted)]">Sin ventas todavía.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {topProducts.map((p, i) => {
                const pct = ((p.sold ?? 0) / maxSold) * 100;
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
                      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6 }} className="h-full bg-[color:var(--color-brand)] rounded-full" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="card-flat p-5">
          <h3 className="font-bold text-[color:var(--color-brand-900)] mb-4">Rotación por categoría</h3>
          {products.length === 0 ? (
            <p className="text-sm text-[color:var(--color-muted)]">Sin productos aún.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {Object.entries(products.reduce<Record<string, number>>((acc, p) => { acc[p.category] = (acc[p.category] || 0) + (p.sold || 0); return acc; }, {})).map(([cat, sold]) => {
                const max = Math.max(...Object.values(products.reduce<Record<string, number>>((acc, p) => { acc[p.category] = (acc[p.category] || 0) + (p.sold || 0); return acc; }, {}))) || 1;
                const pct = (sold / max) * 100;
                return (
                  <div key={cat}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-medium capitalize">{cat}</span>
                      <span className="font-bold text-[color:var(--color-brand)]">{sold} vendidos</span>
                    </div>
                    <div className="h-1.5 bg-[color:var(--color-line-soft)] rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6 }} className="h-full bg-[color:var(--color-accent)] rounded-full" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Kpi({ icon: Icon, label, value }: { icon: React.ComponentType<{ size?: number; className?: string }>; label: string; value: string }) {
  return (
    <div className="card-flat p-4">
      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[color:var(--color-muted)]">
        <Icon size={12} /> {label}
      </div>
      <div className="text-xl md:text-2xl font-black text-[color:var(--color-brand)] mt-1.5">{value}</div>
    </div>
  );
}
