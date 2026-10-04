import type { Product } from "@/types/commerce";
import type { DbProductRow } from "./types";

function rel<T extends { name?: string; slug?: string }>(
  value: T | T[] | null | undefined,
) {
  return Array.isArray(value) ? value[0] : value;
}

export function mapRowToProduct(row: DbProductRow): Product {
  const category = rel(row.categories);
  const subcategory = rel(row.subcategories);
  const brand = rel(row.brands);
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    sku: row.sku,
    brand: brand?.name ?? "",
    brandSlug: brand?.slug ?? "",
    category: category?.name ?? "",
    categorySlug: category?.slug ?? "",
    subcategory: subcategory?.name,
    subcategorySlug: subcategory?.slug,
    price: Number(row.price),
    compareAtPrice:
      row.compare_at_price != null ? Number(row.compare_at_price) : undefined,
    rating: Number(row.rating),
    reviewCount: row.review_count,
    stock: row.stock,
    isNew: row.is_new,
    isFeatured: row.is_featured,
    isBestSeller: row.is_best_seller,
    isAvailable: row.is_available,
    images: row.images?.length ? row.images : ["/images/product-placeholder.svg"],
    shortDescription: row.short_description,
    description: row.description,
    features: row.features ?? [],
    specifications: row.specifications ?? {},
    warranty: row.warranty ?? "",
    shippingInfo: row.shipping_info ?? "",
  };
}
