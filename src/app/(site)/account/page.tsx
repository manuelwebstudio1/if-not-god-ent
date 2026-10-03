import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { listOrders } from "@/lib/local-db";
import { listProducts } from "@/lib/products/repository";

export default async function AccountPage() {
  const session = await getSession();
  if (!session) redirect("/account/login");

  const orders = (await listOrders()).filter(
    (o) => o.email.toLowerCase() === session.email.toLowerCase(),
  );
  const recentProducts = await listProducts({ limit: 4 });

  return (
    <div className="ing-container py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase">My Account</h1>
          <p className="mt-1 text-sm text-muted">
            Welcome, {session.name} ({session.email})
          </p>
        </div>
        <Link
          href="/api/auth/logout"
          className="text-xs font-bold uppercase tracking-wide text-muted hover:text-black"
        >
          Sign Out
        </Link>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <nav className="space-y-2 border border-neutral-200 bg-white p-4 text-sm lg:col-span-1">
          {[
            ["/account", "Overview"],
            ["/account/wishlist", "Wishlist"],
            ["/track-order", "Track Order"],
            ["/account/addresses", "Addresses"],
            ["/account/notifications", "Notifications"],
          ].map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="block border-b border-neutral-100 py-2 font-semibold hover:text-gold-dark"
            >
              {label}
            </Link>
          ))}
          {session.role === "ADMIN" && (
            <Link href="/admin" className="block py-2 font-bold text-gold-dark">
              Admin Dashboard →
            </Link>
          )}
        </nav>

        <div className="lg:col-span-2 space-y-8">
          <section className="border border-neutral-200 bg-white p-6">
            <h2 className="text-sm font-black uppercase">Recent Orders</h2>
            {orders.length === 0 ? (
              <p className="mt-3 text-sm text-muted">No orders yet.</p>
            ) : (
              <ul className="mt-4 space-y-3 text-sm">
                {orders.slice(0, 5).map((o) => (
                  <li key={o.orderNumber} className="flex justify-between border-b pb-2">
                    <span>{o.orderNumber}</span>
                    <span className="font-semibold">{o.status.replaceAll("_", " ")}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="border border-neutral-200 bg-white p-6">
            <h2 className="text-sm font-black uppercase">Recently Viewed Products</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {recentProducts.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/shop/${p.categorySlug}/${p.slug}`}
                    className="hover:text-gold-dark"
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
