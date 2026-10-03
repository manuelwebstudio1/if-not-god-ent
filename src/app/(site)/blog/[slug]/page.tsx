import Image from "next/image";
import { notFound } from "next/navigation";
import { blogPosts, getPostBySlug } from "@/data/blog-posts";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="ing-container max-w-3xl py-12">
      <p className="text-xs font-bold uppercase tracking-wide text-gold">
        {post.category}
      </p>
      <h1 className="mt-2 text-3xl font-black uppercase leading-tight">{post.title}</h1>
      <p className="mt-2 text-xs text-muted">
        {post.author} · {post.publishedAt}
      </p>
      <div className="relative mt-8 aspect-[16/9]">
        <Image src={post.image} alt="" fill className="object-cover" priority sizes="800px" />
      </div>
      <div className="prose prose-neutral mt-8 max-w-none text-sm leading-relaxed">
        <p>{post.content}</p>
      </div>
    </article>
  );
}
