import { ContentPage } from "@/components/content/content-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "IF NOT GOD ENT — building better, supplying better across Ghana.",
};

export default function AboutPage() {
  return (
    <ContentPage
      title="Building Better. Supplying Better."
      subtitle="Our commitment to quality construction, engineering, plumbing and industrial products."
    >
      <h2>Our Story</h2>
      <p>
        IF NOT GOD ENT was founded to give contractors, engineers and businesses
        a trusted source for genuine tools, building materials and industrial
        equipment in Ghana. We combine international brands with local expertise
        and reliable delivery.
      </p>
      <h2>Our Mission</h2>
      <p>
        To equip every project — from residential builds to major infrastructure
        — with products that perform under pressure and support long-term success.
      </p>
      <h2>Our Vision</h2>
      <p>
        To become West Africa&apos;s most respected partner for professional
        construction and engineering supply.
      </p>
      <h2>Our Values</h2>
      <p>
        Integrity, quality, safety, accountability and service excellence guide
        every order we fulfil.
      </p>
      <h2>Why Choose IF NOT GOD ENT</h2>
      <p>
        Genuine products, competitive pricing, bulk-order specialists, nationwide
        logistics and expert support before and after purchase.
      </p>
    </ContentPage>
  );
}
