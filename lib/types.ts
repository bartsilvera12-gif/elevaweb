// Tipos que reflejan el schema eleva.* en Supabase

export interface DBProduct {
  id: number;
  seller_id: string | null;
  slug: string;
  name: string;
  description: string | null;
  price_cents: number;
  compare_cents: number | null;
  currency: string;
  image_url: string | null;
  stock: number;
  stock_minimo: number;
  unit: string;
  ubicacion: string | null;
  category: string;
  active: boolean;
  rating: number | null;
  sold: number;
  badge: "nuevo" | "masvendido" | null;
  disc_pct: number | null;
  created_at: string;
}

export interface DBOrder {
  id: string;
  user_id: string;
  subtotal_cents: number;
  discount_cents: number;
  shipping_cents: number;
  total_cents: number;
  currency: string;
  status: "pending" | "paid" | "shipped" | "delivered";
  coupon: string | null;
  shipping: {
    name: string;
    address: string;
    city: string;
    dept: string;
    phone: string;
  };
  created_at: string;
  order_items?: DBOrderItem[];
}

export interface DBOrderItem {
  id: number;
  order_id: string;
  product_slug: string;
  product_name: string;
  qty: number;
  unit_price_cents: number;
  variant: string | null;
  seller_id: string | null;
  product_image: string | null;
}

export interface CartItemPayload {
  slug: string;
  name: string;
  price_cents: number;
  qty: number;
  variant?: string;
}

export const UNITS = ["unidad", "kg", "g", "litro", "ml", "par", "docena", "metro", "cm"] as const;
