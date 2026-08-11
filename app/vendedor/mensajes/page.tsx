"use client";
import { useState } from "react";
import { demoMessages, type SellerMessage } from "@/lib/seller-store";
import { Search, Send, MessageCircle } from "lucide-react";

export default function AdminMensajes() {
  const [messages, setMessages] = useState(demoMessages);
  const [selectedId, setSelectedId] = useState<string | null>(demoMessages[0]?.id ?? null);
  const [q, setQ] = useState("");
  const [reply, setReply] = useState("");

  const selected = messages.find((m) => m.id === selectedId);
  const filtered = messages.filter((m) => !q || m.from.toLowerCase().includes(q.toLowerCase()) || m.subject.toLowerCase().includes(q.toLowerCase()));
  const unreadCount = messages.filter((m) => m.unread).length;

  const openMessage = (id: string) => {
    setSelectedId(id);
    setMessages((ms) => ms.map((m) => (m.id === id ? { ...m, unread: false } : m)));
    setReply("");
  };

  const sendReply = () => {
    if (!reply.trim()) return;
    alert("Respuesta enviada (demo): " + reply);
    setReply("");
  };

  return (
    <div>
      <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">Mensajes</h1>
          <p className="text-sm text-[color:var(--color-muted)] mt-1">
            {unreadCount > 0 ? <><strong className="text-[color:var(--color-accent)]">{unreadCount} sin leer</strong> · </> : null}
            {messages.length} conversaciones
          </p>
        </div>
      </div>

      <div className="card-flat overflow-hidden grid md:grid-cols-[340px_1fr] min-h-[560px]">
        {/* Inbox */}
        <div className="border-r border-[color:var(--color-line-soft)] flex flex-col">
          <div className="p-3 border-b border-[color:var(--color-line-soft)]">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--color-muted)]" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar…" className="w-full pl-9 pr-3 py-2 text-sm border border-[color:var(--color-line)] rounded focus:outline-none focus:border-[color:var(--color-brand)]" />
            </div>
          </div>
          <div className="overflow-y-auto flex-1">
            {filtered.length === 0 && (
              <div className="p-6 text-center text-sm text-[color:var(--color-muted)]">Sin mensajes.</div>
            )}
            {filtered.map((m) => (
              <button
                key={m.id}
                onClick={() => openMessage(m.id)}
                className={`w-full text-left p-3 border-b border-[color:var(--color-line-soft)] flex gap-3 hover:bg-[color:var(--color-line-soft)]/50 transition ${selectedId === m.id ? "bg-[color:var(--color-brand-100)]/60" : ""}`}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[color:var(--color-brand)] to-[color:var(--color-accent)] text-white font-bold flex items-center justify-center shrink-0">
                  {m.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-sm truncate ${m.unread ? "font-bold text-[color:var(--color-brand-900)]" : "font-medium text-[color:var(--color-ink)]"}`}>{m.from}</span>
                    <span className="text-[10px] text-[color:var(--color-muted)] shrink-0">{timeAgo(m.date)}</span>
                  </div>
                  <div className={`text-xs mt-0.5 truncate ${m.unread ? "text-[color:var(--color-brand-900)] font-semibold" : "text-[color:var(--color-ink-soft)]"}`}>{m.subject}</div>
                  {m.product && <div className="text-[10px] text-[color:var(--color-muted)] truncate mt-0.5">Sobre: {m.product}</div>}
                </div>
                {m.unread && <span className="w-2 h-2 rounded-full bg-[color:var(--color-accent)] mt-1.5 shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        {/* Detalle */}
        <div className="flex flex-col">
          {selected ? (
            <>
              <div className="p-5 border-b border-[color:var(--color-line-soft)]">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[color:var(--color-brand)] to-[color:var(--color-accent)] text-white font-bold flex items-center justify-center">{selected.avatar}</div>
                  <div>
                    <div className="font-bold text-[color:var(--color-brand-900)]">{selected.from}</div>
                    <div className="text-xs text-[color:var(--color-muted)]">{new Date(selected.date).toLocaleString("es-PY")}</div>
                  </div>
                </div>
                {selected.product && (
                  <div className="mt-3 text-xs text-[color:var(--color-muted)]">Sobre <span className="font-semibold text-[color:var(--color-brand)]">{selected.product}</span></div>
                )}
              </div>

              <div className="p-5 flex-1 overflow-y-auto">
                <div className="text-xs font-bold uppercase tracking-wider text-[color:var(--color-muted)] mb-2">{selected.subject}</div>
                <p className="text-[color:var(--color-ink)] leading-relaxed">{selected.text}</p>
              </div>

              <div className="p-4 border-t border-[color:var(--color-line-soft)] bg-[color:var(--color-line-soft)]/40">
                <div className="flex gap-2 items-end">
                  <textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    rows={2}
                    placeholder={`Responder a ${selected.from}…`}
                    className="flex-1 border border-[color:var(--color-line)] rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-[color:var(--color-brand)] resize-none"
                  />
                  <button onClick={sendReply} disabled={!reply.trim()} className="btn-primary shrink-0 disabled:opacity-50">
                    <Send size={14} /> Enviar
                  </button>
                </div>
                <div className="mt-2 flex gap-1.5 flex-wrap">
                  <QuickReply text="¡Gracias por escribir! Sí, tenemos stock." onClick={setReply} />
                  <QuickReply text="Sí, hacemos envío a todo el país en 3–5 días." onClick={setReply} />
                  <QuickReply text="Aceptamos hasta 6 cuotas sin interés con tarjeta." onClick={setReply} />
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-[color:var(--color-muted)] p-10">
              <MessageCircle size={40} />
              <p className="mt-3 text-sm">Elegí un mensaje del inbox</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function QuickReply({ text, onClick }: { text: string; onClick: (t: string) => void }) {
  return (
    <button onClick={() => onClick(text)} className="text-[11px] px-2 py-1 rounded border border-[color:var(--color-line)] text-[color:var(--color-ink-soft)] hover:border-[color:var(--color-brand)] hover:text-[color:var(--color-brand)] bg-white">
      {text}
    </button>
  );
}

function timeAgo(iso: string) {
  const d = new Date(iso).getTime();
  const now = Date.now();
  const diff = (now - d) / 1000;
  if (diff < 60) return "ahora";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
  return new Date(iso).toLocaleDateString("es-PY", { day: "2-digit", month: "short" });
}
