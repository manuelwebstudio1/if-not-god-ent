import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function BulkOrderCta() {
  return (
    <section className="relative overflow-hidden bg-black py-16 text-white lg:py-20">
      <Image
        src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=80"
        alt="Industrial warehouse and bulk orders"
        fill
        className="object-cover opacity-35"
        sizes="100vw"
      />
      <div className="ing-container relative text-center lg:text-left">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">
          Contractors & Businesses
        </p>
        <h2 className="mt-3 text-3xl font-black uppercase tracking-tight sm:text-4xl">
          Need A Bulk Order?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-neutral-300 lg:mx-0">
          Request a tailored quote for project supply, industrial equipment and
          volume pricing across Ghana.
        </p>
        <Link
          href="/request-quote"
          className={cn(buttonVariants({ size: "lg" }), "mt-8 inline-flex")}
        >
          Request A Quote →
        </Link>
      </div>
    </section>
  );
}
