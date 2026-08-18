"use client";
import { useMemo, useState } from "react";
import { useAllOrders, setOrderStatus } from "@/lib/hooks/use-orders";
import { useSellers } from "@/lib/hooks/use-platform";
import { formatGs } from "@/lib/utils";
import { ShoppingBag, Loader2, Package, Truck, Home, Clock } from "lucide-react";

const filtros = [
  { key: "todos", label: "Todos" },
  { key: "esperando", label: "Esperando pago" },
  { key: "empacar", label: "Listos para empacar" },
  { key: "shipped", label: "Despachados" },
  { key: "delivered", label: "Entregados" },
] as const;

export default function AdminPedidos() {
  const { orders, loading, refresh } = useAllOrders();
  const { sellers } = useSellers();
  const [filtro, setFiltro] = useState<(typeof filtros)[number]["key"]>("todos");
  const [working, setWorking] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const tienda = (id: string | null) => {
    const s = sellers.find((x) => x.id === id);
    return s?.store_name || s?.name || "—";
  };

  const cobrados = orders.filter((o) => o.payment_status === "cobrado");
  const comisionTotal = cobrados.reduce((n, o) => n + (o.commission_cents ?? 0), 0);
  const gmvCobrado = cobrados.reduce((n, o) => n + o.total_cents, 0);

  const lista = useMemo(() => orders.filter((o) => {
    if (filtro === "esperando") return o.payment_status !== "cobrado";
    if (filtro === "empacar") return o.payment_status === "cobrado" && o.status === "paid";
    if (filtro === "shipped") return o.status === "shipped";
    if (filtro === "delivered") return o.status === "delivered";
    return true;
  }), [orders, filtro]);

  const mover = async (id: string, status: "shipped" | "delivered") => {
    setWorking(id);
    setErr(await setOrderStatus(id, status));
    setWorking(null);
    refresh();
  };

  if (loading) return <div className="flex justify-center py-12 text-[color:var(--color-muted)]"><Loader2 size={20} className="animate-spin" /></div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold">Todos los pedidos</h1>
        <p className="text-sm text-[color:var(--color-muted)] mt-1">
          Ventas cobradas: <strong className="text-[color:var(--color-brand)]">{formatGs(gmvCobrado)}</strong> ·
          Tu comisión: <strong className="text-[color:var(--color-accent)]">{formatGs(comisionTotal)}</strong>
        </p>
      </div>

      {err && <div className="mb-4 text-sm bg-red-50 text-red-700 border border-red-200 rounded p-3">{err}</div>}

      <div className="flex gap-2 mb-4 flex-wrap">
        {filtros.map((f) => (
          <button
            key={f.key}
            onClick={() => setFiltro(f.key)}
            className={"text-xs font-semibold px-3 py-2 rounded " + (filtro === f.key ? "bg-[color:var(--color-brand)] text-white" : "text-[color:var(--color-ink-soft)] hover:bg-[color:var(--color-line-soft)]")}
          >
            {f.label}
          </button>
        ))}
      </div>

      {!lista.length ? (
        <div className="card-flat p-10 text-center">
          <ShoppingBag size={48} className="mx-auto text-[color:var(--color-brand-200)]" />
          <p className="mt-4 text-[color:var(--color-ink-soft)]">
            {orders.length ? "No hay pedidos en este filtro." : "Todavía no se generaron pedidos en la plataforma."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {lista.map((o) => (
            <div key={o.id} className="card-flat p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="font-bold text-[color:var(--color-brand)]">{o.id}</div>
                  <div className="text-xs text-[color:var(--color-muted)] mt-0.5">
                    {tienda(o.seller_id)} · {new Date(o.created_at).toLocaleDateString("es-PY", { day: "2-digit", month: "short", year: "numeric" })}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-extrabold text-[color:var(--color-brand)]">{formatGs(o.total_cents)}</div>
                  <div className="text-[11px] text-[color:var(--color-accent)] font-semibold">
                    Comisión: {formatGs(o.commission_cents ?? 0)} ({o.commission_pct ?? 0}%)
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm mt-4 pt-4 border-t border-[color:var(--color-line-soft)]">
                <Dato k="Cliente" v={o.shipping?.name} />
                <Dato k="Teléfono" v={o.shipping?.phone} />
                <Dato k="Dirección" v={`${o.shipping?.address}, ${o.shipping?.city}`} />
                <Dato k="Departamento" v={o.shipping?.dept} />
                <Dato k="Método de pago" v={o.payment_method === "efectivo" ? "Efectivo" : "Transferencia"} />
              </div>

              <ul className="text-xs text-[color:var(--color-muted)] mt-3 space-y-0.5">
                {(o.order_items ?? []).map((it) => (
                  <li key={it.id}>{it.qty}× {it.product_name}{it.variant ? ` (${it.variant})` : ""}</li>
                ))}
              </ul>

              <div className="flex items-center justify-between gap-3 mt-4 pt-4 border-t border-[color:var(--color-line-soft)] flex-wrap">
                <Estado order={o} />
                <div className="flex gap-2">
                  {o.payment_status === "cobrado" && o.status === "paid" && (
                    <button onClick={() => mover(o.id, "shipped")} disabled={working === o.id} className="btn-primary text-sm disabled:opacity-50">
                      {working === o.id ? <Loader2 size={14} className="animate-spin" /> : <Truck size={14} />} Marcar despachado
                    </button>
                  )}
                  {o.status === "shipped" && (
                    <button onClick={() => mover(o.id, "delivered")} disabled={working === o.id} className="btn-primary text-sm disabled:opacity-50">
                      {working === o.id ? <Loader2 size={14} className="animate-spin" /> : <Home size={14} />} Marcar entregado
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Estado({ order }: { order: { payment_status: string; status: string } }) {
  if (order.payment_status !== "cobrado") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-1 rounded uppercase bg-yellow-100 text-yellow-800">
        <Clock size={12} /> Esperando que el emprendedor cobre
      </span>
    );
  }
  if (order.status === "paid") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-1 rounded uppercase bg-blue-100 text-blue-800">
        <Package size={12} /> Listo para empacar
      </span>
    );
  }
  if (order.status === "shipped") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-1 rounded uppercase bg-purple-100 text-purple-800">
        <Truck size={12} /> Despachado
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-1 rounded uppercase bg-green-100 text-green-800">
      <Home size={12} /> Entregado
    </span>
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
