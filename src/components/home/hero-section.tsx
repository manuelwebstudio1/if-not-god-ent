"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { siteConfig } from "@/config/site";
import { heroSlides } from "@/data/hero-slides";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SLIDE_MS = 5500;

export function HeroSection() {
  const [index, setIndex] = useState(0);

  const goTo = useCallback((next: number) => {
    setIndex((next + heroSlides.length) % heroSlides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % heroSlides.length);
    }, SLIDE_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      className="relative min-h-[380px] overflow-hidden bg-neutral-900 text-white sm:min-h-[420px] lg:min-h-[480px]"
      aria-roledescription="carousel"
      aria-label="Hero highlights"
    >
      {/* All slides stacked — crossfade; images load from /public (no internet required) */}
      <div className="absolute inset-0">
        {heroSlides.map((s, i) => (
          <div
            key={s.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-[1400ms] ease-out",
              i === index ? "opacity-100" : "opacity-0",
            )}
            aria-hidden={i !== index}
          >
            <motion.div
              className="relative h-full w-full"
              animate={{ scale: i === index ? 1 : 1.06 }}
              transition={{ duration: SLIDE_MS / 1000, ease: "linear" }}
            >
              <Image
                src={s.src}
                alt={s.alt}
                fill
                priority={i === 0}
                className="object-cover object-[center_35%] sm:object-center"
                sizes="100vw"
              />
            </motion.div>
          </div>
        ))}
      </div>

      {/* Overlays — lighter so photography stays visible */}
      <div className="absolute inset-0 bg-black/25" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

      <div className="ing-container relative flex min-h-[380px] items-center py-10 sm:min-h-[420px] sm:py-12 lg:min-h-[480px] lg:py-14">
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
          <p className="mt-5 max-w-xl text-base leading-relaxed text-neutral-200 sm:text-lg">
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

      <div className="ing-container pointer-events-none absolute bottom-5 left-0 right-0 flex justify-end lg:bottom-6">
        <div
          className="pointer-events-auto flex items-center gap-2"
          role="tablist"
          aria-label="Hero slides"
        >
          {heroSlides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Show slide ${i + 1}: ${s.caption}`}
              onClick={() => goTo(i)}
              className={cn(
                "h-1 transition-all duration-300",
                i === index
                  ? "w-10 bg-gold"
                  : "w-4 bg-white/40 hover:bg-white/60",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
