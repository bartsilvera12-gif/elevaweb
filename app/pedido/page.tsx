"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { formatGs } from "@/lib/utils";
import { useOrder } from "@/lib/hooks/use-orders";
import { useSellerPublic, useReclamos } from "@/lib/hooks/use-platform";
import { useState } from "react";
import { CheckCircle2, Circle, Package, Truck, Home, ChevronRight, Loader2, Wallet, Store, AlertTriangle } from "lucide-react";

const steps = [
  { key: "paid", label: "Pago confirmado", icon: CheckCircle2 },
  { key: "shipped", label: "Despachado", icon: Package },
  { key: "in_transit", label: "En camino", icon: Truck },
  { key: "delivered", label: "Entregado", icon: Home },
];

export default function PedidoDetallePage() {
  const sp = useSearchParams();
  const id = sp.get("id") || "";
  const { order, loading } = useOrder(id);
  const sellerMap = useSellerPublic([order?.seller_id ?? null]);
  const { crear } = useReclamos();
  const [motivo, setMotivo] = useState("");
  const [detalle, setDetalle] = useState("");
  const [abriendo, setAbriendo] = useState(false);
  const [reclamoMsg, setReclamoMsg] = useState<string | null>(null);

  if (loading) return (
    <div className="container-eleva pt-16 flex justify-center min-h-[400px] items-center text-[color:var(--color-muted)]">
      <Loader2 size={20} className="animate-spin" />
    </div>
  );

  if (!order) {
    return (
      <div className="container-eleva pt-10">
        <h1 className="text-3xl font-extrabold">Pedido no encontrado</h1>
        <p className="text-sm text-[color:var(--color-muted)] mt-2">El pedido {id ? <code>{id}</code> : ""} no existe o no tenés permiso para verlo.</p>
        <Link href="/mis-pedidos" className="btn-primary mt-6 inline-flex">Ver mis pedidos</Link>
      </div>
    );
  }

  const items = order.order_items ?? [];
  const currentStep = order.status === "delivered" ? 3 : order.status === "shipped" ? 1 : 0;
  const seller = order.seller_id ? sellerMap[order.seller_id] : null;
  const pagado = order.payment_status === "cobrado";

  const enviarReclamo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!motivo.trim()) return;
    const error = await crear({ order_id: order.id, seller_id: order.seller_id, motivo, detalle });
    setReclamoMsg(error ?? "Reclamo enviado. ELEVA lo va a revisar.");
    if (!error) { setMotivo(""); setDetalle(""); setAbriendo(false); }
  };

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

      <div className={"card-flat p-5 mt-6 border-l-4 " + (pagado ? "border-green-500" : "border-[color:var(--color-accent)]")}>
        <h3 className="flex items-center gap-2 font-bold text-[color:var(--color-brand)]">
          <Wallet size={18} /> {pagado ? "Pago confirmado" : "Cómo pagar este pedido"}
        </h3>
        {pagado ? (
          <p className="text-sm text-[color:var(--color-ink-soft)] mt-2">
            {seller?.store_name || "El emprendedor"} confirmó que recibió tu pago. ELEVA ya puede empaquetar y despachar.
          </p>
        ) : (
          <>
            <p className="text-sm text-[color:var(--color-ink-soft)] mt-2">
              Transferí <strong className="text-[color:var(--color-brand)]">{formatGs(order.total_cents)}</strong> a{" "}
              <strong>{seller?.store_name || "el emprendedor"}</strong>. Cuando confirme que le entró el pago,
              ELEVA empaqueta y despacha tu pedido.
            </p>
            <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm mt-4 pt-4 border-t border-[color:var(--color-line-soft)]">
              {seller?.pago_titular && <Dato k="Titular" v={seller.pago_titular} />}
              {seller?.pago_banco && <Dato k="Banco" v={seller.pago_banco} />}
              {seller?.pago_cuenta && <Dato k="Cuenta" v={seller.pago_cuenta} />}
              {seller?.pago_alias && <Dato k="Alias" v={seller.pago_alias} />}
              {seller?.pago_telefono && <Dato k="Teléfono / giro" v={seller.pago_telefono} />}
            </dl>
            {seller?.pago_notas && <p className="text-sm text-[color:var(--color-ink-soft)] mt-3 whitespace-pre-line">{seller.pago_notas}</p>}
            {seller && !seller.pago_titular && !seller.pago_cuenta && !seller.pago_alias && !seller.pago_telefono && (
              <p className="text-sm text-[color:var(--color-accent)] mt-3">
                Este emprendedor todavía no cargó sus datos de cobro. Te va a contactar al teléfono que dejaste.
              </p>
            )}
          </>
        )}
        {seller?.store_name && (
          <div className="text-xs text-[color:var(--color-muted)] mt-4 flex items-center gap-1.5">
            <Store size={12} /> Vendido por {seller.store_name}
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 card-flat p-5">
          <h3 className="font-bold text-sm uppercase tracking-wider text-[color:var(--color-brand)] mb-3">Productos</h3>
          <div className="flex flex-col divide-y divide-[color:var(--color-line-soft)]">
            {items.map((it) => (
              <div key={`${it.product_slug}-${it.variant || ""}`} className="flex items-center gap-4 py-3">
                <Link href={`/producto/${it.product_slug}/`} className="relative w-16 h-16 shrink-0 rounded overflow-hidden bg-[color:var(--color-line-soft)]">
                  {it.product_image && <Image src={it.product_image} alt={it.product_name} fill sizes="64px" className="object-cover" />}
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/producto/${it.product_slug}/`} className="font-semibold text-[color:var(--color-brand)] hover:text-[color:var(--color-accent)] line-clamp-1">{it.product_name}</Link>
                  <div className="text-xs text-[color:var(--color-muted)]">{it.qty}× {formatGs(it.unit_price_cents)}{it.variant && ` · ${it.variant}`}</div>
                </div>
                <div className="text-right font-bold text-[color:var(--color-brand)]">{formatGs(it.unit_price_cents * it.qty)}</div>
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

          <div className="card-flat p-5">
            <h3 className="flex items-center gap-2 font-bold text-sm uppercase tracking-wider text-[color:var(--color-brand)] mb-3">
              <AlertTriangle size={14} /> ¿Algún problema?
            </h3>
            {reclamoMsg && <p className="text-sm text-[color:var(--color-ink-soft)] mb-3">{reclamoMsg}</p>}
            {!abriendo ? (
              <button onClick={() => { setAbriendo(true); setReclamoMsg(null); }} className="btn-outline text-sm w-full justify-center">
                Abrir un reclamo
              </button>
            ) : (
              <form onSubmit={enviarReclamo} className="flex flex-col gap-2">
                <input
                  autoFocus
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  placeholder="Motivo (ej: llegó dañado)"
                  className="border border-[color:var(--color-line)] rounded px-3 py-2 text-sm focus:outline-none focus:border-[color:var(--color-brand)]"
                />
                <textarea
                  rows={3}
                  value={detalle}
                  onChange={(e) => setDetalle(e.target.value)}
                  placeholder="Contanos qué pasó"
                  className="border border-[color:var(--color-line)] rounded px-3 py-2 text-sm focus:outline-none focus:border-[color:var(--color-brand)]"
                />
                <div className="flex gap-2">
                  <button className="btn-primary text-sm flex-1 justify-center">Enviar</button>
                  <button type="button" onClick={() => setAbriendo(false)} className="btn-outline text-sm">Cancelar</button>
                </div>
              </form>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function Dato({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-2">
      <dt className="text-[color:var(--color-muted)]">{k}</dt>
      <dd className="font-semibold text-[color:var(--color-ink)]">{v}</dd>
    </div>
  );
}
