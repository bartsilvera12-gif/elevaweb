"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatGs } from "@/lib/utils";
import { useCart, useOrders, useHydrated } from "@/lib/store";
import { findCoupon, computeTotals, type Coupon, coupons as allCoupons } from "@/lib/coupons";
import { CreditCard, MapPin, User, Truck, Shield, ArrowRight, Tag, Check, X } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const hydrated = useHydrated();
  const items = useCart((s) => s.items);
  const subtotal = useCart((s) => s.subtotalCents());
  const clear = useCart((s) => s.clear);
  const createOrder = useOrders((s) => s.create);

  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [couponInput, setCouponInput] = useState("");
  const [couponMsg, setCouponMsg] = useState<{ ok: boolean; msg: string } | null>(null);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [dept, setDept] = useState("Central");
  const [phone, setPhone] = useState("");
  const [method, setMethod] = useState<"tarjeta" | "transferencia" | "efectivo">("tarjeta");

  const totals = useMemo(() => computeTotals(subtotal, coupon), [subtotal, coupon]);

  if (!hydrated) return <div className="container-eleva pt-10 min-h-[400px]" />;

  if (!items.length) {
    return (
      <div className="container-eleva pt-10">
        <h1 className="text-3xl font-extrabold">Checkout</h1>
        <div className="mt-8 card-flat p-10 text-center">
          <p className="text-[color:var(--color-ink-soft)]">No tenés productos en el carrito.</p>
          <Link href="/catalogo" className="btn-primary mt-6 inline-flex">Ir al catálogo</Link>
        </div>
      </div>
    );
  }

  const applyCoupon = () => {
    const c = findCoupon(couponInput);
    if (!c) {
      setCoupon(null);
      setCouponMsg({ ok: false, msg: "Ese cupón no existe" });
      return;
    }
    setCoupon(c);
    const t = computeTotals(subtotal, c);
    if (t.couponError) {
      setCouponMsg({ ok: false, msg: t.couponError });
      setCoupon(null);
    } else {
      setCouponMsg({ ok: true, msg: `Aplicado: ${c.label}` });
    }
  };

  const clearCoupon = () => {
    setCoupon(null);
    setCouponInput("");
    setCouponMsg(null);
  };

  const placeOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !address || !city || !phone) return;
    const order = createOrder({
      items,
      subtotal_cents: totals.subtotal,
      discount_cents: totals.discount,
      shipping_cents: totals.shipping,
      total_cents: totals.total,
      coupon: coupon?.code,
      shipping: { name, address, city, dept, phone },
    });
    clear();
    router.push(`/pedido/${order.id}`);
  };

  return (
    <div className="container-eleva pt-6">
      <h1 className="text-3xl font-extrabold">Checkout</h1>
      <p className="text-sm text-[color:var(--color-muted)] mt-1">Completá tus datos para finalizar la compra.</p>

      <form onSubmit={placeOrder} className="grid lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 flex flex-col gap-5">
          <section className="card-flat p-5">
            <h2 className="flex items-center gap-2 font-bold text-[color:var(--color-brand)] mb-4"><User size={18} /> Datos de contacto</h2>
            <div className="grid md:grid-cols-2 gap-3">
              <Input label="Nombre completo" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Karen Ayala" className="md:col-span-2" />
              <Input label="Teléfono" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+595 981 000 000" />
            </div>
          </section>

          <section className="card-flat p-5">
            <h2 className="flex items-center gap-2 font-bold text-[color:var(--color-brand)] mb-4"><MapPin size={18} /> Envío</h2>
            <div className="grid md:grid-cols-2 gap-3">
              <Input label="Dirección" required value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Av. España 1234" className="md:col-span-2" />
              <Input label="Ciudad" required value={city} onChange={(e) => setCity(e.target.value)} placeholder="Asunción" />
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-[color:var(--color-ink-soft)]">Departamento</span>
                <select value={dept} onChange={(e) => setDept(e.target.value)} className="border border-[color:var(--color-line)] rounded px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:border-[color:var(--color-brand)]">
                  {["Central","Asunción","Alto Paraná","Itapúa","Cordillera","Guairá","Caaguazú","Paraguarí","Concepción","San Pedro","Amambay","Canindeyú","Misiones","Ñeembucú","Presidente Hayes","Boquerón","Alto Paraguay","Caazapá"].map((d) => <option key={d}>{d}</option>)}
                </select>
              </label>
            </div>
          </section>

          <section className="card-flat p-5">
            <h2 className="flex items-center gap-2 font-bold text-[color:var(--color-brand)] mb-4"><CreditCard size={18} /> Pago</h2>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {(["tarjeta","transferencia","efectivo"] as const).map((m) => (
                <button key={m} type="button" onClick={() => setMethod(m)} className={
                  "border rounded p-3 text-sm capitalize font-semibold transition " +
                  (method === m ? "border-[color:var(--color-brand)] bg-[color:var(--color-brand-100)] text-[color:var(--color-brand)]" : "border-[color:var(--color-line)] text-[color:var(--color-ink-soft)] hover:border-[color:var(--color-brand)]")
                }>{m === "tarjeta" ? "Tarjeta" : m === "transferencia" ? "Transferencia" : "Efectivo"}</button>
              ))}
            </div>
            {method === "tarjeta" && (
              <div className="grid md:grid-cols-2 gap-3">
                <Input label="Número de tarjeta" placeholder="•••• •••• •••• ••••" className="md:col-span-2" />
                <Input label="Vencimiento" placeholder="MM/AA" />
                <Input label="CVV" placeholder="•••" />
                <div className="md:col-span-2 text-xs text-[color:var(--color-muted)]">
                  o pagalo en cuotas: <strong className="text-[color:var(--color-brand)]">3× {formatGs(Math.round(totals.total / 3))}</strong> · <strong>6× {formatGs(Math.round(totals.total / 6))}</strong>
                </div>
              </div>
            )}
            {method === "transferencia" && (
              <div className="text-sm text-[color:var(--color-ink-soft)]">Te enviaremos los datos bancarios al confirmar el pedido.</div>
            )}
            {method === "efectivo" && (
              <div className="text-sm text-[color:var(--color-ink-soft)]">Pagás en efectivo al momento de recibir tu pedido.</div>
            )}
          </section>
        </div>

        <aside className="card-flat p-5 h-fit lg:sticky lg:top-24">
          <h3 className="font-bold text-sm uppercase tracking-wider text-[color:var(--color-brand)] mb-4">Tu pedido</h3>
          <ul className="text-sm space-y-2 mb-4 max-h-64 overflow-auto pr-1">
            {items.map((it) => (
              <li key={`${it.slug}-${it.variant || ""}`} className="flex justify-between gap-2">
                <span className="text-[color:var(--color-ink-soft)] line-clamp-2">{it.qty}× {it.name}{it.variant && ` (${it.variant})`}</span>
                <span className="text-[color:var(--color-ink)] font-medium shrink-0">{formatGs(it.price_cents * it.qty)}</span>
              </li>
            ))}
          </ul>

          <div className="border-t border-[color:var(--color-line)] pt-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[color:var(--color-brand)] mb-2">
              <Tag size={14} /> Cupón
            </div>
            {coupon ? (
              <div className="flex items-center justify-between bg-[color:var(--color-brand-100)] rounded px-3 py-2 text-sm">
                <span className="font-semibold text-[color:var(--color-brand)]">{coupon.code}</span>
                <button type="button" onClick={clearCoupon} className="text-[color:var(--color-muted)] hover:text-[color:var(--color-accent)]"><X size={14} /></button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input value={couponInput} onChange={(e) => setCouponInput(e.target.value)} placeholder="Ingresá tu cupón" className="flex-1 border border-[color:var(--color-line)] rounded px-3 py-2 text-sm focus:outline-none focus:border-[color:var(--color-brand)]" />
                <button type="button" onClick={applyCoupon} className="btn-outline text-sm px-3">Aplicar</button>
              </div>
            )}
            {couponMsg && (
              <div className={"mt-2 text-xs flex items-center gap-1 " + (couponMsg.ok ? "text-green-600" : "text-[color:var(--color-accent)]")}>
                {couponMsg.ok ? <Check size={12} /> : <X size={12} />} {couponMsg.msg}
              </div>
            )}
            <div className="text-[11px] text-[color:var(--color-muted)] mt-2">
              Probá: {allCoupons.map((c) => c.code).join(" · ")}
            </div>
          </div>

          <dl className="text-sm space-y-1.5 border-t border-[color:var(--color-line)] pt-3 mt-3">
            <div className="flex justify-between"><dt className="text-[color:var(--color-ink-soft)]">Subtotal</dt><dd className="font-medium">{formatGs(totals.subtotal)}</dd></div>
            {totals.discount > 0 && <div className="flex justify-between text-[color:var(--color-accent)]"><dt>Descuento</dt><dd className="font-medium">-{formatGs(totals.discount)}</dd></div>}
            <div className="flex justify-between"><dt className="text-[color:var(--color-ink-soft)]">Envío</dt><dd className="font-medium">{totals.shipping === 0 ? "Gratis" : formatGs(totals.shipping)}</dd></div>
          </dl>
          <div className="border-t border-[color:var(--color-line)] mt-3 pt-3 flex items-baseline justify-between">
            <span className="font-bold">Total</span>
            <span className="text-2xl font-extrabold text-[color:var(--color-brand)]">{formatGs(totals.total)}</span>
          </div>
          <button type="submit" className="btn-primary w-full justify-center mt-5">Pagar {formatGs(totals.total)} <ArrowRight size={16} /></button>
          <div className="flex items-center gap-2 text-xs text-[color:var(--color-muted)] mt-3 justify-center">
            <Shield size={12} /> Pago protegido
            <span>·</span>
            <Truck size={12} /> Envío coordinado
          </div>
        </aside>
      </form>
    </div>
  );
}

function Input({ label, className = "", ...rest }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-xs font-semibold text-[color:var(--color-ink-soft)]">{label}</span>
      <input {...rest} className="border border-[color:var(--color-line)] rounded px-3.5 py-2.5 text-sm focus:outline-none focus:border-[color:var(--color-brand)]" />
    </label>
  );
}
