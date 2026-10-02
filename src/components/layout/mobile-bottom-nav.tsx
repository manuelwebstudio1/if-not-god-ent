"use client";

import { Grid3X3, Heart, Home, ShoppingBag, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/shop", label: "Shop", icon: ShoppingBag },
  { href: "/shop?categories=1", label: "Categories", icon: Grid3X3 },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
  { href: "#cart", label: "Cart", icon: ShoppingCart, isCart: true },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const openCart = useCartStore((s) => s.openCart);
  const count = useCartStore((s) => s.itemCount());

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-neutral-200 bg-white pb-[env(safe-area-inset-bottom)] lg:hidden">
      <ul className="flex h-16 items-stretch">
        {items.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === "/"
              ? pathname === "/"
              : !item.isCart && pathname.startsWith(item.href.split("?")[0]);

          if (item.isCart) {
            return (
              <li key={item.label} className="flex-1">
                <button
                  type="button"
                  onClick={openCart}
                  className="relative flex h-full w-full flex-col items-center justify-center gap-0.5 text-[10px] font-semibold uppercase text-neutral-600"
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                  {count > 0 && (
                    <span className="absolute right-[calc(50%-20px)] top-2 flex h-4 min-w-4 items-center justify-center bg-gold px-1 text-[9px] font-bold text-black">
                      {count}
                    </span>
                  )}
                </button>
              </li>
            );
          }

          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={cn(
                  "flex h-full flex-col items-center justify-center gap-0.5 text-[10px] font-semibold uppercase",
                  active ? "text-gold-dark" : "text-neutral-600",
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
