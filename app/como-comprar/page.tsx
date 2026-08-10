"use client";
import Link from "next/link";
import { motion } from "motion/react";
import { useState } from "react";
import { ChevronDown, Search, ShoppingCart, CreditCard, Truck, Package, Shield, Clock, MapPin, MessageCircle, ArrowRight } from "lucide-react";

const pasos = [
  {
    n: 1,
    icon: Search,
    t: "Elegí tu producto",
    d: "Explorá el catálogo, filtrá por categoría o marca, revisá reseñas y guardá favoritos.",
    tip: "Buscá directo desde la barra de arriba o navegá por categorías desde el menú.",
  },
  {
    n: 2,
    icon: ShoppingCart,
    t: "Sumá al carrito",
    d: "Ajustá cantidades y elegí talle o color cuando corresponda. Ves el subtotal en tiempo real.",
    tip: "Envío gratis en compras desde Gs. 500.000.",
  },
  {
    n: 3,
    icon: CreditCard,
    t: "Pagá seguro",
    d: "Ingresá tus datos de envío y elegí cómo pagar: tarjeta (hasta 6 cuotas sin interés), transferencia o efectivo al recibir.",
    tip: "Usá un cupón: ELEVA10, ENVIOGRATIS, NUEVO5.",
  },
  {
    n: 4,
    icon: Truck,
    t: "Recibí en tu casa",
    d: "Coordinamos con el vendedor y te avisamos cuando tu pedido esté en camino. Seguilo en Mis pedidos.",
    tip: "Envíos a los 17 departamentos del país.",
  },
];

const pagos = [
  { t: "Tarjeta", d: "Visa, Mastercard, Cabal. Hasta 6 cuotas sin interés." },
  { t: "Transferencia", d: "Recibís los datos bancarios al confirmar el pedido." },
  { t: "Efectivo", d: "Pagás al recibir el producto en tu domicilio." },
];

const envios = [
  { icon: MapPin, t: "Área Metropolitana", d: "Asunción y Central: 24 a 48 horas." },
  { icon: Truck, t: "Interior", d: "Resto del país: 3 a 5 días hábiles por encomienda." },
  { icon: Clock, t: "Retiro en depósito", d: "Sin costo. Coordinás horario con el vendedor." },
];

const garantias = [
  { icon: Shield, t: "Pago protegido", d: "Retenemos el pago hasta confirmar tu recepción. Si algo sale mal, te devolvemos el dinero." },
  { icon: Package, t: "Devolución en 7 días", d: "Si el producto no coincide con lo publicado, coordinamos la devolución sin costo." },
  { icon: MessageCircle, t: "Soporte real", d: "Chat con nuestro equipo por WhatsApp, de lunes a sábado, 9:00 a 20:00." },
];

const faqs = [
  { q: "¿Necesito una cuenta para comprar?", a: "No. Podés comprar como invitado. Sí te recomendamos crear cuenta para ver historial de pedidos, guardar direcciones y cargar favoritos." },
  { q: "¿Cuánto tarda mi pedido en llegar?", a: "En Asunción y Central, entre 24 y 48 horas. En el interior, 3 a 5 días hábiles por encomienda. Recibís el número de seguimiento por email y WhatsApp." },
  { q: "¿Puedo pagar en cuotas?", a: "Sí, hasta 6 cuotas sin interés con tarjetas de crédito. El detalle aparece en el checkout antes de confirmar." },
  { q: "¿Qué pasa si el producto no llega o llega en mal estado?", a: "Tenés 7 días para reclamar. Nosotros retenemos el pago hasta confirmar tu recepción. Si algo no está bien, coordinamos devolución o reembolso." },
  { q: "¿Puedo cambiar la dirección después de comprar?", a: "Sí, siempre que el pedido no haya sido despachado. Escribinos por WhatsApp al +595 981 000 000 con el número de pedido." },
  { q: "¿Cómo uso un cupón?", a: "En el checkout, después del resumen, hay un campo 'Cupón'. Ingresá el código y hacé click en Aplicar. Códigos activos: ELEVA10, NUEVO5, ENVIOGRATIS, MENOS20K." },
];

