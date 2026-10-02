import { ShopClient } from "@/components/shop/shop-client";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse premium building materials, power tools, plumbing supplies and industrial equipment.",
};

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="ing-container py-20 text-center text-sm text-muted">
          Loading products…
        </div>
      }
    >
      <ShopClient />
    </Suspense>
  );
}
