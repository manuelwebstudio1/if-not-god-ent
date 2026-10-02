"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback } from "react";
import { categories } from "@/data/categories";

export function CategoryCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className="bg-white py-14 lg:py-16">
      <div className="ing-container">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-black uppercase tracking-tight text-black sm:text-3xl">
            Shop By Category
          </h2>
          <Link
            href="/shop"
            className="shrink-0 text-xs font-bold uppercase tracking-wide text-gold hover:text-gold-dark"
          >
            View All Categories →
          </Link>
        </div>

        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/shop?category=${cat.slug}`}
                  className="group min-w-[72%] shrink-0 sm:min-w-[45%] md:min-w-[32%] lg:min-w-[23%]"
                >
                  <div className="overflow-hidden border border-neutral-200 bg-white transition-shadow group-hover:shadow-lg">
                    <div className="relative aspect-[4/3] bg-neutral-50">
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width:768px) 70vw, 25vw"
                      />
                    </div>
                    <div className="bg-black px-4 py-3">
                      <p className="text-sm font-bold uppercase tracking-wide text-white">
                        {cat.name}
                      </p>
                      <p className="mt-0.5 text-xs font-semibold text-gold">
                        {cat.productCount}+ Products
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={scrollPrev}
            className="absolute -left-2 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center bg-gold text-black shadow lg:flex"
            aria-label="Previous categories"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            className="absolute -right-2 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center bg-gold text-black shadow lg:flex"
            aria-label="Next categories"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
