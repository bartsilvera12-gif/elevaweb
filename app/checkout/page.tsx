import { formatGs } from "@/lib/utils";
import { products } from "@/lib/mock-products";
import { CreditCard, MapPin, User, Truck, Shield, ArrowRight } from "lucide-react";

const demoCart = [
  { slug: "vestido-midi-floral", qty: 1 },
  { slug: "auriculares-inal", qty: 2 },
];

export default function CheckoutPage() {
  const items = demoCart.map((c) => ({ ...c, p: products.find((x) => x.slug === c.slug)! })).filter((x) => x.p);
  const subtotal = items.reduce((acc, it) => acc + it.p.price_cents * it.qty, 0);
  const envio = subtotal > 500000 ? 0 : 25000;
  const total = subtotal + envio;

  return (
    <div className="container-eleva pt-6">
      <h1 className="text-3xl font-extrabold">Checkout</h1>
      <p className="text-sm text-[color:var(--color-muted)] mt-1">Completá tus datos para finalizar la compra.</p>

      <div className="grid lg:grid-cols-3 gap-6 mt-8">
        <form className="lg:col-span-2 flex flex-col gap-5">
          <section className="card-flat p-5">
            <h2 className="flex items-center gap-2 font-bold text-[color:var(--color-brand)] mb-4"><User size={18} /> Datos de contacto</h2>
            <div className="grid md:grid-cols-2 gap-3">
              <Input label="Nombre" placeholder="Karen" />
              <Input label="Apellido" placeholder="Ayala" />
              <Input label="Email" type="email" placeholder="karen@ejemplo.com" />
              <Input label="Teléfono" placeholder="+595 981 000 000" />
            </div>
          </section>

          <section className="card-flat p-5">
            <h2 className="flex items-center gap-2 font-bold text-[color:var(--color-brand)] mb-4"><MapPin size={18} /> Envío</h2>
            <div className="grid md:grid-cols-2 gap-3">
              <Input label="Dirección" placeholder="Av. España 1234" className="md:col-span-2" />
              <Input label="Ciudad" placeholder="Asunción" />
              <Input label="Departamento" placeholder="Central" />
              <Input label="Referencia (opcional)" placeholder="Casa portón azul" className="md:col-span-2" />
            </div>
          </section>

          <section className="card-flat p-5">
            <h2 className="flex items-center gap-2 font-bold text-[color:var(--color-brand)] mb-4"><CreditCard size={18} /> Pago</h2>
            <div className="grid md:grid-cols-2 gap-3">
              <Input label="Número de tarjeta" placeholder="•••• •••• •••• ••••" className="md:col-span-2" />
              <Input label="Vencimiento" placeholder="MM/AA" />
              <Input label="CVV" placeholder="•••" />
            </div>
          </section>
        </form>

        <aside className="card-flat p-5 h-fit sticky top-24">
          <h3 className="font-bold text-sm uppercase tracking-wider text-[color:var(--color-brand)] mb-4">Tu pedido</h3>
          <ul className="text-sm space-y-2 mb-4">
            {items.map((it) => (
              <li key={it.slug} className="flex justify-between">
                <span className="text-[color:var(--color-ink-soft)]">{it.qty}× {it.p.name}</span>
                <span className="text-[color:var(--color-ink)] font-medium">{formatGs(it.p.price_cents * it.qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="text-sm space-y-1.5 border-t border-[color:var(--color-line)] pt-3">
            <div className="flex justify-between"><dt className="text-[color:var(--color-ink-soft)]">Subtotal</dt><dd className="font-medium">{formatGs(subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-[color:var(--color-ink-soft)]">Envío</dt><dd className="font-medium">{envio === 0 ? "Gratis" : formatGs(envio)}</dd></div>
          </dl>
          <div className="border-t border-[color:var(--color-line)] mt-4 pt-4 flex items-baseline justify-between">
            <span className="font-bold">Total</span>
            <span className="text-2xl font-extrabold text-[color:var(--color-brand)]">{formatGs(total)}</span>
          </div>
          <button className="btn-primary w-full justify-center mt-5">Pagar {formatGs(total)} <ArrowRight size={16} /></button>
          <div className="flex items-center gap-2 text-xs text-[color:var(--color-muted)] mt-3 justify-center">
            <Shield size={12} /> Pago protegido
            <span>·</span>
            <Truck size={12} /> Envío coordinado
          </div>
        </aside>
      </div>
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
