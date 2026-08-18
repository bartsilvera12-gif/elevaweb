"use client";
import { motion } from "motion/react";
import Link from "next/link";
import { DollarSign, Users, ShoppingBag, AlertTriangle, TrendingUp, Package, Wallet, Clock } from "lucide-react";
import { formatGs } from "@/lib/utils";
import { useAllOrders } from "@/lib/hooks/use-orders";
import { useLowStock, useProducts } from "@/lib/hooks/use-products";
import { useSellerAccounts } from "@/lib/hooks/use-platform";

export default function AdminOverview() {
  const { orders } = useAllOrders();
  const { items: lowStock } = useLowStock();
  const { products } = useProducts({});
  const { accounts } = useSellerAccounts();

  // Solo cuentan las ventas que el emprendedor ya confirmó como cobradas
  const cobrados = orders.filter((o) => o.payment_status === "cobrado");
  const totalGMV = cobrados.reduce((n, o) => n + o.total_cents, 0);
  const totalComm = cobrados.reduce((n, o) => n + (o.commission_cents ?? 0), 0);
  const esperandoPago = orders.filter((o) => o.payment_status !== "cobrado");
  const porEmpacar = cobrados.filter((o) => o.status === "paid").length;
  const avgTicket = cobrados.length ? Math.round(totalGMV / cobrados.length) : 0;
  const porCobrar = accounts.reduce((n, a) => n + Math.max(0, a.saldo_cents), 0);

  const cards = [
    { icon: DollarSign, label: "Ventas cobradas", value: formatGs(totalGMV), sub: `${cobrados.length} pedidos`, accent: true },
    { icon: TrendingUp, label: "Comisión ELEVA", value: formatGs(totalComm), sub: "sobre ventas confirmadas" },
    { icon: Wallet, label: "Te deben", value: formatGs(porCobrar), sub: "comisiones + depósito", warn: porCobrar > 0 },
    { icon: Package, label: "Para empacar", value: String(porEmpacar), sub: "pagados, sin despachar", warn: porEmpacar > 0 },
    { icon: Clock, label: "Esperando pago", value: String(esperandoPago.length), sub: "el cliente no pagó aún" },
    { icon: ShoppingBag, label: "Ticket promedio", value: formatGs(avgTicket), sub: "por pedido cobrado" },
    { icon: Users, label: "Productos activos", value: String(products.length), sub: "en catálogo" },
    { icon: AlertTriangle, label: "Stock bajo", value: String(lowStock.length), sub: "necesitan reponer", warn: lowStock.length > 0 },
  ];

  return (
    <div>
      <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">Overview</h1>
          <p className="text-sm text-[color:var(--color-muted)] mt-1">Salud del marketplace en tiempo real</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {cards.map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: i * 0.05 }} className={`card-flat p-4 ${c.accent ? "border-l-4 border-[color:var(--color-accent)]" : ""} ${c.warn ? "border-l-4 border-red-400" : ""}`}>
            <div className={"flex items-center gap-2 text-xs font-bold uppercase tracking-wider " + (c.warn ? "text-red-600" : "text-[color:var(--color-muted)]")}>
              <c.icon size={13} /> {c.label}
            </div>
            <div className={"text-2xl font-black mt-2 " + (c.warn ? "text-red-600" : "text-[color:var(--color-brand)]")}>{c.value}</div>
            <div className="text-[11px] text-[color:var(--color-muted)] mt-0.5">{c.sub}</div>
          </motion.div>
        ))}
      </div>

      {lowStock.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="card-flat p-5 mt-4 border-l-4 border-yellow-400">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-yellow-700">
              <AlertTriangle size={14} /> Alerta de stock · {lowStock.length} productos
            </div>
            <Link href="/admin/inventario" className="text-xs text-[color:var(--color-brand)] font-semibold">Ver inventario →</Link>
          </div>
          <ul className="divide-y divide-[color:var(--color-line-soft)]">
            {lowStock.slice(0, 5).map((p) => (
              <li key={p.slug} className="flex justify-between items-center py-2 text-sm">
                <span className="font-medium truncate">{p.name}</span>
                <span className="text-xs"><span className="font-black text-yellow-700">{p.stock} {p.unit}</span> <span className="text-[color:var(--color-muted)]">/ mín {p.stock_minimo}</span></span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.28 }} className="card-flat p-5 mt-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm uppercase tracking-wider text-[color:var(--color-brand)]">Últimos pedidos</h3>
          <Link href="/admin/pedidos" className="text-xs text-[color:var(--color-brand)] font-semibold">Ver todos →</Link>
        </div>
        {orders.length === 0 ? (
          <p className="text-sm text-[color:var(--color-muted)]">Sin pedidos aún.</p>
        ) : (
          <ul className="divide-y divide-[color:var(--color-line-soft)]">
            {orders.slice(0, 6).map((o) => (
              <li key={o.id} className="flex justify-between py-2 text-sm">
                <div>
                  <div className="font-semibold text-[color:var(--color-brand)]">{o.id}</div>
                  <div className="text-xs text-[color:var(--color-muted)]">{new Date(o.created_at).toLocaleString("es-PY")}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-[color:var(--color-brand)]">{formatGs(o.total_cents)}</div>
                  <div className="text-[10px] text-[color:var(--color-accent)] font-semibold">Comisión {formatGs(o.commission_cents ?? 0)}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </motion.div>
    </div>
  );
}
