"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { categories as staticCategories } from "@/lib/mock-products";

export interface CategoryWithCount {
  slug: string;
  name: string;
  image: string;
  count: number;
}

export function useCategoriesWithCounts() {
  const [categories, setCategories] = useState<CategoryWithCount[]>(staticCategories.map((c) => ({ ...c, count: 0 })));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    createClient()
      .from("category_counts")
      .select("*")
      .then(({ data }) => {
        if (cancelled) return;
        const map = new Map<string, number>();
        (data ?? []).forEach((r: { category: string; count: number }) => map.set(r.category, r.count));
        setCategories(staticCategories.map((c) => ({ ...c, count: map.get(c.slug) ?? 0 })));
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  return { categories, loading };
}
