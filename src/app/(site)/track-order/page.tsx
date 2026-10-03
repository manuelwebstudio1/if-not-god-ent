import { TrackOrderForm } from "@/components/forms/track-order-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Track My Order",
};

export default function TrackOrderPage() {
  return (
    <div className="ing-container max-w-2xl py-12">
      <h1 className="text-3xl font-black uppercase">Track My Order</h1>
      <p className="mt-2 text-sm text-muted">
        Enter your order number and the phone number or email used at checkout.
      </p>
      <div className="mt-8">
        <TrackOrderForm />
      </div>
    </div>
  );
}
