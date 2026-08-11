"use client";
import { motion } from "motion/react";
import { useSellerOrders } from "@/lib/hooks/use-orders";
import { formatGs } from "@/lib/utils";
import { Wallet, Calendar, ArrowDownToLine, Info, Check, Clock } from "lucide-react";

// Semanas ISO
function startOfWeek(d: Date) {
  const day = d.getDay() || 7;
  const monday = new Date(d);
  monday.setDate(d.getDate() - (day - 1));
  monday.setHours(0, 0, 0, 0);
  return monday;
}

export default function VendedorFinanzas() {
  const { orders } = useSellerOrders();

  const now = new Date();
  const thisWeekStart = startOfWeek(now);

  const thisWeek = orders.filter((o) => new Date(o.created_at) >= thisWeekStart);
  const revenueWeek = thisWeek.reduce((n, o) => n + o.total_cents, 0);
  const commission = Math.round(revenueWeek * 0.12);
  const neto = revenueWeek - commission;

  // Agrupar en semanas para el historial
  const byWeek = new Map<string, { start: Date; total: number }>();
  orders.forEach((o) => {
    const s = startOfWeek(new Date(o.created_at));
    const key = s.toISOString().slice(0, 10);
    if (!byWeek.has(key)) byWeek.set(key, { start: s, total: 0 });
    byWeek.get(key)!.total += o.total_cents;
  });
  const payouts = [...byWeek.values()]
    .sort((a, b) => b.start.getTime() - a.start.getTime())
    .map((w) => {
      const end = new Date(w.start);
      end.setDate(end.getDate() + 6);
      const nextMon = new Date(w.start);
      nextMon.setDate(w.start.getDate() + 7);
      const isCurrent = nextMon.getTime() > now.getTime();
      const net = w.total - Math.round(w.total * 0.12);
      return {
        id: w.start.toISOString(),
        period: `${w.start.toLocaleDateString("es-PY", { day: "2-digit", month: "short" })} — ${end.toLocaleDateString("es-PY", { day: "2-digit", month: "short", year: "numeric" })}`,
        date: nextMon,
        amount_cents: net,
        status: isCurrent ? "programado" : "pagado",
      };
    });

  const totalCobradoMes = payouts.filter((p) => p.status === "pagado" && p.date.getMonth() === now.getMonth() && p.date.getFullYear() === now.getFullYear()).reduce((n, p) => n + p.amount_cents, 0);
  const totalCobradoYear = payouts.filter((p) => p.status === "pagado" && p.date.getFullYear() === now.getFullYear()).reduce((n, p) => n + p.amount_cents, 0);
  const comisionYear = Math.round(totalCobradoYear * 0.12 / 0.88);

  return (
    <div>
      <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">Finanzas</h1>
          <p className="text-sm text-[color:var(--color-muted)] mt-1">Liquidaciones semanales todos los lunes</p>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="rounded overflow-hidden bg-gradient-to-br from-[#240453] via-[#3B1370] to-[#1A003F] text-white p-6 md:p-8">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[color:var(--color-accent)]">
          <Calendar size={12} /> Próxima liquidación
        </div>
        <div className="flex items-baseline gap-3 mt-3">
          <span className="text-4xl md:text-5xl font-black">{formatGs(neto)}</span>
          <span className="text-sm text-white/60">este lunes</span>
        </div>
        <div className="grid md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
          <div>
            <div className="text-xs text-white/60 uppercase tracking-wider">Ventas de la semana</div>
            <div className="text-xl font-bold mt-1">{formatGs(revenueWeek)}</div>
          </div>
          <div>
            <div className="text-xs text-white/60 uppercase tracking-wider">Comisión (12%)</div>
            <div className="text-xl font-bold mt-1 text-[color:var(--color-accent)]">-{formatGs(commission)}</div>
          </div>
          <div>
            <div className="text-xs text-white/60 uppercase tracking-wider">A recibir</div>
            <div className="text-xl font-black mt-1">{formatGs(neto)}</div>
          </div>
        </div>
        <div className="mt-6 flex items-center gap-2 text-xs text-white/70">
          <Info size={12} /> Transferencia a tu cuenta el próximo lunes.
        </div>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        <Kpi label="Cobrado este mes" value={formatGs(totalCobradoMes)} />
        <Kpi label="Cobrado en el año" value={formatGs(totalCobradoYear)} />
        <Kpi label="Comisión pagada (año)" value={formatGs(comisionYear)} />
        <Kpi label="Pedidos totales" value={String(orders.length)} />
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-extrabold mb-3">Historial de liquidaciones</h2>
        <div className="card-flat overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[color:var(--color-line-soft)] text-[color:var(--color-ink-soft)] uppercase text-[11px] tracking-wider">
                <th className="text-left px-4 py-3 font-bold">Período</th>
                <th className="text-left px-4 py-3 font-bold hidden md:table-cell">Fecha de pago</th>
                <th className="text-right px-4 py-3 font-bold">Monto</th>
                <th className="text-right px-4 py-3 font-bold">Estado</th>
                <th className="w-10 px-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[color:var(--color-line-soft)]">
              {payouts.length === 0 ? (
                <tr><td colSpan={5} className="p-10 text-center text-[color:var(--color-muted)]">Sin ventas registradas aún.</td></tr>
              ) : payouts.map((p) => (
                <tr key={p.id} className="hover:bg-[color:var(--color-line-soft)]/40">
                  <td className="px-4 py-3 font-medium">{p.period}</td>
                  <td className="px-4 py-3 hidden md:table-cell text-[color:var(--color-ink-soft)]">{p.date.toLocaleDateString("es-PY", { day: "2-digit", month: "long", year: "numeric" })}</td>
                  <td className="px-4 py-3 text-right font-bold text-[color:var(--color-brand)]">{formatGs(p.amount_cents)}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={"inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded " + (p.status === "pagado" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800")}>
                      {p.status === "pagado" ? <Check size={11} /> : <Clock size={11} />} {p.status}
                    </span>
                  </td>
                  <td className="px-2 py-3 text-right">
                    {p.status === "pagado" && <button className="p-1.5 rounded hover:bg-[color:var(--color-line-soft)] text-[color:var(--color-muted)]"><ArrowDownToLine size={16} /></button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card-flat p-5 mt-6 bg-[color:var(--color-brand-100)]/40 border-[color:var(--color-brand-100)]">
        <div className="text-xs font-bold uppercase tracking-wider text-[color:var(--color-brand)] mb-3 flex items-center gap-2"><Wallet size={14} /> ¿Cómo funciona?</div>
        <ul className="text-sm text-[color:var(--color-ink-soft)] space-y-2">
          <li>· Cada semana (lunes a domingo) sumamos tus ventas cerradas.</li>
          <li>· Descontamos la comisión del <strong>12%</strong>.</li>
          <li>· El lunes siguiente hacemos la transferencia a tu cuenta.</li>
          <li>· Recibís un email con el comprobante.</li>
        </ul>
      </div>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="card-flat p-4">
      <div className="text-[11px] font-bold uppercase tracking-wider text-[color:var(--color-muted)]">{label}</div>
      <div className="text-xl font-black text-[color:var(--color-brand)] mt-1.5">{value}</div>
    </div>
  );
}
