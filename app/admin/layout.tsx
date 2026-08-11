"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, ShoppingBag, Tag, LayoutGrid, AlertTriangle, Settings, LogOut, Lock, ShieldCheck } from "lucide-react";

const KEY = "eleva-staff-2026";
const STORAGE = "eleva.admin.staff";

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
    if (pass === KEY) {
      localStorage.setItem(STORAGE, "1");
      setOk(true);
      setErr("");
    } else setErr("Clave incorrecta");
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
        <div className="card-flat p-8 border-t-4 border-[color:var(--color-accent)]">
          <div className="w-12 h-12 rounded bg-[color:var(--color-accent)]/10 text-[color:var(--color-accent)] flex items-center justify-center mb-4"><ShieldCheck size={22} /></div>
          <div className="text-[10px] font-black uppercase tracking-widest text-[color:var(--color-accent)]">Solo para staff ELEVA</div>
          <h1 className="text-2xl font-extrabold mt-1">Panel de administración</h1>
          <p className="text-sm text-[color:var(--color-ink-soft)] mt-2">Acceso restringido. Si sos vendedor, andá a <Link href="/vendedor" className="text-[color:var(--color-brand)] font-semibold hover:text-[color:var(--color-accent)]">/vendedor</Link>.</p>
          <form onSubmit={submit} className="mt-6 flex flex-col gap-3">
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="Clave de staff"
              className="border border-[color:var(--color-line)] rounded px-4 py-3 focus:outline-none focus:border-[color:var(--color-accent)]"
            />
            {err && <div className="text-sm text-[color:var(--color-accent)] flex items-center gap-1.5"><Lock size={12} /> {err}</div>}
            <button className="btn-primary justify-center">Ingresar</button>
            <p className="text-xs text-[color:var(--color-muted)] text-center mt-2">
              Demo: clave <code className="bg-[color:var(--color-line-soft)] px-1.5 py-0.5 rounded">eleva-staff-2026</code>
            </p>
          </form>
        </div>
      </div>
    );
  }

  const tabs = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/vendedores", label: "Vendedores", icon: Users },
    { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag },
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
            <div className="text-sm font-bold text-[color:var(--color-brand-900)]">Admin ELEVA</div>
          </div>
          <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible mt-2">
            {tabs.map((t) => {
              const active = pathname === t.href;
              return (
                <Link
                  key={t.href}
                  href={t.href}
                  className={
                    "flex items-center gap-2.5 px-3 py-2 rounded text-sm font-medium whitespace-nowrap " +
                    (active
                      ? "bg-[color:var(--color-accent)]/10 text-[color:var(--color-accent)]"
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
