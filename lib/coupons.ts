import type { DBCoupon } from "@/lib/types";

// Los cupones viven en eleva.cupones (ver useCoupons). Este módulo solo tiene
// el cálculo de totales, que comparten el carrito y el checkout.

export interface ShippingRules {
  envio_cents: number;
  envio_gratis_desde_cents: number;
}

export const defaultShipping: ShippingRules = {
  envio_cents: 25000,
  envio_gratis_desde_cents: 500000,
};

export interface Totals {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  couponError?: string;
}

export function computeTotals(
  subtotal: number,
  coupon: DBCoupon | null,
  rules: ShippingRules = defaultShipping
): Totals {
  let discount = 0;
  let shipping = subtotal >= rules.envio_gratis_desde_cents ? 0 : rules.envio_cents;
  let couponError: string | undefined;

  if (coupon) {
    if (coupon.min_cents && subtotal < coupon.min_cents) {
      couponError = `Este cupón requiere una compra mínima de Gs. ${coupon.min_cents.toLocaleString("es-PY")}`;
    } else if (coupon.kind === "percent") {
      discount = Math.round((subtotal * coupon.value) / 100);
    } else if (coupon.kind === "flat") {
      discount = coupon.value;
    } else if (coupon.kind === "shipping") {
      shipping = 0;
    }
  }

  const total = Math.max(0, subtotal - discount + shipping);
  return { subtotal, discount, shipping, total, couponError };
}
