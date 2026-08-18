"use client";
import { useEffect, useRef, useState } from "react";
import { useUser } from "@/lib/hooks/use-user";
import { useMensajes } from "@/lib/hooks/use-platform";
import { Send, Loader2, MessageCircle } from "lucide-react";

export default function VendedorMensajes() {
  const { user, loading: loadingUser } = useUser();
  const { mensajes, loading, send } = useMensajes(user?.id ?? null);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [mensajes.length]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;
    setSending(true);
    await send(body, false);
    setBody("");
    setSending(false);
  };

  if (loadingUser || loading) {
    return <div className="flex justify-center py-12 text-[color:var(--color-muted)]"><Loader2 size={20} className="animate-spin" /></div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold">Mensajes con ELEVA</h1>
        <p className="text-sm text-[color:var(--color-muted)] mt-1">
          Canal directo con el equipo de ELEVA: pedidos, depósito, cobros y cualquier consulta.
        </p>
      </div>

      <div className="card-flat flex flex-col h-[560px]">
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3">
          {!mensajes.length && (
            <div className="m-auto text-center text-sm text-[color:var(--color-ink-soft)]">
              <MessageCircle size={40} className="mx-auto text-[color:var(--color-brand-200)] mb-3" />
              Todavía no hay mensajes. Escribile a ELEVA cuando necesites algo.
            </div>
          )}
          {mensajes.map((m) => (
            <div key={m.id} className={"max-w-[80%] rounded p-3 " + (m.from_admin
              ? "bg-[color:var(--color-line-soft)] self-start"
              : "bg-[color:var(--color-brand-100)] self-end")}>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--color-muted)] mb-1">
                {m.from_admin ? "ELEVA" : "Vos"}
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
  );
}
