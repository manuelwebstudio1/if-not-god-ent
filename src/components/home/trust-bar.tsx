import {
  BadgePercent,
  Headphones,
  PackageCheck,
  ShieldCheck,
  Truck,
  Wallet,
} from "lucide-react";

const items = [
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

export function TrustBar() {
  return (
    <section className="border-y border-neutral-800 bg-black py-8 text-white lg:py-10">
      <div className="ing-container grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6 lg:gap-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="text-center lg:text-left">
              <Icon className="mx-auto h-6 w-6 text-gold lg:mx-0" strokeWidth={1.75} />
              <h3 className="mt-3 text-[11px] font-bold uppercase leading-snug tracking-wide">
                {item.title}
              </h3>
              <p className="mt-1 hidden text-xs text-neutral-400 sm:block">
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
