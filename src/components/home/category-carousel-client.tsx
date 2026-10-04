"use client";

import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/types/commerce";

export function CategoryCarouselClient({ categories }: { categories: Category[] }) {
  if (!categories.length) {
    return (
      <section id="shop-by-category" className="scroll-mt-28 bg-white py-14 lg:py-16">
        <div className="ing-container">
          <h2 className="text-2xl font-black uppercase tracking-tight text-black sm:text-3xl">
            Shop By Category
          </h2>
          <p className="mt-4 text-sm text-muted">
            Categories will appear here once they are added in the admin catalog.
          </p>
        </div>
      </section>
    );
  }
  return (
    <section id="shop-by-category" className="scroll-mt-28 bg-white py-14 lg:py-16">
      <div className="ing-container">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.22em] text-gold">
              Our catalog
            </p>
            <h2 className="text-2xl font-black uppercase tracking-tight text-black sm:text-3xl">
              Shop By Category
            </h2>
          </div>
          <Link
            href="/shop"
            className="shrink-0 text-xs font-bold uppercase tracking-wide text-gold hover:text-gold-dark"
          >
            View All Products →
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/shop?category=${cat.slug}`} className="group">
              <article className="overflow-hidden border border-neutral-200 bg-white transition-all duration-300 group-hover:-translate-y-1 group-hover:border-gold group-hover:shadow-[0_18px_40px_rgba(0,0,0,0.12)]">
                <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width:640px) 100vw, 33vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-transparent opacity-80" />
                </div>
                <div className="relative bg-black px-5 py-4">
                  <span className="absolute left-0 top-0 h-full w-0.5 bg-gold" />
                  <p className="text-sm font-bold uppercase tracking-[0.14em] text-white">
                    {cat.name}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-gold">
                    {cat.productCount} {cat.productCount === 1 ? "Product" : "Products"}
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
