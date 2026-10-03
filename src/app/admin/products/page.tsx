import Link from "next/link";
import { DeleteProductButton } from "@/components/admin/delete-product-button";
import { buttonVariants } from "@/components/ui/button";
import { listProducts } from "@/lib/products/repository";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { formatPrice, cn } from "@/lib/utils";

export default async function AdminProductsPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="rounded border border-amber-200 bg-amber-50 p-6 text-sm">
        Configure <code>NEXT_PUBLIC_SUPABASE_URL</code> and Supabase keys in{" "}
        <code>.env.local</code>, then run{" "}
        <code>supabase/migrations/001_products_catalog.sql</code> in your Supabase project.
      </div>
    );
  }

  const products = await listProducts({ admin: true });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-xl font-black uppercase">Products</h1>
        <Link href="/admin/products/new" className={cn(buttonVariants({ size: "sm" }))}>
          Add product
        </Link>
      </div>
      <div className="mt-6 overflow-x-auto border border-neutral-200 bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b bg-neutral-50 text-xs uppercase tracking-wide">
            <tr>
              <th className="p-3">Product</th>
              <th className="p-3">SKU</th>
              <th className="p-3">Category</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Price</th>
              <th className="p-3">Featured</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-muted">
                  No products yet. Add your first product.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="border-b">
                  <td className="p-3 font-semibold">{p.name}</td>
                  <td className="p-3">{p.sku}</td>
                  <td className="p-3">{p.category}</td>
                  <td className="p-3">
                    {p.stock <= 0 ? (
                      <span className="font-bold text-red-600">OUT OF STOCK</span>
                    ) : (
                      p.stock
                    )}
                  </td>
                  <td className="p-3">{formatPrice(p.price)}</td>
                  <td className="p-3">{p.isFeatured ? "Yes" : "—"}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/products/${p.id}/edit`}
                        className="text-xs font-bold uppercase text-gold-dark hover:underline"
                      >
                        Edit
                      </Link>
                      <DeleteProductButton id={p.id} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
