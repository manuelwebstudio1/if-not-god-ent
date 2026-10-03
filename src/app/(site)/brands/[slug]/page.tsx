import { ProductCard } from "@/components/product/product-card";
import {
  getBrandBySlug,
  getProductsByBrand,
} from "@/lib/products/repository";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);
  if (!brand) return {};
  return {
    title: `${brand.name} Products`,
    description: `Browse ${brand.name} tools and equipment at IF NOT GOD ENT.`,
  };
}

export default async function BrandPage({ params }: Props) {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);
  if (!brand) notFound();
  const products = await getProductsByBrand(slug);

  return (
    <div className="ing-container py-12">
      <h1 className="text-3xl font-black uppercase">{brand.name}</h1>
      <p className="mt-2 text-sm text-muted">{products.length} products</p>
      {products.length === 0 ? (
        <p className="mt-8 text-sm text-muted">No products for this brand yet.</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
