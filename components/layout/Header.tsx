"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Search, Heart, ShoppingCart, User, ArrowUpRight, MapPin, Menu, X } from "lucide-react";
import { categories } from "@/lib/mock-products";

const navItems = [
  { href: "/", label: "Inicio" },
  { href: "/catalogo", label: "Productos" },
  { href: "/catalogo?ofertas=1", label: "Ofertas" },
  { href: "/catalogo?nuevo=1", label: "Novedades" },
  { href: "/como-comprar", label: "Cómo comprar" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-[color:var(--color-line)]">
      <div className="container-eleva flex items-center gap-6 py-3.5">
        <Link href="/" aria-label="ELEVA inicio" className="shrink-0">
          <Image src="/logo-eleva-trans.png" alt="ELEVA" width={200} height={60} priority className="h-14 w-auto" />
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
        </div>
      </div>

      <nav className="hidden md:block border-t border-[color:var(--color-line-soft)]">
        <div className="container-eleva flex items-center gap-1 h-12">
          <button className="flex items-center gap-2 px-3 py-2 rounded text-sm text-[color:var(--color-brand)] hover:bg-[color:var(--color-brand-100)]">
            <MapPin size={16} className="text-[color:var(--color-accent)]" />
            <span className="text-[color:var(--color-muted)]">Enviar a <strong className="text-[color:var(--color-brand)]">Asunción</strong></span>
          </button>
          <span className="w-px h-5 bg-[color:var(--color-line)] mx-2" />
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            className="flex items-center gap-2 px-3.5 py-2 rounded text-sm font-bold text-[color:var(--color-brand)] bg-[color:var(--color-brand-100)] hover:bg-[color:var(--color-brand-200)]"
          >
            {menuOpen ? <X size={16} /> : <Menu size={16} />} Categorías
          </button>
          {navItems.map((n) => (
            <Link key={n.href} href={n.href} className="px-3 py-2 rounded text-sm font-medium text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-accent)] whitespace-nowrap">
              {n.label}
            </Link>
          ))}
        </div>
      </nav>

      {menuOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/30" onClick={() => setMenuOpen(false)} />
          <div className="absolute left-0 right-0 top-full bg-white border-b border-[color:var(--color-line)] shadow-xl z-50">
            <div className="container-eleva py-6">
              <div className="text-xs font-bold tracking-widest uppercase text-[color:var(--color-accent)] mb-4">Explorá</div>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/catalogo?cat=${c.slug}`}
                    onClick={() => setMenuOpen(false)}
                    className="card-flat px-4 py-3 flex items-center gap-3 hover:border-[color:var(--color-accent)] hover:shadow-md transition"
                  >
                    <span className="text-2xl leading-none">{c.icon}</span>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-[color:var(--color-brand)] truncate">{c.name}</div>
                      <div className="text-[11px] text-[color:var(--color-muted)]">{c.count} productos</div>
                    </div>
                  </Link>
                ))}
              </div>
              <Link href="/categorias" onClick={() => setMenuOpen(false)} className="inline-block mt-5 text-sm font-semibold text-[color:var(--color-brand)] hover:text-[color:var(--color-accent)]">
                Ver todas las categorías →
              </Link>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
