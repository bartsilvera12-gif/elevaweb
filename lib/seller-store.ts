// Datos demo para mensajes del panel vendedor (todavía sin backend real)

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
  { id: "m4", from: "Rocío S.", avatar: "R", product: 'Notebook 14"', subject: "Cuotas sin interés", text: "Hola, con qué tarjetas puedo pagar en 12 cuotas?", date: "2026-08-10T16:05:00Z", unread: false },
  { id: "m5", from: "Diego C.", avatar: "D", subject: "Otras consultas", text: "Cómo puedo ver mis pedidos anteriores?", date: "2026-08-09T22:18:00Z", unread: false },
];
