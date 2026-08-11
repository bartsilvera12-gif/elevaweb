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
  { id: "s5", name: "Ana Peña", storeName: "Perfumería Ana", city: "Encarnación", joined: "2026-06-18", status: "revision", products: 12, sales: 0, gmvCents: 0, rating: 0, reclamos: 0 },
  { id: "s6", name: "Rocío Silva", storeName: "Deco Home", city: "Luque", joined: "2026-05-21", status: "activo", products: 51, sales: 178, gmvCents: 15600000, rating: 4.8, reclamos: 1 },
  { id: "s7", name: "Marcos Villar", storeName: "Villar Sport", city: "Lambaré", joined: "2026-01-08", status: "activo", products: 33, sales: 224, gmvCents: 13400000, rating: 4.5, reclamos: 4 },
  { id: "s8", name: "Pedro Franco", storeName: "El Rincón Gourmet", city: "Asunción", joined: "2026-04-27", status: "pausado", products: 22, sales: 87, gmvCents: 5800000, rating: 4.4, reclamos: 6 },
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

export const platformKpis = {
  gmvMes: 129400000,
  gmvMesPrev: 98500000,
  comisionMes: 15528000,
  vendedoresActivos: 7,
  vendedoresRevision: 1,
  pedidosMes: 1233,
  ticketPromedio: 105000,
  reclamosAbiertos: 2,
  reclamosMes: 8,
  usuariosNuevos: 421,
};
