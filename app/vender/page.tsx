import Link from "next/link";
import { ArrowUpRight, Package, TrendingUp, Users, ShieldCheck } from "lucide-react";

const beneficios = [
  { icon: Package, t: "Nosotros almacenamos", d: "Dejás tu stock en nuestro depósito y nos ocupamos de la logística." },
  { icon: TrendingUp, t: "Más ventas", d: "Miles de compradores navegan ELEVA cada semana." },
  { icon: Users, t: "Comunidad", d: "Formá parte de la red de emprendedores paraguayos que ya venden con nosotros." },
  { icon: ShieldCheck, t: "Pago seguro", d: "Cobrás por transferencia semanal. Sin sorpresas." },
];

const pasos = [
  { n: 1, t: "Registrate", d: "Creá tu cuenta de vendedor en menos de 5 minutos." },
  { n: 2, t: "Publicá tus productos", d: "Cargá fotos, precio y stock desde el panel." },
  { n: 3, t: "Nosotros vendemos", d: "Aparecés en el catálogo. Nosotros almacenamos, vendemos y entregamos." },
  { n: 4, t: "Cobrás", d: "Recibís tu liquidación semanal por transferencia." },
];

export default function VenderPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-[#240453] via-[#3B1370] to-[#240453] text-white">
        <div className="container-eleva py-14 md:py-20 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="text-xs font-bold tracking-widest uppercase text-[color:var(--color-accent)]">Vendé con nosotros</div>
            <h1 className="text-4xl md:text-5xl font-extrabold mt-2">Llevá tu emprendimiento más alto</h1>
            <p className="text-white/80 mt-4 max-w-lg">Vos publicás; nosotros almacenamos, vendemos y entregamos. Sin comisiones ocultas.</p>
            <Link href="/registro" className="btn-primary mt-6 w-fit">Empezar ahora <ArrowUpRight size={18} /></Link>
          </div>
          <div className="hidden md:block">
            <div className="aspect-video rounded border border-white/15 bg-white/5 flex items-center justify-center text-white/50">Banner: Vendé con nosotros</div>
          </div>
        </div>
      </section>

      <section className="container-eleva pt-12">
        <h2 className="text-2xl md:text-3xl font-extrabold text-center">¿Por qué vender en ELEVA?</h2>
        <div className="grid md:grid-cols-4 gap-4 mt-8">
          {beneficios.map((b) => (
            <div key={b.t} className="card-flat p-5">
              <div className="w-11 h-11 rounded bg-[color:var(--color-brand-100)] text-[color:var(--color-brand)] flex items-center justify-center"><b.icon size={22} /></div>
              <h3 className="font-bold mt-3">{b.t}</h3>
              <p className="text-sm text-[color:var(--color-ink-soft)] mt-1">{b.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-eleva pt-12 pb-6">
        <h2 className="text-2xl md:text-3xl font-extrabold text-center">Cómo funciona</h2>
        <div className="grid md:grid-cols-4 gap-4 mt-8">
          {pasos.map((p) => (
            <div key={p.n} className="card-flat p-5">
              <div className="w-9 h-9 rounded bg-[color:var(--color-accent)] text-white font-extrabold flex items-center justify-center">{p.n}</div>
              <h3 className="font-bold mt-3">{p.t}</h3>
              <p className="text-sm text-[color:var(--color-ink-soft)] mt-1">{p.d}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/registro" className="btn-primary inline-flex">Crear cuenta de vendedor <ArrowUpRight size={18} /></Link>
        </div>
      </section>
    </>
  );
}