export default function ComoComprarPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-[#240453] via-[#3B1370] to-[#240453] text-white">
        <div className="container-eleva py-14 md:py-16">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="text-xs font-bold tracking-widest uppercase text-[color:var(--color-accent)]">Guía rápida</div>
            <h1 className="text-3xl md:text-5xl font-extrabold mt-2 max-w-3xl">Cómo comprar en ELEVA</h1>
            <p className="text-white/80 mt-3 max-w-xl">Comprar en ELEVA es tan simple como pedir delivery. Estos son los pasos, los métodos de pago y las garantías.</p>
          </motion.div>
        </div>
      </section>

      <section className="container-eleva pt-12">
        <div className="grid md:grid-cols-2 gap-4">
          {pasos.map((p, i) => (
            <motion.div
              key={p.n}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.35, delay: i * 0.07 }}
              className="card-flat p-6 flex gap-5"
            >
              <div className="flex flex-col items-center gap-2 shrink-0">
                <div className="w-11 h-11 rounded bg-[color:var(--color-accent)] text-white font-extrabold flex items-center justify-center">{p.n}</div>
                <div className="w-11 h-11 rounded bg-[color:var(--color-brand-100)] text-[color:var(--color-brand)] flex items-center justify-center"><p.icon size={20} /></div>
              </div>
              <div>
                <h3 className="font-bold text-lg text-[color:var(--color-brand-900)]">{p.t}</h3>
                <p className="text-sm text-[color:var(--color-ink-soft)] mt-1 leading-relaxed">{p.d}</p>
                <div className="text-xs text-[color:var(--color-accent)] font-semibold mt-2 flex items-center gap-1.5">
                  <ArrowRight size={12} /> {p.tip}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container-eleva pt-16">
        <div className="text-xs font-bold tracking-widest uppercase text-[color:var(--color-accent)]">Métodos de pago</div>
        <h2 className="text-2xl md:text-3xl font-extrabold mt-1">Pagá como te quede mejor</h2>
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          {pagos.map((p, i) => (
            <motion.div key={p.t} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.3, delay: i * 0.07 }} className="card-flat p-5">
              <div className="text-sm font-bold text-[color:var(--color-brand)]">{p.t}</div>
              <p className="text-sm text-[color:var(--color-ink-soft)] mt-1">{p.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container-eleva pt-16">
        <div className="text-xs font-bold tracking-widest uppercase text-[color:var(--color-accent)]">Envíos</div>
        <h2 className="text-2xl md:text-3xl font-extrabold mt-1">A todo Paraguay</h2>
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          {envios.map((e, i) => (
            <motion.div key={e.t} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.3, delay: i * 0.07 }} className="card-flat p-5 flex gap-3">
              <div className="w-10 h-10 rounded bg-[color:var(--color-brand-100)] text-[color:var(--color-brand)] flex items-center justify-center shrink-0"><e.icon size={18} /></div>
              <div>
                <div className="text-sm font-bold text-[color:var(--color-brand)]">{e.t}</div>
                <p className="text-sm text-[color:var(--color-ink-soft)] mt-1">{e.d}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container-eleva pt-16">
        <div className="text-xs font-bold tracking-widest uppercase text-[color:var(--color-accent)]">Garantías</div>
        <h2 className="text-2xl md:text-3xl font-extrabold mt-1">Comprás tranquilo</h2>
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          {garantias.map((g, i) => (
            <motion.div key={g.t} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.3, delay: i * 0.07 }} className="card-flat p-5">
              <div className="w-10 h-10 rounded bg-[color:var(--color-accent)]/10 text-[color:var(--color-accent)] flex items-center justify-center"><g.icon size={18} /></div>
              <div className="text-sm font-bold text-[color:var(--color-brand)] mt-3">{g.t}</div>
              <p className="text-sm text-[color:var(--color-ink-soft)] mt-1 leading-relaxed">{g.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container-eleva pt-16">
        <div className="text-xs font-bold tracking-widest uppercase text-[color:var(--color-accent)]">Dudas frecuentes</div>
        <h2 className="text-2xl md:text-3xl font-extrabold mt-1">Preguntas de compradores</h2>
        <div className="max-w-3xl mt-6 flex flex-col gap-2">
          {faqs.map((f, i) => <Faq key={f.q} f={f} i={i} />)}
        </div>
      </section>

      <section className="container-eleva pt-16 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.4 }}
          className="rounded overflow-hidden bg-gradient-to-br from-[#240453] via-[#3B1370] to-[#240453] text-white p-10 md:p-14 text-center"
        >
          <h2 className="text-2xl md:text-3xl font-extrabold">¿Quedaste con alguna duda?</h2>
          <p className="text-white/80 mt-2 max-w-xl mx-auto">Escribinos por WhatsApp al +595 981 000 000 o entrá al formulario de contacto.</p>
          <div className="flex gap-3 justify-center mt-6 flex-wrap">
            <a href="https://wa.me/595981000000" target="_blank" rel="noopener" className="btn-primary">
              <MessageCircle size={18} /> Chatear por WhatsApp
            </a>
            <Link href="/contacto" className="btn-outline bg-transparent text-white border-white/30 hover:bg-white/10">Ir a Contacto</Link>
          </div>
        </motion.div>
      </section>
    </>
  );
}

function Faq({ f, i }: { f: { q: string; a: string }; i: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.3, delay: i * 0.05 }}
      className="card-flat"
    >
      <button onClick={() => setOpen((v) => !v)} className="w-full flex items-center justify-between text-left p-4 gap-4">
        <span className="font-semibold text-[color:var(--color-brand-900)]">{f.q}</span>
        <ChevronDown size={18} className={"text-[color:var(--color-muted)] transition-transform " + (open ? "rotate-180" : "")} />
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.22 }}
        className="overflow-hidden"
      >
        <div className="px-4 pb-4 text-sm text-[color:var(--color-ink-soft)] leading-relaxed">{f.a}</div>
      </motion.div>
    </motion.div>
  );
}
