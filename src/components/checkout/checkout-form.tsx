"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { buttonVariants } from "@/components/ui/button";
import { formatPrice, cn } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";
import type { PaymentMethod } from "@/types/commerce";

const schema = z.object({
  customerName: z.string().min(2),
  phone: z.string().min(6),
  email: z.string().email(),
  region: z.string().min(2),
  city: z.string().min(2),
  digitalAddress: z.string().optional(),
  streetAddress: z.string().min(3),
  deliveryNotes: z.string().optional(),
  paymentMethod: z.enum([
    "MTN_MOMO",
    "TELECEL_CASH",
    "AIRTELTIGO",
    "VISA",
    "MASTERCARD",
    "BANK_TRANSFER",
    "PAYSTACK",
    "FLUTTERWAVE",
  ]),
});

type FormValues = z.infer<typeof schema>;

const paymentLabels: Record<PaymentMethod, string> = {
  MTN_MOMO: "MTN Mobile Money",
  TELECEL_CASH: "Telecel Cash",
  AIRTELTIGO: "AirtelTigo Money",
  VISA: "Visa",
  MASTERCARD: "Mastercard",
  BANK_TRANSFER: "Bank Transfer",
  PAYSTACK: "Paystack",
  FLUTTERWAVE: "Flutterwave",
};

export function CheckoutForm() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const deliveryCost = useCartStore((s) => s.deliveryCost());
  const total = useCartStore((s) => s.total());
  const couponDiscount = useCartStore((s) => s.couponDiscount);
  const clearCart = useCartStore((s) => s.clearCart);
  const [error, setError] = useState("");
  const discountAmount = subtotal * couponDiscount;

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { paymentMethod: "MTN_MOMO" },
  });

  if (items.length === 0) {
    return (
      <p className="text-center text-sm text-muted">
        Your cart is empty.{" "}
        <a href="/shop" className="font-semibold text-gold-dark underline">
          Continue shopping
        </a>
      </p>
    );
  }

  async function onSubmit(values: FormValues) {
    setError("");
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        subtotal,
        deliveryCost,
        discount: discountAmount,
        total,
        items: items.map((i) => ({
          productId: i.productId,
          name: i.name,
          sku: i.sku,
          quantity: i.quantity,
          price: i.price,
        })),
      }),
    });
    const data = (await res.json()) as {
      orderNumber?: string;
      error?: string;
    };
    if (!res.ok) {
      setError(data.error ?? "Checkout failed");
      return;
    }
    clearCart();
    router.push(
      `/checkout/success?order=${encodeURIComponent(data.orderNumber ?? "")}`,
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <h2 className="text-lg font-black uppercase">Delivery Details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <input placeholder="Full Name" {...register("customerName")} className={input} />
          <input placeholder="Phone" {...register("phone")} className={input} />
          <input placeholder="Email" type="email" {...register("email")} className={input} />
          <input placeholder="Region" {...register("region")} className={input} />
          <input placeholder="City" {...register("city")} className={input} />
          <input placeholder="Digital Address (Ghana Post GPS)" {...register("digitalAddress")} className={input} />
        </div>
        <input placeholder="Street Address" {...register("streetAddress")} className={input} />
        <textarea placeholder="Additional delivery instructions" {...register("deliveryNotes")} className={input} rows={3} />

        <h2 className="pt-4 text-lg font-black uppercase">Payment Method</h2>
        <p className="text-xs text-muted">
          Select a method below. Payment is processed securely via your chosen
          provider when integrated (Paystack / Flutterwave / MoMo APIs).
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {(Object.keys(paymentLabels) as PaymentMethod[]).map((method) => (
            <label
              key={method}
              className="flex cursor-pointer items-center gap-2 border border-neutral-300 px-3 py-3 text-sm has-[:checked]:border-gold"
            >
              <input type="radio" value={method} {...register("paymentMethod")} />
              {paymentLabels[method]}
            </label>
          ))}
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button type="submit" disabled={isSubmitting} className={cn(buttonVariants({ size: "lg" }))}>
          {isSubmitting ? "Placing Order…" : "Place Order"}
        </button>
      </form>

      <aside className="h-fit border border-neutral-200 bg-white p-5">
        <h3 className="text-sm font-black uppercase">Order Summary</h3>
        <ul className="mt-4 space-y-3 text-sm">
          {items.map((i) => (
            <li key={i.productId} className="flex justify-between gap-2">
              <span className="line-clamp-2">
                {i.name} × {i.quantity}
              </span>
              <span className="shrink-0 font-semibold">
                {formatPrice(i.price * i.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-1 border-t border-neutral-200 pt-4 text-sm">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd>{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Delivery</dt>
            <dd>{deliveryCost === 0 ? "FREE" : formatPrice(deliveryCost)}</dd>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-green-700">
              <dt>Discount</dt>
              <dd>-{formatPrice(discountAmount)}</dd>
            </div>
          )}
          <div className="flex justify-between pt-2 text-base font-bold">
            <dt>Total</dt>
            <dd>{formatPrice(total)}</dd>
          </div>
        </dl>
      </aside>
    </div>
  );
}

const input =
  "w-full border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-gold";
