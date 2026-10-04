import Link from "next/link";
import { blogPosts } from "@/data/blog-posts";

export default function AdminBlogPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black uppercase">Blog Posts</h1>
        <p className="mt-2 text-sm text-muted">
          Content lives in <code className="text-xs">src/data/blog-posts.ts</code>{" "}
          until PostgreSQL <code className="text-xs">BlogPost</code> is connected.
        </p>
      </div>
      <ul className="divide-y divide-neutral-200 border border-neutral-200 bg-white">
        {blogPosts.map((post) => (
          <li key={post.slug} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
            <div>
              <p className="font-semibold">{post.title}</p>
              <p className="text-xs text-muted">
                {post.category} · {post.author}
              </p>
            </div>
            <Link
              href={`/blog/${post.slug}`}
              className="text-xs font-bold uppercase text-gold hover:text-gold-dark"
            >
              View →
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
