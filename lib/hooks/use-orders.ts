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
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      // Guest: leemos los ids que guardamos en localStorage al comprar
      const guestIds: string[] = typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("eleva.guest.orders") || "[]")
        : [];

      if (!user && !guestIds.length) { setOrders([]); setLoading(false); return; }

      let q = supabase.from("orders").select("*, order_items(*)").order("created_at", { ascending: false });
      if (user) q = q.eq("user_id", user.id);
      else q = q.in("id", guestIds);
      const { data } = await q;
      if (!cancelled) { setOrders((data as DBOrder[]) ?? []); setLoading(false); }
    })();
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

// Pedidos del emprendedor. Desde v4 cada pedido pertenece a un solo vendedor,
// así que alcanza con filtrar por orders.seller_id.
export function useSellerOrders() {
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
        .eq("seller_id", user.id)
        .order("created_at", { ascending: false });
      if (!cancelled) { setOrders((data as DBOrder[]) ?? []); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, [refreshKey]);

  return { orders, loading, refresh };
}

// El emprendedor confirma que el cliente le pagó: recién ahí ELEVA despacha
// y se le carga la comisión a su cuenta corriente.
export async function confirmarPago(orderId: string) {
  const { error } = await createClient().rpc("confirmar_pago", { p_order_id: orderId });
  return error?.message ?? null;
}

// ELEVA mueve el despacho (empaquetado -> enviado -> entregado)
export async function setOrderStatus(orderId: string, status: DBOrder["status"]) {
  const { error } = await createClient().rpc("set_order_status", { p_order_id: orderId, p_status: status });
  return error?.message ?? null;
}

// Todas las órdenes (admin) — RLS orders_admin_read_all filtra
export function useAllOrders() {
  const [orders, setOrders] = useState<DBOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

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
  }, [refreshKey]);

  return { orders, loading, refresh };
}
