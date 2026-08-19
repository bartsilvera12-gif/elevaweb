"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductDetail from "@/components/product/ProductDetail";
import { Loader2 } from "lucide-react";

export default function ProductPage() {
  return (
    <Suspense fallback={<div className="container-eleva pt-16 flex justify-center min-h-[400px] items-center text-[color:var(--color-muted)]"><Loader2 size={20} className="animate-spin" /></div>}>
      <Inner />
    </Suspense>
  );
}

function Inner() {
  const sp = useSearchParams();
  const slug = sp.get("slug") || "";
  return <ProductDetail slug={slug} />;
}
