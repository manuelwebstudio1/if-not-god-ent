import Link from "next/link";
import { ProductCard } from "@/components/product/product-card";
import { getFeaturedProducts } from "@/data/products";

export function FeaturedProducts() {
  const products = getFeaturedProducts();

  return (
    <section className="bg-surface py-14 lg:py-16">
      <div className="ing-container">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-black uppercase tracking-tight text-black sm:text-3xl">
            Featured Products
          </h2>
          <Link
            href="/shop"
            className="shrink-0 text-xs font-bold uppercase tracking-wide text-gold hover:text-gold-dark"
          >
            View All Products →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
