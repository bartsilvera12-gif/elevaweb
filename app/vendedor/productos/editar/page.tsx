"use client";
import Link from "next/link";
import { Info } from "lucide-react";
export default function Deprecated() {
  return (
    <div className="max-w-md">
      <div className="card-flat p-6 border-l-4 border-[color:var(--color-accent)]">
        <div className="flex items-center gap-2 text-[color:var(--color-accent)] font-bold text-sm uppercase tracking-wider"><Info size={16} /> Los productos los gestiona ELEVA</div>
        <p className="text-sm text-[color:var(--color-ink-soft)] mt-2">Si necesitás modificar precio, stock, foto o descripción, escribile a ELEVA por Mensajes.</p>
        <div className="flex gap-2 mt-4">
          <Link href="/vendedor/mensajes" className="btn-primary">Ir a mensajes</Link>
          <Link href="/vendedor/productos" className="btn-outline">Volver</Link>
        </div>
      </div>
    </div>
  );
}
