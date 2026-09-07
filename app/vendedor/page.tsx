"use client";
import { motion } from "motion/react";
import Link from "next/link";
import { DollarSign, ShoppingBag, Package, TrendingUp, AlertTriangle } from "lucide-react";
import { formatGs } from "@/lib/utils";
import { useMyProducts } from "@/lib/hooks/use-products";
import { useSellerOrders } from "@/lib/hooks/use-orders";
import { useMyCharges } from "@/lib/hooks/use-platform";

export default function VendedorOverview() {
  const { products } = useMyProducts();
  const { orders } = useSellerOrders();

  const { charges } = useMyCharges();

  const lowStock = products.filter((p) => p.stock_minimo > 0 && p.stock <= p.stock_minimo);
  const cobradas = orders.filter((o) => o.payment_status === "cobrado");
  const totalRevenue = cobradas.reduce((n, o) => n + o.total_cents, 0);
  const porCobrar = orders.filter((o) => o.payment_status !== "cobrado");
  const saldo = charges.reduce((n, c) => n + c.amount_cents, 0);
  const avgTicket = cobradas.length ? Math.round(totalRevenue / cobradas.length) : 0;

  const cards = [
    { icon: DollarSign, label: "Ventas cobradas", value: formatGs(totalRevenue), sub: `${cobradas.length} pedidos` },
    { icon: ShoppingBag, label: "Falta cobrar", value: String(porCobrar.length), sub: "confirmalos en Pedidos" },
    { icon: TrendingUp, label: "Le debés a ELEVA", value: formatGs(Math.max(0, saldo)), sub: "comisiones + depósito" },
    { icon: Package, label: "Productos activos", value: String(products.filter((p) => p.active).length), sub: `Ticket ${formatGs(avgTicket)}` },
  ];

  return (
    <div>
      <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">Overview</h1>
          <p className="text-sm text-[color:var(--color-muted)] mt-1">Resumen de tu actividad en ELEVA</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {cards.map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: i * 0.06 }} className="card-flat p-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[color:var(--color-muted)]"><c.icon size={14} /> {c.label}</div>
            <div className="text-2xl font-extrabold text-[color:var(--color-brand)] mt-2">{c.value}</div>
            <div className="text-[11px] text-[color:var(--color-muted)] mt-0.5">{c.sub}</div>
          </motion.div>
        ))}
      </div>

      {lowStock.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }} className="card-flat p-5 mt-4 border-l-4 border-yellow-400">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-yellow-700 mb-3">
            <AlertTriangle size={14} /> Stock bajo · {lowStock.length} productos
          </div>
          <ul className="divide-y divide-[color:var(--color-line-soft)]">
            {lowStock.slice(0, 5).map((p) => (
              <li key={p.slug} className="flex justify-between items-center py-2 text-sm">
                <Link href={`/vendedor/productos/editar?slug=${p.slug}`} className="font-medium text-[color:var(--color-brand)] hover:text-[color:var(--color-accent)] truncate">{p.name}</Link>
                <span className="text-xs">
                  <span className="font-black text-yellow-700">{p.stock} {p.unit}</span>
                  <span className="text-[color:var(--color-muted)]"> / mín {p.stock_minimo}</span>
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="card-flat p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm uppercase tracking-wider text-[color:var(--color-brand)]">Últimos pedidos</h3>
            <Link href="/vendedor/pedidos" className="text-xs text-[color:var(--color-brand)] font-semibold">Ver todos →</Link>
          </div>
          {orders.length === 0 ? (
            <p className="text-sm text-[color:var(--color-muted)]">Todavía no hay pedidos con tus productos.</p>
          ) : (
            <ul className="divide-y divide-[color:var(--color-line-soft)]">
              {orders.slice(0, 5).map((o) => (
                <li key={o.id} className="flex justify-between py-2.5 text-sm">
                  <div>
                    <div className="font-semibold text-[color:var(--color-brand)]">{o.id}</div>
                    <div className="text-xs text-[color:var(--color-muted)]">{new Date(o.created_at).toLocaleDateString("es-PY")}</div>
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

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.28 }} className="card-flat p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm uppercase tracking-wider text-[color:var(--color-brand)]">Top productos</h3>
            <Link href="/vendedor/productos" className="text-xs text-[color:var(--color-brand)] font-semibold">Ver todos →</Link>
          </div>
          <ul className="divide-y divide-[color:var(--color-line-soft)]">
            {[...products].sort((a, b) => (b.sold ?? 0) - (a.sold ?? 0)).slice(0, 5).map((p) => (
              <li key={p.slug} className="flex justify-between py-2.5 text-sm">
                <div className="min-w-0">
                  <div className="font-semibold line-clamp-1">{p.name}</div>
                  <div className="text-xs text-[color:var(--color-muted)]">{p.sold} vendidos · {p.stock} {p.unit} en stock</div>
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
