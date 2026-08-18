"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export interface UserProfile {
  id: string;
  name: string | null;
  phone: string | null;
  city: string | null;
  is_seller: boolean;
  store_name: string | null;
  is_admin?: boolean | null;
  store_desc?: string | null;
  pago_titular?: string | null;
  pago_banco?: string | null;
  pago_cuenta?: string | null;
  pago_alias?: string | null;
  pago_telefono?: string | null;
  pago_notas?: string | null;
  instagram?: string | null;
  tiktok?: string | null;
  mensualidad_cents?: number | null;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function fetchProfile(u: User | null) {
      if (!u) { setProfile(null); return; }
      const { data } = await supabase.from("profiles").select("*").eq("id", u.id).single();
      setProfile((data as UserProfile) ?? null);
    }

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      fetchProfile(data.user).finally(() => setLoading(false));
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      fetchProfile(u);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  return { user, profile, loading };
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
}
