"use client";
import Link from "next/link";
import Image from "next/image";
import { formatGs } from "@/lib/utils";
import { useCart, useHydrated } from "@/lib/store";
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight } from "lucide-react";

export default function CarritoPage() {
  const hydrated = useHydrated();
  const items = useCart((s) => s.items);
  const subtotal = useCart((s) => s.subtotalCents());
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);

  if (!hydrated) {
    return <div className="container-eleva pt-10 min-h-[400px]" />;
  }

  const envio = subtotal >= 500000 ? 0 : subtotal > 0 ? 25000 : 0;
  const total = subtotal + envio;
  const faltaGratis = Math.max(0, 500000 - subtotal);

  if (!items.length) {
    return (
      <div className="container-eleva pt-10">
        <h1 className="text-3xl font-extrabold">Tu carrito</h1>
        <div className="mt-8 card-flat p-10 text-center">
          <ShoppingCart size={48} className="mx-auto text-[color:var(--color-brand-200)]" />
          <p className="mt-4 text-[color:var(--color-ink-soft)]">Tu carrito está vacío.</p>
          <Link href="/catalogo" className="btn-primary mt-6 inline-flex">Ver productos</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-eleva pt-6">
      <h1 className="text-3xl font-extrabold">Tu carrito</h1>
      <p className="text-sm text-[color:var(--color-muted)] mt-1">{items.length} {items.length === 1 ? "producto" : "productos"}</p>

      {faltaGratis > 0 && (
        <div className="mt-4 card-flat p-4">
          <div className="text-sm text-[color:var(--color-ink-soft)]">
            Te faltan <strong className="text-[color:var(--color-brand)]">{formatGs(faltaGratis)}</strong> para envío gratis.
          </div>
          <div className="h-1.5 bg-[color:var(--color-line-soft)] rounded mt-2 overflow-hidden">
            <div className="h-full bg-[color:var(--color-accent)]" style={{ width: `${Math.min(100, (subtotal / 500000) * 100)}%` }} />
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 flex flex-col gap-3">
          {items.map((it) => (
            <div key={`${it.slug}-${it.variant || ""}`} className="card-flat p-4 flex items-center gap-4">
              <Link href={`/producto?slug=${it.slug}`} className="relative w-20 h-20 shrink-0 rounded overflow-hidden bg-[color:var(--color-line-soft)]">
                <Image src={it.image} alt={it.name} fill sizes="80px" className="object-cover" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link href={`/producto?slug=${it.slug}`} className="font-semibold text-[color:var(--color-brand)] hover:text-[color:var(--color-accent)] line-clamp-1">{it.name}</Link>
                {it.variant && <div className="text-xs text-[color:var(--color-muted)] mt-0.5">Variante: {it.variant}</div>}
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex items-center border border-[color:var(--color-line)] rounded">
                    <button onClick={() => setQty(it.slug, it.variant, it.qty - 1)} className="w-8 h-8 flex items-center justify-center text-[color:var(--color-brand)] hover:bg-[color:var(--color-line-soft)]"><Minus size={14} /></button>
                    <span className="w-8 text-center text-sm font-semibold">{it.qty}</span>
                    <button onClick={() => setQty(it.slug, it.variant, it.qty + 1)} className="w-8 h-8 flex items-center justify-center text-[color:var(--color-brand)] hover:bg-[color:var(--color-line-soft)]"><Plus size={14} /></button>
                  </div>
                  <button onClick={() => remove(it.slug, it.variant)} className="text-xs text-[color:var(--color-muted)] flex items-center gap-1 hover:text-[color:var(--color-accent)]"><Trash2 size={13} /> Eliminar</button>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-extrabold text-[color:var(--color-brand)]">{formatGs(it.price_cents * it.qty)}</div>
                <div className="text-xs text-[color:var(--color-muted)]">{formatGs(it.price_cents)} c/u</div>
              </div>
            </div>
          ))}
          <button onClick={clear} className="text-xs text-[color:var(--color-muted)] mt-2 hover:text-[color:var(--color-accent)] w-fit">Vaciar carrito</button>
        </div>

        <aside className="card-flat p-5 h-fit lg:sticky lg:top-24">
          <h3 className="font-bold text-sm uppercase tracking-wider text-[color:var(--color-brand)] mb-4">Resumen</h3>
          <dl className="text-sm space-y-2">
            <Row k="Subtotal" v={formatGs(subtotal)} />
            <Row k="Envío" v={envio === 0 ? "Gratis" : formatGs(envio)} />
          </dl>
          <div className="border-t border-[color:var(--color-line)] mt-4 pt-4 flex items-baseline justify-between">
            <span className="font-bold text-[color:var(--color-brand-900)]">Total</span>
            <span className="text-2xl font-extrabold text-[color:var(--color-brand)]">{formatGs(total)}</span>
          </div>
          <Link href="/checkout" className="btn-primary w-full justify-center mt-5">
            Ir al checkout <ArrowRight size={16} />
          </Link>
          <p className="text-xs text-[color:var(--color-muted)] text-center mt-3">Pago protegido · Envío coordinado</p>
        </aside>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-[color:var(--color-ink-soft)]">{k}</dt>
      <dd className="text-[color:var(--color-ink)] font-medium">{v}</dd>
    </div>
  );
}
