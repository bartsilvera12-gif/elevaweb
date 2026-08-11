"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Mail, Lock, Loader2 } from "lucide-react";

export default function IngresarPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const nextUrl = sp.get("next") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setErr(error.message);
      return;
    }
    router.push(nextUrl);
    router.refresh();
  }

  return (
    <div className="container-eleva pt-10 pb-16 max-w-md">
      <div className="card-flat p-8">
        <h1 className="text-3xl font-extrabold text-[color:var(--color-brand-900)]">Ingresar</h1>
        <p className="text-sm text-[color:var(--color-ink-soft)] mt-1">Volvé a tu cuenta.</p>

        <form onSubmit={submit} className="mt-6 flex flex-col gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-[color:var(--color-ink-soft)]">Email</span>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--color-muted)]" />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="karen@ejemplo.com" className="w-full pl-10 pr-3 py-3 border border-[color:var(--color-line)] rounded text-sm focus:outline-none focus:border-[color:var(--color-brand)]" />
            </div>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-[color:var(--color-ink-soft)]">Contraseña</span>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--color-muted)]" />
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full pl-10 pr-3 py-3 border border-[color:var(--color-line)] rounded text-sm focus:outline-none focus:border-[color:var(--color-brand)]" />
            </div>
          </label>

          <button disabled={loading} className="btn-primary justify-center mt-2 disabled:opacity-60">
            {loading ? <><Loader2 size={16} className="animate-spin" /> Ingresando...</> : "Ingresar"}
          </button>

          {err && (
            <div className="text-sm bg-red-50 text-red-700 border border-red-200 rounded p-3">{err}</div>
          )}

          <p className="text-sm text-[color:var(--color-muted)] text-center mt-2">
            ¿No tenés cuenta? <Link href="/registro" className="text-[color:var(--color-brand)] font-semibold hover:text-[color:var(--color-accent)]">Registrate</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
