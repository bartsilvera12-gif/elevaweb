"use client";
import { createClient } from "@/lib/supabase/client";

// Sube una imagen al bucket público "products" y devuelve la URL pública.
// El nombre del archivo se arma con el sellerId y un timestamp para no chocar.
export async function uploadProductImage(file: File, sellerId: string): Promise<{ url: string | null; error: string | null }> {
  const supabase = createClient();
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `${sellerId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from("products").upload(path, file, { upsert: false, contentType: file.type });
  if (error) return { url: null, error: error.message };
  const { data } = supabase.storage.from("products").getPublicUrl(path);
  return { url: data.publicUrl, error: null };
}
