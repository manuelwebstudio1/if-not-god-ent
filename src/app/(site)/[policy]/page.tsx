import { ContentPage } from "@/components/content/content-page";
import { legalPages } from "@/data/legal-pages";
import { notFound } from "next/navigation";

const slugs = Object.keys(legalPages);

export function generateStaticParams() {
  return slugs.map((policy) => ({ policy }));
}

export default async function PolicyPage({
  params,
}: {
  params: Promise<{ policy: string }>;
}) {
  const { policy } = await params;
  const page = legalPages[policy];
  if (!page) notFound();

  return (
    <ContentPage title={page.title}>
      {page.body.map((p) => (
        <p key={p}>{p}</p>
      ))}
    </ContentPage>
  );
}
