import { BrandsSection } from "@/components/home/brands-section";
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
  return (
    <>
      <HeroSection />
      <TrustBar />
      <CategoryCarousel />
      <FeaturedProducts />
      <BrandsSection />
      <BulkOrderCta />
    </>
  );
}
