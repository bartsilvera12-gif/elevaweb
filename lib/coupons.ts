export interface Coupon {
  code: string;
  label: string;
  kind: "percent" | "shipping" | "flat";
  value: number;
  minCents?: number;
}

export const coupons: Coupon[] = [
  { code: "ELEVA10", label: "10% de descuento", kind: "percent", value: 10 },
  { code: "NUEVO5", label: "5% para clientes nuevos", kind: "percent", value: 5 },
  { code: "ENVIOGRATIS", label: "Envío gratis", kind: "shipping", value: 0 },
  { code: "MENOS20K", label: "-Gs. 20.000 en compras +100k", kind: "flat", value: 20000, minCents: 100000 },
];

export function findCoupon(code: string): Coupon | null {
  const c = coupons.find((x) => x.code.toUpperCase() === code.trim().toUpperCase());
  return c || null;
}

export interface Totals {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  couponError?: string;
}

export function computeTotals(subtotal: number, coupon: Coupon | null): Totals {
  let discount = 0;
  let shipping = subtotal > 500000 ? 0 : 25000;
  let couponError: string | undefined;

  if (coupon) {
    if (coupon.minCents && subtotal < coupon.minCents) {
      couponError = `Este cupón requiere una compra mínima de Gs. ${coupon.minCents.toLocaleString("es-PY")}`;
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
