"use client";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight, TrendingUp, ShieldCheck, Store, ChevronDown, Warehouse, Wallet } from "lucide-react";
import { useState } from "react";

const beneficios = [
  { icon: Warehouse, t: "Nosotros almacenamos", d: "Dejás tu stock en nuestro depósito de Asunción y nos ocupamos de recepción, control y logística." },
  { icon: TrendingUp, t: "Aparecés en el catálogo", d: "Tus productos entran al buscador, ofertas y novedades. Sin pagar más por visibilidad básica." },
  { icon: Wallet, t: "Cobrás semanalmente", d: "Todos los lunes recibís la liquidación de la semana pasada por transferencia. Sin comisiones ocultas." },
  { icon: ShieldCheck, t: "Vos ponés el precio", d: "Nosotros solo cobramos una comisión clara del 12% por venta cerrada. Sin cargos por publicar." },
];

const pasos = [
  { n: 1, t: "Creá tu cuenta", d: "Registrate con tu email en menos de 2 minutos." },
  { n: 2, t: "Cargá tus productos", d: "Subís fotos, precio y stock desde el panel." },
  { n: 3, t: "Traé el stock", d: "Coordinamos que dejes tus productos en nuestro depósito." },
  { n: 4, t: "Cobrás cada lunes", d: "Recibís tu liquidación por transferencia bancaria." },
];

const testimonios = [
  { n: "Camila R.", tienda: "Sana Botánica", txt: "Antes vendía solo por Instagram. En 3 meses en ELEVA tripliqué las ventas y no toco más envíos." },
  { n: "Javier M.", tienda: "Mate & Yerba", txt: "Lo que más me gustó es la transparencia. Sé exactamente cuánto cobro y cuándo. Nunca falla." },
  { n: "Lorena B.", tienda: "Casa Nordica", txt: "Cargo los productos y me olvido. Ellos almacenan, empacan, entregan. Yo me concentro en crear." },
];

const faqs = [
  { q: "¿Cuánto cobra ELEVA por venta?", a: "12% por venta cerrada. No cobramos por publicar, ni por almacenar los primeros 30 días. Sin costos ocultos." },
  { q: "¿Cómo entrego mi stock?", a: "Cuando cargues tus primeros productos, coordinamos día y hora para que traigas el stock a nuestro depósito en Asunción, o pasamos a buscarlo en Central." },
  { q: "¿Cuándo cobro?", a: "Todos los lunes por transferencia bancaria, liquidamos las ventas cerradas de la semana anterior (menos comisión)." },
  { q: "¿Qué pasa si mi producto no se vende?", a: "Podés retirarlo cuando quieras sin costo. Los primeros 30 días de almacenamiento son gratis, después es Gs. 500/día por producto." },
  { q: "¿Puedo vender desde el interior?", a: "Sí. Coordinamos el envío del stock al depósito por encomienda. Los primeros envíos los cubrimos nosotros." },
];

