"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/lib/hooks/use-user";
import { useSellers, useCategorias, useSettings } from "@/lib/hooks/use-platform";
import { uploadProductImage } from "@/lib/storage";
import { UNITS, type DBProduct } from "@/lib/types";
import { ChevronLeft, Trash2, Loader2, Upload } from "lucide-react";

const slugify = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function Page() {
  return (
    <Suspense fallback={<div className="flex justify-center pt-16 text-[color:var(--color-muted)]"><Loader2 size={20} className="animate-spin" /></div>}>
      <Editor />
    </Suspense>
  );
}

function Editor() {
  const router = useRouter();
  const sp = useSearchParams();
  const slugParam = sp.get("slug") || "";
  const isNew = !slugParam;
  const { user } = useUser();
  const { sellers, loading: loadingSellers } = useSellers();
  const { categorias } = useCategorias();
  const { num } = useSettings();
  const comisionPct = num("comision_pct", 12);

  const [product, setProduct] = useState<DBProduct | null>(null);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const [form, setForm] = useState({
    slug: "", name: "", category: "moda",
    price_cents: 0, compare_cents: 0,
    stock: 0, stock_minimo: 5, unit: "unidad", ubicacion: "",
    description: "", image_url: "", active: true,
    seller_id: "" as string,
    is_featured: false, disc_pct: 0,
  });

  useEffect(() => {
    if (isNew) return;
    let cancelled = false;
    createClient().from("products").select("*").eq("slug", slugParam).single()
      .then(({ data }) => {
        if (cancelled) return;
        const p = data as DBProduct | null;
        setProduct(p);
        if (p) {
          setForm({
            slug: p.slug, name: p.name, category: p.category,
            price_cents: p.price_cents, compare_cents: p.compare_cents ?? 0,
            stock: p.stock, stock_minimo: p.stock_minimo ?? 0,
            unit: p.unit || "unidad", ubicacion: p.ubicacion ?? "",
            description: p.description ?? "", image_url: p.image_url ?? "",
            active: p.active, seller_id: p.seller_id ?? "",
            is_featured: p.is_featured, disc_pct: p.disc_pct ?? 0,
          });
        }
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, [slugParam, isNew]);

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));
  const fmt = (n: number) => n ? new Intl.NumberFormat("es-PY").format(n) : "";

  const onImage = async (f: File | null) => {
    if (!f || !user) return;
    setUploading(true);
    // Sube a la carpeta del ADMIN (auth.uid()); si querés que quede en carpeta del vendedor,
    // hay que ampliar la policy de storage.
    const { url, error } = await uploadProductImage(f, user.id);
    setUploading(false);
    if (error) { setMsg({ ok: false, text: "Error subiendo imagen: " + error }); return; }
    if (url) set("image_url", url);
  };

  const save = async () => {
    if (!form.name || !form.seller_id) {
      setMsg({ ok: false, text: "Completá al menos nombre y emprendedor" }); return;
    }
    setSaving(true); setMsg(null);
    const supabase = createClient();
    const slug = form.slug || slugify(form.name);
    const payload: Partial<DBProduct> & { slug: string; name: string; category: string; seller_id: string } = {
      slug,
      name: form.name,
      category: form.category,
      price_cents: form.price_cents,
      compare_cents: form.compare_cents || null,
      stock: form.stock,
      stock_minimo: form.stock_minimo,
      unit: form.unit,
      ubicacion: form.ubicacion || null,
      description: form.description || null,
      image_url: form.image_url || null,
      active: form.active,
      seller_id: form.seller_id,
      is_featured: form.is_featured,
      disc_pct: form.disc_pct || null,
    };
    let error;
    if (isNew) {
      ({ error } = await supabase.from("products").insert(payload));
    } else {
      ({ error } = await supabase.from("products").update(payload).eq("slug", slugParam));
    }
    setSaving(false);
    if (error) { setMsg({ ok: false, text: error.message }); return; }
    setMsg({ ok: true, text: "Guardado" });
    if (isNew) setTimeout(() => router.push(`/admin/productos/editar?slug=${slug}`), 400);
  };

  const del = async () => {
    if (!product) return;
    if (!confirm(`¿Eliminar "${product.name}"?`)) return;
    await createClient().from("products").delete().eq("slug", slugParam);
    router.push("/admin/productos");
  };

  if (loading || loadingSellers) return <div className="flex justify-center pt-16 text-[color:var(--color-muted)]"><Loader2 size={20} className="animate-spin" /></div>;
  if (!isNew && !product) return (
    <div><h1 className="text-2xl font-extrabold">Producto no encontrado</h1><Link href="/admin/productos" className="btn-outline mt-4 inline-flex">Volver</Link></div>
  );

  return (
    <div>
      <Link href="/admin/productos" className="text-sm text-[color:var(--color-muted)] hover:text-[color:var(--color-accent)] flex items-center gap-1 mb-4"><ChevronLeft size={14} /> Volver</Link>
      <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">{isNew ? "Nuevo producto" : product!.name}</h1>
          <p className="text-sm text-[color:var(--color-muted)] mt-1">{isNew ? "Cargalo a nombre de un emprendedor" : `/${product!.slug}`}</p>
        </div>
        <div className="flex gap-2">
          {!isNew && <button onClick={del} className="btn-outline text-red-600 border-red-200"><Trash2 size={14} /> Eliminar</button>}
          <button onClick={save} disabled={saving} className="btn-primary disabled:opacity-50">{saving ? <Loader2 size={14} className="animate-spin" /> : "Guardar"}</button>
        </div>
      </div>

      {msg && <div className={"card-flat p-3 mb-4 text-sm " + (msg.ok ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-700")}>{msg.text}</div>}

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="card-flat p-5">
            <h3 className="font-bold text-sm uppercase tracking-wider text-[color:var(--color-brand)] mb-3">Información</h3>
            <div className="grid gap-3">
              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-[color:var(--color-ink-soft)]">Emprendedor</span>
                <select value={form.seller_id} onChange={(e) => set("seller_id", e.target.value)} className="border border-[color:var(--color-line)] rounded px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-[color:var(--color-brand)]">
                  <option value="">— Elegí un emprendedor —</option>
                  {sellers.filter((s) => s.is_approved).map((s) => (
                    <option key={s.id} value={s.id}>{s.store_name || s.name}</option>
                  ))}
                </select>
              </label>
              <Field label="Nombre" value={form.name} onChange={(v) => set("name", v)} />
              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-[color:var(--color-ink-soft)]">Categoría</span>
                <select value={form.category} onChange={(e) => set("category", e.target.value)} className="border border-[color:var(--color-line)] rounded px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-[color:var(--color-brand)]">
                  {categorias.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                </select>
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-[color:var(--color-ink-soft)]">Descripción</span>
                <textarea rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} className="border border-[color:var(--color-line)] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[color:var(--color-brand)] resize-none" />
              </label>
            </div>
          </div>

          <div className="card-flat p-5">
            <h3 className="font-bold text-sm uppercase tracking-wider text-[color:var(--color-brand)] mb-3">Precio</h3>
            <div className="grid md:grid-cols-2 gap-3">
              <MoneyField label="Precio (Gs.)" value={form.price_cents} onChange={(n) => set("price_cents", n)} />
              <MoneyField label="Precio de comparación (opcional)" value={form.compare_cents} onChange={(n) => set("compare_cents", n)} />
            </div>
            {form.price_cents > 0 && (
              <p className="text-xs text-[color:var(--color-muted)] mt-3">
                Comisión ELEVA ({comisionPct}%): <strong>Gs. {fmt(Math.round(form.price_cents * comisionPct / 100))}</strong> · Cobra el emprendedor: <strong className="text-[color:var(--color-brand)]">Gs. {fmt(form.price_cents)}</strong>
              </p>
            )}
          </div>

          <div className="card-flat p-5">
            <h3 className="font-bold text-sm uppercase tracking-wider text-[color:var(--color-brand)] mb-3">Inventario</h3>
            <div className="grid md:grid-cols-4 gap-3">
              <NumField label="Stock" value={form.stock} onChange={(n) => set("stock", n)} />
              <NumField label="Stock mínimo" value={form.stock_minimo} onChange={(n) => set("stock_minimo", n)} />
              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-[color:var(--color-ink-soft)]">Unidad</span>
                <select value={form.unit} onChange={(e) => set("unit", e.target.value)} className="border border-[color:var(--color-line)] rounded px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-[color:var(--color-brand)]">
                  {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
              </label>
              <Field label="Ubicación depósito" value={form.ubicacion} onChange={(v) => set("ubicacion", v)} placeholder="Estante A-3" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="card-flat p-5">
            <h3 className="font-bold text-sm uppercase tracking-wider text-[color:var(--color-brand)] mb-3">Imagen</h3>
            <div className="relative aspect-square rounded overflow-hidden bg-[color:var(--color-line-soft)] mb-3">
              {form.image_url && (form.image_url.startsWith("data:")
                ? <img src={form.image_url} alt="" className="w-full h-full object-cover" />
                : <img src={form.image_url} alt="" className="w-full h-full object-cover" />)}
            </div>
            <label className="btn-outline w-full justify-center cursor-pointer">
              {uploading ? <><Loader2 size={14} className="animate-spin" /> Subiendo…</> : <><Upload size={14} /> Elegir imagen</>}
              <input type="file" accept="image/*" onChange={(e) => onImage(e.target.files?.[0] ?? null)} className="hidden" />
            </label>
          </div>

          <div className="card-flat p-5">
            <h3 className="font-bold text-sm uppercase tracking-wider text-[color:var(--color-brand)] mb-3">Visibilidad</h3>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.active} onChange={(e) => set("active", e.target.checked)} /> Activo (visible en el catálogo)
            </label>
            <label className="flex items-center gap-2 text-sm mt-2">
              <input type="checkbox" checked={form.is_featured} onChange={(e) => set("is_featured", e.target.checked)} /> Destacar en home
            </label>
            <div className="mt-3">
              <NumField label="Descuento (%)" value={form.disc_pct} onChange={(n) => set("disc_pct", Math.max(0, Math.min(90, n)))} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-semibold text-[color:var(--color-ink-soft)]">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="border border-[color:var(--color-line)] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[color:var(--color-brand)]" />
    </label>
  );
}
function NumField({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-semibold text-[color:var(--color-ink-soft)]">{label}</span>
      <input type="number" value={value} onChange={(e) => onChange(Number(e.target.value) || 0)} className="border border-[color:var(--color-line)] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[color:var(--color-brand)]" />
    </label>
  );
}
function MoneyField({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  const fmt = (n: number) => n ? new Intl.NumberFormat("es-PY").format(n) : "";
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-semibold text-[color:var(--color-ink-soft)]">{label}</span>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[color:var(--color-muted)]">Gs.</span>
        <input inputMode="numeric" value={fmt(value)} onChange={(e) => onChange(Number(e.target.value.replace(/\D/g, "")) || 0)} className="w-full pl-10 pr-3 py-2.5 text-sm border border-[color:var(--color-line)] rounded focus:outline-none focus:border-[color:var(--color-brand)]" />
      </div>
    </label>
  );
}
