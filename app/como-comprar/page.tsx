"use client";
import Link from "next/link";
import { motion } from "motion/react";
import { useState } from "react";
import { ChevronDown, Search, ShoppingCart, MessageCircle, Star } from "lucide-react";

const pasos = [
  {
    n: "01",
    t: "Elegí",
    d: "Explorá el catálogo. Filtrá por talle, color, precio o marca. Guardá favoritos y volvé cuando quieras.",
    ejemplo: "Ejemplo: buscás \"vestido midi\", filtrás talle M, ordenás por precio.",
  },
  {
    n: "02",
    t: "Sumás",
    d: "Agregás al carrito. Ajustás cantidad y elegís variante. El envío gratis aparece a partir de Gs. 500.000.",
    ejemplo: "Truco: usá un cupón. ELEVA10 te da 10% off en toda la compra.",
  },
  {
    n: "03",
    t: "Pagás",
    d: "Elegís cómo: tarjeta en cuotas, transferencia o efectivo al recibir. Todo protegido, sin cargos ocultos.",
    ejemplo: "Con Visa/Mastercard: hasta 6 cuotas sin interés. Cabal también aceptamos.",
  },
  {
    n: "04",
    t: "Recibís",
    d: "Coordinamos con el vendedor y te avisamos cuando el pedido esté en camino. Lo seguís desde Mis pedidos.",
    ejemplo: "Asunción y Central: mañana en tu casa. Interior: 3 a 5 días.",
  },
];

const faqs = [
  { q: "¿Necesito una cuenta para comprar?", a: "No. Podés comprar como invitado. Sí te recomendamos crear cuenta para ver historial, guardar direcciones y cargar favoritos." },
  { q: "¿Cuánto tarda mi pedido en llegar?", a: "En Asunción y Central, entre 24 y 48 horas. En el interior, 3 a 5 días hábiles por encomienda. Recibís el número de seguimiento por email y WhatsApp." },
  { q: "¿Puedo pagar en cuotas?", a: "Sí, hasta 6 cuotas sin interés con tarjetas de crédito. El detalle aparece en el checkout antes de confirmar." },
  { q: "¿Qué pasa si el producto no llega o llega en mal estado?", a: "Tenés 7 días para reclamar. Retenemos el pago hasta confirmar tu recepción. Si algo no está bien, coordinamos devolución o reembolso íntegro." },
  { q: "¿Puedo cambiar la dirección después de comprar?", a: "Sí, siempre que el pedido no haya sido despachado. Escribinos por WhatsApp al +595 986 121 439 con el número de pedido." },
  { q: "¿Cómo uso un cupón?", a: "En el checkout, después del resumen, hay un campo 'Cupón'. Ingresá el código y hacé click en Aplicar. Códigos activos: ELEVA10, NUEVO5, ENVIOGRATIS, MENOS20K." },
];

