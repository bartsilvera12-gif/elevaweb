"use client";
import { useState } from "react";
import { useSellerOrders, confirmarPago } from "@/lib/hooks/use-orders";
import { formatGs } from "@/lib/utils";
import { ShoppingBag, Loader2, Check, Wallet } from "lucide-react";

const statusLabel: Record<string, string> = {
  pending: "Esperando pago",
  paid: "Cobrado · ELEVA prepara",
  shipped: "Despachado",
  delivered: "Entregado",
};

const statusStyle: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
};

export default function VendedorPedidos() {
  const { orders, loading, refresh } = useSellerOrders();
  const [working, setWorking] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const confirmar = async (id: string, total: number) => {
    if (!confirm(`¿Confirmás que el cliente ya te pagó ${formatGs(total)} por el pedido ${id}?\n\nSe le avisa a ELEVA para que lo despache y se te carga la comisión.`)) return;
    setWorking(id);
    setErr(await confirmarPago(id));
    setWorking(null);
    refresh();
  };

  if (loading) return <div className="flex justify-center py-12 text-[color:var(--color-muted)]"><Loader2 size={20} className="animate-spin" /></div>;

  const pendientes = orders.filter((o) => o.payment_status !== "cobrado");

  return (
    <div>
      <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">Tus pedidos</h1>
          <p className="text-sm text-[color:var(--color-muted)] mt-1">
            {orders.length} pedidos · {pendientes.length > 0
              ? <strong className="text-[color:var(--color-accent)]">{pendientes.length} esperando que confirmes el cobro</strong>
              : "todos cobrados"}
          </p>
        </div>
      </div>

      {err && <div className="mb-4 text-sm bg-red-50 text-red-700 border border-red-200 rounded p-3">{err}</div>}

      {!orders.length ? (
        <div className="card-flat p-10 text-center">
          <ShoppingBag size={48} className="mx-auto text-[color:var(--color-brand-200)]" />
          <p className="mt-4 text-[color:var(--color-ink-soft)]">Todavía no hay pedidos de tus productos.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((o) => (
            <div key={o.id} className={"card-flat p-5 " + (o.payment_status !== "cobrado" ? "border-l-4 border-[color:var(--color-accent)]" : "")}>
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="font-bold text-[color:var(--color-brand)]">{o.id}</div>
                  <div className="text-xs text-[color:var(--color-muted)] mt-0.5">
                    {new Date(o.created_at).toLocaleDateString("es-PY", { day: "2-digit", month: "short", year: "numeric" })} · {(o.order_items ?? []).length} productos
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-extrabold text-[color:var(--color-brand)]">{formatGs(o.total_cents)}</div>
                  <div className="text-[11px] text-[color:var(--color-muted)]">Comisión ELEVA: {formatGs(o.commission_cents ?? 0)}</div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm mt-4 pt-4 border-t border-[color:var(--color-line-soft)]">
                <Dato k="Cliente" v={o.shipping?.name} />
                <Dato k="Teléfono" v={o.shipping?.phone} />
                <Dato k="Dirección" v={`${o.shipping?.address}, ${o.shipping?.city}`} />
                <Dato k="Departamento" v={o.shipping?.dept} />
              </div>

              <ul className="text-xs text-[color:var(--color-muted)] mt-3 space-y-0.5">
                {(o.order_items ?? []).map((it) => (
                  <li key={it.id}>{it.qty}× {it.product_name}{it.variant ? ` (${it.variant})` : ""}</li>
                ))}
              </ul>

              <div className="flex items-center justify-between gap-3 mt-4 pt-4 border-t border-[color:var(--color-line-soft)] flex-wrap">
                <span className={"inline-flex text-[11px] font-bold px-2 py-1 rounded uppercase " + (statusStyle[o.status] || statusStyle.pending)}>
                  {statusLabel[o.status] || o.status}
                </span>
                {o.payment_status !== "cobrado" ? (
                  <button
                    onClick={() => confirmar(o.id, o.total_cents)}
                    disabled={working === o.id}
                    className="btn-primary text-sm disabled:opacity-50"
                  >
                    {working === o.id ? <Loader2 size={14} className="animate-spin" /> : <Wallet size={14} />} Ya me pagó
                  </button>
                ) : (
                  <span className="text-xs text-green-700 font-semibold flex items-center gap-1">
                    <Check size={14} /> Cobro confirmado {o.paid_at ? `el ${new Date(o.paid_at).toLocaleDateString("es-PY")}` : ""}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Dato({ k, v }: { k: string; v?: string }) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-[color:var(--color-muted)]">{k}</span>
      <span className="font-medium text-right">{v || "—"}</span>
    </div>
  );
}
