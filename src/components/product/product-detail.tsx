"use client";

import { Heart, MessageCircle, Minus, Plus, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ProductCard } from "@/components/product/product-card";
import { buttonVariants } from "@/components/ui/button";
import type { Product } from "@/types/commerce";
import { cn, formatPrice } from "@/lib/utils";
import { buildProductWhatsAppMessage, openWhatsApp } from "@/lib/whatsapp";
import { getRelatedProducts } from "@/data/products";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";

export function ProductDetail({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [zoom, setZoom] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const inWishlist = useWishlistStore((s) => s.has(product.id));
  const outOfStock = product.stock <= 0;
  const related = getRelatedProducts(product);

  return (
    <div className="ing-container py-8 lg:py-12">
      <nav className="mb-6 text-xs text-muted">
        <Link href="/" className="hover:text-gold-dark">
          Home
        </Link>
        {" / "}
        <Link href="/shop" className="hover:text-gold-dark">
          Shop
        </Link>
        {" / "}
        <Link
          href={`/shop?category=${product.categorySlug}`}
          className="hover:text-gold-dark"
        >
          {product.category}
        </Link>
        {" / "}
        <span className="text-black">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <button
            type="button"
            className="relative aspect-square w-full overflow-hidden border border-neutral-200 bg-neutral-50"
            onClick={() => setZoom(true)}
          >
            <Image
              src={product.images[activeImage]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
              sizes="(max-width:1024px) 100vw, 50vw"
              priority
            />
          </button>
          <div className="mt-3 flex gap-2 overflow-x-auto">
            {product.images.map((img, i) => (
              <button
                key={img}
                type="button"
                onClick={() => setActiveImage(i)}
                className={cn(
                  "relative h-20 w-20 shrink-0 border",
                  i === activeImage ? "border-gold" : "border-neutral-200",
                )}
              >
                <Image src={img} alt="" fill className="object-cover" sizes="80px" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-muted">
            {product.brand}
          </p>
          <h1 className="mt-2 text-3xl font-black uppercase tracking-tight">
            {product.name}
          </h1>
          <p className="mt-2 text-sm text-muted">SKU: {product.sku}</p>

          <div className="mt-3 flex items-center gap-2 text-sm">
            <Star className="h-4 w-4 fill-gold text-gold" />
            <span className="font-semibold">{product.rating.toFixed(1)}</span>
            <span className="text-muted">({product.reviewCount} reviews)</span>
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-3xl font-black">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-lg text-muted line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          <p
            className={cn(
              "mt-3 text-sm font-bold uppercase",
              outOfStock ? "text-red-600" : "text-green-700",
            )}
          >
            {outOfStock ? "Out of Stock" : `${product.stock} units available`}
          </p>

          <p className="mt-4 text-sm leading-relaxed text-neutral-700">
            {product.shortDescription}
          </p>

          <div className="mt-6 flex items-center gap-3">
            <span className="text-xs font-bold uppercase">Qty</span>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center border border-neutral-300"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-8 text-center font-semibold">{qty}</span>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center border border-neutral-300"
              onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
              disabled={outOfStock}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              disabled={outOfStock}
              onClick={() => addItem(product, qty)}
              className={cn(buttonVariants(), "w-full")}
            >
              Add to Cart
            </button>
            <Link
              href="/checkout"
              className={cn(
                buttonVariants({ variant: "dark" }),
                "w-full text-center",
                outOfStock && "pointer-events-none opacity-50",
              )}
              onClick={() => !outOfStock && addItem(product, qty)}
            >
              Buy Now
            </Link>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => toggleWishlist(product)}
              className={cn(
                buttonVariants({ variant: "outlineDark", size: "sm" }),
                inWishlist && "border-gold text-gold",
              )}
            >
              <Heart className={cn("h-4 w-4", inWishlist && "fill-gold")} />
              Wishlist
            </button>
            <button
              type="button"
              onClick={() =>
                openWhatsApp(buildProductWhatsAppMessage(product))
              }
              className="inline-flex h-9 items-center gap-2 bg-[#25D366] px-4 text-xs font-bold uppercase text-white"
            >
              <MessageCircle className="h-4 w-4" />
              Ask on WhatsApp
            </button>
          </div>
        </div>
      </div>

      <section className="mt-14 grid gap-8 border-t border-neutral-200 pt-10 lg:grid-cols-2">
        <div>
          <h2 className="text-lg font-black uppercase">Description</h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-700">
            {product.description}
          </p>
          <h3 className="mt-8 text-sm font-black uppercase">Features</h3>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-neutral-700">
            {product.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-lg font-black uppercase">Specifications</h2>
          <dl className="mt-3 divide-y divide-neutral-200 border border-neutral-200 text-sm">
            {Object.entries(product.specifications).map(([k, v]) => (
              <div key={k} className="grid grid-cols-2 gap-2 px-3 py-2">
                <dt className="font-semibold text-muted">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <h3 className="mt-8 text-sm font-black uppercase">Shipping</h3>
          <p className="mt-2 text-sm text-neutral-700">{product.shippingInfo}</p>
          <h3 className="mt-6 text-sm font-black uppercase">Warranty</h3>
          <p className="mt-2 text-sm text-neutral-700">{product.warranty}</p>
        </div>
      </section>

      <section className="mt-14 border-t border-neutral-200 pt-10">
        <h2 className="text-lg font-black uppercase">Customer Reviews</h2>
        <div className="mt-4 space-y-4">
          {[
            {
              name: "Kwame A.",
              text: "Solid build quality and fast delivery to Kumasi. Exactly as described.",
              rating: 5,
            },
            {
              name: "Abena M.",
              text: "Professional support helped us choose the right model for our site.",
              rating: 5,
            },
          ].map((review) => (
            <article
              key={review.name}
              className="border border-neutral-200 bg-white p-4 text-sm"
            >
              <div className="flex items-center gap-1 text-gold">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-gold" />
                ))}
              </div>
              <p className="mt-2 text-neutral-700">{review.text}</p>
              <p className="mt-2 text-xs font-semibold">{review.name}</p>
            </article>
          ))}
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-14 border-t border-neutral-200 pt-10">
          <h2 className="text-lg font-black uppercase">Related Products</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {zoom && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/90 p-4"
          role="dialog"
        >
          <button
            type="button"
            className="absolute inset-0"
            aria-label="Close zoom"
            onClick={() => setZoom(false)}
          />
          <div className="relative h-[min(80vh,800px)] w-full max-w-4xl">
            <Image
              src={product.images[activeImage]}
              alt={product.name}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </div>
      )}
    </div>
  );
}
