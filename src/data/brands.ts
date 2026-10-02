import type { Brand } from "@/types/commerce";

export const brands: Brand[] = [
  { id: "1", name: "INGCO", slug: "ingco" },
  { id: "2", name: "TOTAL", slug: "total" },
  { id: "3", name: "KOSHIN", slug: "koshin" },
  { id: "4", name: "TOLSEN", slug: "tolsen" },
  { id: "5", name: "STANLEY", slug: "stanley" },
  { id: "6", name: "BOSCH", slug: "bosch" },
  { id: "7", name: "DEWALT", slug: "dewalt" },
  { id: "8", name: "MAKITA", slug: "makita" },
  { id: "9", name: "MILWAUKEE", slug: "milwaukee" },
  { id: "10", name: "CATERPILLAR", slug: "caterpillar" },
];

export function getBrandBySlug(slug: string) {
  return brands.find((b) => b.slug === slug);
}
