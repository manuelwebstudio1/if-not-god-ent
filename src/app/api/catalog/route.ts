import { NextResponse } from "next/server";
import {
  listBrandsForStore,
  listCategoriesWithCounts,
} from "@/lib/products/repository";

export async function GET() {
  const [categories, brands] = await Promise.all([
    listCategoriesWithCounts(),
    listBrandsForStore(),
  ]);
  return NextResponse.json({ categories, brands });
}
