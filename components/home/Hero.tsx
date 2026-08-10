"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, ChevronLeft, ChevronRight, Star, Heart, ShoppingCart, TrendingUp, DollarSign, Package } from "lucide-react";

const slides = [
  { kicker: "Recién llegados", title: "Novedades de la semana", desc: "Lo último que sumaron nuestros emprendedores.", cta: "Descubrir novedades", href: "/catalogo?nuevo=1", art: "novedades" as const },
  { kicker: "Hasta -40%", title: "Semana de ofertas", desc: "Los mejores precios del mes, por tiempo limitado.", cta: "Ver ofertas", href: "/catalogo?ofertas=1", art: "ofertas" as const },
  { kicker: "Vendé con nosotros", title: "Llevá tu emprendimiento más alto", desc: "Vos publicás; nosotros almacenamos, vendemos y entregamos.", cta: "Quiero vender", href: "/vender", art: "vender" as const },
];

export default function Hero() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, []);
  const s = slides[i];
  return (
    <section className="container-eleva pt-6">
      <div className="relative overflow-hidden rounded bg-gradient-to-br from-[#240453] via-[#3B1370] to-[#240453] text-white h-[420px] md:h-[440px]">
        <div className="grid md:grid-cols-2 gap-6 p-8 md:p-14 h-full">
          <div className="flex flex-col justify-center gap-5 min-w-0">
            <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-[color:var(--color-accent)]">
              <span className="h-px w-8 bg-[color:var(--color-accent)]" /> {s.kicker}
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight line-clamp-3">{s.title}</h1>
            <p className="text-base md:text-lg text-white/80 max-w-md line-clamp-2">{s.desc}</p>
            <Link href={s.href} className="btn-primary w-fit mt-2">
              {s.cta} <ArrowRight size={18} />
            </Link>
          </div>
          <div className="hidden md:block relative h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={s.art}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.35 }}
                className="absolute inset-0"
              >
                {s.art === "novedades" && <NovedadesArt />}
                {s.art === "ofertas" && <OfertasArt />}
                {s.art === "vender" && <VenderArt />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <button aria-label="Anterior" onClick={() => setI((v) => (v - 1 + slides.length) % slides.length)} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 text-[color:var(--color-brand)] flex items-center justify-center hover:bg-white transition">
          <ChevronLeft size={20} />
        </button>
        <button aria-label="Siguiente" onClick={() => setI((v) => (v + 1) % slides.length)} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 text-[color:var(--color-brand)] flex items-center justify-center hover:bg-white transition">
          <ChevronRight size={20} />
        </button>
        <div className="absolute left-1/2 -translate-x-1/2 bottom-4 flex gap-1.5">
          {slides.map((_, idx) => (
            <button key={idx} onClick={() => setI(idx)} aria-label={`Slide ${idx + 1}`} className={`h-1.5 rounded-full transition-all ${idx === i ? "w-8 bg-[color:var(--color-accent)]" : "w-4 bg-white/40"}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- SVG compositions ---------- */

function ArtBackdrop({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-72 h-72 rounded-full border border-white/10" />
        <div className="absolute w-56 h-56 rounded-full border border-white/[0.07]" />
        <div className="absolute w-52 h-52 rounded-full bg-gradient-to-br from-[#FC5005]/20 to-transparent blur-3xl" />
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}

/* --- NOVEDADES: stack of product cards --- */
function NovedadesArt() {
  return (
    <ArtBackdrop>
      <div className="relative w-[300px] h-[340px]">
        {/* Back card */}
        <motion.div
          initial={{ opacity: 0, x: 40, y: 20, rotate: 8 }}
          animate={{ opacity: 1, x: 0, y: 0, rotate: 8 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="absolute top-4 right-0 w-52 h-64 bg-white rounded shadow-xl overflow-hidden"
        >
          <div className="h-32 bg-gradient-to-br from-[#F1EAFB] via-[#E3D0F5] to-[#FFD9C2]" />
          <div className="p-3">
            <div className="text-[10px] text-[color:var(--color-muted)]">★ 4.7 · 95 vendidos</div>
            <div className="h-2 w-4/5 bg-[color:var(--color-brand-100)] rounded-sm mt-1.5" />
            <div className="h-2 w-3/5 bg-[color:var(--color-line)] rounded-sm mt-1.5" />
            <div className="mt-3 text-sm font-extrabold text-[color:var(--color-brand)]">Gs. 320.000</div>
          </div>
        </motion.div>

        {/* Middle card */}
        <motion.div
          initial={{ opacity: 0, x: 20, rotate: 4 }}
          animate={{ opacity: 1, x: 0, rotate: 4 }}
          transition={{ delay: 0.08, duration: 0.4 }}
          className="absolute top-2 right-14 w-52 h-64 bg-white rounded shadow-xl overflow-hidden"
        >
          <div className="h-32 bg-gradient-to-br from-[#FFD9C2] via-[#F1EAFB] to-[#E3D0F5]" />
          <div className="p-3">
            <div className="text-[10px] text-[color:var(--color-muted)]">★ 4.8 · 180 vendidos</div>
            <div className="h-2 w-4/5 bg-[color:var(--color-brand-100)] rounded-sm mt-1.5" />
            <div className="h-2 w-3/5 bg-[color:var(--color-line)] rounded-sm mt-1.5" />
            <div className="mt-3 text-sm font-extrabold text-[color:var(--color-brand)]">Gs. 155.000</div>
          </div>
        </motion.div>

        {/* Front card (detailed) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute top-0 left-2 w-56 h-72 bg-white rounded overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)]"
        >
          <div className="relative h-36 bg-gradient-to-br from-[#E3D0F5] via-[#F1EAFB] to-[#FFD9C2]">
            <span className="absolute top-2 left-2 bg-[color:var(--color-brand)] text-white text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded">Nuevo</span>
            <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center">
              <Heart size={13} className="text-[color:var(--color-brand)]" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-white/40 backdrop-blur-sm" />
            </div>
          </div>
          <div className="p-3">
            <div className="flex items-center gap-1 text-[10px] text-[color:var(--color-muted)]">
              <Star size={10} className="text-[color:var(--color-accent)]" fill="currentColor" />
              <span className="font-bold text-[color:var(--color-ink)]">4.9</span>
              <span>· 66 vendidos</span>
            </div>
            <div className="text-[13px] font-bold text-[color:var(--color-ink)] mt-1 leading-tight">Perfume floral 50 ml</div>
            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="text-base font-extrabold text-[color:var(--color-brand)]">Gs. 280.000</span>
            </div>
            <div className="mt-2.5 h-8 rounded bg-[color:var(--color-brand)] flex items-center justify-center gap-1.5 text-white text-[11px] font-bold">
              <ShoppingCart size={12} /> Agregar
            </div>
          </div>
        </motion.div>
      </div>
    </ArtBackdrop>
  );
}

/* --- OFERTAS: price tag with old/new + countdown row --- */
function OfertasArt() {
  return (
    <ArtBackdrop>
      <div className="relative w-[320px] h-[320px]">
        {/* Big price tag */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative w-[260px] h-[200px] bg-white rounded-l-md rounded-r-[100px] shadow-2xl overflow-hidden"
        >
          {/* Tag hole */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[color:var(--color-brand-900)] border-2 border-white/30" />

          <div className="p-5 h-full flex flex-col justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-[color:var(--color-accent)] text-white flex items-center justify-center font-black">%</div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[color:var(--color-muted)]">Oferta del día</span>
            </div>

            <div>
              <div className="text-xs text-[color:var(--color-muted)] line-through">Gs. 240.000</div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black text-[color:var(--color-brand-900)]">Gs. 189.000</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[10px] font-bold text-[color:var(--color-accent)]">Ahorrás Gs. 51.000</span>
                <span className="bg-[color:var(--color-accent)] text-white text-[10px] font-black px-1.5 py-0.5 rounded">-21%</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Countdown chip below */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="absolute -bottom-2 left-6 right-16 bg-[color:var(--color-brand-900)] rounded p-3 flex items-center justify-between shadow-xl border border-white/10"
        >
          <div className="text-[10px] text-white/70 font-bold uppercase tracking-wider">Termina en</div>
          <div className="flex items-center gap-1">
            {["12", "45", "08"].map((n, idx) => (
              <div key={idx} className="flex items-center gap-1">
                <div className="w-8 h-8 rounded bg-[color:var(--color-accent)] text-white font-black text-sm flex items-center justify-center">{n}</div>
                {idx < 2 && <span className="text-white font-black">:</span>}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Small "40% off" badge floating top-right */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6, rotate: -30 }}
          animate={{ opacity: 1, scale: 1, rotate: -12 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 220, damping: 15 }}
          className="absolute -top-6 -right-2 w-24 h-24 rounded-full bg-[color:var(--color-accent)] text-white flex flex-col items-center justify-center shadow-xl border-4 border-white/20"
        >
          <div className="text-[9px] font-black tracking-widest opacity-90">HASTA</div>
          <div className="text-2xl font-black leading-none">40%</div>
          <div className="text-[10px] font-black tracking-widest">OFF</div>
        </motion.div>
      </div>
    </ArtBackdrop>
  );
}

/* --- VENDER: detailed seller dashboard mock --- */
function VenderArt() {
  const bars = [40, 55, 45, 70, 60, 82, 100];
  return (
    <ArtBackdrop>
      <div className="relative w-[320px] h-[320px]">
        {/* Main dashboard card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-[280px] bg-white rounded shadow-2xl overflow-hidden"
        >
          {/* Header bar */}
          <div className="bg-[color:var(--color-brand-900)] px-4 py-2.5 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[color:var(--color-accent)]" />
            <div className="w-2 h-2 rounded-full bg-white/30" />
            <div className="w-2 h-2 rounded-full bg-white/30" />
            <div className="ml-auto text-[10px] text-white/60 font-mono">panel · vendedor</div>
          </div>

          <div className="p-4">
            {/* Revenue counter */}
            <div className="flex items-end justify-between mb-3">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--color-muted)]">Ventas · esta semana</div>
                <div className="text-2xl font-black text-[color:var(--color-brand)] leading-tight">Gs. 4.290.000</div>
              </div>
              <div className="text-[10px] font-bold bg-green-100 text-green-800 px-1.5 py-0.5 rounded flex items-center gap-1">
                <TrendingUp size={10} /> +38%
              </div>
            </div>

            {/* Bar chart */}
            <div className="flex items-end gap-1.5 h-20 border-b border-[color:var(--color-line)] pb-0.5">
              {bars.map((h, idx) => (
                <motion.div
                  key={idx}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: 0.15 + idx * 0.05, duration: 0.5, ease: "easeOut" }}
                  className={`flex-1 rounded-t ${idx === 6 ? "bg-[color:var(--color-accent)]" : "bg-[color:var(--color-brand)]/70"}`}
                />
              ))}
            </div>
            <div className="mt-2 flex justify-between text-[9px] text-[color:var(--color-muted)] font-bold">
              <span>L</span><span>M</span><span>M</span><span>J</span><span>V</span><span>S</span><span>D</span>
            </div>

            {/* KPI pills */}
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div className="bg-[color:var(--color-line-soft)] rounded p-2">
                <div className="flex items-center gap-1 text-[9px] font-bold uppercase text-[color:var(--color-muted)] tracking-wider">
                  <Package size={10} /> Pedidos
                </div>
                <div className="text-sm font-black text-[color:var(--color-brand)] mt-0.5">24</div>
              </div>
              <div className="bg-[color:var(--color-line-soft)] rounded p-2">
                <div className="flex items-center gap-1 text-[9px] font-bold uppercase text-[color:var(--color-muted)] tracking-wider">
                  <DollarSign size={10} /> Ticket
                </div>
                <div className="text-sm font-black text-[color:var(--color-brand)] mt-0.5">Gs. 178k</div>
              </div>
            </div>

            {/* Table row */}
            <div className="mt-3 pt-2 border-t border-[color:var(--color-line-soft)]">
              <div className="text-[9px] font-bold uppercase text-[color:var(--color-muted)] tracking-wider mb-1.5">Último pedido</div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-gradient-to-br from-[#F1EAFB] to-[#FFD9C2]" />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-bold text-[color:var(--color-ink)] truncate">Vestido midi floral</div>
                  <div className="text-[9px] text-[color:var(--color-muted)]">ELV-A9C2X · pagado</div>
                </div>
                <div className="text-[11px] font-black text-[color:var(--color-brand)]">Gs. 189k</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Payout notification floating */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ delay: 0.35, type: "spring", stiffness: 200, damping: 18 }}
          className="absolute -bottom-4 -right-2 w-56 bg-white rounded shadow-2xl p-3 border-l-4 border-[color:var(--color-accent)]"
        >
          <div className="flex items-start gap-2">
            <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center shrink-0">
              <DollarSign size={16} />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-black uppercase tracking-widest text-green-700">Liquidación</div>
              <div className="text-[11px] text-[color:var(--color-ink)] mt-0.5 font-semibold">Se acreditaron Gs. 3.771.200 en tu cuenta.</div>
            </div>
          </div>
        </motion.div>
      </div>
    </ArtBackdrop>
  );
}
