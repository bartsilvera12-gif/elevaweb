"use client";
import { motion } from "motion/react";
import { DollarSign, ShoppingBag, Package, Star, TrendingUp } from "lucide-react";
import { formatGs } from "@/lib/utils";
import { products } from "@/lib/mock-products";
import { useOrders, useHydrated } from "@/lib/store";

export default function AdminOverview() {
  const hydrated = useHydrated();
  const orders = useOrders((s) => s.orders);
  if (!hydrated) return <div className="min-h-[400px]" />;

  const totalRevenue = orders.reduce((n, o) => n + o.total_cents, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const avgTicket = totalOrders ? Math.round(totalRevenue / totalOrders) : 0;

  const cards = [
    { icon: DollarSign, label: "Ventas totales", value: formatGs(totalRevenue), sub: "semana actual" },
    { icon: ShoppingBag, label: "Pedidos", value: String(totalOrders), sub: "recibidos" },
    { icon: Package, label: "Productos activos", value: String(totalProducts), sub: "en catálogo" },
    { icon: TrendingUp, label: "Ticket promedio", value: formatGs(avgTicket), sub: "por pedido" },
  ];

  return (
    <div>
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">Overview</h1>
          <p className="text-sm text-[color:var(--color-muted)] mt-1">Resumen de tu actividad en ELEVA</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {cards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.06 }}
            className="card-flat p-4"
          >
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[color:var(--color-muted)]">
              <c.icon size={14} /> {c.label}
            </div>
            <div className="text-2xl font-extrabold text-[color:var(--color-brand)] mt-2">{c.value}</div>
            <div className="text-[11px] text-[color:var(--color-muted)] mt-0.5">{c.sub}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="card-flat p-5"
        >
          <h3 className="font-bold text-sm uppercase tracking-wider text-[color:var(--color-brand)] mb-3">Últimos pedidos</h3>
          {orders.length === 0 ? (
            <p className="text-sm text-[color:var(--color-muted)]">Todavía no hay pedidos.</p>
          ) : (
            <ul className="divide-y divide-[color:var(--color-line-soft)]">
              {orders.slice(0, 5).map((o) => (
                <li key={o.id} className="flex justify-between py-2.5 text-sm">
                  <div>
                    <div className="font-semibold text-[color:var(--color-brand)]">{o.id}</div>
                    <div className="text-xs text-[color:var(--color-muted)]">{o.items.length} productos</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-[color:var(--color-brand)]">{formatGs(o.total_cents)}</div>
                    <div className="text-[11px] text-[color:var(--color-muted)] capitalize">{o.status}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.28 }}
          className="card-flat p-5"
        >
          <h3 className="font-bold text-sm uppercase tracking-wider text-[color:var(--color-brand)] mb-3">Top productos</h3>
          <ul className="divide-y divide-[color:var(--color-line-soft)]">
            {[...products].sort((a, b) => (b.sold ?? 0) - (a.sold ?? 0)).slice(0, 5).map((p) => (
              <li key={p.slug} className="flex justify-between py-2.5 text-sm">
                <div className="min-w-0">
                  <div className="font-semibold line-clamp-1">{p.name}</div>
                  <div className="text-xs text-[color:var(--color-muted)] flex items-center gap-2 mt-0.5">
                    <span className="flex items-center gap-0.5"><Star size={11} className="text-[color:var(--color-accent)]" /> {p.rating?.toFixed(1)}</span>
                    <span>·</span>
                    <span>{p.sold} vendidos</span>
                  </div>
                </div>
                <div className="text-right font-bold text-[color:var(--color-brand)]">{formatGs(p.price_cents)}</div>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
