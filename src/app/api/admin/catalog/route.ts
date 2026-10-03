import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/require-admin";
import {
  listBrands,
  listCategories,
  listSubcategories,
} from "@/lib/products/repository";

export async function GET(request: Request) {
  try {
    await requireAdminSession();
    const categoryId = new URL(request.url).searchParams.get("categoryId");
    const [categories, brands, subcategories] = await Promise.all([
      listCategories(),
      listBrands(),
      listSubcategories(categoryId ?? undefined),
    ]);
    return NextResponse.json({ categories, brands, subcategories });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