export default function ComoComprarPage() {
  return (
    <>
      <div className="container-eleva pt-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[color:var(--color-brand-900)]">Cómo comprar en ELEVA</h1>
        <p className="text-[color:var(--color-ink-soft)] mt-2 max-w-xl">
          Los pasos, los métodos de pago, los tiempos de envío y las garantías.
        </p>
      </div>

      {/* PASOS */}
      <section className="container-eleva pt-20">
        <SectionHead kicker="Paso a paso" title="Así se compra" />
        <div className="mt-10 grid md:grid-cols-2 gap-x-10 gap-y-14">
          {pasos.map((p, i) => (
            <motion.div
              key={p.n}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="relative"
            >
              <div className="flex items-baseline gap-4">
                <span className="font-black text-6xl md:text-7xl text-[color:var(--color-accent)]/15 leading-none tabular-nums">{p.n}</span>
                <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[color:var(--color-brand-900)]">{p.t}</h3>
              </div>
              <p className="mt-3 text-[color:var(--color-ink-soft)] leading-relaxed max-w-md">{p.d}</p>
              <div className="mt-4 border-l-2 border-[color:var(--color-accent)] pl-3 text-sm text-[color:var(--color-brand)] italic max-w-md">
                {p.ejemplo}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PAGOS */}
      <section className="container-eleva pt-24">
        <SectionHead kicker="Pagos" title="Como te quede mejor" />
        <div className="grid md:grid-cols-3 gap-4 mt-10">
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.35 }} className="card-flat p-6 overflow-hidden relative">
            <CreditCardArt />
            <h3 className="text-xl font-extrabold text-[color:var(--color-brand-900)] mt-6">Tarjeta</h3>
            <p className="text-sm text-[color:var(--color-ink-soft)] mt-1">Visa, Mastercard y Cabal.</p>
            <div className="mt-3 flex items-baseline gap-1.5 flex-wrap">
              <span className="text-2xl font-black text-[color:var(--color-accent)]">6</span>
              <span className="text-sm font-semibold text-[color:var(--color-brand-900)]">cuotas sin interés</span>
            </div>
            <ul className="text-xs text-[color:var(--color-muted)] mt-3 space-y-1">
              <li>· Cobramos al confirmar despacho</li>
              <li>· Verificación 3D Secure</li>
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.35, delay: 0.08 }} className="card-flat p-6 overflow-hidden relative">
            <BankTransferArt />
            <h3 className="text-xl font-extrabold text-[color:var(--color-brand-900)] mt-6">Transferencia</h3>
            <p className="text-sm text-[color:var(--color-ink-soft)] mt-1">Bancos y billeteras del país.</p>
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              {["Itaú", "Continental", "Familiar", "Personal Pay", "Tigo Money"].map((b) => (
                <span key={b} className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[color:var(--color-brand-100)] text-[color:var(--color-brand)]">{b}</span>
              ))}
            </div>
            <ul className="text-xs text-[color:var(--color-muted)] mt-3 space-y-1">
              <li>· Datos por email al confirmar</li>
              <li>· Comprobante desde el chat</li>
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.35, delay: 0.16 }} className="card-flat p-6 overflow-hidden relative">
            <CashArt />
            <h3 className="text-xl font-extrabold text-[color:var(--color-brand-900)] mt-6">Efectivo</h3>
            <p className="text-sm text-[color:var(--color-ink-soft)] mt-1">Contra entrega en tu domicilio.</p>
            <div className="mt-3 text-sm text-[color:var(--color-brand-900)] font-bold">Guaraníes al recibir</div>
            <ul className="text-xs text-[color:var(--color-muted)] mt-3 space-y-1">
              <li>· Solo Asunción y Central</li>
              <li>· Sin recargo</li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* ENVIOS */}
      <section className="container-eleva pt-24">
        <SectionHead kicker="Envíos" title="A todo Paraguay" />
        <div className="mt-10 max-w-3xl">
          <ShipRow k="Asunción" v="24 horas" acc>
            Zona céntrica. Retiro coordinado con el vendedor.
          </ShipRow>
          <ShipRow k="Área Central" v="24 – 48 h">
            Fernando de la Mora, Lambaré, San Lorenzo, Luque, Ñemby, Capiatá y más.
          </ShipRow>
          <ShipRow k="Ciudades grandes" v="2 – 3 días">
            Ciudad del Este, Encarnación, Villarrica, Coronel Oviedo, Concepción.
          </ShipRow>
          <ShipRow k="Interior" v="3 – 5 días">
            Envío por encomienda con seguimiento. Descuento para pedidos +Gs. 800.000.
          </ShipRow>
          <ShipRow k="Chaco" v="4 – 7 días">
            Filadelfia, Loma Plata, Neuland. Coordinamos con transporte local.
          </ShipRow>
        </div>
      </section>

      {/* GARANTIAS */}
      <section className="container-eleva pt-24">
        <SectionHead kicker="Garantías" title="Comprás tranquilo" />
        <div className="grid md:grid-cols-3 gap-4 mt-10">
          <GuaranteeCard
            title="Pago protegido"
            body="Retenemos tu dinero hasta que confirmes que recibiste el producto. Si no llega o no es lo pactado, te devolvemos hasta el último guaraní."
            badge="100% reembolso"
            art={<ShieldArt />}
          />
          <GuaranteeCard
            title="Devolución en 7 días"
            body="Cambio o devolución sin preguntas si el producto no coincide con lo publicado. Coordinamos el retiro sin costo para vos."
            badge="Sin costo"
            art={<ReturnArt />}
          />
          <GuaranteeCard
            title="Soporte humano"
            body="No hay bots. Escribís por WhatsApp y respondemos en 47 minutos promedio. Nos gusta la gente y las respuestas cortas."
            badge="Lun a Sáb 9–20"
            art={<SupportArt />}
          />
        </div>
      </section>

      {/* TESTIMONIO */}
      <section className="container-eleva pt-24">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="relative rounded overflow-hidden bg-[color:var(--color-brand-900)] text-white p-10 md:p-14"
        >
          <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-[color:var(--color-accent)]/20 blur-3xl" />
          <div className="absolute -left-10 -top-10 w-40 h-40 rounded-full bg-[color:var(--color-brand)]/40 blur-2xl" />
          <div className="relative max-w-3xl">
            <div className="flex items-center gap-1 mb-6">
              {[0,1,2,3,4].map((i) => <Star key={i} size={18} className="text-[color:var(--color-accent)]" fill="currentColor" />)}
            </div>
            <blockquote className="font-serif italic text-2xl md:text-3xl leading-snug text-white">
              &ldquo;Compré un vestido a las 10 de la noche, me llegó al día siguiente a las 3. Lo mismo con las zapatillas de mi hijo. Es la primera tienda paraguaya que no me hace dudar.&rdquo;
            </blockquote>
            <div className="mt-6 flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[color:var(--color-accent)] to-[#e04700] text-white font-black flex items-center justify-center">C</div>
              <div>
                <div className="font-bold">Cecilia G.</div>
                <div className="text-xs text-white/60">Luque · compró 4 veces en 2 meses</div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="container-eleva pt-24">
        <SectionHead kicker="Dudas frecuentes" title="Lo que preguntan los compradores" />
        <div className="max-w-3xl mt-10 flex flex-col gap-2">
          {faqs.map((f, i) => <Faq key={f.q} f={f} i={i} />)}
        </div>
      </section>

      {/* CTA */}
      <section className="container-eleva pt-24 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.4 }}
          className="rounded overflow-hidden bg-gradient-to-br from-[#240453] to-[#1A003F] text-white p-10 md:p-14"
        >
          <div className="grid md:grid-cols-[1.4fr_1fr] gap-8 items-center">
            <div>
              <div className="text-xs font-bold tracking-widest uppercase text-[color:var(--color-accent)]">¿Sigue sin quedarte claro?</div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight mt-2">Escribinos y lo resolvemos juntos.</h2>
            </div>
            <div className="flex gap-3 flex-wrap md:justify-end">
              <a href="https://wa.me/595981000000" target="_blank" rel="noopener" className="btn-primary">
                <MessageCircle size={18} /> WhatsApp
              </a>
              <Link href="/contacto" className="btn-outline bg-transparent text-white border-white/30 hover:bg-white/10">Ir a Contacto</Link>
            </div>
          </div>
        </motion.div>
      </section>
    </>
  );
}

