"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSellers, useMensajes, useMensajesResumen } from "@/lib/hooks/use-platform";
import { Send, Loader2, MessageCircle, Search } from "lucide-react";

export default function AdminMensajes() {
  const { sellers, loading } = useSellers();
  const { rows } = useMensajesResumen();
  const [selected, setSelected] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const { mensajes, send } = useMensajes(selected);

  useEffect(() => {
    if (!selected && sellers.length) setSelected(sellers[0].id);
  }, [sellers, selected]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [mensajes.length]);

  // Último mensaje por emprendedor, para ordenar el inbox
  const ultimoPorSeller = useMemo(() => {
    const m = new Map<string, { body: string; created_at: string; from_admin: boolean }>();
    for (const r of rows) if (!m.has(r.seller_id)) m.set(r.seller_id, r);
    return m;
  }, [rows]);

  const filtrados = sellers.filter((s) =>
    !q || (s.store_name || s.name || "").toLowerCase().includes(q.toLowerCase())
  );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;
    setSending(true);
    await send(body, true);
    setBody("");
    setSending(false);
  };

  if (loading) return <div className="flex justify-center py-12 text-[color:var(--color-muted)]"><Loader2 size={20} className="animate-spin" /></div>;

  const seller = sellers.find((s) => s.id === selected);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold">Mensajes</h1>
        <p className="text-sm text-[color:var(--color-muted)] mt-1">Conversaciones con los emprendedores</p>
      </div>

      {!sellers.length ? (
        <div className="card-flat p-10 text-center">
          <MessageCircle size={48} className="mx-auto text-[color:var(--color-brand-200)]" />
          <p className="mt-4 text-[color:var(--color-ink-soft)]">Todavía no hay emprendedores registrados.</p>
        </div>
      ) : (
        <div className="card-flat overflow-hidden grid md:grid-cols-[300px_1fr] h-[560px]">
          <div className="border-r border-[color:var(--color-line-soft)] flex flex-col">
            <div className="p-3 border-b border-[color:var(--color-line-soft)]">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--color-muted)]" />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar emprendedor…" className="w-full pl-9 pr-3 py-2 text-sm border border-[color:var(--color-line)] rounded focus:outline-none focus:border-[color:var(--color-brand)]" />
              </div>
            </div>
            <div className="overflow-y-auto flex-1">
              {filtrados.map((s) => {
                const last = ultimoPorSeller.get(s.id);
                return (
                  <button
                    key={s.id}
                    onClick={() => setSelected(s.id)}
                    className={"w-full text-left p-3 border-b border-[color:var(--color-line-soft)] flex gap-3 hover:bg-[color:var(--color-line-soft)]/50 transition " + (selected === s.id ? "bg-[color:var(--color-brand-100)]/60" : "")}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[color:var(--color-brand)] to-[color:var(--color-accent)] text-white font-bold flex items-center justify-center shrink-0">
                      {(s.store_name || s.name || "?").charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm truncate">{s.store_name || s.name}</div>
                      <div className="text-xs text-[color:var(--color-muted)] truncate">
                        {last ? `${last.from_admin ? "Vos: " : ""}${last.body}` : "Sin mensajes"}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="px-5 py-3 border-b border-[color:var(--color-line-soft)]">
              <div className="font-bold text-[color:var(--color-brand)]">{seller?.store_name || seller?.name}</div>
              <div className="text-xs text-[color:var(--color-muted)]">{seller?.city || "—"} · {seller?.phone || "sin teléfono"}</div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3">
              {!mensajes.length && (
                <div className="m-auto text-center text-sm text-[color:var(--color-ink-soft)]">
                  Todavía no hay mensajes con este emprendedor.
                </div>
              )}
              {mensajes.map((m) => (
                <div key={m.id} className={"max-w-[80%] rounded p-3 " + (m.from_admin
                  ? "bg-[color:var(--color-brand-100)] self-end"
                  : "bg-[color:var(--color-line-soft)] self-start")}>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--color-muted)] mb-1">
                    {m.from_admin ? "ELEVA" : seller?.store_name || "Emprendedor"}
                  </div>
                  <div className="text-sm whitespace-pre-line">{m.body}</div>
                  <div className="text-[10px] text-[color:var(--color-muted)] mt-1">
                    {new Date(m.created_at).toLocaleString("es-PY", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>

            <form onSubmit={submit} className="border-t border-[color:var(--color-line-soft)] p-3 flex gap-2">
              <input
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Escribí tu mensaje…"
                className="flex-1 border border-[color:var(--color-line)] rounded px-3.5 py-2.5 text-sm focus:outline-none focus:border-[color:var(--color-brand)]"
              />
              <button disabled={sending || !body.trim()} className="btn-primary disabled:opacity-50">
                {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
