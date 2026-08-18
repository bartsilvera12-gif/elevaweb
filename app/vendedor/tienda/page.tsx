"use client";
import { useEffect, useState } from "react";
import { useUser } from "@/lib/hooks/use-user";
import { createClient } from "@/lib/supabase/client";
import { Store, Wallet, Loader2, Check } from "lucide-react";

export default function VendedorTienda() {
  const { user, profile, loading } = useUser();
  const [form, setForm] = useState({
    store_name: "", city: "", phone: "", store_desc: "",
    pago_titular: "", pago_banco: "", pago_cuenta: "", pago_alias: "", pago_telefono: "", pago_notas: "",
    instagram: "", tiktok: "",
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    if (!profile) return;
    setForm({
      store_name: profile.store_name ?? "",
      city: profile.city ?? "",
      phone: profile.phone ?? "",
      store_desc: profile.store_desc ?? "",
      pago_titular: profile.pago_titular ?? "",
      pago_banco: profile.pago_banco ?? "",
      pago_cuenta: profile.pago_cuenta ?? "",
      pago_alias: profile.pago_alias ?? "",
      pago_telefono: profile.pago_telefono ?? "",
      pago_notas: profile.pago_notas ?? "",
      instagram: profile.instagram ?? "",
      tiktok: profile.tiktok ?? "",
    });
  }, [profile]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await createClient().from("profiles").update(form).eq("id", user.id);
    setSaving(false);
    setMsg(error ? { ok: false, text: error.message } : { ok: true, text: "Datos guardados" });
    setTimeout(() => setMsg(null), 3000);
  };

  if (loading) return <div className="flex justify-center py-12 text-[color:var(--color-muted)]"><Loader2 size={20} className="animate-spin" /></div>;

  const sinDatosDeCobro = !form.pago_titular && !form.pago_cuenta && !form.pago_alias && !form.pago_telefono;

  return (
    <div>
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">Mi tienda</h1>
          <p className="text-sm text-[color:var(--color-muted)] mt-1">Datos que ven los compradores</p>
        </div>
      </div>

      {sinDatosDeCobro && (
        <div className="card-flat p-4 mb-4 border-l-4 border-[color:var(--color-accent)] text-sm">
          <strong className="text-[color:var(--color-accent)]">Te faltan los datos de cobro.</strong>{" "}
          Sin ellos el cliente no sabe cómo pagarte, y ELEVA no despacha hasta que confirmes el cobro.
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card-flat p-6">
          <h2 className="flex items-center gap-2 font-bold text-[color:var(--color-brand)] mb-4"><Store size={18} /> Tu tienda</h2>
          <div className="grid gap-3">
            <Field label="Nombre de tu tienda" value={form.store_name} onChange={set("store_name")} />
            <Field label="Ciudad" value={form.city} onChange={set("city")} />
            <Field label="Teléfono / WhatsApp" value={form.phone} onChange={set("phone")} />
            <Field label="Instagram" value={form.instagram} onChange={set("instagram")} placeholder="@tutienda" />
            <Field label="TikTok" value={form.tiktok} onChange={set("tiktok")} placeholder="@tutienda" />
            <Textarea label="Descripción" value={form.store_desc} onChange={set("store_desc")} />
          </div>
        </div>

        <div className="card-flat p-6 border-t-4 border-[color:var(--color-accent)]">
          <h2 className="flex items-center gap-2 font-bold text-[color:var(--color-brand)] mb-1"><Wallet size={18} /> Cómo te pagan</h2>
          <p className="text-xs text-[color:var(--color-muted)] mb-4">
            El cliente te paga a vos directamente. Estos datos se le muestran al confirmar la compra.
          </p>
          <div className="grid gap-3">
            <Field label="Titular de la cuenta" value={form.pago_titular} onChange={set("pago_titular")} />
            <Field label="Banco / billetera" value={form.pago_banco} onChange={set("pago_banco")} placeholder="Ueno, Itaú, Tigo Money…" />
            <Field label="Número de cuenta" value={form.pago_cuenta} onChange={set("pago_cuenta")} />
            <Field label="Alias" value={form.pago_alias} onChange={set("pago_alias")} />
            <Field label="Teléfono para giros" value={form.pago_telefono} onChange={set("pago_telefono")} />
            <Textarea label="Instrucciones extra" value={form.pago_notas} onChange={set("pago_notas")} placeholder="Ej: mandame el comprobante por WhatsApp." />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-5">
        <button onClick={save} disabled={saving} className="btn-primary disabled:opacity-50">
          {saving ? <><Loader2 size={14} className="animate-spin" /> Guardando…</> : "Guardar cambios"}
        </button>
        {msg && (
          <span className={"text-sm flex items-center gap-1 " + (msg.ok ? "text-green-600" : "text-red-600")}>
            {msg.ok && <Check size={14} />} {msg.text}
          </span>
        )}
      </div>
    </div>
  );
}

function Field({ label, ...rest }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-[color:var(--color-ink-soft)]">{label}</span>
      <input {...rest} className="border border-[color:var(--color-line)] rounded px-3.5 py-2.5 text-sm focus:outline-none focus:border-[color:var(--color-brand)]" />
    </label>
  );
}

function Textarea({ label, ...rest }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-[color:var(--color-ink-soft)]">{label}</span>
      <textarea {...rest} rows={3} className="border border-[color:var(--color-line)] rounded px-3.5 py-2.5 text-sm focus:outline-none focus:border-[color:var(--color-brand)]" />
    </label>
  );
}
