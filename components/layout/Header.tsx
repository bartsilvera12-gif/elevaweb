"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Search, Heart, ShoppingCart, User, ArrowUpRight, MapPin, Menu, X, Zap, Truck, Package, Store, HelpCircle, MessageCircle, ChevronRight } from "lucide-react";
import { categories } from "@/lib/mock-products";
import { categoryIcon } from "@/lib/category-icons";
import { useCart, useFavorites, useHydrated } from "@/lib/store";
import { useCity } from "@/lib/city-store";
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
  const [drawerOpen, setDrawerOpen] = useState(false);
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

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (drawerOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

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

      {/* DESKTOP top row */}
      <div className="hidden md:flex container-eleva items-center gap-6 py-4">
        <Link href="/" aria-label="ELEVA inicio" className="shrink-0 group">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.15 }}>
            <Image src="/logo-eleva-trans.png" alt="ELEVA" width={200} height={60} priority className="h-14 w-auto" />
          </motion.div>
        </Link>

        <form action="/catalogo" className="flex-1 relative">
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
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded font-bold text-sm text-white
                         bg-gradient-to-r from-[#FC5005] via-[#FF6320] to-[#FC5005]
                         bg-[length:200%_100%] hover:bg-[position:100%_0]
                         shadow-[0_8px_20px_-8px_rgba(252,80,5,0.55)]
                         transition-[background-position] duration-500"
            >
              <ArrowUpRight size={16} /> Quiero vender
            </Link>
          </motion.div>

          <IconLink href="/mis-pedidos" label="Mi cuenta"><User size={22} /></IconLink>
          <IconLink href="/favoritos" label="Favoritos" badge={hydrated ? favCount : 0} badgeColor="brand"><Heart size={22} /></IconLink>
          <IconLink href="/carrito" label="Carrito" badge={hydrated ? cartCount : 0} badgeColor="accent"><ShoppingCart size={22} /></IconLink>
        </div>
      </div>

      {/* MOBILE top rows */}
      <div className="md:hidden">
        <div className="container-eleva flex items-center gap-3 py-3">
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Menú"
            className="w-10 h-10 -ml-2 rounded flex items-center justify-center text-[color:var(--color-brand)] hover:bg-[color:var(--color-brand-100)] active:bg-[color:var(--color-brand-200)]"
          >
            <Menu size={26} strokeWidth={2.2} />
          </button>

          <Link href="/" aria-label="ELEVA inicio" className="flex-1 flex justify-start">
            <Image src="/logo-eleva-trans.png" alt="ELEVA" width={140} height={44} priority className="h-10 w-auto" />
          </Link>

          <Link
            href="/carrito"
            aria-label="Carrito"
            className="relative w-10 h-10 -mr-2 rounded flex items-center justify-center text-[color:var(--color-brand)] hover:bg-[color:var(--color-brand-100)] active:bg-[color:var(--color-brand-200)]"
          >
            <ShoppingCart size={24} />
            {hydrated && cartCount > 0 && (
              <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 bg-[color:var(--color-accent)] text-white text-[10px] font-black rounded-full flex items-center justify-center">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile search bar */}
        <form action="/catalogo" className="container-eleva pb-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[color:var(--color-muted)]" size={18} />
            <input
              name="q"
              placeholder="Buscar en ELEVA"
              className="w-full pl-10 pr-11 py-3 rounded border border-[color:var(--color-line)] bg-[color:var(--color-surface)] text-[color:var(--color-ink)] focus:outline-none focus:border-[color:var(--color-accent)] focus:bg-white transition-all text-[15px]"
            />
            <button aria-label="Buscar" className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 rounded bg-[color:var(--color-accent)] flex items-center justify-center text-white">
              <Search size={16} strokeWidth={2.5} />
            </button>
          </div>
        </form>

        {/* Mobile city strip */}
        <div className="bg-[color:var(--color-line-soft)] border-y border-[color:var(--color-line)]">
          <div className="container-eleva py-2 flex items-center gap-2 text-sm">
            <MapPin size={14} className="text-[color:var(--color-accent)] shrink-0" />
            <span className="text-[color:var(--color-muted)]">Enviar a</span>
            <MobileCity />
          </div>
        </div>
      </div>

      {/* Desktop nav */}
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

      {/* Categorias mega dropdown (desktop only, on home) */}
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

      {/* MOBILE DRAWER */}
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} favCount={hydrated ? favCount : 0} />
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

function MobileCity() {
  const [open, setOpen] = useState(false);
  const city = useCity((s) => s.city);
  const hydrated = useHydrated();
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="font-bold text-[color:var(--color-brand)] flex items-center gap-1"
      >
        {hydrated ? city : "Asunción"}
      </button>
      <AnimatePresence>
        {open && <CityPickerMobile onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

function CityPickerMobile({ onClose }: { onClose: () => void }) {
  const setCity = useCity((s) => s.setCity);
  const current = useCity((s) => s.city);
  const [q, setQ] = useState("");
  const { depts } = require("@/lib/cities") as typeof import("@/lib/cities");
  const filtered = q
    ? depts.map((d) => ({ ...d, cities: d.cities.filter((c) => c.toLowerCase().includes(q.toLowerCase())) })).filter((d) => d.cities.length > 0)
    : depts;

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="md:hidden fixed inset-0 z-[70] bg-black/40" onClick={onClose} />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 250 }}
        className="md:hidden fixed left-0 right-0 bottom-0 z-[71] bg-white rounded-t-xl max-h-[80vh] flex flex-col"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="p-4 border-b border-[color:var(--color-line-soft)]">
          <div className="mx-auto w-10 h-1 rounded-full bg-[color:var(--color-line)] mb-3" />
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-[color:var(--color-brand-900)]">Elegí tu ciudad</h3>
            <button onClick={onClose} aria-label="Cerrar" className="w-8 h-8 rounded flex items-center justify-center text-[color:var(--color-muted)]"><X size={20} /></button>
          </div>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--color-muted)]" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar ciudad…"
              className="w-full pl-9 pr-3 py-2.5 text-sm border border-[color:var(--color-line)] rounded focus:outline-none focus:border-[color:var(--color-brand)]"
            />
          </div>
        </div>
        <div className="overflow-y-auto p-3 flex-1">
          {filtered.map((d) => (
            <div key={d.name} className="mb-3">
              <div className="px-2 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[color:var(--color-brand-200)]">{d.name}</div>
              {d.cities.map((c) => (
                <button
                  key={c}
                  onClick={() => { setCity(c); onClose(); }}
                  className={`w-full text-left px-3 py-3 rounded text-[15px] ${c === current ? "bg-[color:var(--color-brand-100)] text-[color:var(--color-brand)] font-semibold" : "text-[color:var(--color-ink-soft)] active:bg-[color:var(--color-line-soft)]"}`}
                >
                  {c}
                </button>
              ))}
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );
}

function MobileDrawer({ open, onClose, favCount }: { open: boolean; onClose: () => void; favCount: number }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="md:hidden fixed inset-0 z-[60] bg-black/40"
          />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 300 }}
            className="md:hidden fixed left-0 top-0 bottom-0 z-[61] w-[86%] max-w-[360px] bg-white flex flex-col shadow-2xl"
          >
            {/* Drawer header */}
            <div className="bg-gradient-to-br from-[#240453] to-[#1A003F] text-white px-5 py-6 relative">
              <button onClick={onClose} aria-label="Cerrar" className="absolute top-3 right-3 w-9 h-9 rounded flex items-center justify-center text-white/80 hover:bg-white/10">
                <X size={22} />
              </button>
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-3">
                <User size={22} />
              </div>
              <div className="text-sm text-white/70">Hola,</div>
              <div className="text-xl font-bold">Ingresá a tu cuenta</div>
              <Link href="/ingresar" onClick={onClose} className="mt-4 inline-flex items-center gap-2 bg-[color:var(--color-accent)] hover:brightness-110 text-white font-bold text-sm px-4 py-2 rounded">
                Iniciar sesión <ChevronRight size={14} />
              </Link>
            </div>

            <div className="flex-1 overflow-y-auto">
              <DrawerSection title="Comprar">
                <DrawerLink href="/" icon={Menu} label="Inicio" onClick={onClose} />
                <DrawerLink href="/catalogo" icon={Package} label="Todos los productos" onClick={onClose} />
                <DrawerLink href="/catalogo?ofertas=1" icon={Zap} label="Ofertas del día" onClick={onClose} accent />
                <DrawerLink href="/catalogo?nuevo=1" icon={Truck} label="Novedades" onClick={onClose} />
                <DrawerLink href="/categorias" icon={Menu} label="Todas las categorías" onClick={onClose} />
              </DrawerSection>

              <DrawerSection title="Categorías">
                {categories.map((c) => {
                  const Icon = categoryIcon(c.slug);
                  return <DrawerLink key={c.slug} href={`/catalogo?cat=${c.slug}`} icon={Icon} label={c.name} sub={`${c.count} productos`} onClick={onClose} />;
                })}
              </DrawerSection>

              <DrawerSection title="Mi cuenta">
                <DrawerLink href="/mis-pedidos" icon={Package} label="Mis pedidos" onClick={onClose} />
                <DrawerLink href="/favoritos" icon={Heart} label="Favoritos" sub={favCount > 0 ? `${favCount} guardados` : undefined} onClick={onClose} />
                <DrawerLink href="/ingresar" icon={User} label="Iniciar sesión" onClick={onClose} />
                <DrawerLink href="/registro" icon={User} label="Crear cuenta" onClick={onClose} />
              </DrawerSection>

              <DrawerSection title="Vender">
                <DrawerLink href="/vender" icon={Store} label="Quiero vender" onClick={onClose} accent />
                <DrawerLink href="/vendedor" icon={Store} label="Panel del emprendedor" onClick={onClose} />
              </DrawerSection>

              <DrawerSection title="Ayuda">
                <DrawerLink href="/como-comprar" icon={HelpCircle} label="Cómo comprar" onClick={onClose} />
                <DrawerLink href="/contacto" icon={MessageCircle} label="Contacto" onClick={onClose} />
              </DrawerSection>
            </div>

            <div className="border-t border-[color:var(--color-line-soft)] p-4 text-[11px] text-[color:var(--color-muted)] text-center">
              © 2026 ELEVA · Asunción, Paraguay
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function DrawerSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="py-2 border-b border-[color:var(--color-line-soft)]">
      <div className="px-5 pt-3 pb-1 text-[11px] font-black uppercase tracking-[0.14em] text-[color:var(--color-muted)]">{title}</div>
      <div className="flex flex-col">{children}</div>
    </div>
  );
}

function DrawerLink({ href, icon: Icon, label, sub, onClick, accent }: {
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  sub?: string;
  onClick?: () => void;
  accent?: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-5 py-3 active:bg-[color:var(--color-brand-100)] transition-colors"
    >
      <span className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${accent ? "bg-[color:var(--color-accent)]/10 text-[color:var(--color-accent)]" : "bg-[color:var(--color-brand-100)] text-[color:var(--color-brand)]"}`}>
        <Icon size={16} />
      </span>
      <div className="flex-1 min-w-0">
        <div className={`text-[15px] ${accent ? "font-bold text-[color:var(--color-accent)]" : "font-medium text-[color:var(--color-ink)]"}`}>{label}</div>
        {sub && <div className="text-[11px] text-[color:var(--color-muted)] mt-0.5">{sub}</div>}
      </div>
      <ChevronRight size={16} className="text-[color:var(--color-muted)] shrink-0" />
    </Link>
  );
}
