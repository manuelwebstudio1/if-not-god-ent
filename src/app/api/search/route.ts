import { NextResponse } from "next/server";
import { searchProducts } from "@/lib/products/repository";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim();
  const category = searchParams.get("category");
  const limit = Number(searchParams.get("limit") ?? "12");

  if (!q) {
    return NextResponse.json({ products: [] });
  }

  let results = await searchProducts(q, Math.max(limit, 24));
  if (category && category !== "all") {
    results = results.filter((p) => p.categorySlug === category);
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
