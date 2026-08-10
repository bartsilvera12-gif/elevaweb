import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function VenderPage() {
  return (
    <div className="container-eleva pt-10">
      <h1 className="text-3xl md:text-4xl font-extrabold">Vendé con ELEVA</h1>
      <p className="text-[color:var(--color-ink-soft)] mt-2 max-w-2xl">Vos publicás; nosotros almacenamos, vendemos y entregamos. Sumate a la comunidad de emprendedores paraguayos que ya venden en ELEVA.</p>
      <Link href="/registro" className="btn-primary mt-6 w-fit">
        Empezar ahora <ArrowUpRight size={18} />
      </Link>
    </div>
  );
}
