"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    kicker: "Recién llegados",
    title: "Novedades de la semana",
    desc: "Lo último que sumaron nuestros emprendedores.",
    cta: "Descubrir novedades",
    href: "/catalogo?nuevo=1",
    image: "/productos/perfume-floral.jpg",
  },
  {
    kicker: "Hasta -40%",
    title: "Semana de ofertas",
    desc: "Los mejores precios del mes, por tiempo limitado.",
    cta: "Ver ofertas",
    href: "/catalogo?ofertas=1",
    image: "/productos/vestido-midi-floral.jpg",
  },
  {
    kicker: "Vendé con nosotros",
    title: "Llevá tu emprendimiento más alto",
    desc: "Vos publicás; nosotros almacenamos, vendemos y entregamos.",
    cta: "Quiero vender",
    href: "/vender",
    image: "/productos/notebook-14.png",
  },
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
          <div className="flex flex-col justify-center gap-5 min-w-0 z-10">
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
                key={s.image}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0"
              >
                <div className="absolute inset-0 rounded overflow-hidden border border-white/10">
                  <Image src={s.image} alt={s.title} fill sizes="50vw" className="object-cover" priority />
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#240453]/10 to-[#240453]/60" />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <button aria-label="Anterior" onClick={() => setI((v) => (v - 1 + slides.length) % slides.length)} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 text-[color:var(--color-brand)] flex items-center justify-center hover:bg-white transition z-20">
          <ChevronLeft size={20} />
        </button>
        <button aria-label="Siguiente" onClick={() => setI((v) => (v + 1) % slides.length)} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 text-[color:var(--color-brand)] flex items-center justify-center hover:bg-white transition z-20">
          <ChevronRight size={20} />
        </button>
        <div className="absolute left-1/2 -translate-x-1/2 bottom-4 flex gap-1.5 z-20">
          {slides.map((_, idx) => (
            <button key={idx} onClick={() => setI(idx)} aria-label={`Slide ${idx + 1}`} className={`h-1.5 rounded-full transition-all ${idx === i ? "w-8 bg-[color:var(--color-accent)]" : "w-4 bg-white/40"}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
