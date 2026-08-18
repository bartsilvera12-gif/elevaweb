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
  seller_id: string | null;
  payment_status: "pendiente" | "cobrado";
  paid_at: string | null;
  commission_pct: number | null;
  commission_cents: number;
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

// ---- v4: modelo real (cliente le paga al emprendedor, ELEVA cobra comisión) ----

export interface SellerPublic {
  id: string;
  store_name: string | null;
  city: string | null;
  store_desc: string | null;
  pago_titular: string | null;
  pago_banco: string | null;
  pago_cuenta: string | null;
  pago_alias: string | null;
  pago_telefono: string | null;
  pago_notas: string | null;
  instagram: string | null;
  tiktok: string | null;
}

export interface SellerCharge {
  id: number;
  seller_id: string;
  kind: "comision" | "mensualidad" | "pago" | "ajuste";
  amount_cents: number;
  order_id: string | null;
  period: string | null;
  note: string | null;
  created_at: string;
}

export interface SellerAccount {
  seller_id: string;
  store_name: string | null;
  mensualidad_cents: number;
  comisiones_cents: number;
  mensualidades_cents: number;
  pagado_cents: number;
  saldo_cents: number;
}

export interface Mensaje {
  id: number;
  seller_id: string;
  from_admin: boolean;
  body: string;
  read_at: string | null;
  created_at: string;
}

export interface DBCoupon {
  code: string;
  label: string;
  kind: "percent" | "shipping" | "flat";
  value: number;
  min_cents: number;
  active: boolean;
}

export interface DBCategoria {
  slug: string;
  name: string;
  image_url: string | null;
  orden: number;
  active: boolean;
}

export interface DBReclamo {
  id: number;
  order_id: string | null;
  buyer_id: string | null;
  seller_id: string | null;
  motivo: string;
  detalle: string | null;
  status: string;
  respuesta: string | null;
  created_at: string;
  resolved_at: string | null;
}
