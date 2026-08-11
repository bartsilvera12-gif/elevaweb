"use client";
import { useState } from "react";
import { Settings, Percent, Truck, Bell, Check } from "lucide-react";

export default function AdminConfiguracion() {
  const [saved, setSaved] = useState(false);
  const [commission, setCommission] = useState(12);
  const [freeShipping, setFreeShipping] = useState(500000);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyWA, setNotifyWA] = useState(true);
  const [maintenance, setMaintenance] = useState(false);

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const fmt = (n: number) => new Intl.NumberFormat("es-PY").format(n);

  return (
    <div>
      <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">Configuración</h1>
          <p className="text-sm text-[color:var(--color-muted)] mt-1">Parámetros globales de la plataforma</p>
        </div>
        <button onClick={save} className="btn-primary">{saved ? <><Check size={14} /> Guardado</> : "Guardar cambios"}</button>
      </div>

      <div className="grid gap-4">
        <div className="card-flat p-5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[color:var(--color-brand)] mb-3">
            <Percent size={14} /> Comisión y precios
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-[color:var(--color-ink-soft)]">Comisión ELEVA (%)</span>
              <input type="number" value={commission} onChange={(e) => setCommission(Number(e.target.value))} className="border border-[color:var(--color-line)] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[color:var(--color-brand)]" />
              <span className="text-[10px] text-[color:var(--color-muted)]">Aplicada a cada venta cerrada</span>
            </label>
          </div>
        </div>

        <div className="card-flat p-5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[color:var(--color-brand)] mb-3">
            <Truck size={14} /> Envío
          </div>
          <div className="grid md:grid-cols-2 gap-3">
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
