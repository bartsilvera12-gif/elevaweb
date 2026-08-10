import { formatGs } from "@/lib/utils";
import { featured, nuevos } from "@/lib/mock-products";
import { ShoppingCart, Heart, Shield, Truck } from "lucide-react";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const all = [...featured, ...nuevos];
  const p = all.find((x) => x.slug === slug) ?? all[0];
  return (
    <div className="container-eleva pt-8 grid md:grid-cols-2 gap-10">
      <div className="aspect-square bg-gradient-to-br from-[#F1EAFB] via-[#E3D0F5] to-[#FFD9C2] rounded flex items-center justify-center text-[color:var(--color-brand)]/60">
        {p.name}
      </div>
      <div className="flex flex-col gap-4">
        <div className="text-xs text-[color:var(--color-muted)]">★ {p.rating?.toFixed(1) ?? "-"} · {p.sold ?? 0} vendidos</div>
        <h1 className="text-3xl font-extrabold">{p.name}</h1>
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-extrabold text-[color:var(--color-brand)]">{formatGs(p.price_cents)}</span>
          {p.compare_cents && p.compare_cents > p.price_cents && (
            <span className="text-sm text-[color:var(--color-muted)] line-through">{formatGs(p.compare_cents)}</span>
          )}
        </div>
        <p className="text-[color:var(--color-ink-soft)]">Descripción del producto no disponible aún — vendrá desde el backend cuando esté conectado.</p>
        <div className="flex gap-2 mt-2">
          <button className="btn-primary"><ShoppingCart size={18} /> Agregar al carrito</button>
          <button className="btn-outline"><Heart size={18} /></button>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-6 text-sm">
          <div className="flex items-center gap-2 text-[color:var(--color-ink-soft)]"><Truck size={16} className="text-[color:var(--color-accent)]" /> Entrega coordinada</div>
          <div className="flex items-center gap-2 text-[color:var(--color-ink-soft)]"><Shield size={16} className="text-[color:var(--color-accent)]" /> Pago protegido</div>
        </div>
      </div>
    </div>
  );
}
