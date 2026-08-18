"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { categories as staticCategories } from "@/lib/mock-products";
import type { DBCategoria } from "@/lib/types";

export interface CategoryWithCount {
  slug: string;
  name: string;
  image: string;
  count: number;
}

// Las categorías salen de eleva.categorias (editables desde /admin/categorias).
// Si la tabla todavía no existe o está vacía, se cae a la lista estática.
export function useCategoriesWithCounts() {
  const [categories, setCategories] = useState<CategoryWithCount[]>(staticCategories.map((c) => ({ ...c, count: 0 })));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();

    Promise.all([
      supabase.from("categorias").select("*").eq("active", true).order("orden"),
      supabase.from("category_counts").select("*"),
    ]).then(([cats, counts]) => {
      if (cancelled) return;
      const map = new Map<string, number>();
      ((counts.data as { category: string; count: number }[]) ?? []).forEach((r) => map.set(r.category, r.count));

      const rows = (cats.data as DBCategoria[]) ?? [];
      const base: CategoryWithCount[] = rows.length
        ? rows.map((c) => ({ slug: c.slug, name: c.name, image: c.image_url ?? "", count: map.get(c.slug) ?? 0 }))
        : staticCategories.map((c) => ({ ...c, count: map.get(c.slug) ?? 0 }));

      setCategories(base);
      setLoading(false);
    });

    return () => { cancelled = true; };
  }, []);

  return { categories, loading };
}
