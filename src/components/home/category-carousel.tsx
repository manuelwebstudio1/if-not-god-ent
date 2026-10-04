import { listCategoriesWithCounts } from "@/lib/products/repository";
import { CategoryCarouselClient } from "./category-carousel-client";

export async function CategoryCarousel() {
  const categories = await listCategoriesWithCounts().catch(() => []);
  return <CategoryCarouselClient categories={categories} />;
}
