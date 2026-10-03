import Link from "next/link";
import { listBrandsForStore } from "@/lib/products/repository";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brands",
  description: "Shop trusted construction and engineering brands at IF NOT GOD ENT.",
};

export default async function BrandsPage() {
  const brands = await listBrandsForStore();

  return (
    <div className="ing-container py-12">
      <h1 className="text-3xl font-black uppercase">Shop By Brand</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Genuine tools and equipment from leading international manufacturers.
      </p>
      {brands.length === 0 ? (
        <p className="mt-10 text-sm text-muted">
          Brands will appear here once added in the admin catalog.
        </p>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/brands/${brand.slug}`}
              className="flex h-28 items-center justify-center border border-neutral-200 bg-white text-lg font-black tracking-widest transition-colors hover:border-gold"
            >
              {brand.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
