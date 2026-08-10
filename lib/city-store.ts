"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CityState {
  city: string;
  setCity: (c: string) => void;
}

export const useCity = create<CityState>()(
  persist(
    (set) => ({
      city: "Asunción",
      setCity: (city) => set({ city }),
    }),
    { name: "eleva.city" }
  )
);
