"use client";
import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatGs } from "@/lib/utils";
import { useOrders, useHydrated } from "@/lib/store";
import { CheckCircle2, CircleDot, Circle, Package, Truck, Home, ChevronRight } from "lucide-react";

const steps = [
  { key: "paid", label: "Pagado", icon: CheckCircle2 },
  { key: "shipped", label: "Despachado", icon: Package },
  { key: "in_transit", label: "En camino", icon: Truck },
  { key: "delivered", label: "Entregado", icon: Home },
];

export default function PedidoDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const hydrated = useHydrated();
  const order = useOrders((s) => s.orders.find((o) => o.id === id));

  if (!hydrated) return <div className="container-eleva pt-10 min-h-[400px]" />;

  if (!order) {
    return (
      <div className="container-eleva pt-10">
        <h1 className="text-3xl font-extrabold">Pedido no encontrado</h1>
        <Link href="/mis-pedidos" className="btn-primary mt-6 inline-flex">Ver mis pedidos</Link>
      </div>
    );
  }

  const currentStep = order.status === "delivered" ? 3 : order.status === "shipped" ? 1 : 0;

  return (
    <div className="container-eleva pt-6">
      <nav className="text-xs text-[color:var(--color-muted)] flex items-center gap-1.5 mb-4">
        <Link href="/" className="hover:text-[color:var(--color-brand)]">Inicio</Link>
        <ChevronRight size={12} />
        <Link href="/mis-pedidos" className="hover:text-[color:var(--color-brand)]">Mis pedidos</Link>
        <ChevronRight size={12} />
        <span className="text-[color:var(--color-ink-soft)]">{order.id}</span>
      </nav>

      <div className="card-flat p-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="text-xs text-[color:var(--color-muted)] uppercase tracking-wider font-bold">Pedido</div>
            <div className="text-2xl font-extrabold text-[color:var(--color-brand)]">{order.id}</div>
            <div className="text-sm text-[color:var(--color-muted)] mt-1">{new Date(order.created_at).toLocaleString("es-PY")}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-[color:var(--color-muted)] uppercase tracking-wider font-bold">Total</div>
            <div className="text-2xl font-extrabold text-[color:var(--color-brand)]">{formatGs(order.total_cents)}</div>
          </div>
        </div>

        <div className="mt-6 relative">
          <div className="absolute top-5 left-5 right-5 h-0.5 bg-[color:var(--color-line)]" />
          <div className="absolute top-5 left-5 h-0.5 bg-[color:var(--color-accent)] transition-all" style={{ width: `${(currentStep / (steps.length - 1)) * 100}%`, maxWidth: "calc(100% - 40px)" }} />
          <div className="relative grid grid-cols-4 gap-2">
            {steps.map((s, i) => {
              const done = i <= currentStep;
              const Icon = done ? s.icon : Circle;
              return (
                <div key={s.key} className="flex flex-col items-center">
                  <div className={"w-10 h-10 rounded-full flex items-center justify-center border-2 " + (done ? "bg-[color:var(--color-accent)] border-[color:var(--color-accent)] text-white" : "bg-white border-[color:var(--color-line)] text-[color:var(--color-muted)]")}>
                    <Icon size={18} />
                  </div>
                  <div className={"text-xs font-semibold mt-2 text-center " + (done ? "text-[color:var(--color-brand)]" : "text-[color:var(--color-muted)]")}>{s.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 card-flat p-5">
          <h3 className="font-bold text-sm uppercase tracking-wider text-[color:var(--color-brand)] mb-3">Productos</h3>
          <div className="flex flex-col divide-y divide-[color:var(--color-line-soft)]">
            {order.items.map((it) => (
              <div key={`${it.slug}-${it.variant || ""}`} className="flex items-center gap-4 py-3">
                <Link href={`/producto/${it.slug}`} className="relative w-16 h-16 shrink-0 rounded overflow-hidden bg-[color:var(--color-line-soft)]">
                  <Image src={it.image} alt={it.name} fill sizes="64px" className="object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/producto/${it.slug}`} className="font-semibold text-[color:var(--color-brand)] hover:text-[color:var(--color-accent)] line-clamp-1">{it.name}</Link>
                  <div className="text-xs text-[color:var(--color-muted)]">{it.qty}× {formatGs(it.price_cents)}{it.variant && ` · ${it.variant}`}</div>
                </div>
                <div className="text-right font-bold text-[color:var(--color-brand)]">{formatGs(it.price_cents * it.qty)}</div>
              </div>
            ))}
          </div>
        </div>

        <aside className="flex flex-col gap-4">
          <div className="card-flat p-5">
            <h3 className="font-bold text-sm uppercase tracking-wider text-[color:var(--color-brand)] mb-3">Resumen</h3>
            <dl className="text-sm space-y-1.5">
              <div className="flex justify-between"><dt className="text-[color:var(--color-ink-soft)]">Subtotal</dt><dd className="font-medium">{formatGs(order.subtotal_cents)}</dd></div>
              {order.discount_cents > 0 && <div className="flex justify-between text-[color:var(--color-accent)]"><dt>Descuento{order.coupon ? ` (${order.coupon})` : ""}</dt><dd className="font-medium">-{formatGs(order.discount_cents)}</dd></div>}
              <div className="flex justify-between"><dt className="text-[color:var(--color-ink-soft)]">Envío</dt><dd className="font-medium">{order.shipping_cents === 0 ? "Gratis" : formatGs(order.shipping_cents)}</dd></div>
            </dl>
            <div className="border-t border-[color:var(--color-line)] mt-3 pt-3 flex items-baseline justify-between">
              <span className="font-bold">Total</span>
              <span className="text-xl font-extrabold text-[color:var(--color-brand)]">{formatGs(order.total_cents)}</span>
            </div>
          </div>

          <div className="card-flat p-5">
            <h3 className="font-bold text-sm uppercase tracking-wider text-[color:var(--color-brand)] mb-3">Envío a</h3>
            <div className="text-sm text-[color:var(--color-ink-soft)] leading-relaxed">
              <div className="font-semibold text-[color:var(--color-ink)]">{order.shipping.name}</div>
              <div>{order.shipping.address}</div>
              <div>{order.shipping.city}, {order.shipping.dept}</div>
              <div>{order.shipping.phone}</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
