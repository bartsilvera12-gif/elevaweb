import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatGs(cents: number) {
  return "Gs. " + new Intl.NumberFormat("es-PY").format(Math.round(cents));
}
