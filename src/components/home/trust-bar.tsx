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
    <div className="flex shrink-0 items-center gap-3 px-8">
      <Icon
        className="h-5 w-5 shrink-0 text-gold"
        strokeWidth={1.75}
        aria-hidden
      />
      <p className="whitespace-nowrap text-[11px] font-bold uppercase tracking-wide text-white">
        {title}
        <span className="ml-2 font-medium normal-case tracking-normal text-neutral-400">
          {desc}
        </span>
      </p>
    </div>
  );
}

export function TrustBar() {
  const track = [...items, ...items];

  return (
    <section
      className="border-y border-neutral-800 bg-black py-4 text-white"
      aria-label="Why choose IF NOT GOD ENT"
    >
      <div className="trust-ticker relative overflow-hidden">
        <div className="trust-ticker-track flex w-max items-center">
          {track.map((item, i) => (
            <TrustItem key={`${item.title}-${i}`} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
