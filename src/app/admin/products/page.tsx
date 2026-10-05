import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminProductsTable } from "@/components/admin/admin-products-table";
import { buttonVariants } from "@/components/ui/button";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import { PackagePlus } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminProductsPage() {
  const configured = isSupabaseConfigured();

  return (
    <>
      <AdminPageHeader
        title="Products"
        description="Manage your equipment catalog, pricing, and stock levels."
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Products" },
        ]}
        actions={
          <Link href="/admin/products/new" prefetch={false} className={cn(buttonVariants({ size: "sm" }))}>
            <PackagePlus className="h-4 w-4" />
            Add product
          </Link>
        }
      />
      <div className="p-6 lg:p-8">
        {!configured ? (
          <div className="mb-4 border border-amber-200 bg-amber-50 p-4 text-sm">
            Supabase keys are missing in this server environment. The table will
            still load any published catalog items from the live API.
          </div>
        ) : null}
        <AdminProductsTable />
      </div>
    </>
  );
}
