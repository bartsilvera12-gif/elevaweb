"use client";
import { useState } from "react";
import Link from "next/link";
import { useSellers, useSellerAccounts, registrarPago, cobrarMensualidades } from "@/lib/hooks/use-platform";
import { createClient } from "@/lib/supabase/client";
import { formatGs } from "@/lib/utils";
import { Search, Users, Loader2, Wallet, Warehouse, Check, ShieldCheck, Clock } from "lucide-react";

const periodoActual = () => new Date().toISOString().slice(0, 7);

export default function AdminVendedores() {
  const { sellers, loading, reload } = useSellers();
  const { accounts, reload: reloadAccounts } = useSellerAccounts();
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [mensualidad, setMensualidad] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [working, setWorking] = useState(false);

  const cuenta = (id: string) => accounts.find((a) => a.seller_id === id);

  const filtered = sellers.filter((s) =>
    !q ||
    (s.store_name || "").toLowerCase().includes(q.toLowerCase()) ||
    (s.name || "").toLowerCase().includes(q.toLowerCase()) ||
    (s.city || "").toLowerCase().includes(q.toLowerCase())
  ).sort((a, b) => Number(a.is_approved) - Number(b.is_approved)); // pendientes arriba

  const pendientes = sellers.filter((s) => !s.is_approved).length;

  const aprobar = async (id: string) => {
    setWorking(true);
    const { error } = await createClient().from("profiles").update({ is_approved: true }).eq("id", id);
    setWorking(false);
    setMsg(error?.message ?? "Emprendedor aprobado");
    reload();
    setTimeout(() => setMsg(null), 3000);
  };

  const guardarMensualidad = async (id: string) => {
    setWorking(true);
    const { error } = await createClient()
      .from("profiles")
      .update({ mensualidad_cents: Number(mensualidad.replace(/\D/g, "")) || 0 })
      .eq("id", id);
    setWorking(false);
    setMsg(error ? error.message : "Mensualidad actualizada");
    setEditing(null);
    reload();
    setTimeout(() => setMsg(null), 3000);
  };

  const cobrarPago = async (id: string, saldo: number) => {
    const input = prompt(`¿Cuánto pagó? (saldo actual: ${formatGs(saldo)})`, String(Math.max(0, saldo)));
    if (!input) return;
    const monto = Number(input.replace(/\D/g, ""));
    if (!monto) return;
    setWorking(true);
    const error = await registrarPago(id, monto, "Pago recibido");
    setWorking(false);
    setMsg(error ?? "Pago registrado");
    reloadAccounts();
    setTimeout(() => setMsg(null), 3000);
  };

  const generarMensualidades = async () => {
    const period = periodoActual();
    if (!confirm(`¿Generar las mensualidades de depósito de ${period} para todos los emprendedores?`)) return;
    setWorking(true);
    const { count, error } = await cobrarMensualidades(period);
    setWorking(false);
    setMsg(error ?? `${count} mensualidades generadas para ${period}`);
    reloadAccounts();
    setTimeout(() => setMsg(null), 4000);
  };

  if (loading) return <div className="flex justify-center py-12 text-[color:var(--color-muted)]"><Loader2 size={20} className="animate-spin" /></div>;

  const deudaTotal = accounts.reduce((n, a) => n + Math.max(0, a.saldo_cents), 0);

  return (
    <div>
      <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">Emprendedores</h1>
          <p className="text-sm text-[color:var(--color-muted)] mt-1">
            {sellers.length} registrados{pendientes > 0 && <> · <strong className="text-yellow-700">{pendientes} esperando aprobación</strong></>} · te deben <strong className="text-[color:var(--color-accent)]">{formatGs(deudaTotal)}</strong>
          </p>
        </div>
        <button onClick={generarMensualidades} disabled={working} className="btn-outline disabled:opacity-50">
          <Warehouse size={16} /> Generar mensualidades de {periodoActual()}
        </button>
      </div>

      {msg && <div className="mb-4 text-sm bg-[color:var(--color-brand-100)] border border-[color:var(--color-line)] rounded p-3">{msg}</div>}

      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--color-muted)]" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por tienda, nombre o ciudad…" className="w-full pl-10 pr-3 py-2.5 text-sm border border-[color:var(--color-line)] rounded focus:outline-none focus:border-[color:var(--color-brand)]" />
      </div>

      {!filtered.length ? (
        <div className="card-flat p-10 text-center">
          <Users size={48} className="mx-auto text-[color:var(--color-brand-200)]" />
          <p className="mt-4 text-[color:var(--color-ink-soft)]">
            {sellers.length ? "Ningún emprendedor coincide con la búsqueda." : "Todavía no hay emprendedores registrados."}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-3">
          {filtered.map((s) => {
            const c = cuenta(s.id);
            const saldo = c?.saldo_cents ?? 0;
            const datosDeCobro = s.pago_titular || s.pago_cuenta || s.pago_alias || s.pago_telefono;
            return (
              <div key={s.id} className="card-flat p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded bg-gradient-to-br from-[color:var(--color-brand)] to-[color:var(--color-accent)] text-white font-bold flex items-center justify-center shrink-0">
                      {(s.store_name || s.name || "?").charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-[color:var(--color-brand)] truncate">{s.store_name || s.name || "Sin nombre"}</div>
                      <div className="text-xs text-[color:var(--color-muted)] truncate">{s.name} · {s.city || "sin ciudad"}</div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    {s.is_approved ? (
                      <>
                        <div className={"font-extrabold " + (saldo > 0 ? "text-[color:var(--color-accent)]" : "text-green-600")}>{formatGs(Math.abs(saldo))}</div>
                        <div className="text-[10px] text-[color:var(--color-muted)] uppercase">{saldo > 0 ? "te debe" : "al día"}</div>
                      </>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded bg-yellow-100 text-yellow-800 uppercase"><Clock size={10} /> Pendiente</span>
                    )}
                  </div>
                </div>

                <dl className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-[color:var(--color-line-soft)] text-center">
                  <Mini k="Comisiones" v={formatGs(c?.comisiones_cents ?? 0)} />
                  <Mini k="Depósito" v={formatGs(c?.mensualidades_cents ?? 0)} />
                  <Mini k="Pagó" v={formatGs(c?.pagado_cents ?? 0)} />
                </dl>

                {!datosDeCobro && (
                  <p className="text-xs text-[color:var(--color-accent)] mt-3">No cargó datos de cobro: sus clientes no saben cómo pagarle.</p>
                )}

                <div className="flex items-center gap-2 mt-4 flex-wrap">
                  {!s.is_approved && (
                    <button onClick={() => aprobar(s.id)} disabled={working} className="btn-primary text-sm disabled:opacity-50">
                      <ShieldCheck size={14} /> Aprobar
                    </button>
                  )}
                  {editing === s.id ? (
                    <>
                      <input
                        autoFocus
                        value={mensualidad}
                        onChange={(e) => setMensualidad(e.target.value)}
                        placeholder="Mensualidad en Gs."
                        className="border border-[color:var(--color-line)] rounded px-3 py-2 text-sm flex-1 min-w-[140px] focus:outline-none focus:border-[color:var(--color-brand)]"
                      />
                      <button onClick={() => guardarMensualidad(s.id)} disabled={working} className="btn-primary text-sm disabled:opacity-50"><Check size={14} /> Guardar</button>
                      <button onClick={() => setEditing(null)} className="btn-outline text-sm">Cancelar</button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => { setEditing(s.id); setMensualidad(String(s.mensualidad_cents || "")); }}
                        className="btn-outline text-sm"
                      >
                        <Warehouse size={14} /> Depósito: {formatGs(s.mensualidad_cents || 0)}/mes
                      </button>
                      <button onClick={() => cobrarPago(s.id, saldo)} disabled={working} className="btn-primary text-sm disabled:opacity-50">
                        <Wallet size={14} /> Registrar pago
                      </button>
                      <Link href="/admin/mensajes" className="text-xs text-[color:var(--color-brand)] font-semibold ml-auto">Mensajes →</Link>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Mini({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-wider text-[color:var(--color-muted)]">{k}</dt>
      <dd className="text-sm font-bold text-[color:var(--color-brand)]">{v}</dd>
    </div>
  );
}
