import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ProductForm } from "@/components/admin/product-form";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default function NewProductPage() {
  const configured = isSupabaseConfigured();

  return (
    <>
      <AdminPageHeader
        title="Add product"
        description="Create a new catalog item for the IF NOT GOD ENT storefront. All fields marked with * are required."
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Products", href: "/admin/products" },
          { label: "Add product" },
        ]}
        actions={
          <Link href="/admin/products" prefetch={false} className={cn(buttonVariants({ variant: "outlineDark", size: "sm" }))}>
            View all products
          </Link>
        }
      />
      <div className="p-6 lg:p-8">
        {!configured ? (
          <div className="border border-amber-200 bg-amber-50 p-6 text-sm text-amber-950">
            <p className="font-semibold">Supabase not configured</p>
            <p className="mt-2">
              Add <code className="text-xs">NEXT_PUBLIC_SUPABASE_URL</code> and your Supabase keys to{" "}
              <code className="text-xs">.env.local</code>, then restart the dev server before adding products.
            </p>
          </div>
        ) : (
          <ProductForm />
        )}
      </div>
    </>
  );
}
