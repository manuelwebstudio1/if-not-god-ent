"use client";

import {
  BadgePercent,
  Headphones,
  PackageCheck,
  ShieldCheck,
  Truck,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const items: {
  icon: LucideIcon;
  title: string;
  desc: string;
}[] = [
  {
    icon: ShieldCheck,
    title: "100% Genuine Products",
    desc: "Authentic products from trusted brands.",
  },
  {
    icon: Truck,
    title: "Nationwide Delivery",
    desc: "Fast and reliable delivery across Ghana.",
  },
  {
    icon: BadgePercent,
    title: "Competitive Pricing",
    desc: "Quality products at competitive prices.",
  },
  {
    icon: Headphones,
    title: "Professional Support",
    desc: "Expert assistance before and after purchase.",
  },
  {
    icon: PackageCheck,
    title: "Bulk Order Specialist",
    desc: "Special solutions for contractors and businesses.",
  },
  {
    icon: Wallet,
    title: "Secure Payment",
    desc: "Safe and convenient payment options.",
  },
];

function TrustItem({ icon: Icon, title, desc }: (typeof items)[number]) {
  return (
    <div className="flex w-[min(100%,280px)] shrink-0 items-start gap-3 px-6 sm:w-[320px]">
      <Icon
        className="mt-0.5 h-6 w-6 shrink-0 text-gold"
        strokeWidth={1.75}
        aria-hidden
      />
      <div className="min-w-0 text-left">
        <h3 className="text-[11px] font-bold uppercase leading-snug tracking-wide text-white">
          {title}
        </h3>
        <p className="mt-1 text-xs leading-relaxed text-neutral-400">{desc}</p>
      </div>
    </div>
  );
}

export function TrustBar() {
  const track = [...items, ...items];

  return (
    <section
      className="trust-ticker border-y border-neutral-800 bg-black py-5 text-white"
      aria-label="Why choose IF NOT GOD ENT"
    >
      <div className="relative overflow-hidden">
        <div className="trust-ticker-track flex w-max items-stretch">
          {track.map((item, i) => (
            <TrustItem key={`${item.title}-${i}`} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