/* ---------- helpers ---------- */

function SectionHead({ kicker, title }: { kicker: string; title: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.4 }}>
      <div className="text-xs font-bold tracking-widest uppercase text-[color:var(--color-accent)]">{kicker}</div>
      <h2 className="font-black tracking-tight text-3xl md:text-5xl text-[color:var(--color-brand-900)] mt-1">{title}</h2>
    </motion.div>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div>
      <div className="text-3xl md:text-4xl font-black text-white leading-none">{n}</div>
      <div className="text-[11px] uppercase tracking-wider text-white/60 mt-1.5">{l}</div>
    </div>
  );
}

function ShipRow({ k, v, children, acc }: { k: string; v: string; children: React.ReactNode; acc?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.3 }}
      className="flex items-start gap-4 py-3 border-b border-[color:var(--color-line-soft)]"
    >
      <div className={"font-bold shrink-0 w-40 " + (acc ? "text-[color:var(--color-accent)]" : "text-[color:var(--color-brand)]")}>{k}</div>
      <div className="flex-1">
        <div className="font-black text-lg text-[color:var(--color-brand-900)] leading-tight">{v}</div>
        <div className="text-sm text-[color:var(--color-ink-soft)] mt-0.5">{children}</div>
      </div>
    </motion.div>
  );
}

function GuaranteeCard({ title, body, badge, art }: { title: string; body: string; badge: string; art: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.35 }}
      className="card-flat p-6 flex flex-col"
    >
      <div className="h-24">{art}</div>
      <div className="flex items-center gap-2 mt-4">
        <h3 className="text-lg font-extrabold text-[color:var(--color-brand-900)]">{title}</h3>
        <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-[color:var(--color-accent)]/10 text-[color:var(--color-accent)]">{badge}</span>
      </div>
      <p className="text-sm text-[color:var(--color-ink-soft)] mt-2 leading-relaxed">{body}</p>
    </motion.div>
  );
}

function Faq({ f, i }: { f: { q: string; a: string }; i: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.3, delay: i * 0.04 }}
      className="card-flat"
    >
      <button onClick={() => setOpen((v) => !v)} className="w-full flex items-center justify-between text-left p-5 gap-4">
        <span className="font-semibold text-[color:var(--color-brand-900)]">{f.q}</span>
        <ChevronDown size={18} className={"text-[color:var(--color-muted)] transition-transform shrink-0 " + (open ? "rotate-180" : "")} />
      </button>
      <motion.div initial={false} animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
        <div className="px-5 pb-5 text-sm text-[color:var(--color-ink-soft)] leading-relaxed">{f.a}</div>
      </motion.div>
    </motion.div>
  );
}

/* ---------- decorative SVGs ---------- */

function BackdropGrid() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.08] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  );
}

