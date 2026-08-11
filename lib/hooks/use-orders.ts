"use client";
import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { DBOrder } from "@/lib/types";

export function useMyOrders() {
  const [orders, setOrders] = useState<DBOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { setOrders([]); setLoading(false); return; }
      const { data } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (!cancelled) { setOrders((data as DBOrder[]) ?? []); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, [refreshKey]);

  return { orders, loading, refresh };
}

export function useOrder(id: string | null) {
  const [order, setOrder] = useState<DBOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    let cancelled = false;
    createClient()
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        if (!cancelled) { setOrder((data as DBOrder) ?? null); setLoading(false); }
      });
    return () => { cancelled = true; };
  }, [id]);

  return { order, loading };
}

// Órdenes que contienen productos del seller (RLS + policy orders_seller_read se encargan)
export function useSellerOrders() {
  const [orders, setOrders] = useState<DBOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { setOrders([]); setLoading(false); return; }
      const { data } = await supabase
        .from("orders")
        .select("*, order_items!inner(*)")
        .eq("order_items.seller_id", user.id)
        .order("created_at", { ascending: false });
      if (!cancelled) { setOrders((data as DBOrder[]) ?? []); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, []);

  return { orders, loading };
}

// Todas las órdenes (admin) — RLS orders_admin_read_all filtra
export function useAllOrders() {
  const [orders, setOrders] = useState<DBOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    createClient()
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (!cancelled) { setOrders((data as DBOrder[]) ?? []); setLoading(false); }
      });
    return () => { cancelled = true; };
  }, []);

  return { orders, loading };
}