export default function VenderPage() {
  return (
    <>
      <div className="container-eleva pt-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[color:var(--color-brand-900)]">Vendé en ELEVA</h1>
        <p className="text-[color:var(--color-ink-soft)] mt-2 max-w-xl">
          Vos creás y publicás tus productos. Nosotros los almacenamos, vendemos y entregamos en todo Paraguay.
        </p>
        <div className="mt-5 flex gap-3 flex-wrap">
          <Link href="/registro" className="btn-primary">Empezar ahora <ArrowUpRight size={18} /></Link>
          <a href="#como-funciona" className="btn-outline">Ver cómo funciona</a>
        </div>
      </div>

      <section className="container-eleva pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-xs font-bold tracking-widest uppercase text-[color:var(--color-accent)] text-center">Beneficios</div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mt-2">Menos operación, más ventas</h2>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-4 mt-10 max-w-5xl mx-auto">
          {beneficios.map((b, i) => (
            <motion.div
              key={b.t}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="card-flat p-6 flex gap-4"
            >
              <div className="w-12 h-12 shrink-0 rounded bg-[color:var(--color-brand-100)] text-[color:var(--color-brand)] flex items-center justify-center"><b.icon size={22} /></div>
              <div>
                <h3 className="font-bold text-[color:var(--color-brand-900)]">{b.t}</h3>
                <p className="text-sm text-[color:var(--color-ink-soft)] mt-1 leading-relaxed">{b.d}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="como-funciona" className="container-eleva pt-20 scroll-mt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-xs font-bold tracking-widest uppercase text-[color:var(--color-accent)] text-center">Proceso</div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mt-2">Empezá a vender en 4 pasos</h2>
        </motion.div>
        <div className="relative mt-10 max-w-4xl mx-auto">
          <div className="hidden md:block absolute left-8 top-6 bottom-6 w-px bg-gradient-to-b from-[color:var(--color-accent)] via-[color:var(--color-brand-200)] to-transparent" />
          <div className="flex flex-col gap-4">
            {pasos.map((p, i) => (
              <motion.div
                key={p.n}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="card-flat p-5 flex items-center gap-5 relative"
              >
                <div className="w-12 h-12 shrink-0 rounded bg-[color:var(--color-accent)] text-white font-extrabold text-lg flex items-center justify-center z-10">{p.n}</div>
                <div>
                  <h3 className="font-bold text-[color:var(--color-brand-900)]">{p.t}</h3>
                  <p className="text-sm text-[color:var(--color-ink-soft)] mt-0.5">{p.d}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-eleva pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-xs font-bold tracking-widest uppercase text-[color:var(--color-accent)] text-center">Emprendedores ELEVA</div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mt-2">Ya venden con nosotros</h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-4 mt-10">
          {testimonios.map((t, i) => (
            <motion.div
              key={t.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="card-flat p-6 flex flex-col gap-4"
            >
              <div className="text-3xl leading-none text-[color:var(--color-accent)] font-black">&ldquo;</div>
              <p className="text-[color:var(--color-ink-soft)] italic leading-relaxed">{t.txt}</p>
              <div className="flex items-center gap-3 pt-3 border-t border-[color:var(--color-line-soft)]">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[color:var(--color-brand)] to-[color:var(--color-accent)] text-white font-bold flex items-center justify-center">{t.n[0]}</div>
                <div>
                  <div className="font-bold text-sm text-[color:var(--color-brand)]">{t.n}</div>
                  <div className="text-xs text-[color:var(--color-muted)] flex items-center gap-1"><Store size={11} /> {t.tienda}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container-eleva pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-xs font-bold tracking-widest uppercase text-[color:var(--color-accent)] text-center">Dudas frecuentes</div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mt-2">Preguntas de vendedores</h2>
        </motion.div>
        <div className="max-w-3xl mx-auto mt-10 flex flex-col gap-2">
          {faqs.map((f, i) => <Faq key={f.q} f={f} i={i} />)}
        </div>
      </section>

      <section className="container-eleva pt-20 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="rounded overflow-hidden bg-gradient-to-br from-[#240453] via-[#3B1370] to-[#240453] text-white p-10 md:p-14 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold">Listo para vender más?</h2>
          <p className="text-white/80 mt-3 max-w-xl mx-auto">Creá tu cuenta gratis y empezá a publicar en menos de 5 minutos.</p>
          <div className="flex gap-3 justify-center mt-6 flex-wrap">
            <Link href="/registro" className="btn-primary">Crear cuenta de vendedor <ArrowUpRight size={18} /></Link>
            <Link href="/admin" className="btn-outline bg-transparent text-white border-white/30 hover:bg-white/10">Ya tengo cuenta — Entrar al panel</Link>
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
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.35, delay: i * 0.06 }}
      className="card-flat"
    >
      <button onClick={() => setOpen((v) => !v)} className="w-full flex items-center justify-between text-left p-4 gap-4">
        <span className="font-semibold text-[color:var(--color-brand-900)]">{f.q}</span>
        <ChevronDown size={18} className={"text-[color:var(--color-muted)] transition-transform " + (open ? "rotate-180" : "")} />
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        className="overflow-hidden"
      >
        <div className="px-4 pb-4 text-sm text-[color:var(--color-ink-soft)] leading-relaxed">{f.a}</div>
      </motion.div>
    </motion.div>
  );
}
