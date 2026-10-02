"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types/commerce";

export type CartItem = {
  productId: string;
  slug: string;
  categorySlug: string;
  name: string;
  sku: string;
  brand: string;
  price: number;
  image: string;
  quantity: number;
  maxStock: number;
};

type CartState = {
  items: CartItem[];
  couponCode: string | null;
  couponDiscount: number;
  isOpen: boolean;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  subtotal: () => number;
  deliveryCost: () => number;
  total: () => number;
  itemCount: () => number;
};

const VALID_COUPONS: Record<string, number> = {
  ING10: 0.1,
  BUILD5: 0.05,
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      couponDiscount: 0,
      isOpen: false,

      addItem: (product, quantity = 1) => {
        if (product.stock <= 0) return;
        set((state) => {
          const existing = state.items.find((i) => i.productId === product.id);
          if (existing) {
            const nextQty = Math.min(
              existing.quantity + quantity,
              product.stock,
            );
            return {
              items: state.items.map((i) =>
                i.productId === product.id
                  ? { ...i, quantity: nextQty, maxStock: product.stock }
                  : i,
              ),
              isOpen: true,
            };
          }
          return {
            items: [
              ...state.items,
              {
                productId: product.id,
                slug: product.slug,
                categorySlug: product.categorySlug,
                name: product.name,
                sku: product.sku,
                brand: product.brand,
                price: product.price,
                image: product.images[0],
                quantity: Math.min(quantity, product.stock),
                maxStock: product.stock,
              },
            ],
            isOpen: true,
          };
        });
      },

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),

      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((i) => {
            if (i.productId !== productId) return i;
            const q = Math.max(1, Math.min(quantity, i.maxStock));
            return { ...i, quantity: q };
          }),
        })),

      clearCart: () => set({ items: [], couponCode: null, couponDiscount: 0 }),

      applyCoupon: (code) => {
        const normalized = code.trim().toUpperCase();
        const discount = VALID_COUPONS[normalized];
        if (!discount) return false;
        set({ couponCode: normalized, couponDiscount: discount });
        return true;
      },

      removeCoupon: () => set({ couponCode: null, couponDiscount: 0 }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      deliveryCost: () => {
        const sub = get().subtotal();
        if (sub === 0) return 0;
        return sub >= 500 ? 0 : 35;
      },

      total: () => {
        const sub = get().subtotal();
        const delivery = get().deliveryCost();
        const discount = sub * get().couponDiscount;
        return Math.max(0, sub - discount + delivery);
      },

      itemCount: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "ing-cart" },
  ),
);
