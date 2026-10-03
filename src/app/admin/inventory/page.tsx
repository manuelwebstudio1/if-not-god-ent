import Link from "next/link";
import { listProductsForAdminInventory } from "@/lib/products/repository";

export default async function AdminInventoryPage() {
  const products = await listProductsForAdminInventory();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-xl font-black uppercase">Inventory</h1>
        <Link
          href="/admin/products"
          className="text-xs font-bold uppercase tracking-wide text-gold hover:text-gold-dark"
        >
          Manage products →
        </Link>
      </div>
      <p className="mt-2 text-sm text-muted">
        Stock levels sync from Supabase. Edit products in the catalog admin.
      </p>
      {products.length === 0 ? (
        <p className="mt-6 text-sm text-muted">No products in catalog yet.</p>
      ) : (
        <ul className="mt-6 space-y-2 text-sm">
          {products.map((p) => (
            <li
              key={p.id}
              className="flex justify-between border border-neutral-200 bg-white px-4 py-3"
            >
              <span>{p.name}</span>
              <span className={p.stock <= 0 ? "font-bold text-red-600" : "font-semibold"}>
                {p.stock <= 0 ? "OUT OF STOCK" : `${p.stock} units`}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
