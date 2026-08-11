"use client";
import { useState } from "react";
import { Minus, Plus, ShoppingCart, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/store";
import FavoriteButton from "./FavoriteButton";
export interface ProductActionsInput {
  slug: string;
  name: string;
  price_cents: number;
  image: string;
  category?: string;
  variants?: { label: string; options: string[] };
}

export default function ProductActions({ p }: { p: ProductActionsInput }) {
  const router = useRouter();
  const add = useCart((s) => s.add);
  const opts = p.variants?.options ?? [];
  const [variant, setVariant] = useState<string | undefined>(opts[0]);
  const [qty, setQty] = useState(1);
  const [err, setErr] = useState<string | null>(null);

  const onAdd = (thenGoCheckout = false) => {
    if (p.variants && !variant) {
      setErr(`Elegí un ${p.variants.label.toLowerCase()}`);
      return;
    }
    setErr(null);
    add({ slug: p.slug, name: p.name, price_cents: p.price_cents, image: p.image, variant }, qty);
    if (thenGoCheckout) router.push("/checkout");
    else router.push("/carrito");
  };

  return (
    <div className="flex flex-col gap-4">
      {p.variants && (
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-[color:var(--color-ink-soft)] mb-2">
            {p.variants.label}: <span className="text-[color:var(--color-brand)]">{variant}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {p.variants.options.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => setVariant(o)}
                className={
                  "min-w-[48px] h-10 px-3 rounded border text-sm font-semibold transition " +
                  (o === variant
                    ? "border-[color:var(--color-brand)] bg-[color:var(--color-brand)] text-white"
                    : "border-[color:var(--color-line)] bg-white text-[color:var(--color-ink-soft)] hover:border-[color:var(--color-brand)]")
                }
              >
                {o}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-[color:var(--color-ink-soft)] mb-2">Cantidad</div>
        <div className="flex items-center border border-[color:var(--color-line)] rounded w-fit">
          <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 flex items-center justify-center text-[color:var(--color-brand)] hover:bg-[color:var(--color-line-soft)]"><Minus size={14} /></button>
          <span className="w-12 text-center font-semibold">{qty}</span>
          <button type="button" onClick={() => setQty(qty + 1)} className="w-10 h-10 flex items-center justify-center text-[color:var(--color-brand)] hover:bg-[color:var(--color-line-soft)]"><Plus size={14} /></button>
        </div>
      </div>

      {err && <div className="text-sm text-[color:var(--color-accent)] font-medium">{err}</div>}

      <div className="flex gap-2 mt-1">
        <button type="button" onClick={() => onAdd(false)} className="btn-primary flex-1 justify-center">
          <ShoppingCart size={18} /> Agregar al carrito
        </button>
        <button type="button" onClick={() => onAdd(true)} className="btn-dark flex-1 justify-center">
          <Zap size={18} /> Comprar ya
        </button>
        <FavoriteButton slug={p.slug} />
      </div>
    </div>
  );
}
