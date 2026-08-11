"use client";
import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { DBProduct } from "@/lib/types";

interface Filters {
  category?: string;
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  onlyStock?: boolean;
  onlyOffers?: boolean;
  onlyNew?: boolean;
  onlyBest?: boolean;
  sort?: "relevancia" | "precio-asc" | "precio-desc" | "vendidos" | "rating" | "nuevos";
}

export function useProducts(filters: Filters = {}) {
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const supabase = createClient();
    let q = supabase.from("products").select("*").eq("active", true);
    if (filters.category) q = q.eq("category", filters.category);
    if (filters.q) q = q.or(`name.ilike.%${filters.q}%,category.ilike.%${filters.q}%`);
    if (filters.minPrice) q = q.gte("price_cents", filters.minPrice);
    if (filters.maxPrice) q = q.lte("price_cents", filters.maxPrice);
    if (filters.onlyStock) q = q.gt("stock", 0);
    if (filters.onlyOffers) q = q.gt("disc_pct", 0);
    if (filters.onlyNew) q = q.eq("badge", "nuevo");
    if (filters.onlyBest) q = q.eq("badge", "masvendido");

    switch (filters.sort) {
      case "precio-asc": q = q.order("price_cents", { ascending: true }); break;
      case "precio-desc": q = q.order("price_cents", { ascending: false }); break;
      case "vendidos": q = q.order("sold", { ascending: false }); break;
      case "rating": q = q.order("rating", { ascending: false, nullsFirst: false }); break;
      case "nuevos": q = q.order("created_at", { ascending: false }); break;
      default: q = q.order("id", { ascending: true });
    }

    q.then(({ data, error }) => {
      if (cancelled) return;
      if (error) setError(error.message);
      else setProducts((data as DBProduct[]) ?? []);
      setLoading(false);
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

  return { products, loading, error };
}

export function useProduct(slug: string | null) {
  const [product, setProduct] = useState<DBProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) { setLoading(false); return; }
    let cancelled = false;
    setLoading(true);
    createClient()
      .from("products")
      .select("*")
      .eq("slug", slug)
      .eq("active", true)
      .single()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) { setError(error.message); setProduct(null); }
        else setProduct(data as DBProduct);
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, [slug]);

  return { product, loading, error };
}

export function useMyProducts() {
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { setProducts([]); setLoading(false); return; }
      const { data } = await supabase.from("products").select("*").eq("seller_id", user.id).order("created_at", { ascending: false });
      if (!cancelled) { setProducts((data as DBProduct[]) ?? []); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, [refreshKey]);

  return { products, loading, refresh };
}

export function useLowStock() {
  const [items, setItems] = useState<DBProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    createClient()
      .from("low_stock")
      .select("*")
      .then(({ data }) => {
        if (!cancelled) { setItems((data as DBProduct[]) ?? []); setLoading(false); }
      });
    return () => { cancelled = true; };
  }, []);

  return { items, loading };
}
