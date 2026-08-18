"use client";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { DBCategoria, DBCoupon, DBReclamo, Mensaje, SellerAccount, SellerCharge, SellerPublic } from "@/lib/types";

// ---- Settings globales (comisión, envío, etc.) ----

export type Settings = Record<string, unknown>;

export function useSettings() {
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data } = await createClient().from("settings").select("*");
    const map: Settings = {};
    for (const row of (data as { key: string; value: unknown }[]) ?? []) map[row.key] = row.value;
    setSettings(map);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = useCallback(async (values: Settings) => {
    const rows = Object.entries(values).map(([key, value]) => ({ key, value }));
    const { error } = await createClient().from("settings").upsert(rows, { onConflict: "key" });
    if (!error) await load();
    return error?.message ?? null;
  }, [load]);

  const num = useCallback((key: string, fallback: number) => {
    const v = settings[key];
    return typeof v === "number" ? v : v == null ? fallback : Number(v);
  }, [settings]);

  const bool = useCallback((key: string, fallback: boolean) => {
    const v = settings[key];
    return typeof v === "boolean" ? v : v == null ? fallback : v === "true";
  }, [settings]);

  return { settings, loading, save, num, bool, reload: load };
}

// ---- Emprendedores ----

export interface SellerRow extends SellerPublic {
  name: string | null;
  phone: string | null;
  is_seller: boolean;
  mensualidad_cents: number;
  created_at: string;
}

export function useSellers() {
  const [sellers, setSellers] = useState<SellerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [key, setKey] = useState(0);
  const reload = useCallback(() => setKey((k) => k + 1), []);

  useEffect(() => {
    let cancelled = false;
    createClient()
      .from("profiles")
      .select("*")
      .eq("is_seller", true)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (!cancelled) { setSellers((data as SellerRow[]) ?? []); setLoading(false); }
      });
    return () => { cancelled = true; };
  }, [key]);

  return { sellers, loading, reload };
}

// Datos de cobro de un vendedor, visibles para el comprador (view sellers_public)
export function useSellerPublic(ids: (string | null)[]) {
  const [map, setMap] = useState<Record<string, SellerPublic>>({});
  const wanted = ids.filter(Boolean).join(",");

  useEffect(() => {
    if (!wanted) { setMap({}); return; }
    let cancelled = false;
    createClient()
      .from("sellers_public")
      .select("*")
      .in("id", wanted.split(","))
      .then(({ data }) => {
        if (cancelled) return;
        const m: Record<string, SellerPublic> = {};
        for (const s of (data as SellerPublic[]) ?? []) m[s.id] = s;
        setMap(m);
      });
    return () => { cancelled = true; };
  }, [wanted]);

  return map;
}

// ---- Cuenta corriente ----

export function useSellerAccounts() {
  const [accounts, setAccounts] = useState<SellerAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [key, setKey] = useState(0);
  const reload = useCallback(() => setKey((k) => k + 1), []);

  useEffect(() => {
    let cancelled = false;
    createClient().from("seller_accounts").select("*").then(({ data }) => {
      if (!cancelled) { setAccounts((data as SellerAccount[]) ?? []); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, [key]);

  return { accounts, loading, reload };
}

export function useMyCharges() {
  const [charges, setCharges] = useState<SellerCharge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { setLoading(false); return; }
      const { data } = await supabase
        .from("seller_charges")
        .select("*")
        .eq("seller_id", user.id)
        .order("created_at", { ascending: false });
      if (!cancelled) { setCharges((data as SellerCharge[]) ?? []); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, []);

  return { charges, loading };
}

export async function registrarPago(sellerId: string, amountCents: number, note: string) {
  const { error } = await createClient().rpc("registrar_pago", {
    p_seller_id: sellerId,
    p_amount_cents: amountCents,
    p_note: note,
  });
  return error?.message ?? null;
}

export async function cobrarMensualidades(period: string) {
  const { data, error } = await createClient().rpc("cobrar_mensualidades", { p_period: period });
  return { count: (data as number) ?? 0, error: error?.message ?? null };
}

// ---- Mensajes ELEVA <-> emprendedor ----

export function useMensajes(sellerId: string | null) {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [loading, setLoading] = useState(true);
  const [key, setKey] = useState(0);
  const reload = useCallback(() => setKey((k) => k + 1), []);

  useEffect(() => {
    if (!sellerId) { setMensajes([]); setLoading(false); return; }
    let cancelled = false;
    createClient()
      .from("mensajes")
      .select("*")
      .eq("seller_id", sellerId)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (!cancelled) { setMensajes((data as Mensaje[]) ?? []); setLoading(false); }
      });
    return () => { cancelled = true; };
  }, [sellerId, key]);

  const send = useCallback(async (body: string, fromAdmin: boolean) => {
    if (!sellerId || !body.trim()) return null;
    const { error } = await createClient()
      .from("mensajes")
      .insert({ seller_id: sellerId, body: body.trim(), from_admin: fromAdmin });
    if (!error) reload();
    return error?.message ?? null;
  }, [sellerId, reload]);

  return { mensajes, loading, send, reload };
}

// Última actividad por emprendedor, para el inbox de admin
export function useMensajesResumen() {
  const [rows, setRows] = useState<Mensaje[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    createClient()
      .from("mensajes")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (!cancelled) { setRows((data as Mensaje[]) ?? []); setLoading(false); }
      });
    return () => { cancelled = true; };
  }, []);

  return { rows, loading };
}

