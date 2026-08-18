"use client";
import { useEffect, useState } from "react";
import { useSettings } from "@/lib/hooks/use-platform";
import { Settings, Percent, Truck, Bell, Check, Loader2, Warehouse } from "lucide-react";

export default function AdminConfiguracion() {
  const { loading, save: saveSettings, num, bool } = useSettings();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [commission, setCommission] = useState(12);
  const [shipping, setShipping] = useState(25000);
  const [freeShipping, setFreeShipping] = useState(500000);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyWA, setNotifyWA] = useState(true);
  const [maintenance, setMaintenance] = useState(false);

  useEffect(() => {
    if (loading) return;
    setCommission(num("comision_pct", 12));
    setShipping(num("envio_cents", 25000));
    setFreeShipping(num("envio_gratis_desde_cents", 500000));
    setNotifyEmail(bool("notificar_email", true));
    setNotifyWA(bool("notificar_whatsapp", true));
    setMaintenance(bool("mantenimiento", false));
  }, [loading, num, bool]);

  const save = async () => {
    setSaving(true);
    const error = await saveSettings({
      comision_pct: commission,
      envio_cents: shipping,
      envio_gratis_desde_cents: freeShipping,
      notificar_email: notifyEmail,
      notificar_whatsapp: notifyWA,
      mantenimiento: maintenance,
    });
    setSaving(false);
    setErr(error);
    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  };

  const fmt = (n: number) => new Intl.NumberFormat("es-PY").format(n);

  if (loading) return <div className="flex justify-center py-12 text-[color:var(--color-muted)]"><Loader2 size={20} className="animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">Configuración</h1>
          <p className="text-sm text-[color:var(--color-muted)] mt-1">Parámetros globales de la plataforma</p>
        </div>
        <button onClick={save} disabled={saving} className="btn-primary disabled:opacity-50">
          {saving ? <><Loader2 size={14} className="animate-spin" /> Guardando…</> : saved ? <><Check size={14} /> Guardado</> : "Guardar cambios"}
        </button>
      </div>

      {err && <div className="mb-4 text-sm bg-red-50 text-red-700 border border-red-200 rounded p-3">{err}</div>}

      <div className="grid gap-4">
        <div className="card-flat p-5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[color:var(--color-brand)] mb-3">
            <Percent size={14} /> Comisión y precios
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-[color:var(--color-ink-soft)]">Comisión ELEVA (%)</span>
              <input type="number" value={commission} onChange={(e) => setCommission(Number(e.target.value))} className="border border-[color:var(--color-line)] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[color:var(--color-brand)]" />
              <span className="text-[10px] text-[color:var(--color-muted)]">Se le carga al emprendedor cuando confirma que cobró la venta</span>
            </label>
          </div>
          <p className="text-xs text-[color:var(--color-muted)] mt-3 flex items-start gap-1.5">
            <Warehouse size={13} className="mt-0.5 shrink-0" />
            La mensualidad de depósito se pacta con cada emprendedor y se carga en su ficha, en Emprendedores.
          </p>
        </div>

        <div className="card-flat p-5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[color:var(--color-brand)] mb-3">
            <Truck size={14} /> Envío
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-[color:var(--color-ink-soft)]">Costo de envío (Gs.)</span>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[color:var(--color-muted)]">Gs.</span>
                <input inputMode="numeric" value={fmt(shipping)} onChange={(e) => setShipping(Number(e.target.value.replace(/\D/g, "")) || 0)} className="w-full pl-10 pr-3 py-2.5 text-sm border border-[color:var(--color-line)] rounded focus:outline-none focus:border-[color:var(--color-brand)]" />
              </div>
              <span className="text-[10px] text-[color:var(--color-muted)]">Se cobra por pedido, o sea por emprendedor</span>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-[color:var(--color-ink-soft)]">Umbral envío gratis (Gs.)</span>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[color:var(--color-muted)]">Gs.</span>
                <input inputMode="numeric" value={fmt(freeShipping)} onChange={(e) => setFreeShipping(Number(e.target.value.replace(/\D/g, "")) || 0)} className="w-full pl-10 pr-3 py-2.5 text-sm border border-[color:var(--color-line)] rounded focus:outline-none focus:border-[color:var(--color-brand)]" />
              </div>
              <span className="text-[10px] text-[color:var(--color-muted)]">Compras iguales o superiores tienen envío sin costo</span>
            </label>
          </div>
        </div>

        <div className="card-flat p-5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[color:var(--color-brand)] mb-3">
            <Bell size={14} /> Notificaciones a compradores
          </div>
          <div className="flex flex-col gap-2">
            <Toggle label="Enviar por email al confirmar pedido" checked={notifyEmail} onChange={setNotifyEmail} />
            <Toggle label="Notificar por WhatsApp cuando se despacha" checked={notifyWA} onChange={setNotifyWA} />
          </div>
        </div>

        <div className="card-flat p-5 border-l-4 border-yellow-400">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-yellow-700 mb-3">
            <Settings size={14} /> Zona de peligro
          </div>
          <Toggle label="Activar modo mantenimiento (bloquea checkout)" checked={maintenance} onChange={setMaintenance} />
          {maintenance && (
            <div className="mt-3 text-xs text-yellow-800 bg-yellow-50 border border-yellow-200 rounded p-3">
              ⚠ Los compradores verán un aviso en toda la web y no podrán completar compras.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!checked)} className="w-full flex items-center justify-between text-left py-2 hover:bg-[color:var(--color-line-soft)] rounded px-2">
      <span className="text-sm text-[color:var(--color-ink)]">{label}</span>
      <span className={`w-10 h-6 rounded-full relative transition-colors ${checked ? "bg-[color:var(--color-brand)]" : "bg-[color:var(--color-line)]"}`}>
        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all shadow ${checked ? "left-[18px]" : "left-0.5"}`} />
      </span>
    </button>
  );
}
