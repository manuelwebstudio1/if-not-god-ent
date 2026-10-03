import type { Product } from "@/types/commerce";
import type { DbProductRow } from "./types";

export function mapRowToProduct(row: DbProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    sku: row.sku,
    brand: row.brands?.name ?? "",
    brandSlug: row.brands?.slug ?? "",
    category: row.categories?.name ?? "",
    categorySlug: row.categories?.slug ?? "",
    subcategory: row.subcategories?.name,
    subcategorySlug: row.subcategories?.slug,
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
