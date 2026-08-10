"use client";
import { Heart } from "lucide-react";
import { useFavorites, useHydrated } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function FavoriteButton({ slug, className, floating = false }: { slug: string; className?: string; floating?: boolean }) {
  const hydrated = useHydrated();
  const isFav = useFavorites((s) => s.slugs.includes(slug));
  const toggle = useFavorites((s) => s.toggle);
  return (
    <button
      type="button"
      aria-label={isFav ? "Quitar de favoritos" : "Agregar a favoritos"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
      }}
      className={cn(
        floating
          ? "absolute top-2.5 right-2.5 w-9 h-9 z-10 bg-white/95 shadow rounded flex items-center justify-center hover:bg-white"
          : "w-11 h-11 rounded border border-[color:var(--color-line)] bg-white flex items-center justify-center hover:border-[color:var(--color-accent)]",
        className
      )}
    >
      <Heart
        size={18}
        className={cn(hydrated && isFav ? "text-[color:var(--color-accent)]" : "text-[color:var(--color-brand)]")}
        fill={hydrated && isFav ? "currentColor" : "none"}
      />
    </button>
  );
}
