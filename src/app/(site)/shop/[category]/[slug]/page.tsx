import { ProductDetail } from "@/components/product/product-detail";
import {
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/products/repository";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ category: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  const product = await getProductBySlug(category, slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: product.images[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { category, slug } = await params;
  const product = await getProductBySlug(category, slug);
  if (!product) notFound();

  const relatedProducts = await getRelatedProducts(product);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    brand: product.brand,
    description: product.shortDescription,
    image: product.images,
    offers: {
      "@type": "Offer",
      priceCurrency: "GHS",
      price: product.price,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetail product={product} relatedProducts={relatedProducts} />
    </>
  );
}
