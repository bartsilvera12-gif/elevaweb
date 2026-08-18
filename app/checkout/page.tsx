"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatGs } from "@/lib/utils";
import { useCart, useHydrated } from "@/lib/store";
import { computeTotals } from "@/lib/coupons";
import { useUser } from "@/lib/hooks/use-user";
import { useProductsBySlugs } from "@/lib/hooks/use-products";
import { useCoupons, useSellerPublic, useSettings } from "@/lib/hooks/use-platform";
import { createClient } from "@/lib/supabase/client";
import type { DBCoupon } from "@/lib/types";
import { Wallet, MapPin, User as UserIcon, Truck, Shield, ArrowRight, Tag, Check, X, Loader2, Store } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const hydrated = useHydrated();
  const items = useCart((s) => s.items);
  const subtotal = useCart((s) => s.subtotalCents());
  const clear = useCart((s) => s.clear);
  const { user, profile } = useUser();
  const { num } = useSettings();
  const { coupons } = useCoupons();
  const { products } = useProductsBySlugs(items.map((i) => i.slug));

  const [coupon, setCoupon] = useState<DBCoupon | null>(null);
  const [couponInput, setCouponInput] = useState("");
  const [couponMsg, setCouponMsg] = useState<{ ok: boolean; msg: string } | null>(null);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [dept, setDept] = useState("Central");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const rules = useMemo(() => ({
    envio_cents: num("envio_cents", 25000),
    envio_gratis_desde_cents: num("envio_gratis_desde_cents", 500000),
  }), [num]);

  // Cada emprendedor cobra por su cuenta: el carrito se divide en un pedido por emprendedor.
  const grupos = useMemo(() => {
    const bySeller = new Map<string, { sellerId: string | null; items: typeof items; subtotal: number }>();
    for (const it of items) {
      const p = products.find((x) => x.slug === it.slug);
      const sid = p?.seller_id ?? null;
      const k = sid ?? "sin-vendedor";
      const g = bySeller.get(k) ?? { sellerId: sid, items: [], subtotal: 0 };
      g.items = [...g.items, it];
      g.subtotal += it.price_cents * it.qty;
      bySeller.set(k, g);
    }
    return [...bySeller.values()];
  }, [items, products]);

  const sellerMap = useSellerPublic(grupos.map((g) => g.sellerId));
  const totals = useMemo(() => computeTotals(subtotal, coupon, rules), [subtotal, coupon, rules]);

  // Mismo prorrateo que hace eleva.create_order, para que lo que se muestra coincida
  const desglose = useMemo(() => grupos.map((g) => {
    let discount = 0;
    if (coupon && !(coupon.min_cents && subtotal < coupon.min_cents)) {
      if (coupon.kind === "percent") discount = Math.round((g.subtotal * coupon.value) / 100);
      else if (coupon.kind === "flat") discount = Math.round((coupon.value * g.subtotal) / (subtotal || 1));
    }
    let shipping = g.subtotal >= rules.envio_gratis_desde_cents ? 0 : rules.envio_cents;
    if (coupon?.kind === "shipping") shipping = 0;
    return { ...g, discount, shipping, total: Math.max(0, g.subtotal - discount + shipping) };
  }), [grupos, coupon, subtotal, rules]);

  const totalAPagar = desglose.reduce((n, g) => n + g.total, 0);

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

  if (!user) {
    return (
      <div className="container-eleva pt-10">
        <h1 className="text-3xl font-extrabold">Ingresá para completar el pedido</h1>
        <p className="text-sm text-[color:var(--color-ink-soft)] mt-2">Necesitás una cuenta para guardar el pedido y hacer seguimiento.</p>
        <div className="flex gap-3 mt-6">
          <Link href={`/ingresar?next=${encodeURIComponent("/checkout")}`} className="btn-primary">Iniciar sesión</Link>
          <Link href="/registro" className="btn-outline">Crear cuenta</Link>
        </div>
      </div>
    );
  }

  const applyCoupon = () => {
    const c = coupons.find((x) => x.code.toUpperCase() === couponInput.trim().toUpperCase());
    if (!c) { setCoupon(null); setCouponMsg({ ok: false, msg: "Ese cupón no existe" }); return; }
    if (c.min_cents && subtotal < c.min_cents) {
      setCoupon(null);
      setCouponMsg({ ok: false, msg: `Este cupón requiere una compra mínima de ${formatGs(c.min_cents)}` });
      return;
    }
    setCoupon(c);
    setCouponMsg({ ok: true, msg: `Aplicado: ${c.label}` });
  };

  const clearCoupon = () => { setCoupon(null); setCouponInput(""); setCouponMsg(null); };

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !address || !city || !phone) return;
    setSubmitting(true);
    setErr(null);

    const prefix = "ELV-" + Math.random().toString(36).slice(2, 8).toUpperCase();
    const { data, error } = await createClient().rpc("create_order", {
      p_prefix: prefix,
      p_coupon: coupon?.code ?? null,
      p_shipping: { name, address, city, dept, phone },
      p_items: items.map((it) => ({ slug: it.slug, qty: it.qty, variant: it.variant ?? null })),
    });

    setSubmitting(false);
    if (error) { setErr(error.message); return; }

    const creadas = (data as { id: string }[]) ?? [];
    clear();
    if (creadas.length === 1) router.push(`/pedido?id=${creadas[0].id}`);
    else router.push("/mis-pedidos");
  };

  return (
    <div className="container-eleva pt-6">
      <h1 className="text-3xl font-extrabold">Checkout</h1>
      <p className="text-sm text-[color:var(--color-muted)] mt-1">
        Hola <strong>{profile?.name || user.email}</strong> · Completá tus datos para finalizar la compra.
      </p>

      <form onSubmit={placeOrder} className="grid lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 flex flex-col gap-5">
          <section className="card-flat p-5">
            <h2 className="flex items-center gap-2 font-bold text-[color:var(--color-brand)] mb-4"><UserIcon size={18} /> Datos de contacto</h2>
            <div className="grid md:grid-cols-2 gap-3">
              <Input label="Nombre completo" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre completo" className="md:col-span-2" />
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
            <h2 className="flex items-center gap-2 font-bold text-[color:var(--color-brand)] mb-4"><Wallet size={18} /> Cómo pagás</h2>
            <p className="text-sm text-[color:var(--color-ink-soft)]">
              Le pagás <strong>directamente a cada emprendedor</strong> con sus datos de cobro. Cuando confirme
              que recibió el pago, ELEVA empaqueta y despacha tu pedido.
            </p>
            {desglose.length > 1 && (
              <p className="text-sm text-[color:var(--color-ink-soft)] mt-2">
                Tu carrito tiene productos de <strong>{desglose.length} emprendedores</strong>, así que se va a dividir
                en {desglose.length} pedidos, uno por cada uno.
              </p>
            )}

            <div className="flex flex-col gap-3 mt-4">
              {desglose.map((g, i) => {
                const s = g.sellerId ? sellerMap[g.sellerId] : null;
                return (
                  <div key={g.sellerId ?? i} className="border border-[color:var(--color-line)] rounded p-4">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-2 font-bold text-[color:var(--color-brand)]">
                        <Store size={16} className="text-[color:var(--color-accent)]" />
                        {s?.store_name || "Emprendedor ELEVA"}
                      </div>
                      <div className="font-extrabold text-[color:var(--color-brand)]">{formatGs(g.total)}</div>
                    </div>
                    <ul className="text-xs text-[color:var(--color-muted)] mt-2 space-y-0.5">
                      {g.items.map((it) => (
                        <li key={`${it.slug}-${it.variant || ""}`}>{it.qty}× {it.name}</li>
                      ))}
                    </ul>
                    <dl className="grid sm:grid-cols-2 gap-x-4 gap-y-1 text-xs mt-3 pt-3 border-t border-[color:var(--color-line-soft)]">
                      {s?.pago_titular && <Dato k="Titular" v={s.pago_titular} />}
                      {s?.pago_banco && <Dato k="Banco" v={s.pago_banco} />}
                      {s?.pago_cuenta && <Dato k="Cuenta" v={s.pago_cuenta} />}
                      {s?.pago_alias && <Dato k="Alias" v={s.pago_alias} />}
                      {s?.pago_telefono && <Dato k="Teléfono / giro" v={s.pago_telefono} />}
                    </dl>
                    {s?.pago_notas && <p className="text-xs text-[color:var(--color-ink-soft)] mt-2 whitespace-pre-line">{s.pago_notas}</p>}
                    {s && !s.pago_titular && !s.pago_cuenta && !s.pago_alias && !s.pago_telefono && (
                      <p className="text-xs text-[color:var(--color-accent)] mt-2">
                        Este emprendedor todavía no cargó sus datos de cobro. Te va a contactar al teléfono que dejaste.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
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
          </div>

          <dl className="text-sm space-y-1.5 border-t border-[color:var(--color-line)] pt-3 mt-3">
            <div className="flex justify-between"><dt className="text-[color:var(--color-ink-soft)]">Subtotal</dt><dd className="font-medium">{formatGs(totals.subtotal)}</dd></div>
            {totals.discount > 0 && <div className="flex justify-between text-[color:var(--color-accent)]"><dt>Descuento</dt><dd className="font-medium">-{formatGs(desglose.reduce((n, g) => n + g.discount, 0))}</dd></div>}
            <div className="flex justify-between"><dt className="text-[color:var(--color-ink-soft)]">Envío</dt><dd className="font-medium">{desglose.every((g) => g.shipping === 0) ? "Gratis" : formatGs(desglose.reduce((n, g) => n + g.shipping, 0))}</dd></div>
          </dl>
          <div className="border-t border-[color:var(--color-line)] mt-3 pt-3 flex items-baseline justify-between">
            <span className="font-bold">Total</span>
            <span className="text-2xl font-extrabold text-[color:var(--color-brand)]">{formatGs(totalAPagar)}</span>
          </div>

          {err && <div className="mt-3 text-sm bg-red-50 text-red-700 border border-red-200 rounded p-2">{err}</div>}

          <button type="submit" disabled={submitting} className="btn-primary w-full justify-center mt-5 disabled:opacity-50">
            {submitting ? <><Loader2 size={16} className="animate-spin" /> Procesando…</> : <>Confirmar pedido <ArrowRight size={16} /></>}
          </button>
          <div className="flex items-center gap-2 text-xs text-[color:var(--color-muted)] mt-3 justify-center">
            <Shield size={12} /> Pagás al emprendedor <span>·</span> <Truck size={12} /> Despacha ELEVA
          </div>
        </aside>
      </form>
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

function Input({ label, className = "", ...rest }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-xs font-semibold text-[color:var(--color-ink-soft)]">{label}</span>
      <input {...rest} className="border border-[color:var(--color-line)] rounded px-3.5 py-2.5 text-sm focus:outline-none focus:border-[color:var(--color-brand)]" />
    </label>
  );
}
