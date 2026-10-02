import type { Product } from "@/types/commerce";
import { products } from "@/data/products";

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

export function filterProducts(filters: ShopFilters): Product[] {
  let list = [...products];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    );
  }
  if (filters.category) {
    list = list.filter((p) => p.categorySlug === filters.category);
  }
  if (filters.brand) {
    list = list.filter((p) => p.brandSlug === filters.brand);
  }
  if (filters.minPrice != null) {
    list = list.filter((p) => p.price >= filters.minPrice!);
  }
  if (filters.maxPrice != null) {
    list = list.filter((p) => p.price <= filters.maxPrice!);
  }
  if (filters.minRating != null) {
    list = list.filter((p) => p.rating >= filters.minRating!);
  }
  if (filters.inStock) {
    list = list.filter((p) => p.stock > 0);
  }
  if (filters.onSale) {
    list = list.filter(
      (p) => p.compareAtPrice != null && p.compareAtPrice > p.price,
    );
  }
  if (filters.isNew) {
    list = list.filter((p) => p.isNew);
  }

  switch (filters.sort) {
    case "newest":
      list.sort((a, b) => Number(b.isNew) - Number(a.isNew));
      break;
    case "best-selling":
      list.sort((a, b) => Number(b.isBestSeller) - Number(a.isBestSeller));
      break;
    case "rating":
      list.sort((a, b) => b.rating - a.rating);
      break;
    case "price-asc":
      list.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      list.sort((a, b) => b.price - a.price);
      break;
    default:
      list.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
  }

  return list;
}
