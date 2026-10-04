import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/admin/require-admin";
import {
  createBrand,
  createCategory,
  createSubcategory,
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

const createSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("category"),
    name: z.string().min(2),
    slug: z.string().optional(),
    image: z.string().optional(),
  }),
  z.object({
    type: z.literal("brand"),
    name: z.string().min(2),
    slug: z.string().optional(),
  }),
  z.object({
    type: z.literal("subcategory"),
    name: z.string().min(2),
    slug: z.string().optional(),
    categoryId: z.string().uuid(),
  }),
]);

export async function POST(request: Request) {
  try {
    await requireAdminSession();
    const body = createSchema.parse(await request.json());
    if (body.type === "category") {
      return NextResponse.json(
        { item: await createCategory(body) },
        { status: 201 },
      );
    }
    if (body.type === "brand") {
      return NextResponse.json({ item: await createBrand(body) }, { status: 201 });
    }
    return NextResponse.json(
      { item: await createSubcategory(body) },
      { status: 201 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Save failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
