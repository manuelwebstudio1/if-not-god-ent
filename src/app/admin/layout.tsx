import Link from "next/link";
import { getSession } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-neutral-100">
      <header className="border-b border-neutral-200 bg-black text-white">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <Link href="/admin" className="text-sm font-black uppercase tracking-widest">
            ING Admin
          </Link>
          <div className="flex items-center gap-4 text-xs">
            <span>{session?.email}</span>
            <Link href="/" className="text-gold hover:underline">
              View Site
            </Link>
            <Link href="/api/auth/logout" className="hover:underline">
              Sign Out
            </Link>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[220px_1fr]">
        <aside className="h-fit space-y-1 border border-neutral-200 bg-white p-3 text-sm">
          {[
            ["/admin", "Overview"],
            ["/admin/products", "Products"],
            ["/admin/orders", "Orders"],
            ["/admin/quotes", "Quote Requests"],
            ["/admin/customers", "Customers"],
            ["/admin/inventory", "Inventory"],
            ["/admin/settings", "Settings"],
          ].map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="block px-2 py-2 font-medium hover:bg-neutral-50 hover:text-gold-dark"
            >
              {label}
            </Link>
          ))}
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
