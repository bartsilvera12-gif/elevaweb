"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { categories } from "@/lib/mock-products";
import { useSeller } from "@/lib/seller-store";
import { ChevronLeft, Upload, Plus, X } from "lucide-react";

const slugify = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function NuevoProducto() {
  const router = useRouter();
  const create = useSeller((s) => s.create);
  const existing = useSeller((s) => s.products);

  const [name, setName] = useState("");
  const [category, setCategory] = useState(categories[0].slug);
  const [price, setPrice] = useState("");
  const [compare, setCompare] = useState("");
  const [stock, setStock] = useState("10");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [variantInput, setVariantInput] = useState("");
  const [variants, setVariants] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const priceNum = Number(price.replace(/\D/g, "")) || 0;
  const compareNum = Number(compare.replace(/\D/g, "")) || 0;
  const fmt = (n: number) => new Intl.NumberFormat("es-PY").format(n);

  const addVariant = () => {
    const v = variantInput.trim();
    if (!v || variants.includes(v)) return;
    setVariants([...variants, v]);
    setVariantInput("");
  };

  const onImage = (f: File | null) => {
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setImage(String(r.result));
    r.readAsDataURL(f);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !priceNum) return;
    setSaving(true);
    let slug = slugify(name);
    let n = 2;
    while (existing.some((p) => p.slug === slug)) slug = `${slugify(name)}-${n++}`;
    create({
      slug,
      name,
      category,
      price_cents: priceNum,
      compare_cents: compareNum > priceNum ? compareNum : undefined,
      stock: Number(stock) || 0,
      image: image || "/productos/perfume-floral.jpg",
      description,
      active: true,
      variants: variants.length ? variants : undefined,
    });
    router.push("/vendedor/productos");
  };

  return (
    <div>
      <Link href="/vendedor/productos" className="text-sm text-[color:var(--color-muted)] hover:text-[color:var(--color-accent)] flex items-center gap-1 mb-4">
        <ChevronLeft size={14} /> Volver a productos
      </Link>
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">Nuevo producto</h1>
          <p className="text-sm text-[color:var(--color-muted)] mt-1">Cargá los datos y aparecerá en el catálogo.</p>
        </div>
      </div>

      <form onSubmit={submit} className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="card-flat p-5">
            <h3 className="font-bold text-sm uppercase tracking-wider text-[color:var(--color-brand)] mb-3">Información básica</h3>
            <div className="grid gap-3">
              <Field label="Nombre" required value={name} onChange={setName} placeholder="Vestido midi floral" />
              <div className="grid md:grid-cols-2 gap-3">
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-[color:var(--color-ink-soft)]">Categoría</span>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="border border-[color:var(--color-line)] rounded px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-[color:var(--color-brand)]">
                    {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                  </select>
                </label>
                <Field label="Stock" type="number" value={stock} onChange={setStock} placeholder="10" />
              </div>
              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-[color:var(--color-ink-soft)]">Descripción</span>
                <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Contá qué es, materiales, medidas..." className="border border-[color:var(--color-line)] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[color:var(--color-brand)] resize-none" />
              </label>
            </div>
          </div>

          <div className="card-flat p-5">
            <h3 className="font-bold text-sm uppercase tracking-wider text-[color:var(--color-brand)] mb-3">Precio</h3>
            <div className="grid md:grid-cols-2 gap-3">
              <MoneyField label="Precio de venta" required value={price} onChange={setPrice} />
              <MoneyField label="Precio de comparación (opcional)" value={compare} onChange={setCompare} hint="Para mostrar tachado" />
            </div>
            {priceNum > 0 && (
              <div className="mt-3 text-sm text-[color:var(--color-ink-soft)] bg-[color:var(--color-line-soft)] rounded p-3">
                Comisión ELEVA (12%): <strong>Gs. {fmt(Math.round(priceNum * 0.12))}</strong>
                <span className="mx-2">·</span>
                Vos recibís: <strong className="text-[color:var(--color-brand)]">Gs. {fmt(Math.round(priceNum * 0.88))}</strong>
              </div>
            )}
          </div>

          <div className="card-flat p-5">
            <h3 className="font-bold text-sm uppercase tracking-wider text-[color:var(--color-brand)] mb-3">Variantes (opcional)</h3>
            <p className="text-xs text-[color:var(--color-muted)] mb-3">Talles, colores o presentaciones. Ejemplo: S, M, L, XL.</p>
            <div className="flex gap-2">
              <input value={variantInput} onChange={(e) => setVariantInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addVariant(); } }} placeholder="Talle / color…" className="flex-1 border border-[color:var(--color-line)] rounded px-3 py-2 text-sm focus:outline-none focus:border-[color:var(--color-brand)]" />
              <button type="button" onClick={addVariant} className="px-3 py-2 rounded bg-[color:var(--color-brand-100)] text-[color:var(--color-brand)] font-semibold text-sm hover:bg-[color:var(--color-brand-200)]"><Plus size={14} /></button>
            </div>
            {variants.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {variants.map((v) => (
                  <span key={v} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[color:var(--color-brand-100)] text-[color:var(--color-brand)] text-sm font-medium">
                    {v}
                    <button type="button" onClick={() => setVariants(variants.filter((x) => x !== v))} className="hover:text-[color:var(--color-accent)]"><X size={12} /></button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <aside className="flex flex-col gap-4">
          <div className="card-flat p-5">
            <h3 className="font-bold text-sm uppercase tracking-wider text-[color:var(--color-brand)] mb-3">Foto principal</h3>
            <label className="block border-2 border-dashed border-[color:var(--color-line)] rounded aspect-square overflow-hidden cursor-pointer hover:border-[color:var(--color-brand)] transition relative">
              {image ? (
                <img src={image} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-[color:var(--color-muted)]">
                  <Upload size={28} />
                  <div className="text-xs font-medium">Subir foto</div>
                  <div className="text-[10px]">JPG, PNG · máx 5MB</div>
                </div>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => onImage(e.target.files?.[0] || null)} />
            </label>
          </div>

          <div className="card-flat p-5">
            <h3 className="font-bold text-sm uppercase tracking-wider text-[color:var(--color-brand)] mb-3">Estado</h3>
            <div className="text-sm text-[color:var(--color-ink-soft)]">Se publica como <strong className="text-green-700">Activo</strong> apenas lo crees. Podés desactivarlo desde la lista.</div>
          </div>

          <div className="flex flex-col gap-2">
            <button disabled={saving || !name || !priceNum} className="btn-primary justify-center disabled:opacity-50 disabled:cursor-not-allowed">
              {saving ? "Guardando..." : "Publicar producto"}
            </button>
            <Link href="/vendedor/productos" className="btn-outline text-center">Cancelar</Link>
          </div>
        </aside>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, required, type = "text", placeholder }: { label: string; value: string; onChange: (v: string) => void; required?: boolean; type?: string; placeholder?: string }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-semibold text-[color:var(--color-ink-soft)]">{label}{required && <span className="text-[color:var(--color-accent)]">*</span>}</span>
      <input type={type} required={required} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="border border-[color:var(--color-line)] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[color:var(--color-brand)]" />
    </label>
  );
}

function MoneyField({ label, value, onChange, required, hint }: { label: string; value: string; onChange: (v: string) => void; required?: boolean; hint?: string }) {
  const fmt = (s: string) => {
    const n = Number(s.replace(/\D/g, "")) || 0;
    return n ? new Intl.NumberFormat("es-PY").format(n) : "";
  };
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
