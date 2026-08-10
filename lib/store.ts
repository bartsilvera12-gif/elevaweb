"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useEffect, useState } from "react";

export interface CartItem {
  slug: string;
  name: string;
  price_cents: number;
  image: string;
  variant?: string;
  qty: number;
}

interface CartState {
  items: CartItem[];
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  remove: (slug: string, variant?: string) => void;
  setQty: (slug: string, variant: string | undefined, qty: number) => void;
  clear: () => void;
  count: () => number;
  subtotalCents: () => number;
}

const key = (slug: string, variant?: string) => `${slug}::${variant || ""}`;

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item, qty = 1) => {
        const k = key(item.slug, item.variant);
        const existing = get().items.find((x) => key(x.slug, x.variant) === k);
        if (existing) {
          set({
            items: get().items.map((x) =>
              key(x.slug, x.variant) === k ? { ...x, qty: x.qty + qty } : x
            ),
          });
        } else {
          set({ items: [...get().items, { ...item, qty }] });
        }
      },
      remove: (slug, variant) =>
        set({ items: get().items.filter((x) => key(x.slug, x.variant) !== key(slug, variant)) }),
      setQty: (slug, variant, qty) => {
        if (qty <= 0) return get().remove(slug, variant);
        set({
          items: get().items.map((x) =>
            key(x.slug, x.variant) === key(slug, variant) ? { ...x, qty } : x
          ),
        });
      },
      clear: () => set({ items: [] }),
      count: () => get().items.reduce((n, x) => n + x.qty, 0),
      subtotalCents: () => get().items.reduce((n, x) => n + x.price_cents * x.qty, 0),
    }),
    { name: "eleva.cart" }
  )
);

interface FavState {
  slugs: string[];
  toggle: (slug: string) => void;
  has: (slug: string) => boolean;
  remove: (slug: string) => void;
}

export const useFavorites = create<FavState>()(
  persist(
    (set, get) => ({
      slugs: [],
      toggle: (slug) => {
        const s = get().slugs;
        set({ slugs: s.includes(slug) ? s.filter((x) => x !== slug) : [...s, slug] });
      },
      has: (slug) => get().slugs.includes(slug),
      remove: (slug) => set({ slugs: get().slugs.filter((x) => x !== slug) }),
    }),
    { name: "eleva.favs" }
  )
);

export interface Order {
  id: string;
  created_at: string;
  items: CartItem[];
  subtotal_cents: number;
  discount_cents: number;
  shipping_cents: number;
  total_cents: number;
  coupon?: string;
  shipping: {
    name: string;
    address: string;
    city: string;
    dept: string;
    phone: string;
  };
  status: "pending" | "paid" | "shipped" | "delivered";
}

interface OrdersState {
  orders: Order[];
  create: (o: Omit<Order, "id" | "created_at" | "status">) => Order;
  get: (id: string) => Order | undefined;
}

export const useOrders = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: [],
      create: (o) => {
        const id = "ELV-" + Math.random().toString(36).slice(2, 8).toUpperCase();
        const created_at = new Date().toISOString();
        const order: Order = { ...o, id, created_at, status: "paid" };
        set({ orders: [order, ...get().orders] });
        return order;
      },
      get: (id) => get().orders.find((o) => o.id === id),
    }),
    { name: "eleva.orders" }
  )
);

// Hook to safely read persisted state (avoids SSR hydration mismatch)
export function useHydrated() {
  const [ok, setOk] = useState(false);
  useEffect(() => setOk(true), []);
  return ok;
}