// ---- Cupones ----

export function useCoupons(onlyActive = true) {
  const [coupons, setCoupons] = useState<DBCoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [key, setKey] = useState(0);
  const reload = useCallback(() => setKey((k) => k + 1), []);

  useEffect(() => {
    let cancelled = false;
    let q = createClient().from("cupones").select("*").order("code");
    if (onlyActive) q = q.eq("active", true);
    q.then(({ data }) => {
      if (!cancelled) { setCoupons((data as DBCoupon[]) ?? []); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, [onlyActive, key]);

  const create = useCallback(async (c: Omit<DBCoupon, "active">) => {
    const { error } = await createClient().from("cupones").insert({ ...c, active: true });
    if (!error) reload();
    return error?.message ?? null;
  }, [reload]);

  const remove = useCallback(async (code: string) => {
    const { error } = await createClient().from("cupones").delete().eq("code", code);
    if (!error) reload();
    return error?.message ?? null;
  }, [reload]);

  return { coupons, loading, create, remove, reload };
}

// ---- Categorías ----

export function useCategorias() {
  const [categorias, setCategorias] = useState<DBCategoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [key, setKey] = useState(0);
  const reload = useCallback(() => setKey((k) => k + 1), []);

  useEffect(() => {
    let cancelled = false;
    createClient().from("categorias").select("*").eq("active", true).order("orden").then(({ data }) => {
      if (!cancelled) { setCategorias((data as DBCategoria[]) ?? []); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, [key]);

  const upsert = useCallback(async (c: Partial<DBCategoria> & { slug: string; name: string }) => {
    const { error } = await createClient().from("categorias").upsert(c, { onConflict: "slug" });
    if (!error) reload();
    return error?.message ?? null;
  }, [reload]);

  const remove = useCallback(async (slug: string) => {
    const { error } = await createClient().from("categorias").delete().eq("slug", slug);
    if (!error) reload();
    return error?.message ?? null;
  }, [reload]);

  return { categorias, loading, upsert, remove, reload };
}

// ---- Reclamos ----

export function useReclamos() {
  const [reclamos, setReclamos] = useState<DBReclamo[]>([]);
  const [loading, setLoading] = useState(true);
  const [key, setKey] = useState(0);
  const reload = useCallback(() => setKey((k) => k + 1), []);

  useEffect(() => {
    let cancelled = false;
    createClient().from("reclamos").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      if (!cancelled) { setReclamos((data as DBReclamo[]) ?? []); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, [key]);

  const resolver = useCallback(async (id: number, respuesta: string) => {
    const { error } = await createClient()
      .from("reclamos")
      .update({ status: "resuelto", respuesta, resolved_at: new Date().toISOString() })
      .eq("id", id);
    if (!error) reload();
    return error?.message ?? null;
  }, [reload]);

  const crear = useCallback(async (r: { order_id: string | null; seller_id: string | null; motivo: string; detalle: string }) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return "Necesitás iniciar sesión";
    const { error } = await supabase.from("reclamos").insert({ ...r, buyer_id: user.id });
    if (!error) reload();
    return error?.message ?? null;
  }, [reload]);

  return { reclamos, loading, resolver, crear, reload };
}
