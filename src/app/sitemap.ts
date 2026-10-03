import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { blogPosts } from "@/data/blog-posts";
import { listProducts } from "@/lib/products/repository";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const staticRoutes = [
    "",
    "/shop",
    "/brands",
    "/about",
    "/services",
    "/blog",
    "/contact",
    "/request-quote",
    "/track-order",
    "/checkout",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));

  const products = await listProducts();
  const productRoutes = products.map((p) => ({
    url: `${base}/shop/${p.categorySlug}/${p.slug}`,
    lastModified: new Date(),
  }));

  const blogRoutes = blogPosts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.publishedAt),
  }));

  return [...staticRoutes, ...productRoutes, ...blogRoutes];
}
