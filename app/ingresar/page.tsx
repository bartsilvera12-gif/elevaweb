"use client";
import { useState } from "react";
import Link from "next/link";

export default function IngresarPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) return setMsg(data.error || "Error");
    localStorage.setItem("eleva.token", data.token);
    setMsg("Sesión iniciada");
  }
  return (
    <div className="container-eleva pt-10 max-w-md">
      <h1 className="text-3xl font-extrabold">Ingresar</h1>
      <form onSubmit={submit} className="mt-6 grid gap-3">
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="border border-[color:var(--color-line)] rounded px-4 py-3" />
        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" className="border border-[color:var(--color-line)] rounded px-4 py-3" />
        <button className="btn-primary justify-center">Ingresar</button>
        {msg && <p className="text-sm text-[color:var(--color-ink-soft)]">{msg}</p>}
        <p className="text-sm text-[color:var(--color-muted)]">¿No tenés cuenta? <Link href="/registro" className="text-[color:var(--color-brand)] font-semibold">Registrate</Link></p>
      </form>
    </div>
  );
}
