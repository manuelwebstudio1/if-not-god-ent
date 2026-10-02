"use client";

import {
  Heart,
  Menu,
  Phone,
  ShoppingCart,
  User,
  X,
  Mail,
  ShieldCheck,
  Truck,
  BadgePercent,
  Headphones,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";
import { categories } from "@/data/categories";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { Logo } from "./logo";
import { SearchBar } from "./search-bar";
import { buttonVariants } from "@/components/ui/button";

const navLinks = [
  { href: "/", label: "HOME" },
  { href: "/shop", label: "SHOP" },
  { href: "/brands", label: "BRANDS" },
  { href: "/about", label: "ABOUT US" },
  { href: "/blog", label: "BLOG" },
  { href: "/contact", label: "CONTACT US" },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const cartCount = useCartStore((s) => s.itemCount());
  const openCart = useCartStore((s) => s.openCart);
  const wishCount = useWishlistStore((s) => s.count());

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setCatOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 bg-black text-white transition-shadow duration-300",
        scrolled && "shadow-lg shadow-black/40",
      )}
    >
      {/* Top info bar — desktop */}
      <div className="hidden border-b border-neutral-800 lg:block">
        <div className="ing-container flex h-9 items-center justify-between text-[11px] font-medium uppercase tracking-wide text-neutral-300">
          <p>Welcome to {siteConfig.name}</p>
          <ul className="flex items-center gap-5">
            <li className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-gold" />
              Genuine Products
            </li>
            <li className="flex items-center gap-1.5">
              <Truck className="h-3.5 w-3.5 text-gold" />
              Fast Delivery
            </li>
            <li className="flex items-center gap-1.5">
              <BadgePercent className="h-3.5 w-3.5 text-gold" />
              Best Prices
            </li>
            <li className="flex items-center gap-1.5">
              <Headphones className="h-3.5 w-3.5 text-gold" />
              Customer Support
            </li>
          </ul>
          <div className="flex items-center gap-4">
            <a
              href={`tel:${siteConfig.phoneRaw}`}
              className="flex items-center gap-1 hover:text-gold"
            >
              <Phone className="h-3.5 w-3.5" />
              {siteConfig.phone}
            </a>
            <a
              href={`mailto:${siteConfig.email}`}
              className="flex items-center gap-1 hover:text-gold"
            >
              <Mail className="h-3.5 w-3.5" />
              {siteConfig.email}
            </a>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="border-b border-neutral-800">
        <div className="ing-container flex h-16 items-center gap-3 sm:h-[72px] sm:gap-4">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>

          <Logo className="shrink-0 lg:mr-2" variant="mark" />

          <div className="hidden flex-1 lg:block">
            <SearchBar />
          </div>

          <div className="ml-auto flex items-center gap-1 sm:gap-3">
            <Link
              href="/account"
              className="hidden flex-col items-center px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-neutral-300 hover:text-white sm:flex"
            >
              <User className="mb-0.5 h-5 w-5" />
              Account
            </Link>
            <Link
              href="/account/wishlist"
              className="relative flex flex-col items-center px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-neutral-300 hover:text-white"
            >
              <Heart className="mb-0.5 h-5 w-5" />
              <span className="hidden sm:inline">Wishlist</span>
              {wishCount > 0 && (
                <span className="absolute -right-0.5 top-0 flex h-4 min-w-4 items-center justify-center bg-gold px-1 text-[10px] font-bold text-black">
                  {wishCount}
                </span>
              )}
            </Link>
            <button
              type="button"
              onClick={openCart}
              className="relative flex flex-col items-center px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-neutral-300 hover:text-white"
            >
              <ShoppingCart className="mb-0.5 h-5 w-5" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -right-0.5 top-0 flex h-4 min-w-4 items-center justify-center bg-gold px-1 text-[10px] font-bold text-black">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="ing-container pb-3 lg:hidden">
          <SearchBar />
        </div>
      </div>

      {/* Nav row — desktop */}
      <div className="hidden border-b border-neutral-800 lg:block">
        <div className="ing-container flex h-12 items-center gap-6">
          <div className="relative">
            <button
              type="button"
              onClick={() => setCatOpen((v) => !v)}
              className="flex h-10 items-center gap-2 border border-gold px-4 text-xs font-bold uppercase tracking-wider text-white hover:bg-gold/10"
            >
              <Menu className="h-4 w-4 text-gold" />
              Shop By Category
            </button>
            {catOpen && (
              <div className="absolute left-0 top-full z-50 mt-0 w-72 border border-neutral-700 bg-black py-2 shadow-2xl">
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    href={`/shop?category=${c.slug}`}
                    className="block px-4 py-2.5 text-sm text-neutral-200 hover:bg-neutral-900 hover:text-gold"
                  >
                    {c.name}
                  </Link>
                ))}
                <Link
                  href="/shop"
                  className="mt-1 block border-t border-neutral-800 px-4 py-3 text-xs font-bold uppercase tracking-wide text-gold"
                >
                  View all categories →
                </Link>
              </div>
            )}
          </div>

          <nav className="flex flex-1 items-center justify-center gap-8">
            {navLinks.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-xs font-bold uppercase tracking-[0.15em] transition-colors",
                    active ? "text-gold" : "text-white hover:text-gold",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <Link
            href="/request-quote"
            className={cn(buttonVariants({ size: "sm" }), "shrink-0")}
          >
            Request A Quote
          </Link>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/70"
            aria-label="Close menu overlay"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 flex h-full w-[min(100%,320px)] flex-col bg-black shadow-2xl">
            <div className="flex h-16 items-center justify-between border-b border-neutral-800 px-4">
              <Logo variant="mark" />
              <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close">
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-gold">
                Categories
              </p>
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/shop?category=${c.slug}`}
                  className="block border-b border-neutral-900 py-3 text-sm font-medium"
                >
                  {c.name}
                </Link>
              ))}
              <p className="mb-2 mt-6 text-xs font-bold uppercase tracking-widest text-gold">
                Menu
              </p>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block border-b border-neutral-900 py-3 text-sm font-bold uppercase tracking-wide"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="border-t border-neutral-800 p-4">
              <Link
                href="/request-quote"
                className={cn(buttonVariants(), "w-full text-center")}
              >
                Request A Quote
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
