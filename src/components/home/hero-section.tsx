"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <section className="relative min-h-[520px] overflow-hidden bg-black text-white sm:min-h-[580px] lg:min-h-[640px]">
      <Image
        src="https://images.unsplash.com/photo-1504148455328-c376ef8136c3?auto=format&fit=crop&w=1920&q=80"
        alt="Professional worker using power tools on construction site"
        fill
        priority
        className="object-cover opacity-50"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/40" />

      <div className="ing-container relative flex min-h-[520px] items-center py-16 sm:min-h-[580px] lg:min-h-[640px]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-gold">
            Welcome to {siteConfig.name}
          </p>
          <h1 className="mt-4 text-4xl font-black uppercase leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Building Excellence.
            <br />
            <span className="text-white">
              Delivering Quality<span className="text-gold">.</span>
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-neutral-300 sm:text-lg">
            {siteConfig.tagline}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/shop" className={cn(buttonVariants({ size: "lg" }))}>
              Shop Products →
            </Link>
            <Link
              href="/request-quote"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "text-center",
              )}
            >
              Request A Quote →
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
