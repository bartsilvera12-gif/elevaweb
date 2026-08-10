"use client";
import { useState } from "react";

export default function RegistroPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) return setMsg(data.error || "Error");
    localStorage.setItem("eleva.token", data.token);
    setMsg("Cuenta creada");
  }
  return (
    <div className="container-eleva pt-10 max-w-md">
      <h1 className="text-3xl font-extrabold">Crear cuenta</h1>
      <form onSubmit={submit} className="mt-6 grid gap-3">
        <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre" className="border border-[color:var(--color-line)] rounded px-4 py-3" />
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="border border-[color:var(--color-line)] rounded px-4 py-3" />
        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña (mín 6)" minLength={6} className="border border-[color:var(--color-line)] rounded px-4 py-3" />
        <button className="btn-primary justify-center">Registrarme</button>
        {msg && <p className="text-sm text-[color:var(--color-ink-soft)]">{msg}</p>}
      </form>
    </div>
  );
}
