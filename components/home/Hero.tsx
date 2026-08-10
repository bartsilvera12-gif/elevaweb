"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, ChevronLeft, ChevronRight, Newspaper, Calendar, Bell, Tag, Flame, Percent, Store, TrendingUp, ShoppingBag, Sparkles } from "lucide-react";

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
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
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
      {/* Decorative concentric rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-72 h-72 rounded-full border border-white/10" />
        <div className="absolute w-56 h-56 rounded-full border border-white/15" />
        <div className="absolute w-40 h-40 rounded-full bg-gradient-to-br from-[#FC5005]/25 to-transparent blur-2xl" />
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}

function Chip({ children, className = "", style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`absolute bg-white/95 text-[color:var(--color-brand)] rounded shadow-[0_10px_30px_-10px_rgba(0,0,0,0.4)] flex items-center gap-2 ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

function NovedadesArt() {
  return (
    <ArtBackdrop>
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-56 h-72 bg-white rounded-md shadow-2xl overflow-hidden border-4 border-[color:var(--color-accent)]/20"
      >
        <div className="bg-[color:var(--color-brand)] text-white text-[10px] font-black tracking-[0.2em] p-2 text-center">
          NOVEDADES
        </div>
        <div className="p-3 flex flex-col gap-2">
          <div className="h-2 w-3/4 bg-[color:var(--color-brand-100)] rounded-sm" />
          <div className="h-2 w-full bg-[color:var(--color-line)] rounded-sm" />
          <div className="h-2 w-5/6 bg-[color:var(--color-line)] rounded-sm" />
          <div className="mt-2 h-24 rounded bg-gradient-to-br from-[color:var(--color-brand-100)] to-[color:var(--color-accent)]/30 flex items-center justify-center">
            <Newspaper size={40} className="text-[color:var(--color-brand)]" />
          </div>
          <div className="h-2 w-2/3 bg-[color:var(--color-line)] rounded-sm mt-2" />
          <div className="h-2 w-4/5 bg-[color:var(--color-line)] rounded-sm" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20, y: -10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Chip className="top-4 -left-8 px-3 py-2 text-xs font-bold">
          <Calendar size={14} className="text-[color:var(--color-accent)]" />
          Esta semana
        </Chip>
      </motion.div>

      <motion.div
        animate={{ rotate: [-8, 8, -8] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <Chip className="-top-2 -right-6 w-12 h-12 rounded-full justify-center">
          <Bell size={20} className="text-[color:var(--color-accent)]" />
        </Chip>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5 }}
      >
        <Chip className="-bottom-4 -left-10 px-3 py-2 text-xs font-bold">
          <Sparkles size={14} className="text-[color:var(--color-accent)]" />
          +24 productos nuevos
        </Chip>
      </motion.div>
    </ArtBackdrop>
  );
}

function OfertasArt() {
  return (
    <ArtBackdrop>
      <motion.div
        animate={{ rotate: [-2, 2, -2] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-64 h-64 bg-[color:var(--color-accent)] rounded-md shadow-2xl flex flex-col items-center justify-center text-white"
        style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
      >
        <div className="text-[10px] font-black tracking-[0.3em] opacity-80">HASTA</div>
        <div className="text-7xl font-black leading-none">40%</div>
        <div className="text-sm font-bold tracking-widest opacity-95 mt-1">OFF</div>
        <div className="text-[10px] font-bold tracking-wider opacity-70 mt-3">POR TIEMPO LIMITADO</div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Chip className="-top-2 -left-8 px-3 py-2 text-xs font-bold">
          <Tag size={14} className="text-[color:var(--color-accent)]" />
          Ofertas del día
        </Chip>
      </motion.div>

      <motion.div
        animate={{ y: [0, -6, 0], rotate: [0, 8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Chip className="-top-4 -right-6 w-12 h-12 rounded-full justify-center bg-white">
          <Flame size={20} className="text-[color:var(--color-accent)]" />
        </Chip>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <Chip className="-bottom-2 -right-4 px-3 py-2 text-xs font-bold">
          <Percent size={14} className="text-[color:var(--color-accent)]" />
          En 8 categorías
        </Chip>
      </motion.div>
    </ArtBackdrop>
  );
}

function VenderArt() {
  return (
    <ArtBackdrop>
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-64 h-60 bg-white rounded-md shadow-2xl p-5 border-t-8 border-[color:var(--color-accent)]"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded bg-[color:var(--color-brand)] text-white flex items-center justify-center">
            <Store size={16} />
          </div>
          <div className="flex-1">
            <div className="h-2 w-20 bg-[color:var(--color-brand-100)] rounded-sm mb-1" />
            <div className="h-1.5 w-14 bg-[color:var(--color-line)] rounded-sm" />
          </div>
        </div>

        {/* Bar chart */}
        <div className="flex items-end gap-2 h-24 border-b border-[color:var(--color-line)] pb-1">
          {[35, 55, 40, 70, 60, 85, 100].map((h, idx) => (
            <motion.div
              key={idx}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ delay: 0.15 + idx * 0.06, duration: 0.6, ease: "easeOut" }}
              className={`flex-1 rounded-t ${idx === 6 ? "bg-[color:var(--color-accent)]" : "bg-[color:var(--color-brand)]/70"}`}
            />
          ))}
        </div>

        <div className="mt-3 flex justify-between text-[10px] text-[color:var(--color-muted)] font-bold">
          <span>L</span><span>M</span><span>M</span><span>J</span><span>V</span><span>S</span><span>D</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Chip className="-top-4 -left-6 px-3 py-2 text-xs font-bold">
          <TrendingUp size={14} className="text-[color:var(--color-accent)]" />
          +38% ventas
        </Chip>
      </motion.div>

      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <Chip className="-top-2 -right-8 w-12 h-12 rounded-full justify-center bg-[color:var(--color-brand)]">
          <ShoppingBag size={20} className="text-white" />
        </Chip>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <Chip className="-bottom-4 -right-4 px-3 py-2 text-xs font-bold">
          <Sparkles size={14} className="text-[color:var(--color-accent)]" />
          500+ vendedores
        </Chip>
      </motion.div>
    </ArtBackdrop>
  );
}
