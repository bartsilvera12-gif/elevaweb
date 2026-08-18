"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCategorias, useSettings } from "@/lib/hooks/use-platform";
import { useUser } from "@/lib/hooks/use-user";
import { createClient } from "@/lib/supabase/client";
import { UNITS } from "@/lib/types";
import { uploadProductImage } from "@/lib/storage";
import { ChevronLeft, Upload, Loader2 } from "lucide-react";

const slugify = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function NuevoProducto() {
  const router = useRouter();
  const { user } = useUser();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("moda");
  const [price, setPrice] = useState("");
  const [compare, setCompare] = useState("");
  const [stock, setStock] = useState("10");
  const [stockMinimo, setStockMinimo] = useState("5");
  const [unit, setUnit] = useState<string>("unidad");
  const [ubicacion, setUbicacion] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const { categorias } = useCategorias();
  const { num } = useSettings();
  const comisionPct = num("comision_pct", 12);
  const priceNum = Number(price.replace(/\D/g, "")) || 0;
  const compareNum = Number(compare.replace(/\D/g, "")) || 0;
  const fmt = (s: string) => { const n = Number(s.replace(/\D/g, "")) || 0; return n ? new Intl.NumberFormat("es-PY").format(n) : ""; };

  const onImage = async (f: File | null) => {
    if (!f || !user) return;
    setUploading(true);
    const { url, error } = await uploadProductImage(f, user.id);
    setUploading(false);
    if (error) { setErr("Error subiendo imagen: " + error); return; }
    if (url) setImage(url);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !priceNum || !user) return;
    setSaving(true);
    setErr(null);
    const supabase = createClient();

    let slug = slugify(name);
    const { data: existing } = await supabase.from("products").select("slug").ilike("slug", `${slug}%`);
    if (existing && existing.some((r: { slug: string }) => r.slug === slug)) {
      slug = `${slug}-${Date.now().toString(36).slice(-4)}`;
    }

    const { error } = await supabase.from("products").insert({
      seller_id: user.id,
      slug,
      name,
      category,
      price_cents: priceNum,
      compare_cents: compareNum > priceNum ? compareNum : null,
      stock: Number(stock) || 0,
      stock_minimo: Number(stockMinimo) || 0,
      unit,
      ubicacion: ubicacion || null,
      description,
      image_url: image || null,
      active: true,
    });

    setSaving(false);
    if (error) { setErr(error.message); return; }
    router.push("/vendedor/productos");
  };

  return (
    <div>
      <Link href="/vendedor/productos" className="text-sm text-[color:var(--color-muted)] hover:text-[color:var(--color-accent)] flex items-center gap-1 mb-4"><ChevronLeft size={14} /> Volver</Link>
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">Nuevo producto</h1>
          <p className="text-sm text-[color:var(--color-muted)] mt-1">Cargá los datos y aparecerá en el catálogo.</p>
        </div>
      </div>

      <form onSubmit={submit} className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="card-flat p-5">
            <h3 className="font-bold text-sm uppercase tracking-wider text-[color:var(--color-brand)] mb-3">Información</h3>
            <div className="grid gap-3">
              <Field label="Nombre" required value={name} onChange={setName} placeholder="Vestido midi floral" />
              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-[color:var(--color-ink-soft)]">Categoría</span>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="border border-[color:var(--color-line)] rounded px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-[color:var(--color-brand)]">
                  {categorias.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                </select>
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-[color:var(--color-ink-soft)]">Descripción</span>
                <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Contá qué es, materiales, medidas..." className="border border-[color:var(--color-line)] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[color:var(--color-brand)] resize-none" />
              </label>
            </div>
          </div>

          <div className="card-flat p-5">
            <h3 className="font-bold text-sm uppercase tracking-wider text-[color:var(--color-brand)] mb-3">Inventario</h3>
            <div className="grid md:grid-cols-4 gap-3">
              <Field label="Stock actual" type="number" value={stock} onChange={setStock} />
              <Field label="Stock mínimo" type="number" value={stockMinimo} onChange={setStockMinimo} hint="Alerta cuando baja de acá" />
              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-[color:var(--color-ink-soft)]">Unidad</span>
                <select value={unit} onChange={(e) => setUnit(e.target.value)} className="border border-[color:var(--color-line)] rounded px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-[color:var(--color-brand)]">
                  {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
              </label>
              <Field label="Ubicación" value={ubicacion} onChange={setUbicacion} placeholder="Estante A-3" hint="Pasillo/estante" />
            </div>
          </div>

          <div className="card-flat p-5">
            <h3 className="font-bold text-sm uppercase tracking-wider text-[color:var(--color-brand)] mb-3">Precio</h3>
            <div className="grid md:grid-cols-2 gap-3">
              <MoneyField label="Precio de venta" required value={price} onChange={setPrice} />
              <MoneyField label="Precio de comparación" value={compare} onChange={setCompare} hint="Para mostrar tachado" />
            </div>
            {priceNum > 0 && (
              <div className="mt-3 text-sm text-[color:var(--color-ink-soft)] bg-[color:var(--color-line-soft)] rounded p-3">
                Comisión ELEVA ({comisionPct}%): <strong>Gs. {fmt(String(Math.round((priceNum * comisionPct) / 100)))}</strong>
                <span className="mx-2">·</span>
                Cobrás vos: <strong className="text-[color:var(--color-brand)]">Gs. {fmt(String(priceNum))}</strong> (le pagás la comisión a ELEVA después)
              </div>
            )}
          </div>
        </div>

        <aside className="flex flex-col gap-4">
          <div className="card-flat p-5">
            <h3 className="font-bold text-sm uppercase tracking-wider text-[color:var(--color-brand)] mb-3">Foto</h3>
            <label className="block border-2 border-dashed border-[color:var(--color-line)] rounded aspect-square overflow-hidden cursor-pointer hover:border-[color:var(--color-brand)] transition">
              {image ? <img src={image} alt="preview" className="w-full h-full object-cover" /> : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-[color:var(--color-muted)]">
                  <Upload size={28} />
                  <div className="text-xs font-medium">Subir foto</div>
                </div>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => onImage(e.target.files?.[0] || null)} />
            </label>
          </div>

          {err && <div className="card-flat p-3 bg-red-50 border-red-200 text-red-700 text-sm">{err}</div>}

          <div className="flex flex-col gap-2">
            <button disabled={saving || !name || !priceNum} className="btn-primary justify-center disabled:opacity-50">
              {saving ? <><Loader2 size={16} className="animate-spin" /> Publicando…</> : "Publicar producto"}
            </button>
            <Link href="/vendedor/productos" className="btn-outline text-center">Cancelar</Link>
          </div>
        </aside>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, required, type = "text", placeholder, hint }: { label: string; value: string; onChange: (v: string) => void; required?: boolean; type?: string; placeholder?: string; hint?: string }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-semibold text-[color:var(--color-ink-soft)]">{label}{required && <span className="text-[color:var(--color-accent)]">*</span>}</span>
      <input type={type} required={required} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="border border-[color:var(--color-line)] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[color:var(--color-brand)]" />
      {hint && <span className="text-[10px] text-[color:var(--color-muted)]">{hint}</span>}
    </label>
  );
}

function MoneyField({ label, value, onChange, required, hint }: { label: string; value: string; onChange: (v: string) => void; required?: boolean; hint?: string }) {
  const fmt = (s: string) => { const n = Number(s.replace(/\D/g, "")) || 0; return n ? new Intl.NumberFormat("es-PY").format(n) : ""; };
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-semibold text-[color:var(--color-ink-soft)]">{label}{required && <span className="text-[color:var(--color-accent)]">*</span>}</span>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[color:var(--color-muted)]">Gs.</span>
        <input required={required} inputMode="numeric" value={fmt(value)} onChange={(e) => onChange(e.target.value)} placeholder="0" className="w-full pl-10 pr-3 py-2.5 text-sm border border-[color:var(--color-line)] rounded focus:outline-none focus:border-[color:var(--color-brand)]" />
      </div>
      {hint && <span className="text-[10px] text-[color:var(--color-muted)]">{hint}</span>}
    </label>
  );
}
