import Link from "next/link";
import { brands } from "@/data/brands";

export function BrandsSection() {
  return (
    <section className="border-y border-neutral-200 bg-white py-12">
      <div className="ing-container">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-2xl font-black uppercase tracking-tight">
            Shop By Brand
          </h2>
          <Link
            href="/brands"
            className="text-xs font-bold uppercase tracking-wide text-gold"
          >
            View All →
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/brands/${brand.slug}`}
              className="flex h-20 min-w-[140px] shrink-0 items-center justify-center border border-neutral-200 bg-neutral-50 px-6 text-sm font-black tracking-widest text-neutral-800 transition-colors hover:border-gold hover:text-black"
            >
              {brand.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
