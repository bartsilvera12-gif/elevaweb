"use client";
import { useState } from "react";
import Image from "next/image";
import { useCategorias } from "@/lib/hooks/use-platform";
import { useProducts } from "@/lib/hooks/use-products";
import { categoryIcon } from "@/lib/category-icons";
import { Pencil, Plus, Trash2, Check, Loader2 } from "lucide-react";

const slugify = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function AdminCategorias() {
  const { categorias, loading, upsert, remove } = useCategorias();
  const { products } = useProducts({});
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ slug: "", name: "", image_url: "" });
  const [showForm, setShowForm] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [working, setWorking] = useState(false);

  const count = (slug: string) => products.filter((p) => p.category === slug).length;

  const guardar = async () => {
    if (!form.name) return;
    setWorking(true);
    setErr(await upsert({
      slug: form.slug || slugify(form.name),
      name: form.name,
      image_url: form.image_url || null,
    }));
    setWorking(false);
    setShowForm(false);
    setEditing(null);
    setForm({ slug: "", name: "", image_url: "" });
  };

  const borrar = async (slug: string) => {
    if (count(slug) > 0) {
      alert("No podés borrar una categoría que tiene productos. Movelos primero.");
      return;
    }
    if (!confirm(`¿Eliminar la categoría "${slug}"?`)) return;
    setErr(await remove(slug));
  };

  if (loading) return <div className="flex justify-center py-12 text-[color:var(--color-muted)]"><Loader2 size={20} className="animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">Categorías</h1>
          <p className="text-sm text-[color:var(--color-muted)] mt-1">{categorias.length} categorías en el catálogo</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ slug: "", name: "", image_url: "" }); }} className="btn-primary">
          <Plus size={16} /> Nueva categoría
        </button>
      </div>

      {err && <div className="mb-4 text-sm bg-red-50 text-red-700 border border-red-200 rounded p-3">{err}</div>}

      {(showForm || editing) && (
        <div className="card-flat p-5 mb-4 bg-[color:var(--color-brand-100)]/30">
          <h3 className="font-bold text-sm uppercase tracking-wider text-[color:var(--color-brand)] mb-3">
            {editing ? `Editar ${editing}` : "Nueva categoría"}
          </h3>
          <div className="grid md:grid-cols-3 gap-3">
            <Field label="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ferretería" />
            <Field label="Slug (URL)" value={form.slug} onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })} placeholder="ferreteria" disabled={!!editing} />
            <Field label="Imagen (ruta)" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="/categorias/moda.jpg" />
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={guardar} disabled={working} className="btn-primary disabled:opacity-50">
              {working ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Guardar
            </button>
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="btn-outline">Cancelar</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {categorias.map((c) => {
          const Icon = categoryIcon(c.slug);
          return (
            <div key={c.slug} className="card-flat overflow-hidden">
              <div className="relative aspect-[4/3] bg-[color:var(--color-line-soft)]">
                {c.image_url && <Image src={c.image_url} alt={c.name} fill sizes="(max-width:768px) 50vw, 33vw" className="object-cover" />}
                <span className="absolute top-2 left-2 w-8 h-8 rounded bg-white/95 text-[color:var(--color-brand)] flex items-center justify-center">
                  <Icon size={16} />
                </span>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-bold text-[color:var(--color-brand)] truncate">{c.name}</div>
                    <div className="text-[11px] text-[color:var(--color-muted)] mt-0.5">/{c.slug} · {count(c.slug)} productos</div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => { setEditing(c.slug); setShowForm(false); setForm({ slug: c.slug, name: c.name, image_url: c.image_url ?? "" }); }}
                      className="p-1.5 rounded hover:bg-[color:var(--color-line-soft)] text-[color:var(--color-muted)]"
                    >
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => borrar(c.slug)} className="p-1.5 rounded hover:bg-[color:var(--color-line-soft)] text-[color:var(--color-muted)] hover:text-red-600">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Field({ label, ...rest }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-semibold text-[color:var(--color-ink-soft)]">{label}</span>
      <input {...rest} className="border border-[color:var(--color-line)] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[color:var(--color-brand)] disabled:bg-[color:var(--color-line-soft)]" />
    </label>
  );
}
