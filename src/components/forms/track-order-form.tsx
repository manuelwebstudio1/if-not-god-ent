"use client";

import { useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types/commerce";

const steps: OrderStatus[] = [
  "ORDER_RECEIVED",
  "PAYMENT_CONFIRMED",
  "PROCESSING",
  "READY_FOR_DELIVERY",
  "SHIPPED",
  "DELIVERED",
];

const labels: Record<OrderStatus, string> = {
  ORDER_RECEIVED: "Order Received",
  PAYMENT_CONFIRMED: "Payment Confirmed",
  PROCESSING: "Processing",
  READY_FOR_DELIVERY: "Ready for Delivery",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
};

export function TrackOrderForm() {
  const [orderNumber, setOrderNumber] = useState("");
  const [contact, setContact] = useState("");
  const [result, setResult] = useState<{
    status: OrderStatus;
    orderNumber: string;
    total: number;
  } | null>(null);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResult(null);
    const res = await fetch("/api/orders/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderNumber, contact }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Order not found");
      return;
    }
    setResult(data);
  }

  const activeIndex = result ? steps.indexOf(result.status) : -1;

  return (
    <div>
      <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
        <input
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          placeholder="Order number"
          className="h-11 flex-1 border border-neutral-300 px-3 text-sm outline-none focus:border-gold"
          required
        />
        <input
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="Phone or email"
          className="h-11 flex-1 border border-neutral-300 px-3 text-sm outline-none focus:border-gold"
          required
        />
        <button type="submit" className={cn(buttonVariants(), "shrink-0")}>
          Track
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {result && (
        <div className="mt-8 border border-neutral-200 bg-white p-6">
          <p className="text-sm font-semibold">{result.orderNumber}</p>
          <p className="mt-1 text-xs text-muted">
            Total: GH₵{result.total.toFixed(2)}
          </p>
          <ol className="mt-6 space-y-3">
            {steps.map((step, index) => {
              const done = index <= activeIndex;
              return (
                <li key={step} className="flex items-center gap-3 text-sm">
                  <span
                    className={cn(
                      "flex h-8 w-8 items-center justify-center text-xs font-bold",
                      done ? "bg-gold text-black" : "bg-neutral-200 text-neutral-500",
                    )}
                  >
                    {index + 1}
                  </span>
                  <span className={done ? "font-semibold" : "text-muted"}>
                    {labels[step]}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </div>
  );
}
