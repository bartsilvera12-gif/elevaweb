"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, ShoppingCart, Heart, User } from "lucide-react";
import { useCart, useFavorites, useHydrated } from "@/lib/store";

const items = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/categorias", label: "Categorías", icon: LayoutGrid },
  { href: "/carrito", label: "Carrito", icon: ShoppingCart, badge: "cart" as const },
  { href: "/favoritos", label: "Favoritos", icon: Heart, badge: "fav" as const },
  { href: "/mis-pedidos", label: "Cuenta", icon: User },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const hydrated = useHydrated();
  const cartCount = useCart((s) => s.count());
  const favCount = useFavorites((s) => s.slugs.length);

  return (
    <nav
      aria-label="Navegación principal"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[color:var(--color-line)] shadow-[0_-4px_16px_-8px_rgba(36,4,83,0.15)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="grid grid-cols-5">
        {items.map((it) => {
          const active = pathname === it.href;
          const count = it.badge === "cart" ? cartCount : it.badge === "fav" ? favCount : 0;
          return (
            <li key={it.href}>
              <Link
                href={it.href}
                className={`flex flex-col items-center justify-center gap-1 py-2.5 relative transition-colors ${
                  active ? "text-[color:var(--color-accent)]" : "text-[color:var(--color-ink-soft)]"
                }`}
              >
                <span className="relative">
                  <it.icon size={22} strokeWidth={active ? 2.5 : 2} />
                  {hydrated && it.badge && count > 0 && (
                    <span className="absolute -top-1.5 -right-2 min-w-[16px] h-[16px] px-1 bg-[color:var(--color-accent)] text-white text-[9px] font-black rounded-full flex items-center justify-center">
                      {count > 9 ? "9+" : count}
                    </span>
                  )}
                </span>
                <span className={`text-[10px] leading-none ${active ? "font-bold" : "font-medium"}`}>{it.label}</span>
                {active && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-t bg-[color:var(--color-accent)]" />}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
