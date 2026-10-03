import { QuoteForm } from "@/components/forms/quote-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Request A Quote",
  description:
    "Request bulk pricing and project supply quotes from IF NOT GOD ENT.",
};

export default function RequestQuotePage() {
  return (
    <div className="bg-surface py-12 lg:py-16">
      <div className="ing-container max-w-3xl">
        <h1 className="text-3xl font-black uppercase tracking-tight">
          Request A Quote
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          For contractors, developers and businesses ordering in volume. Tell us
          what you need and our team will respond with competitive pricing and
          delivery options.
        </p>
        <div className="mt-8 border border-neutral-200 bg-white p-6 sm:p-8">
          <QuoteForm />
        </div>
      </div>
    </div>
  );
}
