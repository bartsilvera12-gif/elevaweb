"use client";
import Link from "next/link";
import { useAllOrders } from "@/lib/hooks/use-orders";
import { formatGs } from "@/lib/utils";
import { ShoppingBag, ChevronRight, Loader2 } from "lucide-react";

const statusStyle: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
};

export default function AdminPedidos() {
  const { orders, loading } = useAllOrders();
  const totalGMV = orders.reduce((n, o) => n + o.total_cents, 0);
  const totalComm = Math.round(totalGMV * 0.12);

  if (loading) return <div className="flex justify-center py-12 text-[color:var(--color-muted)]"><Loader2 size={20} className="animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">Todos los pedidos</h1>
          <p className="text-sm text-[color:var(--color-muted)] mt-1">GMV: <strong className="text-[color:var(--color-brand)]">{formatGs(totalGMV)}</strong> · Comisión ELEVA: <strong className="text-[color:var(--color-accent)]">{formatGs(totalComm)}</strong></p>
        </div>
      </div>

      {!orders.length ? (
        <div className="card-flat p-10 text-center">
          <ShoppingBag size={48} className="mx-auto text-[color:var(--color-brand-200)]" />
          <p className="mt-4 text-[color:var(--color-ink-soft)]">Todavía no se generaron pedidos en la plataforma.</p>
        </div>
      ) : (
        <div className="card-flat overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[color:var(--color-line-soft)] text-[color:var(--color-ink-soft)] uppercase text-[11px] tracking-wider">
                <th className="text-left px-4 py-3 font-bold">Pedido</th>
                <th className="text-left px-4 py-3 font-bold hidden md:table-cell">Cliente</th>
                <th className="text-left px-4 py-3 font-bold hidden md:table-cell">Fecha</th>
                <th className="text-right px-4 py-3 font-bold">Total</th>
                <th className="text-right px-4 py-3 font-bold hidden md:table-cell">Comisión</th>
                <th className="text-right px-4 py-3 font-bold">Estado</th>
                <th className="w-10 px-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[color:var(--color-line-soft)]">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-[color:var(--color-line-soft)]/40">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-[color:var(--color-brand)]">{o.id}</div>
                    <div className="text-[11px] text-[color:var(--color-muted)]">{(o.order_items ?? []).length} productos</div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">{o.shipping?.name}</td>
                  <td className="px-4 py-3 hidden md:table-cell text-[color:var(--color-ink-soft)]">{new Date(o.created_at).toLocaleDateString("es-PY", { day: "2-digit", month: "short", year: "numeric" })}</td>
                  <td className="px-4 py-3 text-right font-bold text-[color:var(--color-brand)]">{formatGs(o.total_cents)}</td>
                  <td className="px-4 py-3 text-right hidden md:table-cell text-[color:var(--color-accent)] font-semibold">{formatGs(Math.round(o.total_cents * 0.12))}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={"inline-flex text-[11px] font-bold px-2 py-0.5 rounded uppercase " + (statusStyle[o.status] || statusStyle.paid)}>{o.status}</span>
                  </td>
                  <td className="px-2 py-3 text-right">
                    <Link href={`/pedido?id=${o.id}`} className="p-1.5 rounded hover:bg-[color:var(--color-line-soft)] text-[color:var(--color-muted)] inline-flex"><ChevronRight size={16} /></Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
