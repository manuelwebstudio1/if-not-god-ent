import { ContentPage } from "@/components/content/content-page";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
};

const services = [
  "Construction Supply",
  "Engineering Equipment Supply",
  "Bulk Orders",
  "Project Supply",
  "Industrial Equipment Supply",
  "Delivery Services",
  "After-Sales Support",
  "Equipment Support",
];

export default function ServicesPage() {
  return (
    <ContentPage
      title="Professional Services"
      subtitle="End-to-end supply solutions for construction and engineering projects."
    >
      <ul className="grid gap-4 sm:grid-cols-2 not-prose">
        {services.map((s) => (
          <li
            key={s}
            className="border border-neutral-200 bg-white p-4 text-sm font-semibold uppercase tracking-wide"
          >
            {s}
          </li>
        ))}
      </ul>
      <p className="mt-8">
        <Link href="/request-quote" className="font-bold text-gold-dark underline">
          Request a quote
        </Link>{" "}
        for project-based pricing and dedicated account support.
      </p>
    </ContentPage>
  );
}
