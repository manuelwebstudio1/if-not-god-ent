export type ShopFilters = {
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
  onSale?: boolean;
  isNew?: boolean;
  sort?:
    | "featured"
    | "newest"
    | "best-selling"
    | "rating"
    | "price-asc"
    | "price-desc";
};

export function parseShopFilters(
  params: Record<string, string | string[] | undefined>,
): ShopFilters {
  const get = (key: string) => {
    const v = params[key];
    return Array.isArray(v) ? v[0] : v;
  };
  return {
    search: get("search") ?? undefined,
    category: get("category") ?? undefined,
    brand: get("brand") ?? undefined,
    minPrice: get("minPrice") ? Number(get("minPrice")) : undefined,
    maxPrice: get("maxPrice") ? Number(get("maxPrice")) : undefined,
    minRating: get("minRating") ? Number(get("minRating")) : undefined,
    inStock: get("inStock") === "1",
    onSale: get("onSale") === "1",
    isNew: get("new") === "1",
    sort: (get("sort") as ShopFilters["sort"]) ?? "featured",
  };
}
