"use client";
import { Store, Star } from "lucide-react";

export default function AdminTienda() {
  return (
    <div>
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">Mi tienda</h1>
          <p className="text-sm text-[color:var(--color-muted)] mt-1">Datos que ven los compradores</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 card-flat p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded bg-gradient-to-br from-[color:var(--color-brand)] to-[color:var(--color-accent)] text-white font-bold text-2xl flex items-center justify-center">E</div>
            <div>
              <div className="font-bold text-lg text-[color:var(--color-brand)]">Emprendedor ELEVA</div>
              <div className="text-xs text-[color:var(--color-muted)] flex items-center gap-1"><Store size={11} /> Miembro desde 2026</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <Field label="Nombre de tu tienda" defaultValue="Emprendedor ELEVA" />
            <Field label="Ciudad" defaultValue="Asunción" />
            <Field label="Teléfono" defaultValue="+595 981 000 000" />
            <Field label="WhatsApp" defaultValue="+595 981 000 000" />
            <Textarea label="Descripción" defaultValue="Productos seleccionados por nuestro equipo. Envío coordinado a todo el país." className="md:col-span-2" />
          </div>

          <button className="btn-primary mt-6">Guardar cambios</button>
        </div>

        <div className="card-flat p-5 h-fit">
          <h3 className="font-bold text-sm uppercase tracking-wider text-[color:var(--color-brand)] mb-3">Reputación</h3>
          <div className="flex items-baseline gap-1 mb-1">
            <Star size={18} className="text-[color:var(--color-accent)]" fill="currentColor" />
            <span className="text-3xl font-extrabold text-[color:var(--color-brand)]">4.8</span>
            <span className="text-sm text-[color:var(--color-muted)]">/ 5</span>
          </div>
          <div className="text-xs text-[color:var(--color-muted)]">180 opiniones</div>

          <div className="mt-5 pt-5 border-t border-[color:var(--color-line-soft)] space-y-1.5 text-sm">
            <Metric label="Ventas concretadas" v="234" />
            <Metric label="Tasa de respuesta" v="98%" />
            <Metric label="Tiempo de respuesta" v="< 2h" />
            <Metric label="Reclamos" v="0.4%" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, defaultValue, className = "" }: { label: string; defaultValue?: string; className?: string }) {
  return (
    <label className={"flex flex-col gap-1.5 " + className}>
      <span className="text-xs font-semibold text-[color:var(--color-ink-soft)]">{label}</span>
      <input defaultValue={defaultValue} className="border border-[color:var(--color-line)] rounded px-3.5 py-2.5 text-sm focus:outline-none focus:border-[color:var(--color-brand)]" />
    </label>
  );
}

function Textarea({ label, defaultValue, className = "" }: { label: string; defaultValue?: string; className?: string }) {
  return (
    <label className={"flex flex-col gap-1.5 " + className}>
      <span className="text-xs font-semibold text-[color:var(--color-ink-soft)]">{label}</span>
      <textarea defaultValue={defaultValue} rows={3} className="border border-[color:var(--color-line)] rounded px-3.5 py-2.5 text-sm focus:outline-none focus:border-[color:var(--color-brand)]" />
    </label>
  );
}

function Metric({ label, v }: { label: string; v: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-[color:var(--color-ink-soft)]">{label}</span>
      <span className="font-semibold">{v}</span>
    </div>
  );
}
