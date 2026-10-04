import Link from "next/link";
import {
  AlertTriangle,
  FileText,
  PackagePlus,
  ShoppingCart,
  Users,
  Warehouse,
} from "lucide-react";
import { listCustomers, listOrders, listQuotes } from "@/lib/local-db";
import {
  countProducts,
  listLowStockProducts,
  listProducts,
} from "@/lib/products/repository";
import { formatPrice, cn } from "@/lib/utils";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function safe<T>(promise: Promise<T>, fallback: T): Promise<T> {
  try {
    return await promise;
  } catch {
    return fallback;
  }
}

export default async function AdminDashboardPage() {
  const session = await getSession();
  const [orders, quotes, customers, lowStock, productCount, recentProducts] =
    await Promise.all([
      safe(listOrders(), []),
      safe(listQuotes(), []),
      safe(listCustomers(), []),
      safe(listLowStockProducts(5), []),
      safe(countProducts(true), 0),
      safe(listProducts({ admin: true, limit: 6 }), []),
    ]);

  const totalSales = orders.reduce((s, o) => s + o.total, 0);
  const pendingOrders = orders.filter((o) => o.status === "ORDER_RECEIVED");
  const firstName = session?.name?.split(" ")[0] ?? "Admin";

  const kpis = [
    {
      label: "Revenue",
      value: formatPrice(totalSales),
      hint: `${orders.length} orders`,
      href: "/admin/orders",
    },
    {
      label: "Products",
      value: String(productCount),
      hint: "Live catalog items",
      href: "/admin/products",
    },
    {
      label: "Pending orders",
      value: String(pendingOrders.length),
      hint: "Awaiting processing",
      href: "/admin/orders",
    },
    {
      label: "Quote requests",
      value: String(quotes.length),
      hint: "Contractor enquiries",
      href: "/admin/quotes",
    },
  ];

  return (
    <div className="space-y-8 p-6 lg:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold-dark">
            IF NOT GOD ENT
          </p>
          <h1 className="mt-1 text-3xl font-black uppercase tracking-tight">
            Welcome, {firstName}
          </h1>
          <p className="mt-1 text-sm text-muted">
            Manage the catalog, fulfill orders and respond to project quotes.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          prefetch={false}
          className="inline-flex items-center gap-2 bg-gold px-5 py-3 text-xs font-bold uppercase tracking-wide text-black hover:bg-gold-light"
        >
          <PackagePlus className="h-4 w-4" />
          Add product
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <Link
            key={kpi.label}
            href={kpi.href}
            prefetch={false}
            className="border border-neutral-200 bg-white p-5 shadow-sm transition-colors hover:border-gold"
          >
            <p className="text-[11px] font-bold uppercase tracking-wide text-muted">
              {kpi.label}
            </p>
            <p className="mt-3 text-3xl font-black text-black">{kpi.value}</p>
            <p className="mt-1 text-xs text-muted">{kpi.hint}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Link
          href="/admin/products/new"
          prefetch={false}
          className="flex items-start gap-4 bg-black p-5 text-white hover:bg-neutral-900"
        >
          <span className="flex h-11 w-11 items-center justify-center bg-gold text-black">
            <PackagePlus className="h-5 w-5" />
          </span>
          <div>
            <p className="font-bold uppercase">Publish a product</p>
            <p className="mt-1 text-sm text-neutral-400">
              Name, images, GH₵ price, stock and WhatsApp inquiry.
            </p>
          </div>
        </Link>
        <Link
          href="/admin/inventory"
          prefetch={false}
          className="flex items-start gap-4 border border-neutral-200 bg-white p-5 hover:border-gold"
        >
          <span className="flex h-11 w-11 items-center justify-center bg-neutral-100 text-black">
            <Warehouse className="h-5 w-5" />
          </span>
          <div>
            <p className="font-bold uppercase">Inventory</p>
            <p className="mt-1 text-sm text-muted">
              {lowStock.length} item{lowStock.length === 1 ? "" : "s"} running low
            </p>
          </div>
        </Link>
        <Link
          href="/admin/customers"
          prefetch={false}
          className="flex items-start gap-4 border border-neutral-200 bg-white p-5 hover:border-gold"
        >
          <span className="flex h-11 w-11 items-center justify-center bg-neutral-100 text-black">
            <Users className="h-5 w-5" />
          </span>
          <div>
            <p className="font-bold uppercase">Customers</p>
            <p className="mt-1 text-sm text-muted">{customers.length} registered accounts</p>
          </div>
        </Link>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-black uppercase">Recent orders</h2>
            <Link
              href="/admin/orders"
              prefetch={false}
              className="text-xs font-bold uppercase text-gold-dark hover:underline"
            >
              View all
            </Link>
          </div>
          {orders.length === 0 ? (
            <div className="mt-8 flex items-center gap-3 text-sm text-muted">
              <ShoppingCart className="h-5 w-5" />
              No orders yet. New checkouts will appear here.
            </div>
          ) : (
            <ul className="mt-4 divide-y divide-neutral-100">
              {orders.slice(0, 6).map((o) => (
                <li key={o.orderNumber} className="flex items-center justify-between gap-4 py-3 text-sm">
                  <div>
                    <p className="font-semibold">{o.orderNumber}</p>
                    <p className="text-xs text-muted">{o.customerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{formatPrice(o.total)}</p>
                    <p className="text-[11px] uppercase text-muted">
                      {o.status.replaceAll("_", " ")}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-black uppercase">Catalog</h2>
            <Link
              href="/admin/products"
              prefetch={false}
              className="text-xs font-bold uppercase text-gold-dark hover:underline"
            >
              Manage
            </Link>
          </div>
          {recentProducts.length === 0 ? (
            <p className="mt-8 text-sm text-muted">
              No products yet.{" "}
              <Link
                href="/admin/products/new"
                prefetch={false}
                className="font-semibold text-gold-dark hover:underline"
              >
                Add the first product
              </Link>
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-neutral-100 text-sm">
              {recentProducts.map((p) => (
                <li key={p.id} className="flex items-center justify-between py-3">
                  <Link
                    href={`/admin/products/${p.id}/edit`}
                    prefetch={false}
                    className="font-medium hover:text-gold-dark"
                  >
                    {p.name}
                  </Link>
                  <span className={cn("text-xs font-semibold", p.stock <= 0 ? "text-red-600" : "text-muted")}>
                    {p.stock <= 0 ? "Out of stock" : `${p.stock} in stock`}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {lowStock.length > 0 && (
            <div className="mt-6 border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">
              <p className="flex items-center gap-2 font-semibold">
                <AlertTriangle className="h-4 w-4" />
                Low stock
              </p>
              <p className="mt-1 text-xs">
                {lowStock.map((p) => p.name).join(", ")}
              </p>
            </div>
          )}
        </section>
      </div>

      <section className="border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-black uppercase">
            <FileText className="h-4 w-4 text-gold-dark" />
            Quote requests
          </h2>
          <Link
            href="/admin/quotes"
            prefetch={false}
            className="text-xs font-bold uppercase text-gold-dark hover:underline"
          >
            Open inbox
          </Link>
        </div>
        {quotes.length === 0 ? (
          <p className="mt-4 text-sm text-muted">No contractor quotes waiting.</p>
        ) : (
          <ul className="mt-4 grid gap-3 md:grid-cols-2">
            {quotes.slice(0, 4).map((q) => (
              <li key={q.id} className="border border-neutral-100 p-3 text-sm">
                <p className="font-semibold">{q.name}</p>
                <p className="text-xs text-muted">{q.company || q.email}</p>
                <p className="mt-2 line-clamp-2 text-neutral-700">{q.products}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
