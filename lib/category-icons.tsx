import type { LucideIcon } from "lucide-react";
import { Shirt, Sparkles, Sofa, Smartphone, Headphones, Watch, Dumbbell, Baby, BookOpen, Wine, PawPrint, Package } from "lucide-react";

const map: Record<string, LucideIcon> = {
  moda: Shirt,
  belleza: Sparkles,
  hogar: Sofa,
  electronica: Smartphone,
  audio: Headphones,
  wearables: Watch,
  deportes: Dumbbell,
  ninos: Baby,
  libros: BookOpen,
  gourmet: Wine,
  mascotas: PawPrint,
};

export function categoryIcon(slug: string): LucideIcon {
  return map[slug] || Package;
}
