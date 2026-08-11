// Datos demo para admin (los reclamos aún no tienen backend, se muestran mockeados)

export interface PlatformSeller {
  id: string;
  name: string;
  storeName: string;
  city: string;
  joined: string;
  status: "activo" | "pausado" | "revision";
  products: number;
  sales: number;
  gmvCents: number;
  rating: number;
  reclamos: number;
}

export const platformSellers: PlatformSeller[] = [
  { id: "s1", name: "Camila Ruiz", storeName: "Sana Botánica", city: "Asunción", joined: "2026-02-14", status: "activo", products: 42, sales: 312, gmvCents: 18500000, rating: 4.9, reclamos: 1 },
  { id: "s2", name: "Javier Méndez", storeName: "Mate & Yerba", city: "San Lorenzo", joined: "2026-03-22", status: "activo", products: 18, sales: 189, gmvCents: 9200000, rating: 4.8, reclamos: 0 },
  { id: "s3", name: "Lorena Benítez", storeName: "Casa Nordica", city: "Fernando de la Mora", joined: "2026-04-10", status: "activo", products: 65, sales: 245, gmvCents: 24800000, rating: 4.7, reclamos: 2 },
  { id: "s4", name: "Diego Cáceres", storeName: "Tech Py", city: "Ciudad del Este", joined: "2026-05-03", status: "activo", products: 28, sales: 98, gmvCents: 42100000, rating: 4.6, reclamos: 3 },
];

export interface PlatformComplaint {
  id: string;
  orderId: string;
  buyer: string;
  seller: string;
  reason: string;
  date: string;
  status: "abierto" | "resuelto";
}

export const complaints: PlatformComplaint[] = [
  { id: "c1", orderId: "ELV-A9C2X", buyer: "Cecilia G.", seller: "Sana Botánica", reason: "Producto no coincide con lo publicado", date: "2026-08-10", status: "abierto" },
  { id: "c2", orderId: "ELV-B4D8M", buyer: "Javier M.", seller: "Villar Sport", reason: "Demora en entrega", date: "2026-08-09", status: "abierto" },
  { id: "c3", orderId: "ELV-C7F1L", buyer: "Ana P.", seller: "Casa Nordica", reason: "Reembolso pendiente", date: "2026-08-07", status: "resuelto" },
];
