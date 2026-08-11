"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, ShoppingBag, Store, LogOut, Lock, Wallet, MessageCircle, BarChart3 } from "lucide-react";

const ADMIN_KEY = "eleva2026";
const STORAGE = "eleva.admin";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [ok, setOk] = useState<boolean | null>(null);
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setOk(typeof window !== "undefined" && localStorage.getItem(STORAGE) === "1");
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pass === ADMIN_KEY) {
      localStorage.setItem(STORAGE, "1");
      setOk(true);
      setErr("");
    } else {
      setErr("Clave incorrecta");
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE);
    setOk(false);
    router.push("/admin");
  };

  if (ok === null) return <div className="container-eleva pt-16 min-h-[400px]" />;

  if (!ok) {
    return (
      <div className="container-eleva pt-16 pb-24 max-w-md">
        <div className="card-flat p-8">
          <div className="w-12 h-12 rounded bg-[color:var(--color-brand-100)] text-[color:var(--color-brand)] flex items-center justify-center mb-4"><Lock size={22} /></div>
          <h1 className="text-2xl font-extrabold">Panel de vendedor</h1>
          <p className="text-sm text-[color:var(--color-ink-soft)] mt-2">Ingresá tu clave de acceso.</p>
          <form onSubmit={submit} className="mt-6 flex flex-col gap-3">
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="Clave de admin"
              className="border border-[color:var(--color-line)] rounded px-4 py-3 focus:outline-none focus:border-[color:var(--color-brand)]"
            />
            {err && <div className="text-sm text-[color:var(--color-accent)]">{err}</div>}
            <button className="btn-primary justify-center">Ingresar</button>
            <p className="text-xs text-[color:var(--color-muted)] text-center mt-2">
              Demo: clave <code className="bg-[color:var(--color-line-soft)] px-1.5 py-0.5 rounded">eleva2026</code>
            </p>
          </form>
        </div>
      </div>
    );
  }

  const tabs = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/productos", label: "Productos", icon: Package },
    { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag },
    { href: "/admin/mensajes", label: "Mensajes", icon: MessageCircle },
    { href: "/admin/analiticas", label: "Analíticas", icon: BarChart3 },
    { href: "/admin/finanzas", label: "Finanzas", icon: Wallet },
    { href: "/admin/tienda", label: "Mi tienda", icon: Store },
  ];

  return (
    <div className="container-eleva pt-6">
      <div className="grid md:grid-cols-[220px_1fr] gap-6">
        <aside className="card-flat p-3 h-fit md:sticky md:top-24">
          <div className="text-xs font-bold uppercase tracking-wider text-[color:var(--color-muted)] px-2 py-2">Panel vendedor</div>
          <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
            {tabs.map((t) => {
              const active = pathname === t.href;
              return (
                <Link
                  key={t.href}
                  href={t.href}
                  className={
                    "flex items-center gap-2.5 px-3 py-2 rounded text-sm font-medium whitespace-nowrap " +
                    (active
                      ? "bg-[color:var(--color-brand-100)] text-[color:var(--color-brand)]"
                      : "text-[color:var(--color-ink-soft)] hover:bg-[color:var(--color-line-soft)]")
                  }
                >
                  <t.icon size={16} /> {t.label}
                </Link>
              );
            })}
          </nav>
          <button onClick={logout} className="flex items-center gap-2 px-3 py-2 rounded text-sm text-[color:var(--color-muted)] hover:text-[color:var(--color-accent)] w-full mt-3 border-t border-[color:var(--color-line-soft)] pt-3">
            <LogOut size={16} /> Salir
          </button>
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
