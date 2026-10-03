import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import { getProductById } from "@/lib/products/repository";

type Props = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  let product;
  try {
    product = await getProductById(id);
  } catch {
    notFound();
  }

  const { data: row } = await createSupabaseAdmin()
    .from("products")
    .select("category_id, subcategory_id, brand_id, images")
    .eq("id", id)
    .single();

  return (
    <div>
      <h1 className="text-xl font-black uppercase">Edit product</h1>
      <div className="mt-6 border border-neutral-200 bg-white p-6">
        <ProductForm
          product={product}
          productDb={{
            categoryId: row?.category_id ?? "",
            subcategoryId: row?.subcategory_id ?? null,
            brandId: row?.brand_id ?? "",
            images: row?.images ?? product.images,
          }}
        />
      </div>
    </div>
  );
}
