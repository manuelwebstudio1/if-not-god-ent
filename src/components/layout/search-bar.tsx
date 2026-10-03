"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Category } from "@/types/commerce";
import { cn } from "@/lib/utils";

type Suggestion = {
  id: string;
  name: string;
  slug: string;
  categorySlug: string;
  brand: string;
  price: number;
};

export function SearchBar({
  className,
  categories = [],
}: {
  className?: string;
  categories?: Pick<Category, "id" | "name" | "slug">[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }
    const params = new URLSearchParams({ q, limit: "6" });
    if (category !== "all") params.set("category", category);
    const res = await fetch(`/api/search?${params}`);
    const data = (await res.json()) as { products: Suggestion[] };
    setSuggestions(data.products ?? []);
  }, [category]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      void fetchSuggestions(query);
    }, 250);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, fetchSuggestions]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setOpen(false);
    router.push(`/shop?search=${encodeURIComponent(q)}`);
  }

  return (
    <div ref={wrapRef} className={cn("relative w-full", className)}>
      <form
        onSubmit={submit}
        className="flex h-11 w-full overflow-hidden border border-neutral-700 bg-neutral-900 sm:h-12"
      >
        <label className="sr-only" htmlFor="site-search">
          Search products
        </label>
        <div className="relative hidden shrink-0 border-r border-neutral-700 sm:block">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-full appearance-none bg-neutral-900 pl-3 pr-8 text-xs font-medium uppercase tracking-wide text-neutral-300 outline-none"
            aria-label="Category filter"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <input
          id="site-search"
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search for products, brands..."
          className="min-w-0 flex-1 bg-transparent px-3 text-sm text-white placeholder:text-neutral-500 outline-none"
          autoComplete="off"
        />
        <button
          type="submit"
          className="flex shrink-0 items-center justify-center bg-gold px-4 text-black transition-colors hover:bg-gold-light"
          aria-label="Search"
        >
          <Search className="h-5 w-5" strokeWidth={2.25} />
        </button>
      </form>

      {open && suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 top-full z-50 mt-1 max-h-80 overflow-auto border border-neutral-200 bg-white shadow-xl">
          {suggestions.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm hover:bg-neutral-50"
                onClick={() => {
                  setOpen(false);
                  router.push(`/shop/${s.categorySlug}/${s.slug}`);
                }}
              >
                <span>
                  <span className="block font-semibold text-black">{s.name}</span>
                  <span className="text-xs text-muted">{s.brand}</span>
                </span>
                <span className="shrink-0 font-semibold text-black">
                  GH₵{s.price.toFixed(2)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
