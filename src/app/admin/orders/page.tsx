import { listOrders } from "@/lib/local-db";
import { formatPrice } from "@/lib/utils";

export default async function AdminOrdersPage() {
  const orders = await listOrders();

  return (
    <div>
      <h1 className="text-xl font-black uppercase">Orders</h1>
      <div className="mt-6 overflow-x-auto border border-neutral-200 bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b bg-neutral-50 text-xs uppercase">
            <tr>
              <th className="p-3">Order</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Status</th>
              <th className="p-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.orderNumber} className="border-b">
                <td className="p-3 font-mono text-xs">{o.orderNumber}</td>
                <td className="p-3">{o.customerName}</td>
                <td className="p-3">{o.status.replaceAll("_", " ")}</td>
                <td className="p-3 font-semibold">{formatPrice(o.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