function CreditCardArt() {
  return (
    <svg viewBox="0 0 220 130" className="w-full h-24">
      <rect x="15" y="15" width="180" height="105" rx="8" fill="#240453" />
      <rect x="15" y="35" width="180" height="18" fill="#1A003F" />
      <circle cx="170" cy="85" r="14" fill="#FC5005" />
      <circle cx="155" cy="85" r="14" fill="#FFD9C2" opacity="0.85" />
      <rect x="25" y="72" width="42" height="6" rx="1" fill="#8A82A0" />
      <rect x="25" y="82" width="60" height="4" rx="1" fill="#8A82A0" />
      <rect x="25" y="90" width="50" height="4" rx="1" fill="#8A82A0" />
      <rect x="25" y="98" width="70" height="4" rx="1" fill="#8A82A0" />
    </svg>
  );
}

function BankTransferArt() {
  return (
    <svg viewBox="0 0 220 130" className="w-full h-24">
      <path d="M20 100 L110 30 L200 100" fill="none" stroke="#240453" strokeWidth="3" strokeLinejoin="round" />
      <rect x="20" y="100" width="180" height="15" fill="#240453" />
      <rect x="35" y="70" width="10" height="30" fill="#240453" />
      <rect x="60" y="70" width="10" height="30" fill="#240453" />
      <rect x="105" y="70" width="10" height="30" fill="#240453" />
      <rect x="150" y="70" width="10" height="30" fill="#240453" />
      <rect x="175" y="70" width="10" height="30" fill="#240453" />
      <circle cx="110" cy="55" r="6" fill="#FC5005" />
    </svg>
  );
}

function CashArt() {
  return (
    <svg viewBox="0 0 220 130" className="w-full h-24">
      <rect x="20" y="45" width="160" height="70" rx="4" fill="#E8F5E9" stroke="#2E7D32" strokeWidth="2" />
      <circle cx="100" cy="80" r="18" fill="none" stroke="#2E7D32" strokeWidth="2" />
      <text x="100" y="86" textAnchor="middle" fill="#2E7D32" fontWeight="900" fontSize="16" fontFamily="ui-monospace, monospace">₲</text>
      <rect x="35" y="60" width="14" height="14" rx="2" fill="none" stroke="#2E7D32" strokeWidth="1.5" />
      <rect x="151" y="86" width="14" height="14" rx="2" fill="none" stroke="#2E7D32" strokeWidth="1.5" />
      <rect x="40" y="30" width="140" height="20" rx="3" fill="#FC5005" opacity="0.9" />
      <text x="110" y="45" textAnchor="middle" fill="white" fontWeight="800" fontSize="11" letterSpacing="2">GUARANIES</text>
    </svg>
  );
}

function ShieldArt() {
  return (
    <svg viewBox="0 0 120 100" className="h-full">
      <path d="M60 10 L100 22 L100 55 C100 75 82 88 60 92 C38 88 20 75 20 55 L20 22 Z" fill="#FC5005" opacity="0.15" />
      <path d="M60 10 L100 22 L100 55 C100 75 82 88 60 92 C38 88 20 75 20 55 L20 22 Z" fill="none" stroke="#FC5005" strokeWidth="2.5" />
      <path d="M42 52 L54 65 L80 38" stroke="#240453" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ReturnArt() {
  return (
    <svg viewBox="0 0 120 100" className="h-full">
      <rect x="30" y="35" width="60" height="50" rx="4" fill="#F1EAFB" stroke="#240453" strokeWidth="2" />
      <path d="M30 45 L60 60 L90 45" fill="none" stroke="#240453" strokeWidth="2" />
      <path d="M80 25 A 20 20 0 1 0 100 45" fill="none" stroke="#FC5005" strokeWidth="3" strokeLinecap="round" />
      <path d="M100 30 L100 45 L85 45" fill="none" stroke="#FC5005" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <text x="60" y="80" textAnchor="middle" fontWeight="900" fontSize="10" fill="#240453">7 DÍAS</text>
    </svg>
  );
}

function SupportArt() {
  return (
    <svg viewBox="0 0 120 100" className="h-full">
      <path d="M20 30 Q 20 20 30 20 L75 20 Q 85 20 85 30 L85 55 Q 85 65 75 65 L45 65 L30 78 L30 65 Q 20 65 20 55 Z" fill="#FC5005" opacity="0.15" stroke="#FC5005" strokeWidth="2" />
      <circle cx="40" cy="42" r="3" fill="#FC5005" />
      <circle cx="52" cy="42" r="3" fill="#FC5005" />
      <circle cx="64" cy="42" r="3" fill="#FC5005" />
      <path d="M60 50 Q 60 40 70 40 L100 40 Q 110 40 110 50 L110 70 Q 110 80 100 80 L88 80 L75 90 L78 80 Q 60 80 60 70 Z" fill="#240453" opacity="0.12" stroke="#240453" strokeWidth="2" />
    </svg>
  );
}
