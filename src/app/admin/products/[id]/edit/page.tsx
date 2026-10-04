import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ProductForm } from "@/components/admin/product-form";
import { buttonVariants } from "@/components/ui/button";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import { getProductById } from "@/lib/products/repository";
import { cn } from "@/lib/utils";

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
    .select("category_id, subcategory_id, images")
    .eq("id", id)
    .single();

  return (
    <>
      <AdminPageHeader
        title="Edit product"
        description={product.name}
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Products", href: "/admin/products" },
          { label: product.name },
        ]}
        actions={
          <Link
            href={`/shop/${product.categorySlug}/${product.slug}`}
            className={cn(buttonVariants({ variant: "outlineDark", size: "sm" }))}
            target="_blank"
          >
            View on site
          </Link>
        }
      />
      <div className="p-6 lg:p-8">
        <ProductForm
          product={product}
          productDb={{
            categoryId: row?.category_id ?? "",
            subcategoryId: row?.subcategory_id ?? null,
            images: row?.images ?? product.images,
          }}
        />
      </div>
    </>
  );
}
