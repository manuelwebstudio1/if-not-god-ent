"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@/types/commerce";
import { useWishlistStore } from "@/stores/wishlist-store";

export default function WishlistPage() {
  const ids = useWishlistStore((s) => s.ids);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ids.length === 0) {
      setProducts([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    void fetch(`/api/products?ids=${encodeURIComponent(ids.join(","))}`)
      .then((r) => r.json())
      .then((data: { products?: Product[] }) => {
        if (!cancelled) setProducts(data.products ?? []);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [ids]);

  return (
    <div className="ing-container py-12">
      <h1 className="text-3xl font-black uppercase">Wishlist</h1>
      {loading ? (
        <p className="mt-4 text-sm text-muted">Loading saved products…</p>
      ) : products.length === 0 ? (
        <p className="mt-4 text-sm text-muted">Save products to compare and buy later.</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
