import Link from "next/link";
import { formatGs } from "@/lib/utils";
import { products } from "@/lib/mock-products";
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight } from "lucide-react";

const demoCart = [
  { slug: "vestido-midi-floral", qty: 1 },
  { slug: "auriculares-inal", qty: 2 },
  { slug: "cafe-100g", qty: 3 },
];

export default function CarritoPage() {
  const items = demoCart.map((c) => ({ ...c, p: products.find((x) => x.slug === c.slug)! })).filter((x) => x.p);
  const subtotal = items.reduce((acc, it) => acc + it.p.price_cents * it.qty, 0);
  const envio = subtotal > 500000 ? 0 : 25000;
  const total = subtotal + envio;

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
      <p className="text-sm text-[color:var(--color-muted)] mt-1">{items.length} productos</p>

      <div className="grid lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 flex flex-col gap-3">
          {items.map((it) => (
            <div key={it.slug} className="card-flat p-4 flex items-center gap-4">
              <div className="w-20 h-20 shrink-0 bg-gradient-to-br from-[#F1EAFB] to-[#FFD9C2] rounded" />
              <div className="flex-1 min-w-0">
                <Link href={`/producto/${it.p.slug}`} className="font-semibold text-[color:var(--color-brand)] hover:text-[color:var(--color-accent)] line-clamp-1">{it.p.name}</Link>
                <div className="text-xs text-[color:var(--color-muted)] capitalize mt-0.5">{it.p.category}</div>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex items-center border border-[color:var(--color-line)] rounded">
                    <button className="w-8 h-8 flex items-center justify-center text-[color:var(--color-brand)] hover:bg-[color:var(--color-line-soft)]"><Minus size={14} /></button>
                    <span className="w-8 text-center text-sm font-semibold">{it.qty}</span>
                    <button className="w-8 h-8 flex items-center justify-center text-[color:var(--color-brand)] hover:bg-[color:var(--color-line-soft)]"><Plus size={14} /></button>
                  </div>
                  <button className="text-xs text-[color:var(--color-muted)] flex items-center gap-1 hover:text-[color:var(--color-accent)]"><Trash2 size={13} /> Eliminar</button>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-extrabold text-[color:var(--color-brand)]">{formatGs(it.p.price_cents * it.qty)}</div>
                <div className="text-xs text-[color:var(--color-muted)]">{formatGs(it.p.price_cents)} c/u</div>
              </div>
            </div>
          ))}
        </div>

        <aside className="card-flat p-5 h-fit sticky top-24">
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
