import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Confirmed",
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;

  return (
    <div className="ing-container max-w-xl py-16 text-center">
      <h1 className="text-3xl font-black uppercase text-green-800">
        Order Received
      </h1>
      {order && (
        <p className="mt-4 text-sm">
          Order number:{" "}
          <strong className="font-mono text-base">{order}</strong>
        </p>
      )}
      <p className="mt-4 text-sm text-muted">
        Payment confirmation will be sent once your selected provider is
        connected. Track your order anytime using your order number and phone or
        email.
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link href="/track-order" className={buttonVariants()}>
          Track My Order
        </Link>
        <Link href="/shop" className={buttonVariants({ variant: "outlineDark" })}>
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
