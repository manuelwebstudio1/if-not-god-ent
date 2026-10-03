export const legalPages: Record<
  string,
  { title: string; body: string[] }
> = {
  faqs: {
    title: "FAQs",
    body: [
      "We supply genuine building materials, tools and industrial equipment across Ghana.",
      "Delivery times vary by location — typically 2–5 business days for standard items.",
      "Bulk and machinery orders may require a custom quote and freight scheduling.",
    ],
  },
  returns: {
    title: "Returns & Refunds",
    body: [
      "Unused items in original packaging may be returned within 7 days subject to inspection.",
      "Defective products are covered under manufacturer warranty terms.",
    ],
  },
  "shipping-policy": {
    title: "Shipping Policy",
    body: [
      "Free delivery on orders over GH₵500 within selected cities.",
      "Nationwide delivery available. Heavy equipment shipped via freight partners.",
    ],
  },
  terms: {
    title: "Terms & Conditions",
    body: [
      "All prices are listed in Ghana Cedis (GH₵) unless stated otherwise.",
      "Orders are confirmed after payment verification through your selected provider.",
    ],
  },
  privacy: {
    title: "Privacy Policy",
    body: [
      "We collect account, order and contact information to fulfil purchases and support.",
      "We do not sell personal data. Payment credentials are handled by payment processors only.",
    ],
  },
  "refund-policy": {
    title: "Refund Policy",
    body: [
      "Approved refunds are processed to the original payment method within 5–10 business days.",
    ],
  },
  "bulk-order-policy": {
    title: "Bulk Order Policy",
    body: [
      "Volume pricing requires a formal quote. Deposits may apply for large or imported orders.",
    ],
  },
};
