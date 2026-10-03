import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/admin/require-admin";
import {
  deleteProduct,
  getProductById,
  updateProduct,
} from "@/lib/products/repository";

const schema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().optional(),
  sku: z.string().min(2).optional(),
  categoryId: z.string().uuid().optional(),
  subcategoryId: z.string().uuid().nullable().optional(),
  brandId: z.string().uuid().optional(),
  price: z.number().nonnegative().optional(),
  compareAtPrice: z.number().nonnegative().nullable().optional(),
  stock: z.number().int().nonnegative().optional(),
  images: z.array(z.string()).min(1).optional(),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  features: z.array(z.string()).optional(),
  specifications: z.record(z.string(), z.string()).optional(),
  warranty: z.string().optional(),
  shippingInfo: z.string().optional(),
  isFeatured: z.boolean().optional(),
  isAvailable: z.boolean().optional(),
  isNew: z.boolean().optional(),
  isBestSeller: z.boolean().optional(),
});

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Ctx) {
  try {
    await requireAdminSession();
    const { id } = await params;
    const product = await getProductById(id);
    return NextResponse.json({ product });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function PATCH(request: Request, { params }: Ctx) {
  try {
    await requireAdminSession();
    const { id } = await params;
    const body = schema.parse(await request.json());
    const product = await updateProduct(id, body);
    return NextResponse.json({ product });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Update failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_request: Request, { params }: Ctx) {
  try {
    await requireAdminSession();
    const { id } = await params;
    await deleteProduct(id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 400 });
  }
}
