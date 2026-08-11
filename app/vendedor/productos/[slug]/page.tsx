"use client";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { categories } from "@/lib/mock-products";
import { useSeller } from "@/lib/seller-store";
import { useHydrated } from "@/lib/store";
import { ChevronLeft, Trash2, Plus, X } from "lucide-react";

export default function EditarProducto({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const hydrated = useHydrated();
  const product = useSeller((s) => s.products.find((p) => p.slug === slug));
  const update = useSeller((s) => s.update);
  const remove = useSeller((s) => s.remove);

  const [name, setName] = useState("");
  const [category, setCategory] = useState(categories[0].slug);
  const [price, setPrice] = useState("");
  const [compare, setCompare] = useState("");
  const [stock, setStock] = useState("0");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [active, setActive] = useState(true);
  const [variantInput, setVariantInput] = useState("");
  const [variants, setVariants] = useState<string[]>([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (product) {
      setName(product.name);
      setCategory(product.category);
      setPrice(String(product.price_cents));
      setCompare(String(product.compare_cents ?? ""));
      setStock(String(product.stock));
      setDescription(product.description);
      setImage(product.image);
      setActive(product.active);
      setVariants(product.variants ?? []);
    }
  }, [product]);

  if (!hydrated) return <div className="min-h-[400px]" />;
  if (!product) {
    return (
      <div>
        <h1 className="text-2xl font-extrabold">Producto no encontrado</h1>
        <p className="text-sm text-[color:var(--color-muted)] mt-2">Solo se pueden editar los productos que vos creaste.</p>
        <Link href="/vendedor/productos" className="btn-outline mt-4 inline-flex">Volver</Link>
      </div>
    );
  }

  const fmt = (s: string) => {
    const n = Number(s.replace(/\D/g, "")) || 0;
    return n ? new Intl.NumberFormat("es-PY").format(n) : "";
  };

  const onImage = (f: File | null) => {
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setImage(String(r.result));
    r.readAsDataURL(f);
  };

  const save = () => {
    update(slug, {
      name,
      category,
      price_cents: Number(price.replace(/\D/g, "")) || 0,
      compare_cents: Number(compare.replace(/\D/g, "")) || undefined,
      stock: Number(stock) || 0,
      description,
      image,
      active,
      variants: variants.length ? variants : undefined,
    });
    setMsg("Cambios guardados");
    setTimeout(() => setMsg(""), 2500);
  };

  const del = () => {
    if (!confirm(`¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`)) return;
    remove(slug);
    router.push("/vendedor/productos");
  };

  return (
    <div>
      <Link href="/vendedor/productos" className="text-sm text-[color:var(--color-muted)] hover:text-[color:var(--color-accent)] flex items-center gap-1 mb-4">
        <ChevronLeft size={14} /> Volver a productos
      </Link>
      <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">{product.name}</h1>
          <p className="text-sm text-[color:var(--color-muted)] mt-1">/{product.slug}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={del} className="btn-outline text-red-600 border-red-200 hover:border-red-400"><Trash2 size={14} /> Eliminar</button>
          <button onClick={save} className="btn-primary">Guardar cambios</button>
        </div>
      </div>

      {msg && <div className="card-flat p-3 mb-4 bg-green-50 border-green-200 text-green-800 text-sm">{msg}</div>}

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="card-flat p-5">
            <h3 className="font-bold text-sm uppercase tracking-wider text-[color:var(--color-brand)] mb-3">Información</h3>
            <div className="grid gap-3">
              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-[color:var(--color-ink-soft)]">Nombre</span>
                <input value={name} onChange={(e) => setName(e.target.value)} className="border border-[color:var(--color-line)] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[color:var(--color-brand)]" />
              </label>
              <div className="grid md:grid-cols-2 gap-3">
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-[color:var(--color-ink-soft)]">Categoría</span>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="border border-[color:var(--color-line)] rounded px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-[color:var(--color-brand)]">
                    {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                  </select>
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-[color:var(--color-ink-soft)]">Stock</span>
                  <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} className="border border-[color:var(--color-line)] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[color:var(--color-brand)]" />
                </label>
              </div>
              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-[color:var(--color-ink-soft)]">Descripción</span>
                <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="border border-[color:var(--color-line)] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[color:var(--color-brand)] resize-none" />
              </label>
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

          <div className="card-flat p-5">
            <h3 className="font-bold text-sm uppercase tracking-wider text-[color:var(--color-brand)] mb-3">Variantes</h3>
            <div className="flex gap-2">
              <input value={variantInput} onChange={(e) => setVariantInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (variantInput.trim() && !variants.includes(variantInput.trim())) { setVariants([...variants, variantInput.trim()]); setVariantInput(""); } } }} placeholder="Talle / color…" className="flex-1 border border-[color:var(--color-line)] rounded px-3 py-2 text-sm focus:outline-none focus:border-[color:var(--color-brand)]" />
              <button type="button" onClick={() => { if (variantInput.trim() && !variants.includes(variantInput.trim())) { setVariants([...variants, variantInput.trim()]); setVariantInput(""); } }} className="px-3 py-2 rounded bg-[color:var(--color-brand-100)] text-[color:var(--color-brand)] font-semibold text-sm"><Plus size={14} /></button>
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
            <h3 className="font-bold text-sm uppercase tracking-wider text-[color:var(--color-brand)] mb-3">Foto</h3>
            <label className="block border-2 border-dashed border-[color:var(--color-line)] rounded aspect-square overflow-hidden cursor-pointer hover:border-[color:var(--color-brand)] transition">
              {image && (
                image.startsWith("data:") || image.startsWith("/")
                  ? <img src={image} alt="preview" className="w-full h-full object-cover" />
                  : <img src={image} alt="preview" className="w-full h-full object-cover" />
              )}
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
