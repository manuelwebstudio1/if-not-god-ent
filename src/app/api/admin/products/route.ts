import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/admin/require-admin";
import { createProduct, listProducts } from "@/lib/products/repository";

const schema = z.object({
  name: z.string().min(2),
  slug: z.string().optional(),
  sku: z.string().min(2).optional(),
  categoryId: z.string().uuid(),
  subcategoryId: z.string().uuid().nullable().optional(),
  brandId: z.string().uuid().nullable().optional(),
  price: z.number().nonnegative(),
  compareAtPrice: z.number().nonnegative().nullable().optional(),
  stock: z.number().int().nonnegative(),
  images: z.array(z.string()).min(1),
  shortDescription: z.string(),
  description: z.string(),
  features: z.array(z.string()),
  specifications: z.record(z.string(), z.string()),
  warranty: z.string().optional(),
  shippingInfo: z.string().optional(),
  isFeatured: z.boolean(),
  isAvailable: z.boolean(),
  isNew: z.boolean().optional(),
  isBestSeller: z.boolean().optional(),
});

export async function GET() {
  try {
    await requireAdminSession();
    const adminProducts = await listProducts({ admin: true });
    const products = adminProducts.length ? adminProducts : await listProducts();
    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdminSession();
    const body = schema.parse(await request.json());
    const product = await createProduct(body);
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create product";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
