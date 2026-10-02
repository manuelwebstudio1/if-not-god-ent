"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types/commerce";

type WishlistState = {
  ids: string[];
  toggle: (product: Product) => void;
  has: (productId: string) => boolean;
  count: () => number;
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (product) =>
        set((state) => {
          if (state.ids.includes(product.id)) {
            return { ids: state.ids.filter((id) => id !== product.id) };
          }
          return { ids: [...state.ids, product.id] };
        }),
      has: (productId) => get().ids.includes(productId),
      count: () => get().ids.length,
    }),
    { name: "ing-wishlist" },
  ),
);
