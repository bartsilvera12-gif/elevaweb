"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { MessageCircle, Mail, Phone, MapPin, Clock, Send, Check, Instagram, Facebook } from "lucide-react";

const canales = [
  { icon: MessageCircle, t: "WhatsApp", d: "+595 981 000 000", sub: "Respuesta en menos de 2 horas", href: "https://wa.me/595981000000", accent: true },
  { icon: Mail, t: "Email", d: "hola@eleva.com.py", sub: "Te respondemos en 24hs hábiles", href: "mailto:hola@eleva.com.py" },
  { icon: Phone, t: "Teléfono", d: "021 000 0000", sub: "Lunes a sábado, 9:00 a 20:00", href: "tel:+59521000000" },
];

const asuntos = [
  "Consulta sobre un producto",
  "Estado de mi pedido",
  "Devoluciones y cambios",
  "Quiero vender en ELEVA",
  "Alianzas comerciales",
  "Otro",
];

export default function ContactoPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: asuntos[0], message: "", orderId: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: "", email: "", subject: asuntos[0], message: "", orderId: "" });
  };

  return (
    <>
      <section className="bg-gradient-to-br from-[#240453] via-[#3B1370] to-[#240453] text-white">
        <div className="container-eleva py-14 md:py-16">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="text-xs font-bold tracking-widest uppercase text-[color:var(--color-accent)]">Estamos para ayudarte</div>
            <h1 className="text-3xl md:text-5xl font-extrabold mt-2">Contacto</h1>
            <p className="text-white/80 mt-3 max-w-xl">Escribinos por el canal que te quede mejor. Respondemos rápido.</p>
          </motion.div>
        </div>
      </section>

      <section className="container-eleva pt-12">
        <div className="grid md:grid-cols-3 gap-4">
          {canales.map((c, i) => (
            <motion.a
              key={c.t}
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.3, delay: i * 0.07 }}
              className={`card-flat p-6 flex gap-4 hover:shadow-md hover:border-[color:var(--color-accent)] transition ${c.accent ? "border-[color:var(--color-accent)]/40" : ""}`}
            >
              <div className={`w-12 h-12 rounded flex items-center justify-center shrink-0 ${c.accent ? "bg-[color:var(--color-accent)] text-white" : "bg-[color:var(--color-brand-100)] text-[color:var(--color-brand)]"}`}>
                <c.icon size={22} />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[color:var(--color-muted)]">{c.t}</div>
                <div className="font-bold text-[color:var(--color-brand)] mt-0.5">{c.d}</div>
                <div className="text-xs text-[color:var(--color-ink-soft)] mt-1">{c.sub}</div>
              </div>
            </motion.a>
          ))}
        </div>
      </section>

      <section className="container-eleva pt-16">
        <div className="grid lg:grid-cols-3 gap-6">
          <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-2 card-flat p-6 md:p-8"
          >
            <h2 className="text-xl font-extrabold text-[color:var(--color-brand-900)]">Escribinos</h2>
            <p className="text-sm text-[color:var(--color-ink-soft)] mt-1">Completá el formulario y te contactamos por email.</p>

            <div className="grid md:grid-cols-2 gap-3 mt-6">
              <Field label="Nombre" required value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
              <Field label="Email" type="email" required value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
              <label className="flex flex-col gap-1.5 md:col-span-2">
                <span className="text-xs font-semibold text-[color:var(--color-ink-soft)]">Asunto</span>
                <select
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="border border-[color:var(--color-line)] rounded px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:border-[color:var(--color-brand)]"
                >
                  {asuntos.map((a) => <option key={a}>{a}</option>)}
                </select>
              </label>
              {form.subject === "Estado de mi pedido" && (
                <Field label="Número de pedido" placeholder="ELV-XXXXXX" value={form.orderId} onChange={(v) => setForm({ ...form, orderId: v })} className="md:col-span-2" />
              )}
              <label className="flex flex-col gap-1.5 md:col-span-2">
                <span className="text-xs font-semibold text-[color:var(--color-ink-soft)]">Mensaje</span>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="border border-[color:var(--color-line)] rounded px-3.5 py-2.5 text-sm focus:outline-none focus:border-[color:var(--color-brand)] resize-none"
                />
              </label>
            </div>

            <div className="mt-6 flex items-center gap-3 flex-wrap">
              <button className="btn-primary">
                {sent ? <><Check size={16} /> Enviado</> : <><Send size={16} /> Enviar mensaje</>}
              </button>
              <p className="text-xs text-[color:var(--color-muted)]">Nunca compartimos tus datos.</p>
            </div>
          </motion.form>

          <motion.aside
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-col gap-4"
          >
            <div className="card-flat p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[color:var(--color-brand)]">
                <MapPin size={14} /> Dirección
              </div>
              <div className="mt-2 text-sm text-[color:var(--color-ink-soft)] leading-relaxed">
                Av. España 1234<br />
                Asunción, Paraguay
              </div>
            </div>

            <div className="card-flat p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[color:var(--color-brand)]">
                <Clock size={14} /> Horario de atención
              </div>
              <dl className="mt-2 text-sm space-y-1">
                <div className="flex justify-between"><dt className="text-[color:var(--color-ink-soft)]">Lunes a viernes</dt><dd className="font-medium">9:00 – 20:00</dd></div>
                <div className="flex justify-between"><dt className="text-[color:var(--color-ink-soft)]">Sábados</dt><dd className="font-medium">9:00 – 14:00</dd></div>
                <div className="flex justify-between"><dt className="text-[color:var(--color-ink-soft)]">Domingos</dt><dd className="font-medium text-[color:var(--color-muted)]">Cerrado</dd></div>
              </dl>
            </div>

            <div className="card-flat p-5">
              <div className="text-xs font-bold uppercase tracking-wider text-[color:var(--color-brand)] mb-3">Redes</div>
              <div className="flex gap-2">
                <a href="https://instagram.com" target="_blank" rel="noopener" className="w-10 h-10 rounded border border-[color:var(--color-line)] flex items-center justify-center text-[color:var(--color-brand)] hover:border-[color:var(--color-accent)] hover:text-[color:var(--color-accent)] transition"><Instagram size={18} /></a>
                <a href="https://facebook.com" target="_blank" rel="noopener" className="w-10 h-10 rounded border border-[color:var(--color-line)] flex items-center justify-center text-[color:var(--color-brand)] hover:border-[color:var(--color-accent)] hover:text-[color:var(--color-accent)] transition"><Facebook size={18} /></a>
                <a href="https://wa.me/595981000000" target="_blank" rel="noopener" className="w-10 h-10 rounded border border-[color:var(--color-line)] flex items-center justify-center text-[color:var(--color-brand)] hover:border-[color:var(--color-accent)] hover:text-[color:var(--color-accent)] transition"><MessageCircle size={18} /></a>
              </div>
            </div>
          </motion.aside>
        </div>
      </section>

      <section className="container-eleva pt-16 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.4 }}
          className="rounded overflow-hidden bg-[color:var(--color-brand-900)] text-white p-10 md:p-12 text-center"
        >
          <div className="text-xs font-bold tracking-widest uppercase text-[color:var(--color-accent)]">Prensa y alianzas</div>
          <h2 className="text-xl md:text-2xl font-extrabold mt-2">¿Sos periodista o querés hacer alianza con ELEVA?</h2>
          <p className="text-white/70 mt-2 max-w-xl mx-auto text-sm">Escribinos a <a href="mailto:prensa@eleva.com.py" className="underline">prensa@eleva.com.py</a> o <a href="mailto:alianzas@eleva.com.py" className="underline">alianzas@eleva.com.py</a>.</p>
        </motion.div>
      </section>
    </>
  );
}

function Field({ label, value, onChange, required, type = "text", placeholder, className = "" }: {
  label: string; value: string; onChange: (v: string) => void; required?: boolean; type?: string; placeholder?: string; className?: string;
}) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-xs font-semibold text-[color:var(--color-ink-soft)]">{label}{required && <span className="text-[color:var(--color-accent)]">*</span>}</span>
      <input type={type} required={required} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="border border-[color:var(--color-line)] rounded px-3.5 py-2.5 text-sm focus:outline-none focus:border-[color:var(--color-brand)]" />
    </label>
  );
}
