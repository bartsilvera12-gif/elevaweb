"use client";
import { ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/lib/store";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  slug: string;
  name: string;
  price_cents: number;
  image: string;
  variant?: string;
  qty?: number;
  className?: string;
  size?: "sm" | "md";
  label?: string;
}

export default function AddToCartButton({ slug, name, price_cents, image, variant, qty = 1, className, size = "sm", label = "Agregar" }: Props) {
  const add = useCart((s) => s.add);
  const [ok, setOk] = useState(false);
  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    add({ slug, name, price_cents, image, variant }, qty);
    setOk(true);
    setTimeout(() => setOk(false), 1400);
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        size === "md" ? "btn-primary" : "btn-dark",
        "w-full justify-center text-sm",
        className
      )}
    >
      {ok ? <Check size={16} /> : <ShoppingCart size={16} />} {ok ? "Agregado" : label}
    </button>
  );
}
