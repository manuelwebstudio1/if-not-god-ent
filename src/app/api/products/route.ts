import { NextResponse } from "next/server";
import { getProductsByIds, listProducts } from "@/lib/products/repository";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ids = searchParams.get("ids");
  if (ids) {
    const list = await getProductsByIds(ids.split(",").filter(Boolean));
    return NextResponse.json({ products: list });
  }
  const featured = searchParams.get("featured") === "1";
  const products = await listProducts({ featured, limit: featured ? 12 : undefined });
  return NextResponse.json({ products });
}
