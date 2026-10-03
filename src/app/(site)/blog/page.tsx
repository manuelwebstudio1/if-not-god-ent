import Image from "next/image";
import Link from "next/link";
import { blogPosts } from "@/data/blog-posts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Construction, engineering and tool buying guides from IF NOT GOD ENT.",
};

export default function BlogPage() {
  return (
    <div className="ing-container py-12">
      <h1 className="text-3xl font-black uppercase">Blog</h1>
      <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post) => (
          <article key={post.id} className="border border-neutral-200 bg-white">
            <div className="relative aspect-[16/10]">
              <Image src={post.image} alt="" fill className="object-cover" sizes="400px" />
            </div>
            <div className="p-5">
              <p className="text-[10px] font-bold uppercase tracking-wide text-gold">
                {post.category}
              </p>
              <h2 className="mt-2 text-lg font-bold leading-snug">
                <Link href={`/blog/${post.slug}`} className="hover:text-gold-dark">
                  {post.title}
                </Link>
              </h2>
              <p className="mt-2 line-clamp-3 text-sm text-muted">{post.excerpt}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
