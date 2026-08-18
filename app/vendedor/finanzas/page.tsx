"use client";
import { useMemo } from "react";
import { useSellerOrders } from "@/lib/hooks/use-orders";
import { useMyCharges } from "@/lib/hooks/use-platform";
import { formatGs } from "@/lib/utils";
import { Wallet, TrendingUp, Warehouse, Loader2, AlertTriangle } from "lucide-react";

const kindLabel: Record<string, string> = {
  comision: "Comisión por venta",
  mensualidad: "Mensualidad de depósito",
  pago: "Pago que hiciste",
  ajuste: "Ajuste",
};

export default function VendedorFinanzas() {
  const { orders, loading: loadingOrders } = useSellerOrders();
  const { charges, loading: loadingCharges } = useMyCharges();

  const cobradas = useMemo(() => orders.filter((o) => o.payment_status === "cobrado"), [orders]);
  const ventasCobradas = cobradas.reduce((n, o) => n + o.total_cents, 0);
  const pendienteCobro = orders.filter((o) => o.payment_status !== "cobrado").reduce((n, o) => n + o.total_cents, 0);

  const comisiones = charges.filter((c) => c.kind === "comision").reduce((n, c) => n + c.amount_cents, 0);
  const mensualidades = charges.filter((c) => c.kind === "mensualidad").reduce((n, c) => n + c.amount_cents, 0);
  const pagado = -charges.filter((c) => c.kind === "pago").reduce((n, c) => n + c.amount_cents, 0);
  const saldo = charges.reduce((n, c) => n + c.amount_cents, 0);

  if (loadingOrders || loadingCharges) {
    return <div className="flex justify-center py-12 text-[color:var(--color-muted)]"><Loader2 size={20} className="animate-spin" /></div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold">Finanzas</h1>
        <p className="text-sm text-[color:var(--color-muted)] mt-1">
          Vos cobrás cada venta directamente. Acá ves lo que le debés a ELEVA por comisiones y depósito.
        </p>
      </div>

      <div className={"card-flat p-6 mb-4 border-l-4 " + (saldo > 0 ? "border-[color:var(--color-accent)]" : "border-green-500")}>
        <div className="text-xs font-bold uppercase tracking-wider text-[color:var(--color-muted)]">Saldo con ELEVA</div>
        <div className={"text-4xl font-extrabold mt-1 " + (saldo > 0 ? "text-[color:var(--color-accent)]" : "text-green-600")}>
          {formatGs(Math.abs(saldo))}
        </div>
        <div className="text-sm text-[color:var(--color-ink-soft)] mt-1">
          {saldo > 0 ? "Es lo que tenés que pagarle a ELEVA" : saldo < 0 ? "Tenés saldo a favor" : "Estás al día"}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card icon={Wallet} label="Ventas cobradas" value={formatGs(ventasCobradas)} sub={`${cobradas.length} pedidos`} />
        <Card icon={AlertTriangle} label="Falta cobrar" value={formatGs(pendienteCobro)} sub="pedidos sin confirmar" warn={pendienteCobro > 0} />
        <Card icon={TrendingUp} label="Comisiones" value={formatGs(comisiones)} sub="sobre tus ventas" />
        <Card icon={Warehouse} label="Depósito" value={formatGs(mensualidades)} sub="mensualidades" />
      </div>

      <div className="card-flat mt-4 overflow-hidden">
        <div className="px-5 py-4 border-b border-[color:var(--color-line-soft)] flex items-center justify-between">
          <h2 className="font-bold text-sm uppercase tracking-wider text-[color:var(--color-brand)]">Movimientos</h2>
          <span className="text-xs text-[color:var(--color-muted)]">Pagado hasta ahora: {formatGs(pagado)}</span>
        </div>
        {!charges.length ? (
          <div className="p-10 text-center text-sm text-[color:var(--color-ink-soft)]">
            Todavía no tenés movimientos. La comisión se carga cuando confirmás el cobro de un pedido.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[color:var(--color-line-soft)] text-[color:var(--color-ink-soft)] uppercase text-[11px] tracking-wider">
                <th className="text-left px-4 py-3 font-bold">Concepto</th>
                <th className="text-left px-4 py-3 font-bold hidden md:table-cell">Detalle</th>
                <th className="text-left px-4 py-3 font-bold hidden md:table-cell">Fecha</th>
                <th className="text-right px-4 py-3 font-bold">Monto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[color:var(--color-line-soft)]">
              {charges.map((c) => (
                <tr key={c.id}>
                  <td className="px-4 py-3 font-semibold">{kindLabel[c.kind] ?? c.kind}</td>
                  <td className="px-4 py-3 hidden md:table-cell text-[color:var(--color-ink-soft)]">{c.note || c.order_id || c.period || "—"}</td>
                  <td className="px-4 py-3 hidden md:table-cell text-[color:var(--color-muted)]">
                    {new Date(c.created_at).toLocaleDateString("es-PY", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td className={"px-4 py-3 text-right font-bold " + (c.amount_cents < 0 ? "text-green-600" : "text-[color:var(--color-brand)]")}>
                    {c.amount_cents < 0 ? "-" : ""}{formatGs(Math.abs(c.amount_cents))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function Card({ icon: Icon, label, value, sub, warn }: { icon: React.ElementType; label: string; value: string; sub: string; warn?: boolean }) {
  return (
    <div className={"card-flat p-4 " + (warn ? "border-l-4 border-[color:var(--color-accent)]" : "")}>
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[color:var(--color-muted)]">
        <Icon size={14} /> {label}
      </div>
      <div className="text-xl font-extrabold text-[color:var(--color-brand)] mt-1">{value}</div>
      <div className="text-[11px] text-[color:var(--color-muted)]">{sub}</div>
    </div>
  );
}
