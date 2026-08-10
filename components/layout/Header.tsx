"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Search, Heart, ShoppingCart, ChevronDown, MapPin, Menu, X, ArrowUpRight } from "lucide-react";
import { categories } from "@/lib/mock-products";
import { categoryIcon } from "@/lib/category-icons";
import { useCart, useFavorites, useHydrated } from "@/lib/store";
import { useCity } from "@/lib/city-store";
import { depts } from "@/lib/cities";

const navItems = [
  { href: "/catalogo?ofertas=1", label: "Ofertas del día" },
  { href: "/catalogo?nuevo=1", label: "Novedades" },
  { href: "/vender", label: "Vender" },
  { href: "/como-comprar", label: "Cómo comprar" },
  { href: "/contacto", label: "Contacto" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [catFilter, setCatFilter] = useState("");
  const [catFilterOpen, setCatFilterOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const catRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);

  const hydrated = useHydrated();
  const cartCount = useCart((s) => s.count());
  const favCount = useFavorites((s) => s.slugs.length);
  const city = useCity((s) => s.city);
  const setCity = useCity((s) => s.setCity);
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setCatFilterOpen(false);
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) setCityOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const onCategoriasClick = () => {
    if (isHome) setMenuOpen((v) => !v);
    else router.push("/categorias");
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Primary bar (dark) */}
      <div className="bg-[#1A003F] text-white">
        <div className="container-eleva flex items-center gap-3 md:gap-4 py-2.5">
          {/* Logo */}
          <Link href="/" aria-label="ELEVA inicio" className="shrink-0 group px-2 py-1 -mx-2 rounded hover:outline hover:outline-1 hover:outline-white/50">
            <Image src="/logo-eleva-trans.png" alt="ELEVA" width={140} height={44} priority className="h-9 w-auto brightness-0 invert" />
          </Link>

          {/* City selector */}
          <div ref={cityRef} className="relative shrink-0">
            <button
              onClick={() => setCityOpen((v) => !v)}
              className="flex items-start gap-1.5 px-2 py-1 -mx-2 rounded hover:outline hover:outline-1 hover:outline-white/50 text-left"
            >
              <MapPin size={18} className="text-white mt-3" />
              <div className="leading-tight">
                <div className="text-[11px] text-white/70">Enviar a</div>
                <div className="text-sm font-bold whitespace-nowrap flex items-center gap-1">
                  {hydrated ? city : "Asunción"} <ChevronDown size={12} />
                </div>
              </div>
            </button>
            <AnimatePresence>
              {cityOpen && <CityDropdown current={hydrated ? city : "Asunción"} onPick={(c) => { setCity(c); setCityOpen(false); }} />}
            </AnimatePresence>
          </div>

          {/* Search */}
          <form action="/catalogo" className="hidden md:flex flex-1 min-w-0 h-11 rounded-md overflow-hidden shadow-md group focus-within:ring-2 focus-within:ring-[color:var(--color-accent)]">
            <div ref={catRef} className="relative">
              <button
                type="button"
                onClick={() => setCatFilterOpen((v) => !v)}
                className="h-full px-3 bg-[#E8E5F0] text-[color:var(--color-brand-900)] text-xs font-semibold flex items-center gap-1 border-r border-[color:var(--color-line)] hover:bg-[#DAD5E7] whitespace-nowrap"
              >
                {catFilter || "Todo"} <ChevronDown size={12} />
              </button>
              <AnimatePresence>
                {catFilterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-1 w-56 max-h-80 overflow-y-auto bg-white rounded shadow-xl border border-[color:var(--color-line)] z-50 p-1"
                  >
                    <button type="button" onClick={() => { setCatFilter(""); setCatFilterOpen(false); }} className="w-full text-left px-3 py-2 text-sm text-[color:var(--color-ink)] hover:bg-[color:var(--color-line-soft)] rounded">Todo</button>
                    {categories.map((c) => (
                      <button key={c.slug} type="button" onClick={() => { setCatFilter(c.name); setCatFilterOpen(false); }} className="w-full text-left px-3 py-2 text-sm text-[color:var(--color-ink-soft)] hover:bg-[color:var(--color-line-soft)] rounded">{c.name}</button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <input
              name="q"
              placeholder="Buscar en ELEVA"
              className="flex-1 min-w-0 h-full px-4 text-sm bg-white text-[color:var(--color-ink)] focus:outline-none"
            />
            <input type="hidden" name="cat" value={catFilter && categories.find((c) => c.name === catFilter)?.slug || ""} />
            <button type="submit" className="h-full px-4 bg-[color:var(--color-accent)] hover:bg-[#e04700] transition-colors flex items-center justify-center text-white">
              <Search size={20} strokeWidth={2.5} />
            </button>
          </form>

          {/* Right cluster */}
          <div className="hidden md:flex items-center gap-1 shrink-0">
            <Link href="/ingresar" className="px-2 py-1 -mx-2 rounded hover:outline hover:outline-1 hover:outline-white/50 text-left leading-tight">
              <div className="text-[11px] text-white/70">Hola,</div>
              <div className="text-sm font-bold flex items-center gap-1 whitespace-nowrap">Ingresá <ChevronDown size={12} /></div>
            </Link>
            <Link href="/mis-pedidos" className="px-2 py-1 rounded hover:outline hover:outline-1 hover:outline-white/50 text-left leading-tight">
              <div className="text-[11px] text-white/70">Devoluciones</div>
              <div className="text-sm font-bold whitespace-nowrap">y pedidos</div>
            </Link>
            <Link href="/favoritos" aria-label="Favoritos" className="relative px-2 py-1 rounded hover:outline hover:outline-1 hover:outline-white/50 flex items-center gap-1.5">
              <Heart size={22} />
              {hydrated && favCount > 0 && (
                <span className="absolute -top-0 right-0 min-w-[18px] h-[18px] px-1 bg-[color:var(--color-accent)] text-white text-[10px] font-black rounded-full flex items-center justify-center">{favCount}</span>
              )}
            </Link>
            <Link href="/carrito" className="relative px-2 py-1 rounded hover:outline hover:outline-1 hover:outline-white/50 flex items-end gap-1.5">
              <div className="relative">
                <ShoppingCart size={26} />
                <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 min-w-[20px] h-[20px] px-1 bg-[color:var(--color-accent)] text-white text-[11px] font-black rounded-full flex items-center justify-center">
                  {hydrated ? cartCount : 0}
                </span>
              </div>
              <span className="text-sm font-bold pb-1">Carrito</span>
            </Link>
          </div>

          {/* Mobile menu */}
          <button className="md:hidden ml-auto p-2 rounded hover:bg-white/10" onClick={() => setMenuOpen((v) => !v)} aria-label="Menú">
            <Menu size={22} />
          </button>
        </div>

        {/* Mobile search */}
        <form action="/catalogo" className="md:hidden container-eleva pb-3">
          <div className="flex h-11 rounded-md overflow-hidden shadow-md">
            <input name="q" placeholder="Buscar en ELEVA" className="flex-1 px-3 text-sm bg-white text-[color:var(--color-ink)] focus:outline-none" />
            <button className="px-4 bg-[color:var(--color-accent)] text-white"><Search size={18} strokeWidth={2.5} /></button>
          </div>
        </form>
      </div>

      {/* Secondary bar (slightly lighter) */}
      <div className="bg-[#2D0868] text-white text-sm border-t border-white/5">
        <div className="container-eleva flex items-center gap-1 py-1.5 overflow-x-auto no-scrollbar">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onCategoriasClick}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded hover:outline hover:outline-1 hover:outline-white/50 font-bold whitespace-nowrap"
          >
            <motion.span animate={{ rotate: isHome && menuOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
              {isHome && menuOpen ? <X size={16} /> : <Menu size={16} />}
            </motion.span>
            Todo
          </motion.button>
          {navItems.map((n) => (
            <Link key={n.href} href={n.href} className="px-2 py-1.5 rounded hover:outline hover:outline-1 hover:outline-white/50 whitespace-nowrap text-white/95 hover:text-white">
              {n.label}
            </Link>
          ))}
          <Link href="/vender" className="ml-auto flex items-center gap-1 px-3 py-1.5 rounded bg-[color:var(--color-accent)] hover:brightness-110 font-bold whitespace-nowrap transition">
            <ArrowUpRight size={14} /> Quiero vender
          </Link>
        </div>
      </div>

      {/* Categorías full-width dropdown (only on home) */}
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

function CityDropdown({ current, onPick }: { current: string; onPick: (c: string) => void }) {
  const [q, setQ] = useState("");
  const filtered = q
    ? depts
        .map((d) => ({ ...d, cities: d.cities.filter((c) => c.toLowerCase().includes(q.toLowerCase())) }))
        .filter((d) => d.cities.length > 0)
    : depts;
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.15 }}
      className="absolute top-full left-0 mt-1 w-80 max-h-[440px] bg-white text-[color:var(--color-ink)] border border-[color:var(--color-line)] rounded shadow-xl z-50 flex flex-col"
    >
      <div className="p-3 border-b border-[color:var(--color-line-soft)]">
        <div className="text-[11px] font-bold uppercase tracking-wider text-[color:var(--color-muted)] mb-2">Elegí tu ciudad</div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--color-muted)]" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar ciudad…"
            className="w-full pl-8 pr-3 py-2 text-sm border border-[color:var(--color-line)] rounded focus:outline-none focus:border-[color:var(--color-brand)]"
          />
        </div>
      </div>
      <div className="overflow-y-auto p-2 flex-1">
        {filtered.map((d) => (
          <div key={d.name} className="mb-2">
            <div className="px-2 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[color:var(--color-brand-200)]">{d.name}</div>
            {d.cities.map((c) => {
              const active = c === current;
              return (
                <button
                  key={c}
                  onClick={() => onPick(c)}
                  className={`w-full text-left px-2 py-1.5 rounded text-sm ${active ? "bg-[color:var(--color-brand-100)] text-[color:var(--color-brand)] font-semibold" : "text-[color:var(--color-ink-soft)] hover:bg-[color:var(--color-line-soft)]"}`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
