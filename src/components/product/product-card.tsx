"use client";

import { Eye, Heart, MessageCircle, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import type { Product } from "@/types/commerce";
import { PLACEHOLDER_PRODUCT_IMAGE } from "@/lib/products/defaults";
import { cn, formatPrice } from "@/lib/utils";
import { buildProductWhatsAppMessage, openWhatsApp } from "@/lib/whatsapp";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const inWishlist = useWishlistStore((s) => s.has(product.id));
  const [quickOpen, setQuickOpen] = useState(false);
  const outOfStock = product.stock <= 0 || product.isAvailable === false;
  const imageSrc = product.images[0] || PLACEHOLDER_PRODUCT_IMAGE;
  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(
          ((product.compareAtPrice - product.price) / product.compareAtPrice) *
            100,
        )
      : null;

  return (
    <>
      <article className="group flex h-full flex-col border border-neutral-200 bg-white transition-shadow hover:shadow-lg">
        <div className="relative aspect-square overflow-hidden bg-neutral-50">
          {product.isNew && (
            <span className="absolute left-0 top-0 z-10 bg-gold px-2 py-1 text-[10px] font-bold uppercase text-black">
              New
            </span>
          )}
          {discount !== null && (
            <span className="absolute left-0 top-8 z-10 bg-black px-2 py-1 text-[10px] font-bold uppercase text-gold">
              -{discount}%
            </span>
          )}
          <Link href={`/shop/${product.categorySlug}/${product.slug}`}>
            <Image
              src={imageSrc}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width:768px) 50vw, 25vw"
            />
          </Link>
          <button
            type="button"
            onClick={() => setQuickOpen(true)}
            className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center bg-white/95 opacity-0 shadow transition-opacity group-hover:opacity-100"
            aria-label="Quick view"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-1 flex-col p-4">
          <p className="text-[10px] font-bold uppercase tracking-wide text-muted">
            {product.brand}
          </p>
          <Link
            href={`/shop/${product.categorySlug}/${product.slug}`}
            className="mt-1 line-clamp-2 text-sm font-bold leading-snug text-black hover:text-gold-dark"
          >
            {product.name}
          </Link>
          <p className="mt-1 text-xs text-muted">SKU: {product.sku}</p>

          <div className="mt-2 flex items-center gap-1 text-xs">
            <Star className="h-3.5 w-3.5 fill-gold text-gold" />
            <span className="font-semibold">{product.rating.toFixed(1)}</span>
            <span className="text-muted">({product.reviewCount})</span>
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-lg font-bold">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-xs text-muted line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          <p
            className={cn(
              "mt-2 text-xs font-semibold uppercase",
              outOfStock ? "text-red-600" : "text-green-700",
            )}
          >
            {outOfStock ? "Out of Stock" : "In Stock"}
          </p>

          <div className="mt-auto flex gap-2 pt-4">
            <button
              type="button"
              disabled={outOfStock}
              onClick={() => addItem(product)}
              className={cn(
                buttonVariants({ variant: "outlineDark", size: "sm" }),
                "flex-1 text-[11px]",
              )}
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </button>
            <button
              type="button"
              onClick={() => toggleWishlist(product)}
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center border border-neutral-300",
                inWishlist && "border-gold text-gold",
              )}
              aria-label="Wishlist"
            >
              <Heart className={cn("h-4 w-4", inWishlist && "fill-gold")} />
            </button>
            <button
              type="button"
              onClick={() =>
                openWhatsApp(buildProductWhatsAppMessage(product))
              }
              className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#25D366] text-white"
              aria-label="Ask on WhatsApp"
            >
              <MessageCircle className="h-4 w-4" />
            </button>
          </div>
        </div>
      </article>

      {quickOpen && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center p-4 sm:items-center">
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            onClick={() => setQuickOpen(false)}
            aria-label="Close quick view"
          />
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto bg-white p-6 shadow-2xl">
            <p className="text-xs font-bold uppercase text-muted">{product.brand}</p>
            <h3 className="mt-1 text-xl font-bold">{product.name}</h3>
            <p className="mt-2 text-sm text-muted">{product.shortDescription}</p>
            <p className="mt-4 text-2xl font-bold">{formatPrice(product.price)}</p>
            <div className="mt-4 flex gap-2">
              <Link
                href={`/shop/${product.categorySlug}/${product.slug}`}
                className={cn(buttonVariants(), "flex-1 text-center")}
                onClick={() => setQuickOpen(false)}
              >
                View Details
              </Link>
              <button
                type="button"
                disabled={outOfStock}
                onClick={() => {
                  addItem(product);
                  setQuickOpen(false);
                }}
                className={cn(buttonVariants({ variant: "outlineDark" }), "flex-1")}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
