import {
  Facebook,
  Instagram,
  Youtube,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Logo } from "./logo";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/brands", label: "Brands" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact Us" },
];

const customerService = [
  { href: "/account", label: "My Account" },
  { href: "/track-order", label: "Order Tracking" },
  { href: "/account/wishlist", label: "Wishlist" },
  { href: "/returns", label: "Returns & Refunds" },
  { href: "/shipping-policy", label: "Shipping Policy" },
  { href: "/faqs", label: "FAQs" },
];

const information = [
  { href: "/about", label: "About Us" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/refund-policy", label: "Refund Policy" },
  { href: "/bulk-order-policy", label: "Bulk Order Policy" },
];

export function Footer() {
  return (
    <footer className="mt-auto bg-black text-neutral-300">
      <div className="ing-container grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-6">
        <div className="lg:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-neutral-400">
            {siteConfig.name} supplies premium building materials, power tools,
            plumbing, industrial equipment and engineering solutions for
            professionals across Ghana.
          </p>
          <div className="mt-5 flex gap-3">
            <a
              href={siteConfig.social.facebook}
              className="flex h-9 w-9 items-center justify-center border border-neutral-700 text-neutral-400 hover:border-gold hover:text-gold"
              aria-label="Facebook"
            >
              <Facebook className="h-4 w-4" />
            </a>
            <a
              href={siteConfig.social.instagram}
              className="flex h-9 w-9 items-center justify-center border border-neutral-700 text-neutral-400 hover:border-gold hover:text-gold"
              aria-label="Instagram"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href={siteConfig.social.youtube}
              className="flex h-9 w-9 items-center justify-center border border-neutral-700 text-neutral-400 hover:border-gold hover:text-gold"
              aria-label="YouTube"
            >
              <Youtube className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
            Quick Links
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-gold">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
            Customer Service
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {customerService.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-gold">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
            Information
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {information.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-gold">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white">
            Contact Us
          </h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <a href={`tel:${siteConfig.phoneRaw}`} className="hover:text-gold">
                {siteConfig.phone}
              </a>
            </li>
            <li className="flex gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <a href={`mailto:${siteConfig.email}`} className="hover:text-gold">
                {siteConfig.email}
              </a>
            </li>
            <li className="flex gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <span>{siteConfig.address}</span>
            </li>
          </ul>

          <h3 className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-white">
            Newsletter
          </h3>
          <p className="mt-2 text-xs text-neutral-500">
            Subscribe for new arrivals, specials and industry updates.
          </p>
          <form className="mt-3 flex" action="/api/newsletter" method="post">
            <input
              name="email"
              type="email"
              required
              placeholder="Your email"
              className="h-10 min-w-0 flex-1 border border-neutral-700 bg-neutral-900 px-3 text-sm text-white outline-none focus:border-gold"
            />
            <button
              type="submit"
              className="bg-gold px-4 text-sm font-bold text-black hover:bg-gold-light"
            >
              →
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-neutral-800">
        <div className="ing-container flex flex-col items-center justify-between gap-4 py-6 text-xs text-neutral-500 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 uppercase tracking-wider">
            <span>Visa</span>
            <span>Mastercard</span>
            <span>MTN MoMo</span>
            <span>Telecel Cash</span>
            <span>Paystack</span>
            <span>Flutterwave</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
