import { ShopClient } from "@/components/shop/shop-client";
import { parseShopFilters } from "@/lib/catalog";
import {
  filterProducts,
  listCategoriesWithCounts,
} from "@/lib/products/repository";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse building materials, water pumps and machines from IF NOT GOD ENT.",
};

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ShopPage({ searchParams }: Props) {
  const params = await searchParams;
  const filters = parseShopFilters(params);
  const [products, categories] = await Promise.all([
    filterProducts(filters),
    listCategoriesWithCounts().catch(() => []),
  ]);

  return (
    <ShopClient
      products={products}
      categories={categories}
      filters={filters}
    />
  );
}
