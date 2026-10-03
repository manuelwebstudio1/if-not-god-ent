import Link from "next/link";
import { ProductCard } from "@/components/product/product-card";
import { listProducts } from "@/lib/products/repository";

export async function FeaturedProducts() {
  const products = await listProducts({ featured: true, limit: 8 });

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
        {products.length === 0 ? (
          <p className="text-sm text-muted">
            Featured products will appear here once added in the admin dashboard.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
