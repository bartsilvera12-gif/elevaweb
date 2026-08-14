"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { categories } from "@/lib/mock-products";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/lib/hooks/use-user";
import { UNITS, type DBProduct } from "@/lib/types";
import { ChevronLeft, Trash2, Loader2 } from "lucide-react";

export default function EditarProductoPage() {
  return (
    <Suspense fallback={<div className="flex justify-center pt-16 text-[color:var(--color-muted)]"><Loader2 size={20} className="animate-spin" /></div>}>
      <EditarProducto />
    </Suspense>
  );
}

function EditarProducto() {
  const sp = useSearchParams();
  const slug = sp.get("slug") || "";
  const router = useRouter();
  const { user } = useUser();
  const [product, setProduct] = useState<DBProduct | null>(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [category, setCategory] = useState(categories[0].slug);
  const [price, setPrice] = useState("");
  const [compare, setCompare] = useState("");
  const [stock, setStock] = useState("0");
  const [stockMinimo, setStockMinimo] = useState("5");
  const [unit, setUnit] = useState<string>("unidad");
  const [ubicacion, setUbicacion] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [active, setActive] = useState(true);
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    createClient().from("products").select("*").eq("slug", slug).eq("seller_id", user.id).single().then(({ data }) => {
      const p = data as DBProduct | null;
      setProduct(p);
      if (p) {
        setName(p.name);
        setCategory(p.category);
        setPrice(String(p.price_cents));
        setCompare(String(p.compare_cents ?? ""));
        setStock(String(p.stock));
        setStockMinimo(String(p.stock_minimo ?? 0));
        setUnit(p.unit || "unidad");
        setUbicacion(p.ubicacion ?? "");
        setDescription(p.description ?? "");
        setImage(p.image_url ?? "");
        setActive(p.active);
      }
      setLoading(false);
    });
  }, [slug, user]);

  if (loading) return <div className="flex justify-center pt-16 text-[color:var(--color-muted)]"><Loader2 size={20} className="animate-spin" /></div>;
  if (!product) return (
    <div>
      <h1 className="text-2xl font-extrabold">Producto no encontrado</h1>
      <p className="text-sm text-[color:var(--color-muted)] mt-2">Solo podés editar productos que vos creaste.</p>
      <Link href="/vendedor/productos" className="btn-outline mt-4 inline-flex">Volver</Link>
    </div>
  );

  const fmt = (s: string) => { const n = Number(s.replace(/\D/g, "")) || 0; return n ? new Intl.NumberFormat("es-PY").format(n) : ""; };

  const onImage = (f: File | null) => {
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setImage(String(r.result));
    r.readAsDataURL(f);
  };

  const save = async () => {
    setSaving(true);
    const { error } = await createClient().from("products").update({
      name, category,
      price_cents: Number(price.replace(/\D/g, "")) || 0,
      compare_cents: Number(compare.replace(/\D/g, "")) || null,
      stock: Number(stock) || 0,
      stock_minimo: Number(stockMinimo) || 0,
      unit,
      ubicacion: ubicacion || null,
      description,
      image_url: image || null,
      active,
    }).eq("slug", slug);
    setSaving(false);
    if (error) setMsg("Error: " + error.message);
    else { setMsg("Cambios guardados"); setTimeout(() => setMsg(""), 2000); }
  };

  const del = async () => {
    if (!confirm(`¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`)) return;
    await createClient().from("products").delete().eq("slug", slug);
    router.push("/vendedor/productos");
  };

  return (
    <div>
      <Link href="/vendedor/productos" className="text-sm text-[color:var(--color-muted)] hover:text-[color:var(--color-accent)] flex items-center gap-1 mb-4"><ChevronLeft size={14} /> Volver</Link>
      <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">{product.name}</h1>
          <p className="text-sm text-[color:var(--color-muted)] mt-1">/{product.slug}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={del} className="btn-outline text-red-600 border-red-200"><Trash2 size={14} /> Eliminar</button>
          <button onClick={save} disabled={saving} className="btn-primary disabled:opacity-50">{saving ? <Loader2 size={14} className="animate-spin" /> : "Guardar"}</button>
        </div>
      </div>

      {msg && <div className={"card-flat p-3 mb-4 text-sm " + (msg.startsWith("Error") ? "bg-red-50 border-red-200 text-red-700" : "bg-green-50 border-green-200 text-green-800")}>{msg}</div>}

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="card-flat p-5">
            <h3 className="font-bold text-sm uppercase tracking-wider text-[color:var(--color-brand)] mb-3">Información</h3>
            <div className="grid gap-3">
              <Field label="Nombre" value={name} onChange={setName} />
              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-[color:var(--color-ink-soft)]">Categoría</span>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="border border-[color:var(--color-line)] rounded px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-[color:var(--color-brand)]">
                  {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                </select>
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-[color:var(--color-ink-soft)]">Descripción</span>
                <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="border border-[color:var(--color-line)] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[color:var(--color-brand)] resize-none" />
              </label>
            </div>
          </div>

          <div className="card-flat p-5">
            <h3 className="font-bold text-sm uppercase tracking-wider text-[color:var(--color-brand)] mb-3">Inventario</h3>
            <div className="grid md:grid-cols-4 gap-3">
              <Field label="Stock" type="number" value={stock} onChange={setStock} />
              <Field label="Stock mínimo" type="number" value={stockMinimo} onChange={setStockMinimo} />
              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-[color:var(--color-ink-soft)]">Unidad</span>
                <select value={unit} onChange={(e) => setUnit(e.target.value)} className="border border-[color:var(--color-line)] rounded px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-[color:var(--color-brand)]">
                  {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
              </label>
              <Field label="Ubicación" value={ubicacion} onChange={setUbicacion} placeholder="Estante A-3" />
            </div>
          </div>

          <div className="card-flat p-5">
            <h3 className="font-bold text-sm uppercase tracking-wider text-[color:var(--color-brand)] mb-3">Precio</h3>
            <div className="grid md:grid-cols-2 gap-3">
              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-[color:var(--color-ink-soft)]">Precio de venta</span>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[color:var(--color-muted)]">Gs.</span>
                  <input inputMode="numeric" value={fmt(price)} onChange={(e) => setPrice(e.target.value)} className="w-full pl-10 pr-3 py-2.5 text-sm border border-[color:var(--color-line)] rounded focus:outline-none focus:border-[color:var(--color-brand)]" />
                </div>
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-[color:var(--color-ink-soft)]">Precio comparación</span>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[color:var(--color-muted)]">Gs.</span>
                  <input inputMode="numeric" value={fmt(compare)} onChange={(e) => setCompare(e.target.value)} className="w-full pl-10 pr-3 py-2.5 text-sm border border-[color:var(--color-line)] rounded focus:outline-none focus:border-[color:var(--color-brand)]" />
                </div>
              </label>
            </div>
          </div>
        </div>

        <aside className="flex flex-col gap-4">
          <div className="card-flat p-5">
            <h3 className="font-bold text-sm uppercase tracking-wider text-[color:var(--color-brand)] mb-3">Foto</h3>
            <label className="block border-2 border-dashed border-[color:var(--color-line)] rounded aspect-square overflow-hidden cursor-pointer hover:border-[color:var(--color-brand)] transition">
              {image && (image.startsWith("data:") ? <img src={image} alt="preview" className="w-full h-full object-cover" /> : <img src={image} alt="preview" className="w-full h-full object-cover" />)}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => onImage(e.target.files?.[0] || null)} />
            </label>
          </div>

          <div className="card-flat p-5">
            <h3 className="font-bold text-sm uppercase tracking-wider text-[color:var(--color-brand)] mb-3">Estado</h3>
            <button onClick={() => setActive(!active)} className={`w-full flex items-center justify-between px-3 py-2.5 rounded border ${active ? "border-green-300 bg-green-50 text-green-800" : "border-[color:var(--color-line)] bg-white text-[color:var(--color-ink-soft)]"}`}>
              <span className="font-semibold text-sm">{active ? "Activo" : "Pausado"}</span>
              <span className={`w-9 h-5 rounded-full relative transition-colors ${active ? "bg-green-600" : "bg-[color:var(--color-line)]"}`}>
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${active ? "left-[18px]" : "left-0.5"}`} />
              </span>
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-semibold text-[color:var(--color-ink-soft)]">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="border border-[color:var(--color-line)] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[color:var(--color-brand)]" />
    </label>
  );
}
