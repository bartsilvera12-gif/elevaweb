"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, ShoppingBag, Tag, LayoutGrid, AlertTriangle, Settings, LogOut, ShieldCheck, Boxes, Loader2, MessageCircle, Star } from "lucide-react";
import { useUser, signOut } from "@/lib/hooks/use-user";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useUser();
  const pathname = usePathname();

  if (loading) return <div className="container-eleva pt-16 flex justify-center min-h-[400px] items-center text-[color:var(--color-muted)]"><Loader2 size={20} className="animate-spin" /></div>;

  // Sin clave hardcodeada: el acceso sale de eleva.profiles.is_admin
  if (!profile?.is_admin) {
    return (
      <div className="container-eleva pt-16 pb-24 max-w-md">
        <div className="card-flat p-8 border-t-4 border-[color:var(--color-accent)]">
          <div className="w-12 h-12 rounded bg-[color:var(--color-accent)]/10 text-[color:var(--color-accent)] flex items-center justify-center mb-4"><ShieldCheck size={22} /></div>
          <div className="text-[10px] font-black uppercase tracking-widest text-[color:var(--color-accent)]">Solo para staff ELEVA</div>
          <h1 className="text-2xl font-extrabold mt-1">Panel de administración</h1>
          {!user ? (
            <>
              <p className="text-sm text-[color:var(--color-ink-soft)] mt-2">Ingresá con tu cuenta de staff para continuar.</p>
              <Link href={`/ingresar?next=${encodeURIComponent("/admin")}`} className="btn-primary justify-center mt-6 w-full">Iniciar sesión</Link>
            </>
          ) : (
            <>
              <p className="text-sm text-[color:var(--color-ink-soft)] mt-2">
                Tu cuenta no tiene permisos de staff. Si sos emprendedor, entrá a{" "}
                <Link href="/vendedor" className="text-[color:var(--color-brand)] font-semibold">tu panel</Link>.
              </p>
              <p className="text-xs text-[color:var(--color-muted)] mt-3">
                Para darte acceso, un admin tiene que marcar <code>is_admin = true</code> en tu perfil.
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  const tabs = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/vendedores", label: "Vendedores", icon: Users },
    { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag },
    { href: "/admin/inventario", label: "Inventario", icon: Boxes },
    { href: "/admin/destacados", label: "Destacados", icon: Star },
    { href: "/admin/mensajes", label: "Mensajes", icon: MessageCircle },
    { href: "/admin/reclamos", label: "Reclamos", icon: AlertTriangle },
    { href: "/admin/cupones", label: "Cupones", icon: Tag },
    { href: "/admin/categorias", label: "Categorías", icon: LayoutGrid },
    { href: "/admin/configuracion", label: "Configuración", icon: Settings },
  ];

  return (
    <div className="container-eleva pt-6">
      <div className="grid md:grid-cols-[240px_1fr] gap-6">
        <aside className="card-flat p-3 h-fit md:sticky md:top-24 border-t-4 border-[color:var(--color-accent)]">
          <div className="px-2 py-2">
            <div className="text-[10px] font-black uppercase tracking-widest text-[color:var(--color-accent)]">Staff</div>
            <div className="text-sm font-bold text-[color:var(--color-brand-900)]">{user ? (profile?.name || user.email) : "Admin ELEVA"}</div>
          </div>
          <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible mt-2">
            {tabs.map((t) => {
              const active = pathname === t.href;
              return (
                <Link key={t.href} href={t.href} className={"flex items-center gap-2.5 px-3 py-2 rounded text-sm font-medium whitespace-nowrap " + (active ? "bg-[color:var(--color-accent)]/10 text-[color:var(--color-accent)]" : "text-[color:var(--color-ink-soft)] hover:bg-[color:var(--color-line-soft)]")}>
                  <t.icon size={16} /> {t.label}
                </Link>
              );
            })}
          </nav>
          <button onClick={() => { localStorage.removeItem("eleva.admin.staff"); if (user) signOut(); window.location.href = "/"; }} className="flex items-center gap-2 px-3 py-2 rounded text-sm text-[color:var(--color-muted)] hover:text-[color:var(--color-accent)] w-full mt-3 border-t border-[color:var(--color-line-soft)] pt-3">
            <LogOut size={16} /> Salir
          </button>
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
