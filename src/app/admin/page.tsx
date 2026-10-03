import { listOrders, listQuotes } from "@/lib/local-db";
import {
  countProducts,
  listLowStockProducts,
  listProducts,
} from "@/lib/products/repository";

export default async function AdminDashboardPage() {
  const orders = await listOrders();
  const quotes = await listQuotes();
  const totalSales = orders.reduce((s, o) => s + o.total, 0);
  const lowStock = await listLowStockProducts(5);
  const pendingOrders = orders.filter((o) => o.status === "ORDER_RECEIVED");
  const productCount = await countProducts(true);

  const stats = [
    { label: "Total Sales", value: `GH₵${totalSales.toFixed(2)}` },
    { label: "Total Orders", value: orders.length },
    { label: "Quote Requests", value: quotes.length },
    { label: "Products", value: productCount },
    { label: "Low Stock", value: lowStock.length },
    { label: "Pending Orders", value: pendingOrders.length },
  ];

  const recentProducts = await listProducts({ admin: true, limit: 5 });

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-black uppercase">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="border border-neutral-200 bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-muted">
              {s.label}
            </p>
            <p className="mt-2 text-2xl font-black">{s.value}</p>
          </div>
        ))}
      </div>

      <section className="border border-neutral-200 bg-white p-5">
        <h2 className="text-sm font-black uppercase">Sales Overview</h2>
        <div className="mt-4 flex h-40 items-end gap-2">
          {orders.slice(0, 7).reverse().map((o) => (
            <div key={o.orderNumber} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full bg-gold"
                style={{
                  height: `${Math.min(100, (o.total / Math.max(totalSales, 1)) * 100)}%`,
                  minHeight: "8px",
                }}
              />
              <span className="text-[10px] text-muted">{o.orderNumber.slice(-4)}</span>
            </div>
          ))}
        </div>
      </section>

      {recentProducts.length > 0 && (
        <section className="border border-neutral-200 bg-white p-5">
          <h2 className="text-sm font-black uppercase">Recent catalog updates</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {recentProducts.map((p) => (
              <li key={p.id} className="flex justify-between border-b border-neutral-100 pb-2">
                <span>{p.name}</span>
                <span className="text-muted">{p.stock} in stock</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
