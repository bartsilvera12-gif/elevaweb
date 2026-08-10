import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[color:var(--color-brand-900)] text-[color:var(--color-brand-100)] mt-16">
      <div className="container-eleva py-14 grid gap-10 md:grid-cols-4">
        <div>
          <Link href="/" aria-label="ELEVA inicio" className="inline-block">
            <Image src="/logo-eleva-trans.png" alt="ELEVA" width={180} height={54} className="h-12 w-auto brightness-0 invert" />
          </Link>
          <p className="text-sm text-[color:var(--color-brand-200)] mt-4">
            Marketplace paraguayo para emprendedores. Todo en una sola tienda.
          </p>
        </div>
        <FooterCol title="Comprar" links={[["/catalogo","Catálogo"],["/catalogo?ofertas=1","Ofertas"],["/catalogo?nuevo=1","Novedades"],["/como-comprar","Cómo comprar"]]} />
        <FooterCol title="Vender" links={[["/vender","Quiero vender"],["/vender/faq","Preguntas de vendedores"]]} />
        <FooterCol title="Ayuda" links={[["/como-comprar","Preguntas frecuentes"],["/contacto","Contacto"]]} />
      </div>
      <div className="border-t border-white/10">
        <div className="container-eleva py-5 flex flex-wrap justify-between gap-3 text-xs text-[color:var(--color-brand-200)]">
          <span>© 2026 ELEVA. Todos los derechos reservados.</span>
          <span className="flex items-center gap-4">
            <span>Asunción, Paraguay</span>
            <a href="https://neura.com.py" target="_blank" rel="noopener" className="text-[color:var(--color-brand-100)] font-semibold hover:text-[color:var(--color-accent)]">
              Desarrollado por <strong className="text-white">Neura</strong>
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4 className="text-white font-bold text-sm mb-3 uppercase tracking-wider">{title}</h4>
      <ul className="space-y-2 text-sm">
        {links.map(([href, label]) => (
          <li key={href}>
            <Link href={href} className="hover:text-white transition-colors">{label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
