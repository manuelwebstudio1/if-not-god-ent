"use client";

import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const subtotal = useCartStore((s) => s.subtotal());
  const deliveryCost = useCartStore((s) => s.deliveryCost());
  const total = useCartStore((s) => s.total());
  const applyCoupon = useCartStore((s) => s.applyCoupon);
  const couponCode = useCartStore((s) => s.couponCode);
  const [code, setCode] = useState("");
  const [couponError, setCouponError] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70]">
      <button
        type="button"
        className="absolute inset-0 bg-black/60"
        aria-label="Close cart"
        onClick={closeCart}
      />
      <aside className="cart-drawer-enter absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        <div className="flex h-14 items-center justify-between border-b border-neutral-200 px-4">
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide">
            <ShoppingBag className="h-5 w-5" />
            Your Cart
          </h2>
          <button type="button" onClick={closeCart} aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted">
              Your cart is empty. Browse our shop to add professional equipment.
            </p>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item.productId}
                  className="flex gap-3 border border-neutral-100 p-3"
                >
                  <div className="relative h-20 w-20 shrink-0 bg-neutral-50">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase text-muted">
                      {item.brand}
                    </p>
                    <Link
                      href={`/shop/${item.categorySlug}/${item.slug}`}
                      onClick={closeCart}
                      className="line-clamp-2 text-sm font-semibold hover:text-gold-dark"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-1 text-sm font-bold">
                      {formatPrice(item.price)}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center border border-neutral-300"
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1)
                        }
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center border border-neutral-300"
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        className="ml-auto text-neutral-500 hover:text-red-600"
                        onClick={() => removeItem(item.productId)}
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-neutral-200 p-4">
            <form
              className="mb-4 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                const ok = applyCoupon(code);
                setCouponError(ok ? "" : "Invalid coupon code");
              }}
            >
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Coupon code"
                className="h-10 flex-1 border border-neutral-300 px-3 text-sm outline-none focus:border-gold"
              />
              <Button type="submit" variant="dark" size="sm">
                Apply
              </Button>
            </form>
            {couponError && (
              <p className="mb-2 text-xs text-red-600">{couponError}</p>
            )}
            {couponCode && (
              <p className="mb-2 text-xs text-green-700">
                Coupon {couponCode} applied
              </p>
            )}

            <dl className="space-y-1 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Subtotal</dt>
                <dd className="font-semibold">{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Delivery</dt>
                <dd className="font-semibold">
                  {deliveryCost === 0 ? "FREE" : formatPrice(deliveryCost)}
                </dd>
              </div>
              <div className="flex justify-between border-t border-neutral-200 pt-2 text-base">
                <dt className="font-bold">Total</dt>
                <dd className="font-bold">{formatPrice(total)}</dd>
              </div>
            </dl>

            <div className="mt-4 grid gap-2">
              <Link
                href="/checkout"
                onClick={closeCart}
                className={cn(buttonVariants(), "w-full text-center")}
              >
                Proceed to Checkout
              </Link>
              <button
                type="button"
                onClick={clearCart}
                className="text-xs font-semibold uppercase tracking-wide text-muted hover:text-black"
              >
                Clear cart
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
