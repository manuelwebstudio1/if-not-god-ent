import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { getAdminCredentials } from "@/config/admin";
import { siteConfig } from "@/config/site";
import { getSession } from "@/lib/auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Sign In",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session?.role === "ADMIN") redirect("/admin");

  const admin = getAdminCredentials();

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-black px-4 py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(201,162,39,0.12),_transparent_55%)]" />
      <div className="relative w-full max-w-md border border-neutral-800 bg-neutral-950 p-8 shadow-2xl">
        <span className="relative mb-4 block h-12 w-[6.5rem] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/brand/ing-logo.png"
            alt="ING"
            className="h-full w-full scale-[1.85] object-contain invert"
          />
        </span>
        <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-gold">
          Administrator
        </p>
        <h1 className="mt-3 text-3xl font-black uppercase tracking-tight text-white">
          {siteConfig.name}
        </h1>
        <p className="mt-2 text-sm text-neutral-400">
          Sign in to manage products, orders, quotes and inventory.
        </p>
        <div className="mt-8">
          <AdminLoginForm defaultEmail={admin.email} />
        </div>
      </div>
    </div>
  );
}
