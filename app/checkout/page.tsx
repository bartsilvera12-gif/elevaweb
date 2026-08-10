export default function CheckoutPage() {
  return (
    <div className="container-eleva pt-10">
      <h1 className="text-3xl font-extrabold">Checkout</h1>
      <p className="text-[color:var(--color-ink-soft)] mt-2">Completá tus datos para finalizar la compra.</p>
      <form className="mt-8 grid gap-4 max-w-lg">
        <input className="border border-[color:var(--color-line)] rounded px-4 py-3" placeholder="Nombre completo" />
        <input className="border border-[color:var(--color-line)] rounded px-4 py-3" placeholder="Dirección de envío" />
        <input className="border border-[color:var(--color-line)] rounded px-4 py-3" placeholder="Ciudad" />
        <input className="border border-[color:var(--color-line)] rounded px-4 py-3" placeholder="Teléfono" />
        <button className="btn-primary justify-center">Pagar</button>
      </form>
    </div>
  );
}
