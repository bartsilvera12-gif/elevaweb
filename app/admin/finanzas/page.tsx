"use client";
import { motion } from "motion/react";
import { demoPayouts } from "@/lib/seller-store";
import { useOrders, useHydrated } from "@/lib/store";
import { formatGs } from "@/lib/utils";
import { Wallet, Calendar, ArrowDownToLine, Info, Check, Clock } from "lucide-react";

export default function AdminFinanzas() {
  const hydrated = useHydrated();
  const orders = useOrders((s) => s.orders);
  const totalPeriod = orders.reduce((n, o) => n + o.total_cents, 0);
  const commission = Math.round(totalPeriod * 0.12);
  const neto = totalPeriod - commission;

  if (!hydrated) return <div className="min-h-[400px]" />;

  const nextPayout = demoPayouts[0];

  return (
    <div>
      <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">Finanzas</h1>
          <p className="text-sm text-[color:var(--color-muted)] mt-1">Liquidaciones semanales todos los lunes</p>
        </div>
      </div>

      {/* Próxima liquidación (grande) */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded overflow-hidden bg-gradient-to-br from-[#240453] via-[#3B1370] to-[#1A003F] text-white p-6 md:p-8"
      >
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[color:var(--color-accent)]">
          <Calendar size={12} /> Próxima liquidación
        </div>
        <div className="flex items-baseline gap-3 mt-3">
          <span className="text-4xl md:text-5xl font-black">{formatGs(nextPayout.amount_cents)}</span>
          <span className="text-sm text-white/60">este lunes</span>
        </div>
        <div className="grid md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
          <div>
            <div className="text-xs text-white/60 uppercase tracking-wider">Ventas del período</div>
            <div className="text-xl font-bold mt-1">{formatGs(totalPeriod || 4285450)}</div>
          </div>
          <div>
            <div className="text-xs text-white/60 uppercase tracking-wider">Comisión ELEVA (12%)</div>
            <div className="text-xl font-bold mt-1 text-[color:var(--color-accent)]">-{formatGs(commission || 514254)}</div>
          </div>
          <div>
            <div className="text-xs text-white/60 uppercase tracking-wider">A recibir</div>
            <div className="text-xl font-black mt-1">{formatGs(neto || nextPayout.amount_cents)}</div>
          </div>
        </div>
        <div className="mt-6 flex items-center gap-2 text-xs text-white/70">
          <Info size={12} /> Transferencia a tu cuenta el lunes 12 ago 2026.
        </div>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        {[
          { l: "Liquidado este mes", v: formatGs(11036900), sub: "3 pagos" },
          { l: "Cobrado en 2026", v: formatGs(43512000), sub: "acumulado" },
          { l: "Comisión pagada", v: formatGs(5936200), sub: "acumulado" },
          { l: "Tasa de reclamos", v: "0.4%", sub: "muy baja" },
        ].map((k) => (
          <div key={k.l} className="card-flat p-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[color:var(--color-muted)]">{k.l}</div>
            <div className="text-xl font-black text-[color:var(--color-brand)] mt-1.5">{k.v}</div>
            <div className="text-[11px] text-[color:var(--color-muted)] mt-0.5">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Historial */}
      <div className="mt-6">
        <h2 className="text-lg font-extrabold mb-3">Historial de pagos</h2>
        <div className="card-flat overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[color:var(--color-line-soft)] text-[color:var(--color-ink-soft)] uppercase text-[11px] tracking-wider">
                <th className="text-left px-4 py-3 font-bold">Período</th>
                <th className="text-left px-4 py-3 font-bold hidden md:table-cell">Fecha de pago</th>
                <th className="text-left px-4 py-3 font-bold hidden md:table-cell">Referencia</th>
                <th className="text-right px-4 py-3 font-bold">Monto</th>
                <th className="text-right px-4 py-3 font-bold">Estado</th>
                <th className="w-10 px-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[color:var(--color-line-soft)]">
              {demoPayouts.map((p) => (
                <tr key={p.id} className="hover:bg-[color:var(--color-line-soft)]/40">
                  <td className="px-4 py-3 font-medium">{p.period}</td>
                  <td className="px-4 py-3 hidden md:table-cell text-[color:var(--color-ink-soft)]">
                    {new Date(p.date).toLocaleDateString("es-PY", { day: "2-digit", month: "long", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-[color:var(--color-muted)] font-mono text-xs">{p.ref ?? "—"}</td>
                  <td className="px-4 py-3 text-right font-bold text-[color:var(--color-brand)]">{formatGs(p.amount_cents)}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={"inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded " + (p.status === "pagado" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800")}>
                      {p.status === "pagado" ? <Check size={11} /> : <Clock size={11} />} {p.status}
                    </span>
                  </td>
                  <td className="px-2 py-3 text-right">
                    {p.status === "pagado" && (
                      <button className="p-1.5 rounded hover:bg-[color:var(--color-line-soft)] text-[color:var(--color-muted)]" title="Descargar comprobante"><ArrowDownToLine size={16} /></button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info bancaria */}
      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <div className="card-flat p-5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[color:var(--color-brand)] mb-3">
            <Wallet size={14} /> Cuenta bancaria para cobrar
          </div>
          <div className="text-sm space-y-1.5">
            <div className="flex justify-between"><span className="text-[color:var(--color-muted)]">Banco</span><span className="font-semibold">Banco Itaú</span></div>
            <div className="flex justify-between"><span className="text-[color:var(--color-muted)]">Titular</span><span className="font-semibold">Karen Ayala</span></div>
            <div className="flex justify-between"><span className="text-[color:var(--color-muted)]">Cuenta</span><span className="font-mono">•••• 4821</span></div>
            <div className="flex justify-between"><span className="text-[color:var(--color-muted)]">CI / RUC</span><span className="font-mono">4.821.900-0</span></div>
          </div>
          <button className="btn-outline text-sm mt-4">Cambiar cuenta</button>
        </div>

        <div className="card-flat p-5 bg-[color:var(--color-brand-100)]/40 border-[color:var(--color-brand-100)]">
          <div className="text-xs font-bold uppercase tracking-wider text-[color:var(--color-brand)] mb-3">¿Cómo funciona?</div>
          <ul className="text-sm text-[color:var(--color-ink-soft)] space-y-2">
            <li>· Cada semana (lunes a domingo) sumamos tus ventas cerradas.</li>
            <li>· Descontamos la comisión del <strong>12%</strong>.</li>
            <li>· El lunes siguiente hacemos la transferencia a tu cuenta.</li>
            <li>· Recibís un email con el comprobante.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
