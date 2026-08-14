"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Mail, Lock, User as UserIcon, Loader2, Check, Store } from "lucide-react";

export default function RegistroPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSeller, setIsSeller] = useState(false);
  const [storeName, setStoreName] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      // app: 'eleva' -> el trigger de auth.users solo crea profile para signups de acá
      // (auth.users es de toda la instancia self-hosted, la comparten otras apps)
      options: { data: { name, app: "eleva" } },
    });
    if (error) { setMsg({ ok: false, text: error.message }); setLoading(false); return; }

    // Si marcó vendedor, actualizar profile
    if (isSeller && data.user) {
      await supabase.from("profiles").update({ is_seller: true, store_name: storeName || name || null }).eq("id", data.user.id);
    }

    setLoading(false);
    if (data.session) {
      router.push(isSeller ? "/vendedor" : "/");
      router.refresh();
    } else {
      setMsg({ ok: true, text: "Cuenta creada. Revisá tu email para confirmar." });
    }
  }

  return (
    <div className="container-eleva pt-10 pb-16 max-w-md">
      <div className="card-flat p-8">
        <h1 className="text-3xl font-extrabold text-[color:var(--color-brand-900)]">Crear cuenta</h1>
        <p className="text-sm text-[color:var(--color-ink-soft)] mt-1">Registrate en 30 segundos.</p>

        <form onSubmit={submit} className="mt-6 flex flex-col gap-3">
          <Field icon={UserIcon} label="Nombre" value={name} onChange={setName} placeholder="Tu nombre completo" />
          <Field icon={Mail} label="Email" type="email" required value={email} onChange={setEmail} placeholder="tu@email.com" />
          <Field icon={Lock} label="Contraseña" type="password" required minLength={6} value={password} onChange={setPassword} placeholder="Mínimo 6 caracteres" />

          <label className="flex items-start gap-2.5 mt-2 p-3 rounded border border-[color:var(--color-line)] cursor-pointer hover:border-[color:var(--color-brand)]">
            <input type="checkbox" checked={isSeller} onChange={(e) => setIsSeller(e.target.checked)} className="mt-0.5 accent-[color:var(--color-accent)]" />
            <div className="flex-1">
              <div className="text-sm font-semibold text-[color:var(--color-brand-900)] flex items-center gap-1.5"><Store size={14} /> También quiero vender</div>
              <div className="text-xs text-[color:var(--color-muted)] mt-0.5">Vas a poder publicar productos y gestionar tu inventario.</div>
            </div>
          </label>

          {isSeller && (
            <Field icon={Store} label="Nombre de tu tienda" value={storeName} onChange={setStoreName} placeholder="Ej: Sana Botánica" />
          )}

          <button disabled={loading} className="btn-primary justify-center mt-2 disabled:opacity-60">
            {loading ? <><Loader2 size={16} className="animate-spin" /> Creando cuenta...</> : "Crear cuenta"}
          </button>

          {msg && (
            <div className={`text-sm flex items-center gap-2 p-3 rounded ${msg.ok ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
              {msg.ok && <Check size={14} />} {msg.text}
            </div>
          )}

          <p className="text-sm text-[color:var(--color-muted)] text-center mt-2">
            ¿Ya tenés cuenta? <Link href="/ingresar" className="text-[color:var(--color-brand)] font-semibold hover:text-[color:var(--color-accent)]">Ingresá</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

function Field({ icon: Icon, label, value, onChange, ...rest }: { icon: React.ComponentType<{ size?: number; className?: string }>; label: string; value: string; onChange: (v: string) => void; } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-[color:var(--color-ink-soft)]">{label}</span>
      <div className="relative">
        <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--color-muted)]" />
        <input {...rest} value={value} onChange={(e) => onChange(e.target.value)} className="w-full pl-10 pr-3 py-3 border border-[color:var(--color-line)] rounded text-sm focus:outline-none focus:border-[color:var(--color-brand)]" />
      </div>
    </label>
  );
}
