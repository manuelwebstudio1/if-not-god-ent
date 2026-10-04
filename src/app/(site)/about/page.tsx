import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  Award,
  Eye,
  Headphones,
  ShieldCheck,
  Target,
  Truck,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "IF NOT GOD ENT — building better, supplying better across Ghana.",
};

const pillars = [
  {
    icon: ShieldCheck,
    title: "Our Story",
    body: "IF NOT GOD ENT was founded to give contractors, engineers and businesses a trusted source for genuine tools, building materials and industrial equipment in Ghana. We combine international quality with local expertise and reliable delivery.",
  },
  {
    icon: Target,
    title: "Our Mission",
    body: "To equip every project — from residential builds to major infrastructure — with products that perform under pressure and support long-term success.",
  },
  {
    icon: Eye,
    title: "Our Vision",
    body: "To become West Africa's most respected partner for professional construction and engineering supply.",
  },
];

const values = [
  "Integrity",
  "Quality",
  "Safety",
  "Accountability",
  "Service Excellence",
];

const reasons = [
  {
    icon: Award,
    title: "Genuine products",
    body: "Equipment and materials you can specify with confidence on site.",
  },
  {
    icon: Truck,
    title: "Nationwide delivery",
    body: "Fast, reliable logistics from Accra to project sites across Ghana.",
  },
  {
    icon: Headphones,
    title: "Expert support",
    body: "Guidance before you buy and after-sales help when the job is live.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-white">
      <section className="relative isolate min-h-[70vh] overflow-hidden text-white lg:min-h-[78vh]">
        <Image
          src="/images/about/hero.jpg"
          alt="Construction site at golden hour"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/78 to-black/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/25" />

        <div className="ing-container relative flex min-h-[70vh] flex-col justify-end pb-16 pt-28 lg:min-h-[78vh] lg:pb-24">
          <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-gold">
            About {siteConfig.shortName}
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black uppercase leading-[0.95] tracking-tight sm:text-5xl lg:text-7xl">
            Building better.
            <span className="block text-gold">Supplying better.</span>
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-neutral-200 sm:text-base">
            Premium construction, engineering and industrial supply for
            professionals who cannot compromise on quality.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/shop" className={cn(buttonVariants())}>
              Shop the catalog
            </Link>
            <Link
              href="/contact"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Talk to us
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-neutral-800 bg-black py-5 text-white">
        <div className="trust-ticker relative overflow-hidden">
          <div className="trust-ticker-track flex w-max items-center">
            {[
              ["Accra based", "Serving Ghana nationwide"],
              ["3 core lines", "Materials, pumps and machines"],
              ["Project ready", "Retail, bulk and site supply"],
              ["Accra based", "Serving Ghana nationwide"],
              ["3 core lines", "Materials, pumps and machines"],
              ["Project ready", "Retail, bulk and site supply"],
            ].map(([label, value], i) => (
              <div
                key={`${label}-${i}`}
                className="flex shrink-0 items-center gap-4 px-10"
              >
                <span className="h-8 w-0.5 bg-gold" />
                <p className="whitespace-nowrap text-xs font-bold uppercase tracking-[0.2em] text-gold">
                  {label}
                  <span className="ml-3 font-medium normal-case tracking-normal text-neutral-300">
                    {value}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ing-container py-16 lg:py-24">
        <div className="grid gap-6 lg:grid-cols-3">
          {pillars.map((item) => (
            <article
              key={item.title}
              className="border border-neutral-200 bg-white p-7 shadow-sm transition-shadow hover:shadow-lg"
            >
              <item.icon className="h-7 w-7 text-gold" strokeWidth={1.75} />
              <h2 className="mt-5 text-lg font-black uppercase tracking-tight">
                {item.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-neutral-950 py-16 text-white lg:py-20">
        <Image
          src="/images/about/hero.jpg"
          alt=""
          fill
          className="object-cover opacity-20"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="ing-container relative">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-gold">
            What we stand for
          </p>
          <h2 className="mt-3 text-3xl font-black uppercase tracking-tight sm:text-4xl">
            Our values
          </h2>
          <div className="mt-10 grid gap-3 sm:grid-cols-5">
            {values.map((value) => (
              <div
                key={value}
                className="border border-white/15 bg-white/5 px-4 py-6 text-center text-sm font-bold uppercase tracking-[0.14em]"
              >
                {value}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ing-container py-16 lg:py-24">
        <div className="max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-gold">
            Why {siteConfig.name}
          </p>
          <h2 className="mt-3 text-3xl font-black uppercase tracking-tight">
            Built for professionals
          </h2>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {reasons.map((item) => (
            <article key={item.title} className="border border-neutral-200 p-6">
              <item.icon className="h-6 w-6 text-gold" strokeWidth={1.75} />
              <h3 className="mt-4 text-sm font-black uppercase">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
            </article>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border border-neutral-200 bg-black px-6 py-8 text-white">
          <div>
            <p className="text-xl font-black uppercase">Ready to supply your next site?</p>
            <p className="mt-1 text-sm text-neutral-300">
              Browse the catalog or request a quote for bulk and project orders.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/shop" className={cn(buttonVariants())}>
              Shop now
            </Link>
            <Link
              href="/request-quote"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Request a quote
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
