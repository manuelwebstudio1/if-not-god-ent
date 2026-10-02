"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/product/product-card";
import { brands } from "@/data/brands";
import { categories } from "@/data/categories";
import { filterProducts, type ShopFilters } from "@/lib/catalog";

export function ShopClient() {
  const searchParams = useSearchParams();

  const filters: ShopFilters = useMemo(
    () => ({
      search: searchParams.get("search") ?? undefined,
      category: searchParams.get("category") ?? undefined,
      brand: searchParams.get("brand") ?? undefined,
      minPrice: searchParams.get("minPrice")
        ? Number(searchParams.get("minPrice"))
        : undefined,
      maxPrice: searchParams.get("maxPrice")
        ? Number(searchParams.get("maxPrice"))
        : undefined,
      minRating: searchParams.get("minRating")
        ? Number(searchParams.get("minRating"))
        : undefined,
      inStock: searchParams.get("inStock") === "1",
      onSale: searchParams.get("onSale") === "1",
      isNew: searchParams.get("new") === "1",
      sort: (searchParams.get("sort") as ShopFilters["sort"]) ?? "featured",
    }),
    [searchParams],
  );

  const products = filterProducts(filters);

  return (
    <div className="ing-container py-10 lg:py-14">
      <div className="mb-8">
        <h1 className="text-3xl font-black uppercase tracking-tight">Shop</h1>
        <p className="mt-2 text-sm text-muted">
          Professional building, engineering and industrial equipment
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-6 border border-neutral-200 bg-white p-5 h-fit">
          <FilterForm filters={filters} />
        </aside>

        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted">
              <span className="font-semibold text-black">{products.length}</span>{" "}
              products
            </p>
            <SortSelect current={filters.sort ?? "featured"} />
          </div>

          {products.length === 0 ? (
            <p className="border border-dashed border-neutral-300 p-12 text-center text-sm text-muted">
              No products match your filters. Try adjusting your search.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SortSelect({ current }: { current: string }) {
  return (
    <form method="get" className="flex items-center gap-2">
      <label htmlFor="sort" className="text-xs font-semibold uppercase text-muted">
        Sort
      </label>
      <select
        id="sort"
        name="sort"
        defaultValue={current}
        onChange={(e) => e.currentTarget.form?.submit()}
        className="h-9 border border-neutral-300 bg-white px-2 text-sm outline-none focus:border-gold"
      >
        <option value="featured">Featured</option>
        <option value="newest">Newest</option>
        <option value="best-selling">Best Selling</option>
        <option value="rating">Highest Rated</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
      </select>
    </form>
  );
}

function FilterForm({ filters }: { filters: ShopFilters }) {
  return (
    <form method="get" className="space-y-5 text-sm">
      <div>
        <label className="text-xs font-bold uppercase tracking-wide">Category</label>
        <select
          name="category"
          defaultValue={filters.category ?? ""}
          className="mt-2 w-full border border-neutral-300 px-2 py-2 outline-none focus:border-gold"
        >
          <option value="">All</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs font-bold uppercase tracking-wide">Brand</label>
        <select
          name="brand"
          defaultValue={filters.brand ?? ""}
          className="mt-2 w-full border border-neutral-300 px-2 py-2 outline-none focus:border-gold"
        >
          <option value="">All</option>
          {brands.map((b) => (
            <option key={b.id} value={b.slug}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs font-bold uppercase">Min GH₵</label>
          <input
            name="minPrice"
            type="number"
            defaultValue={filters.minPrice ?? ""}
            className="mt-2 w-full border border-neutral-300 px-2 py-2 outline-none focus:border-gold"
          />
        </div>
        <div>
          <label className="text-xs font-bold uppercase">Max GH₵</label>
          <input
            name="maxPrice"
            type="number"
            defaultValue={filters.maxPrice ?? ""}
            className="mt-2 w-full border border-neutral-300 px-2 py-2 outline-none focus:border-gold"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-bold uppercase tracking-wide">Min Rating</label>
        <select
          name="minRating"
          defaultValue={filters.minRating?.toString() ?? ""}
          className="mt-2 w-full border border-neutral-300 px-2 py-2 outline-none focus:border-gold"
        >
          <option value="">Any</option>
          <option value="4">4+ Stars</option>
          <option value="4.5">4.5+ Stars</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="inStock" value="1" defaultChecked={filters.inStock} />
          In stock only
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="onSale" value="1" defaultChecked={filters.onSale} />
          On sale
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="new" value="1" defaultChecked={filters.isNew} />
          New arrivals
        </label>
      </div>

      <button
        type="submit"
        className="w-full bg-black py-2.5 text-xs font-bold uppercase tracking-wide text-white hover:bg-neutral-900"
      >
        Apply Filters
      </button>
    </form>
  );
}
