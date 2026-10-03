import { ShopClient } from "@/components/shop/shop-client";
import { parseShopFilters } from "@/lib/catalog";
import {
  filterProducts,
  listBrandsForStore,
  listCategoriesWithCounts,
} from "@/lib/products/repository";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse premium building materials, power tools, plumbing supplies and industrial equipment.",
};

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ShopPage({ searchParams }: Props) {
  const params = await searchParams;
  const filters = parseShopFilters(params);
  const [products, categories, brands] = await Promise.all([
    filterProducts(filters),
    listCategoriesWithCounts(),
    listBrandsForStore(),
  ]);

  return (
    <ShopClient
      products={products}
      categories={categories}
      brands={brands}
      filters={filters}
    />
  );
}
