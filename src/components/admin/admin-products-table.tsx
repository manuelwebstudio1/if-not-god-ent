"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DeleteProductButton } from "@/components/admin/delete-product-button";
import { buttonVariants } from "@/components/ui/button";
import { formatPrice, cn } from "@/lib/utils";
import { PackagePlus } from "lucide-react";

type AdminProduct = {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  isFeatured: boolean;
};

export function AdminProductsTable() {
  const [products, setProducts] = useState<AdminProduct[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const fromAdmin = await fetch("/api/admin/products", { cache: "no-store" })
        .then((res) => (res.ok ? res.json() : null))
        .catch(() => null);
      const adminList = Array.isArray(fromAdmin?.products) ? fromAdmin.products : [];
      if (!cancelled && adminList.length) {
        setProducts(adminList);
        return;
      }

      const fromStore = await fetch("/api/products", { cache: "no-store" })
        .then((res) => (res.ok ? res.json() : null))
        .catch(() => null);
      const storeList = Array.isArray(fromStore?.products) ? fromStore.products : [];
      if (!cancelled) setProducts(storeList);
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (products === null) {
    return (
      <div className="border border-neutral-200 bg-white px-4 py-16 text-center text-sm text-muted">
        Loading products…
      </div>
    );
  }

  return (
    <div className="overflow-hidden border border-neutral-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-xs font-bold uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-16 text-center">
                  <p className="font-semibold text-black">No products yet</p>
                  <p className="mt-1 text-sm text-muted">
                    Add your first product to start selling on the storefront.
                  </p>
                  <Link
                    href="/admin/products/new"
                    prefetch={false}
                    className={cn(buttonVariants({ size: "sm" }), "mt-4 inline-flex")}
                  >
                    <PackagePlus className="h-4 w-4" />
                    Add product
                  </Link>
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="border-b border-neutral-100 hover:bg-neutral-50/80">
                  <td className="px-4 py-3 font-semibold">{p.name}</td>
                  <td className="px-4 py-3 text-muted">{p.category}</td>
                  <td className="px-4 py-3">
                    {p.stock <= 0 ? (
                      <span className="text-xs font-bold uppercase text-red-600">Out of stock</span>
                    ) : (
                      <span>{p.stock}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-semibold">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3">{p.isFeatured ? "Yes" : "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/admin/products/${p.id}/edit`}
                        prefetch={false}
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
