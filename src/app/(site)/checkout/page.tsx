import { CheckoutForm } from "@/components/checkout/checkout-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Secure checkout for IF NOT GOD ENT orders across Ghana.",
};

export default function CheckoutPage() {
  return (
    <div className="ing-container py-12">
      <h1 className="text-3xl font-black uppercase">Checkout</h1>
      <p className="mt-2 text-sm text-muted">
        Complete your order details and select a payment method.
      </p>
      <div className="mt-8">
        <CheckoutForm />
      </div>
    </div>
  );
}
