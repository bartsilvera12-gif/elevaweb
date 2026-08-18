"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingBag, Store, LogOut, Wallet, MessageCircle, BarChart3, Loader2, Lock, Rocket } from "lucide-react";
import { useUser, signOut } from "@/lib/hooks/use-user";
import { createClient } from "@/lib/supabase/client";

export default function VendedorLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useUser();
  const [upgrading, setUpgrading] = useState(false);
  const [upErr, setUpErr] = useState<string | null>(null);
  const [storeName, setStoreName] = useState("");
  const pathname = usePathname();

  if (loading) {
    return <div className="container-eleva pt-16 flex justify-center min-h-[400px] items-center text-[color:var(--color-muted)]"><Loader2 size={20} className="animate-spin" /></div>;
  }

  if (!user) {
    return (
      <div className="container-eleva pt-16 pb-24 max-w-md">
        <div className="card-flat p-8">
          <div className="w-12 h-12 rounded bg-[color:var(--color-brand-100)] text-[color:var(--color-brand)] flex items-center justify-center mb-4"><Lock size={22} /></div>
          <h1 className="text-2xl font-extrabold">Panel del emprendedor</h1>
          <p className="text-sm text-[color:var(--color-ink-soft)] mt-2">Iniciá sesión o creá tu cuenta para publicar productos.</p>
          <div className="flex gap-2 mt-6">
            <Link href={`/ingresar?next=${encodeURIComponent("/vendedor")}`} className="btn-primary flex-1 justify-center">Ingresar</Link>
            <Link href="/registro" className="btn-outline flex-1 justify-center">Crear cuenta</Link>
          </div>
        </div>
      </div>
    );
  }

  const upgradeToSeller = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName.trim()) { setUpErr("Ingresá el nombre de tu tienda"); return; }
    setUpgrading(true);
    setUpErr(null);
    const supabase = createClient();
    const { error } = await supabase.from("profiles").update({ is_seller: true, store_name: storeName.trim() }).eq("id", user.id);
    setUpgrading(false);
    if (error) { setUpErr(error.message); return; }
    window.location.reload();
  };

  if (profile?.is_seller && !profile.is_approved) {
    return (
      <div className="container-eleva pt-16 pb-24 max-w-md">
        <div className="card-flat p-8 border-t-4 border-yellow-400">
          <div className="w-12 h-12 rounded bg-yellow-100 text-yellow-800 flex items-center justify-center mb-4"><Loader2 size={22} /></div>
          <h1 className="text-2xl font-extrabold">Tu cuenta está en revisión</h1>
          <p className="text-sm text-[color:var(--color-ink-soft)] mt-2">
            El equipo de ELEVA está por aprobar tu registro como vendedor. Cuando confirmen, vas a poder
            publicar productos y recibir pedidos. Te contactamos apenas esté listo.
          </p>
        </div>
      </div>
    );
  }

  if (!profile?.is_seller) {
    return (
      <div className="container-eleva pt-16 pb-24 max-w-md">
        <div className="card-flat p-8 border-t-4 border-[color:var(--color-accent)]">
          <div className="w-12 h-12 rounded bg-[color:var(--color-accent)]/10 text-[color:var(--color-accent)] flex items-center justify-center mb-4"><Rocket size={22} /></div>
          <h1 className="text-2xl font-extrabold">Convertite en emprendedor ELEVA</h1>
          <p className="text-sm text-[color:var(--color-ink-soft)] mt-2">Publicá productos, gestioná tu inventario y cobrá vos mismo cada venta. Nos pagás una comisión por venta y la mensualidad de depósito.</p>
          <form onSubmit={upgradeToSeller} className="mt-6 flex flex-col gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-[color:var(--color-ink-soft)]">Nombre de tu tienda</span>
              <input value={storeName} onChange={(e) => setStoreName(e.target.value)} placeholder="Ej: Sana Botánica" className="border border-[color:var(--color-line)] rounded px-3.5 py-2.5 text-sm focus:outline-none focus:border-[color:var(--color-brand)]" />
            </label>
            {upErr && <div className="text-sm text-[color:var(--color-accent)]">{upErr}</div>}
            <button disabled={upgrading} className="btn-primary justify-center disabled:opacity-60">
              {upgrading ? <><Loader2 size={16} className="animate-spin" /> Activando…</> : "Activar cuenta de vendedor"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const tabs = [
    { href: "/vendedor", label: "Overview", icon: LayoutDashboard },
    { href: "/vendedor/productos", label: "Productos", icon: Package },
    { href: "/vendedor/pedidos", label: "Pedidos", icon: ShoppingBag },
    { href: "/vendedor/mensajes", label: "Mensajes", icon: MessageCircle },
    { href: "/vendedor/analiticas", label: "Analíticas", icon: BarChart3 },
    { href: "/vendedor/finanzas", label: "Finanzas", icon: Wallet },
    { href: "/vendedor/tienda", label: "Mi tienda", icon: Store },
  ];

  return (
    <div className="container-eleva pt-6">
      <div className="grid md:grid-cols-[220px_1fr] gap-6">
        <aside className="card-flat p-3 h-fit md:sticky md:top-24">
          <div className="px-2 py-2">
            <div className="text-[10px] font-black uppercase tracking-widest text-[color:var(--color-muted)]">Emprendedor</div>
            <div className="text-sm font-bold text-[color:var(--color-brand-900)] truncate">{profile.store_name || profile.name}</div>
          </div>
          <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible mt-2">
            {tabs.map((t) => {
              const active = pathname === t.href;
              return (
                <Link key={t.href} href={t.href} className={"flex items-center gap-2.5 px-3 py-2 rounded text-sm font-medium whitespace-nowrap " + (active ? "bg-[color:var(--color-brand-100)] text-[color:var(--color-brand)]" : "text-[color:var(--color-ink-soft)] hover:bg-[color:var(--color-line-soft)]")}>
                  <t.icon size={16} /> {t.label}
                </Link>
              );
            })}
          </nav>
          <button onClick={() => { signOut().then(() => (window.location.href = "/")); }} className="flex items-center gap-2 px-3 py-2 rounded text-sm text-[color:var(--color-muted)] hover:text-[color:var(--color-accent)] w-full mt-3 border-t border-[color:var(--color-line-soft)] pt-3">
            <LogOut size={16} /> Salir
          </button>
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
