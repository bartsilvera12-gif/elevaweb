import ProductDetail from "@/components/product/ProductDetail";
import { products as fallbackProducts } from "@/lib/mock-products";

export function generateStaticParams() {
  return fallbackProducts.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ProductDetail slug={slug} />;
}
