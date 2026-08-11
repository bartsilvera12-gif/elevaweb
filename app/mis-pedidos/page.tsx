"use client";
import Link from "next/link";
import Image from "next/image";
import { formatGs } from "@/lib/utils";
import { useOrders, useHydrated } from "@/lib/store";
import { Package, ChevronRight } from "lucide-react";

const statusLabel: Record<string, { l: string; c: string }> = {
  pending: { l: "Pendiente", c: "bg-yellow-100 text-yellow-800" },
  paid: { l: "Pagado", c: "bg-blue-100 text-blue-800" },
  shipped: { l: "Enviado", c: "bg-purple-100 text-purple-800" },
  delivered: { l: "Entregado", c: "bg-green-100 text-green-800" },
};

export default function MisPedidosPage() {
  const hydrated = useHydrated();
  const orders = useOrders((s) => s.orders);
  if (!hydrated) return <div className="container-eleva pt-10 min-h-[400px]" />;

  return (
    <div className="container-eleva pt-6">
      <h1 className="text-3xl font-extrabold">Mis pedidos</h1>
      <p className="text-sm text-[color:var(--color-muted)] mt-1">{orders.length} {orders.length === 1 ? "pedido" : "pedidos"}</p>

      {!orders.length ? (
        <div className="mt-8 card-flat p-10 text-center">
          <Package size={48} className="mx-auto text-[color:var(--color-brand-200)]" />
          <p className="mt-4 text-[color:var(--color-ink-soft)]">Todavía no realizaste ningún pedido.</p>
          <Link href="/catalogo" className="btn-primary mt-6 inline-flex">Ir al catálogo</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3 mt-6">
          {orders.map((o) => {
            const s = statusLabel[o.status] || statusLabel.paid;
            return (
              <Link key={o.id} href={`/pedido?id=${o.id}`} className="card-flat p-5 flex items-center gap-5 hover:border-[color:var(--color-accent)] hover:shadow-md transition">
                <div className="flex -space-x-3 shrink-0">
                  {o.items.slice(0, 3).map((it, i) => (
                    <div key={i} className="relative w-14 h-14 rounded overflow-hidden border-2 border-white bg-[color:var(--color-line-soft)]">
                      <Image src={it.image} alt={it.name} fill sizes="56px" className="object-cover" />
                    </div>
                  ))}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-[color:var(--color-brand)]">{o.id}</span>
                    <span className={"text-[11px] font-bold px-2 py-0.5 rounded uppercase " + s.c}>{s.l}</span>
                  </div>
                  <div className="text-xs text-[color:var(--color-muted)] mt-0.5">{new Date(o.created_at).toLocaleDateString("es-PY", { day: "2-digit", month: "long", year: "numeric" })} · {o.items.length} {o.items.length === 1 ? "producto" : "productos"}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-extrabold text-[color:var(--color-brand)]">{formatGs(o.total_cents)}</div>
                </div>
                <ChevronRight size={18} className="text-[color:var(--color-muted)] shrink-0" />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
