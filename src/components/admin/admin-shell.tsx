"use client";

import {
  BookOpen,
  FileText,
  Layers,
  LayoutDashboard,
  Menu,
  MessageSquare,
  Package,
  PackagePlus,
  Settings,
  ShoppingCart,
  Tag,
  Users,
  Warehouse,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ComponentType } from "react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  match?: (path: string) => boolean;
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    title: "Overview",
    items: [
      {
        href: "/admin",
        label: "Dashboard",
        icon: LayoutDashboard,
        match: (p) => p === "/admin",
      },
    ],
  },
  {
    title: "Catalog",
    items: [
      {
        href: "/admin/products/new",
        label: "Add Product",
        icon: PackagePlus,
        match: (p) => p === "/admin/products/new",
      },
      {
        href: "/admin/products",
        label: "All Products",
        icon: Package,
        match: (p) =>
          p === "/admin/products" ||
          (p.startsWith("/admin/products/") && !p.startsWith("/admin/products/new")),
      },
      {
        href: "/admin/catalog",
        label: "Categories",
        icon: Layers,
        match: (p) => p.startsWith("/admin/catalog"),
      },
      {
        href: "/admin/inventory",
        label: "Inventory",
        icon: Warehouse,
        match: (p) => p.startsWith("/admin/inventory"),
      },
    ],
  },
  {
    title: "Commerce",
    items: [
      {
        href: "/admin/orders",
        label: "Orders",
        icon: ShoppingCart,
        match: (p) => p.startsWith("/admin/orders"),
      },
      {
        href: "/admin/quotes",
        label: "Quote Requests",
        icon: FileText,
        match: (p) => p.startsWith("/admin/quotes"),
      },
      {
        href: "/admin/coupons",
        label: "Coupons",
        icon: Tag,
        match: (p) => p.startsWith("/admin/coupons"),
      },
    ],
  },
  {
    title: "People & Content",
    items: [
      {
        href: "/admin/customers",
        label: "Customers",
        icon: Users,
        match: (p) => p.startsWith("/admin/customers"),
      },
      {
        href: "/admin/reviews",
        label: "Reviews",
        icon: MessageSquare,
        match: (p) => p.startsWith("/admin/reviews"),
      },
      {
        href: "/admin/blog",
        label: "Blog",
        icon: BookOpen,
        match: (p) => p.startsWith("/admin/blog"),
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        href: "/admin/settings",
        label: "Settings",
        icon: Settings,
        match: (p) => p.startsWith("/admin/settings"),
      },
    ],
  },
];

function NavLink({
  item,
  pathname,
  onNavigate,
}: {
  item: NavItem;
  pathname: string;
  onNavigate?: () => void;
}) {
  const active = item.match ? item.match(pathname) : pathname === item.href;
  const isAdd = item.href === "/admin/products/new";
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 text-sm transition-colors",
        isAdd && "bg-gold font-bold text-black hover:bg-gold-light",
        !isAdd && active && "bg-white/10 font-semibold text-white",
        !isAdd && !active && "text-neutral-400 hover:bg-white/5 hover:text-white",
      )}
    >
      <Icon className={cn("h-4 w-4 shrink-0", active && !isAdd && "text-gold")} />
      {item.label}
    </Link>
  );
}

export function AdminShell({
  children,
  userEmail,
}: {
  children: React.ReactNode;
  userEmail?: string | null;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebar = (
    <div className="flex h-full flex-col bg-black text-white">
      <div className="border-b border-neutral-800 px-5 py-5">
        <Link href="/admin" className="block">
          <span className="relative mb-2 block h-10 w-[5.5rem] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/brand/ing-logo.png"
              alt="ING"
              className="h-full w-full scale-[1.85] object-contain invert"
            />
          </span>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold">
            Control Center
          </p>
          <p className="mt-1 text-sm font-black uppercase leading-tight">
            {siteConfig.name}
          </p>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-4">
        {navGroups.map((group) => (
          <div key={group.title} className="mb-6">
            <p className="mb-1 px-3 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
              {group.title}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => (
                <li key={item.href}>
                  <NavLink
                    item={item}
                    pathname={pathname}
                    onNavigate={() => setMobileOpen(false)}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-neutral-800 p-4">
        <p className="truncate text-[11px] text-neutral-500">{userEmail}</p>
        <Link
          href="/"
          className="mt-2 block text-xs font-semibold uppercase tracking-wide text-neutral-400 hover:text-gold"
        >
          ← Storefront
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-100">
      <header className="sticky top-0 z-40 border-b border-neutral-800 bg-black text-white">
        <div className="flex h-14 items-center justify-between gap-4 px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open admin menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <p className="hidden text-xs font-semibold uppercase tracking-widest text-neutral-400 sm:block">
              Operations
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/admin/products/new"
              className="bg-gold px-4 py-2 text-xs font-bold uppercase tracking-wide text-black hover:bg-gold-light"
            >
              + Add product
            </Link>
            <Link href="/" className="hidden text-xs font-semibold text-gold hover:text-gold-light sm:inline">
              View site
            </Link>
            <Link href="/api/auth/logout" className="text-xs text-neutral-400 hover:text-white">
              Sign out
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1600px]">
        <aside className="hidden w-64 shrink-0 lg:block lg:min-h-[calc(100vh-3.5rem)]">
          {sidebar}
        </aside>

        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-black/70"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
            />
            <div className="absolute left-0 top-0 flex h-full w-[min(100%,280px)] flex-col shadow-xl">
              <div className="flex h-14 items-center justify-end bg-black px-3">
                <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close">
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>
              {sidebar}
            </div>
          </div>
        )}

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
