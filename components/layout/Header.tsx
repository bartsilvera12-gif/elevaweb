"use client";
import Link from "next/link";
import Image from "next/image";
import { Search, Heart, ShoppingCart, User, ArrowUpRight, MapPin, Menu } from "lucide-react";

const navItems = [
  { href: "/", label: "Inicio" },
  { href: "/catalogo", label: "Productos" },
  { href: "/catalogo?ofertas=1", label: "Ofertas" },
  { href: "/catalogo?nuevo=1", label: "Novedades" },
  { href: "/como-comprar", label: "Cómo comprar" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-[color:var(--color-line)]">
      <div className="container-eleva flex items-center gap-6 py-3.5">
        <Link href="/" aria-label="ELEVA inicio" className="shrink-0">
          <Image src="/logo-eleva-trans.png" alt="ELEVA" width={140} height={40} priority className="h-10 w-auto" />
        </Link>

        <form action="/catalogo" className="hidden md:block flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--color-muted)]" size={18} />
          <input
            name="q"
            placeholder="Buscar productos, categorías, marcas…"
            className="w-full pl-11 pr-4 py-3 rounded border border-[color:var(--color-line)] bg-[color:var(--color-surface)] text-[color:var(--color-ink)] focus:outline-none focus:border-[color:var(--color-brand)] transition-colors"
          />
        </form>

        <div className="flex items-center gap-1 shrink-0">
          <Link href="/vender" className="btn-primary hidden md:inline-flex">
            <ArrowUpRight size={16} /> Quiero vender
          </Link>
          <Link href="/ingresar" aria-label="Mi cuenta" className="w-11 h-11 rounded flex items-center justify-center text-[color:var(--color-brand)] hover:bg-[color:var(--color-brand-100)]">
            <User size={22} />
          </Link>
          <Link href="/favoritos" aria-label="Favoritos" className="w-11 h-11 rounded flex items-center justify-center text-[color:var(--color-brand)] hover:bg-[color:var(--color-brand-100)]">
            <Heart size={22} />
          </Link>
          <Link href="/carrito" aria-label="Carrito" className="w-11 h-11 rounded flex items-center justify-center text-[color:var(--color-brand)] hover:bg-[color:var(--color-brand-100)]">
            <ShoppingCart size={22} />
          </Link>
          <button aria-label="Menú" className="md:hidden w-11 h-11 rounded flex items-center justify-center text-[color:var(--color-brand)]">
            <Menu size={22} />
          </button>
        </div>
      </div>

      <nav className="hidden md:block border-t border-[color:var(--color-line-soft)]">
        <div className="container-eleva flex items-center gap-1 h-12">
          <button className="flex items-center gap-2 px-3 py-2 rounded text-sm text-[color:var(--color-brand)] hover:bg-[color:var(--color-brand-100)]">
            <MapPin size={16} className="text-[color:var(--color-accent)]" />
            <span className="text-[color:var(--color-muted)]">Enviar a <strong className="text-[color:var(--color-brand)]">Asunción</strong></span>
          </button>
          <span className="w-px h-5 bg-[color:var(--color-line)] mx-2" />
          <Link href="/categorias" className="flex items-center gap-2 px-3.5 py-2 rounded text-sm font-bold text-[color:var(--color-brand)] bg-[color:var(--color-brand-100)] hover:bg-[color:var(--color-brand-200)]">
            <Menu size={16} /> Categorías
          </Link>
          {navItems.map((n) => (
            <Link key={n.href} href={n.href} className="px-3 py-2 rounded text-sm font-medium text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-accent)] whitespace-nowrap">
              {n.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
