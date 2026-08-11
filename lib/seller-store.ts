"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SellerProduct {
  slug: string;
  name: string;
  category: string;
  price_cents: number;
  compare_cents?: number;
  stock: number;
  image: string;
  description: string;
  active: boolean;
  variants?: string[];
  created_at: string;
}

interface SellerState {
  products: SellerProduct[];
  create: (p: Omit<SellerProduct, "created_at">) => void;
  update: (slug: string, patch: Partial<SellerProduct>) => void;
  remove: (slug: string) => void;
  get: (slug: string) => SellerProduct | undefined;
}

export const useSeller = create<SellerState>()(
  persist(
    (set, get) => ({
      products: [],
      create: (p) => set({ products: [{ ...p, created_at: new Date().toISOString() }, ...get().products] }),
      update: (slug, patch) => set({ products: get().products.map((x) => (x.slug === slug ? { ...x, ...patch } : x)) }),
      remove: (slug) => set({ products: get().products.filter((x) => x.slug !== slug) }),
      get: (slug) => get().products.find((x) => x.slug === slug),
    }),
    { name: "eleva.seller" }
  )
);

export interface SellerMessage {
  id: string;
  from: string;
  avatar: string;
  product?: string;
  subject: string;
  text: string;
  date: string;
  unread: boolean;
}

export const demoMessages: SellerMessage[] = [
  { id: "m1", from: "Cecilia G.", avatar: "C", product: "Vestido midi floral de verano", subject: "¿Tienen el vestido en talle L?", text: "Hola, vi el vestido midi floral. ¿Todavía tienen stock en talle L? Lo necesito para el finde. Gracias.", date: "2026-08-11T09:12:00Z", unread: true },
  { id: "m2", from: "Javier M.", avatar: "J", product: "Zapatillas urbanas unisex", subject: "Consulta por talle", text: "Buen día, calzo 42 pero algo apretadas. ¿Tienen 43?", date: "2026-08-11T08:44:00Z", unread: true },
  { id: "m3", from: "Ana P.", avatar: "A", product: "Perfume floral 50 ml", subject: "Envío a Encarnación", text: "Buen día, quiero comprar 2 unidades. ¿Cuánto tarda a Encarnación?", date: "2026-08-10T18:30:00Z", unread: false },
  { id: "m4", from: "Rocío S.", avatar: "R", product: "Notebook 14\"", subject: "Cuotas sin interés", text: "Hola, con qué tarjetas puedo pagar en 12 cuotas?", date: "2026-08-10T16:05:00Z", unread: false },
  { id: "m5", from: "Diego C.", avatar: "D", subject: "Otras consultas", text: "Cómo puedo ver mis pedidos anteriores?", date: "2026-08-09T22:18:00Z", unread: false },
];

export interface Payout {
  id: string;
  amount_cents: number;
  status: "programado" | "pagado";
  period: string;
  date: string;
  ref?: string;
}

export const demoPayouts: Payout[] = [
  { id: "p1", amount_cents: 3771200, status: "programado", period: "05 – 11 ago 2026", date: "2026-08-12" },
  { id: "p2", amount_cents: 4120500, status: "pagado", period: "29 jul – 04 ago 2026", date: "2026-08-05", ref: "TRF-A9C2X" },
  { id: "p3", amount_cents: 2895400, status: "pagado", period: "22 – 28 jul 2026", date: "2026-07-29", ref: "TRF-B4D8M" },
  { id: "p4", amount_cents: 3510000, status: "pagado", period: "15 – 21 jul 2026", date: "2026-07-22", ref: "TRF-C7F1L" },
  { id: "p5", amount_cents: 3240000, status: "pagado", period: "08 – 14 jul 2026", date: "2026-07-15", ref: "TRF-D2K9P" },
];
