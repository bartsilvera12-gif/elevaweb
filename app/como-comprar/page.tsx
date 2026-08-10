const pasos = [
  { n: 1, t: "Elegí tu producto", d: "Explorá el catálogo, filtrá por categoría o marca y guardá favoritos." },
  { n: 2, t: "Sumá al carrito", d: "Podés ajustar cantidades y ver el total antes de comprar." },
  { n: 3, t: "Completá el checkout", d: "Ingresá tus datos de envío y pago. Aceptamos las principales tarjetas." },
  { n: 4, t: "Recibí en tu casa", d: "Coordinamos la entrega y te avisamos cuando tu pedido esté en camino." },
];

export default function ComoComprarPage() {
  return (
    <div className="container-eleva pt-10">
      <h1 className="text-3xl md:text-4xl font-extrabold">Cómo comprar en ELEVA</h1>
      <p className="text-[color:var(--color-ink-soft)] mt-2 max-w-xl">Comprar en ELEVA es simple. Estos son los pasos.</p>
      <div className="grid md:grid-cols-4 gap-4 mt-8">
        {pasos.map((p) => (
          <div key={p.n} className="card-flat p-5">
            <div className="w-9 h-9 rounded bg-[color:var(--color-accent)] text-white font-extrabold flex items-center justify-center">{p.n}</div>
            <h3 className="font-bold mt-3">{p.t}</h3>
            <p className="text-sm text-[color:var(--color-ink-soft)] mt-1">{p.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
