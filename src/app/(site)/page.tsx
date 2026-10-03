import { BulkOrderCta } from "@/components/home/bulk-order-cta";
import { CategoryCarousel } from "@/components/home/category-carousel";
import { FeaturedProducts } from "@/components/home/featured-products";
import { HeroSection } from "@/components/home/hero-section";
import { TrustBar } from "@/components/home/trust-bar";
import { siteConfig } from "@/config/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: siteConfig.slogan,
  description: siteConfig.description,
};

export default function HomePage() {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    description: siteConfig.description,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <HeroSection />
      <TrustBar />
      <CategoryCarousel />
      <FeaturedProducts />
      <BulkOrderCta />
    </>
  );
}
