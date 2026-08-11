"use client";
import Link from "next/link";
import Image from "next/image";
import { formatGs } from "@/lib/utils";
import { useMyOrders } from "@/lib/hooks/use-orders";
import { useUser } from "@/lib/hooks/use-user";
import { Package, ChevronRight, Loader2 } from "lucide-react";

const statusLabel: Record<string, { l: string; c: string }> = {
  pending: { l: "Pendiente", c: "bg-yellow-100 text-yellow-800" },
  paid: { l: "Pagado", c: "bg-blue-100 text-blue-800" },
  shipped: { l: "Enviado", c: "bg-purple-100 text-purple-800" },
  delivered: { l: "Entregado", c: "bg-green-100 text-green-800" },
};

export default function MisPedidosPage() {
  const { user } = useUser();
  const { orders, loading } = useMyOrders();

  if (!user) {
    return (
      <div className="container-eleva pt-10">
        <h1 className="text-3xl font-extrabold">Mis pedidos</h1>
        <div className="mt-8 card-flat p-10 text-center">
          <p className="text-[color:var(--color-ink-soft)]">Iniciá sesión para ver tu historial de pedidos.</p>
          <Link href="/ingresar?next=/mis-pedidos" className="btn-primary mt-6 inline-flex">Ingresar</Link>
        </div>
      </div>
    );
  }

  if (loading) return (
    <div className="container-eleva pt-16 flex justify-center min-h-[400px] items-center text-[color:var(--color-muted)]">
      <Loader2 size={20} className="animate-spin" />
    </div>
  );

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
            const items = o.order_items ?? [];
            return (
              <Link key={o.id} href={`/pedido?id=${o.id}`} className="card-flat p-5 flex items-center gap-5 hover:border-[color:var(--color-accent)] hover:shadow-md transition">
                <div className="flex -space-x-3 shrink-0">
                  {items.slice(0, 3).map((it, i) => (
                    <div key={i} className="relative w-14 h-14 rounded overflow-hidden border-2 border-white bg-[color:var(--color-line-soft)]">
                      {it.product_image && <Image src={it.product_image} alt={it.product_name} fill sizes="56px" className="object-cover" />}
                    </div>
                  ))}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-[color:var(--color-brand)]">{o.id}</span>
                    <span className={"text-[11px] font-bold px-2 py-0.5 rounded uppercase " + s.c}>{s.l}</span>
                  </div>
                  <div className="text-xs text-[color:var(--color-muted)] mt-0.5">
                    {new Date(o.created_at).toLocaleDateString("es-PY", { day: "2-digit", month: "long", year: "numeric" })} · {items.length} {items.length === 1 ? "producto" : "productos"}
                  </div>
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
