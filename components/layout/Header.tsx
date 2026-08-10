"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Search, Heart, ShoppingCart, User, ArrowUpRight, MapPin, Menu, X, Zap, Truck } from "lucide-react";
import { categories } from "@/lib/mock-products";
import { categoryIcon } from "@/lib/category-icons";
import { useCart, useFavorites, useHydrated } from "@/lib/store";
import CitySelector from "./CitySelector";

const navItems = [
  { href: "/", label: "Inicio" },
  { href: "/catalogo", label: "Productos" },
  { href: "/catalogo?ofertas=1", label: "Ofertas" },
  { href: "/catalogo?nuevo=1", label: "Novedades" },
  { href: "/como-comprar", label: "Cómo comprar" },
];

const announcements = [
  { icon: Truck, text: "Envío gratis en compras desde Gs. 500.000" },
  { icon: Zap, text: "Semana de ofertas: hasta 40% off" },
  { icon: ShoppingCart, text: "3 cuotas sin interés con tarjeta" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const hydrated = useHydrated();
  const cartCount = useCart((s) => s.count());
  const favCount = useFavorites((s) => s.slugs.length);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const isHome = pathname === "/";
  const isActive = (href: string) => {
    const [path, query] = href.split("?");
    if (pathname !== path) return false;
    if (!query) {
      return !["ofertas", "nuevo", "best"].some((k) => searchParams.get(k));
    }
    const params = new URLSearchParams(query);
    for (const [k, v] of params.entries()) {
      if (searchParams.get(k) !== v) return false;
    }
    return true;
  };
  const onCategoriasClick = () => {
    if (isHome) setMenuOpen((v) => !v);
    else router.push("/categorias");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-[color:var(--color-line)] shadow-[0_1px_0_rgba(36,4,83,0.02)]">
      {/* Announcement strip */}
      <div className="bg-gradient-to-r from-[#240453] via-[#3B1370] to-[#240453] text-white text-xs overflow-hidden">
        <div className="container-eleva py-2 flex items-center gap-6 md:gap-10 overflow-x-auto no-scrollbar">
          {announcements.map((a, i) => (
            <span key={i} className="flex items-center gap-2 whitespace-nowrap opacity-90">
              <a.icon size={12} className="text-[color:var(--color-accent)]" /> {a.text}
            </span>
          ))}
        </div>
      </div>

      <div className="container-eleva flex items-center gap-6 py-4">
        <Link href="/" aria-label="ELEVA inicio" className="shrink-0 group">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.15 }}>
            <Image src="/logo-eleva-trans.png" alt="ELEVA" width={200} height={60} priority className="h-14 w-auto" />
          </motion.div>
        </Link>

        <form action="/catalogo" className="hidden md:block flex-1 relative">
          <motion.div
            animate={{
              boxShadow: searchFocused
                ? "0 0 0 3px rgba(252,80,5,0.15), 0 8px 24px -12px rgba(36,4,83,0.25)"
                : "0 0 0 0px rgba(252,80,5,0), 0 0 0 0 rgba(36,4,83,0)",
            }}
            transition={{ duration: 0.2 }}
            className="rounded relative"
          >
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${searchFocused ? "text-[color:var(--color-accent)]" : "text-[color:var(--color-muted)]"}`} size={18} />
            <input
              name="q"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Buscar productos, categorías, marcas…"
              className="w-full pl-11 pr-4 py-3.5 rounded border border-[color:var(--color-line)] bg-[color:var(--color-surface)] text-[color:var(--color-ink)] focus:outline-none focus:border-[color:var(--color-accent)] focus:bg-white transition-all"
            />
          </motion.div>
        </form>

        <div className="flex items-center gap-1.5 shrink-0">
          <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.15 }}>
            <Link
              href="/vender"
              className="hidden md:inline-flex items-center gap-2 px-4 py-2.5 rounded font-bold text-sm text-white
                         bg-gradient-to-r from-[#FC5005] via-[#FF6320] to-[#FC5005]
                         bg-[length:200%_100%] hover:bg-[position:100%_0]
                         shadow-[0_8px_20px_-8px_rgba(252,80,5,0.55)]
                         transition-[background-position] duration-500"
            >
              <ArrowUpRight size={16} /> Quiero vender
            </Link>
          </motion.div>

          <IconLink href="/mis-pedidos" label="Mi cuenta">
            <User size={22} />
          </IconLink>

          <IconLink href="/favoritos" label="Favoritos" badge={hydrated ? favCount : 0} badgeColor="brand">
            <Heart size={22} />
          </IconLink>

          <IconLink href="/carrito" label="Carrito" badge={hydrated ? cartCount : 0} badgeColor="accent">
            <ShoppingCart size={22} />
          </IconLink>
        </div>
      </div>

      <nav className="hidden md:block border-t border-[color:var(--color-line-soft)]">
        <div className="container-eleva flex items-center gap-1 h-12">
          <CitySelector />
          <span className="w-px h-5 bg-[color:var(--color-line)] mx-2" />
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onCategoriasClick}
            aria-expanded={isHome ? menuOpen : undefined}
            className="flex items-center gap-2 px-3.5 py-2 rounded text-sm font-bold text-[color:var(--color-brand)] bg-[color:var(--color-brand-100)] hover:bg-[color:var(--color-brand-200)] transition-colors"
          >
            <motion.span animate={{ rotate: isHome && menuOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
              {isHome && menuOpen ? <X size={16} /> : <Menu size={16} />}
            </motion.span>
            Categorías
          </motion.button>
          {navItems.map((n) => {
            const active = isActive(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className="group relative px-3 py-2 text-sm font-medium text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-accent)] whitespace-nowrap transition-colors"
              >
                {n.label}
                <span
                  className={`absolute left-3 right-3 bottom-0 h-0.5 bg-[color:var(--color-accent)] origin-left transition-transform duration-200 ${
                    active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            );
          })}
        </div>
      </nav>

      <AnimatePresence>
        {isHome && menuOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 right-0 top-full bg-white border-b border-[color:var(--color-line)] shadow-xl z-50"
            >
              <div className="container-eleva py-6">
                <div className="text-xs font-bold tracking-widest uppercase text-[color:var(--color-accent)] mb-4">Explorá</div>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {categories.map((c, i) => {
                    const Icon = categoryIcon(c.slug);
                    return (
                      <motion.div
                        key={c.slug}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: i * 0.025 }}
                      >
                        <Link
                          href={`/catalogo?cat=${c.slug}`}
                          onClick={() => setMenuOpen(false)}
                          className="card-flat px-4 py-3 flex items-center gap-3 hover:border-[color:var(--color-accent)] hover:shadow-md transition"
                        >
                          <span className="w-9 h-9 rounded bg-[color:var(--color-brand-100)] flex items-center justify-center text-[color:var(--color-brand)] shrink-0">
                            <Icon size={18} />
                          </span>
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-[color:var(--color-brand)] truncate">{c.name}</div>
                            <div className="text-[11px] text-[color:var(--color-muted)]">{c.count} productos</div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
                <Link href="/categorias" onClick={() => setMenuOpen(false)} className="inline-block mt-5 text-sm font-semibold text-[color:var(--color-brand)] hover:text-[color:var(--color-accent)]">
                  Ver todas las categorías →
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

function IconLink({ href, label, badge = 0, badgeColor = "brand", children }: {
  href: string;
  label: string;
  badge?: number;
  badgeColor?: "brand" | "accent";
  children: React.ReactNode;
}) {
  return (
    <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.94 }} transition={{ duration: 0.15 }}>
      <Link
        href={href}
        aria-label={label}
        title={label}
        className="relative w-11 h-11 rounded flex items-center justify-center text-[color:var(--color-brand)] hover:bg-[color:var(--color-brand-100)] transition-colors"
      >
        {children}
        <AnimatePresence>
          {badge > 0 && (
            <motion.span
              key={badge}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 20 }}
              className={`absolute top-1 right-1 min-w-[18px] h-[18px] px-1 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center shadow ${
                badgeColor === "accent" ? "bg-[color:var(--color-accent)]" : "bg-[color:var(--color-brand)]"
              }`}
            >
              {badge > 99 ? "99+" : badge}
            </motion.span>
          )}
        </AnimatePresence>
      </Link>
    </motion.div>
  );
}
