import { NextResponse } from "next/server";
import { products } from "@/data/products";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").toLowerCase().trim();
  const category = searchParams.get("category");
  const limit = Number(searchParams.get("limit") ?? "12");

  let results = products;

  if (category && category !== "all") {
    results = results.filter((p) => p.categorySlug === category);
  }

  if (q) {
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    );
  }

  return NextResponse.json({
    products: results.slice(0, limit).map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      categorySlug: p.categorySlug,
      brand: p.brand,
      price: p.price,
    })),
  });
}
