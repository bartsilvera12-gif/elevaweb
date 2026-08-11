"use client";
import { motion } from "motion/react";
import Link from "next/link";
import { DollarSign, Users, ShoppingBag, AlertTriangle, TrendingUp, UserPlus } from "lucide-react";
import { formatGs } from "@/lib/utils";
import { platformKpis, platformSellers, complaints } from "@/lib/platform-data";

export default function AdminOverview() {
  const gmvDelta = ((platformKpis.gmvMes - platformKpis.gmvMesPrev) / platformKpis.gmvMesPrev) * 100;

  const cards = [
    { icon: DollarSign, label: "GMV del mes", value: formatGs(platformKpis.gmvMes), sub: `${gmvDelta >= 0 ? "+" : ""}${gmvDelta.toFixed(1)}% vs anterior`, accent: true },
    { icon: TrendingUp, label: "Comisión ELEVA", value: formatGs(platformKpis.comisionMes), sub: "12% sobre GMV" },
    { icon: ShoppingBag, label: "Pedidos", value: platformKpis.pedidosMes.toLocaleString("es-PY"), sub: `Ticket ${formatGs(platformKpis.ticketPromedio)}` },
    { icon: Users, label: "Vendedores activos", value: String(platformKpis.vendedoresActivos), sub: `${platformKpis.vendedoresRevision} en revisión` },
    { icon: UserPlus, label: "Usuarios nuevos", value: platformKpis.usuariosNuevos.toLocaleString("es-PY"), sub: "este mes" },
    { icon: AlertTriangle, label: "Reclamos abiertos", value: String(platformKpis.reclamosAbiertos), sub: `${platformKpis.reclamosMes} este mes`, warn: platformKpis.reclamosAbiertos > 0 },
  ];

  return (
    <div>
      <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">Overview</h1>
          <p className="text-sm text-[color:var(--color-muted)] mt-1">Salud del marketplace en tiempo real</p>
        </div>
        <select className="border border-[color:var(--color-line)] rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-[color:var(--color-brand)]">
          <option>Este mes</option>
          <option>Últimos 30 días</option>
          <option>Últimos 90 días</option>
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {cards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.05 }}
            className={`card-flat p-4 ${c.accent ? "border-l-4 border-[color:var(--color-accent)]" : ""} ${c.warn ? "border-l-4 border-red-400" : ""}`}
          >
            <div className={"flex items-center gap-2 text-xs font-bold uppercase tracking-wider " + (c.warn ? "text-red-600" : "text-[color:var(--color-muted)]")}>
              <c.icon size={13} /> {c.label}
            </div>
            <div className={"text-2xl font-black mt-2 " + (c.warn ? "text-red-600" : "text-[color:var(--color-brand)]")}>{c.value}</div>
            <div className="text-[11px] text-[color:var(--color-muted)] mt-0.5">{c.sub}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.25 }} className="card-flat p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm uppercase tracking-wider text-[color:var(--color-brand)]">Top vendedores por GMV</h3>
            <Link href="/admin/vendedores" className="text-xs text-[color:var(--color-brand)] hover:text-[color:var(--color-accent)] font-semibold">Ver todos →</Link>
          </div>
          <ul className="divide-y divide-[color:var(--color-line-soft)]">
            {[...platformSellers].sort((a, b) => b.gmvCents - a.gmvCents).slice(0, 5).map((s, i) => (
              <li key={s.id} className="flex items-center justify-between py-2.5 text-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-black text-[color:var(--color-muted)] w-5">{i + 1}</span>
                  <div className="min-w-0">
                    <div className="font-semibold text-[color:var(--color-brand)] truncate">{s.storeName}</div>
                    <div className="text-[11px] text-[color:var(--color-muted)]">{s.name} · {s.sales} ventas</div>
                  </div>
                </div>
                <div className="font-bold text-[color:var(--color-brand)]">{formatGs(s.gmvCents)}</div>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.32 }} className="card-flat p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm uppercase tracking-wider text-[color:var(--color-brand)]">Reclamos abiertos</h3>
            <Link href="/admin/reclamos" className="text-xs text-[color:var(--color-brand)] hover:text-[color:var(--color-accent)] font-semibold">Ver todos →</Link>
          </div>
          {complaints.filter((c) => c.status === "abierto").length === 0 ? (
            <p className="text-sm text-[color:var(--color-muted)]">Sin reclamos abiertos.</p>
          ) : (
            <ul className="divide-y divide-[color:var(--color-line-soft)]">
              {complaints.filter((c) => c.status === "abierto").map((c) => (
                <li key={c.id} className="py-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs text-[color:var(--color-brand)]">{c.orderId}</span>
                    <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-red-100 text-red-800">Abierto</span>
                  </div>
                  <div className="text-sm text-[color:var(--color-ink)] mt-1">{c.reason}</div>
                  <div className="text-[11px] text-[color:var(--color-muted)] mt-0.5">{c.buyer} · vs {c.seller} · {new Date(c.date).toLocaleDateString("es-PY")}</div>
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      </div>
    </div>
  );
}
