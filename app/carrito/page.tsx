import Link from "next/link";

export default function CarritoPage() {
  return (
    <div className="container-eleva pt-10">
      <h1 className="text-3xl font-extrabold">Tu carrito</h1>
      <div className="mt-8 card-flat p-10 text-center">
        <p className="text-[color:var(--color-ink-soft)]">Tu carrito está vacío.</p>
        <Link href="/catalogo" className="btn-primary mt-6 inline-flex">Ver productos</Link>
      </div>
    </div>
  );
}
