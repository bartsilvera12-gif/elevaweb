import { ShoppingBag, Truck, Shield, MessageCircle } from "lucide-react";

const items = [
  { icon: ShoppingBag, label: "Todo en una sola tienda" },
  { icon: Truck, label: "Entrega coordinada" },
  { icon: Shield, label: "Pago protegido" },
  { icon: MessageCircle, label: "Atención personalizada" },
];

export default function TrustStrip() {
  return (
    <div className="bg-white">
      <div className="container-eleva py-6 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-[color:var(--color-ink)]">
        {items.map((it) => (
          <span key={it.label} className="flex items-center gap-2 font-medium">
            <it.icon size={17} className="text-[color:var(--color-accent)]" /> {it.label}
          </span>
        ))}
      </div>
    </div>
  );
}
