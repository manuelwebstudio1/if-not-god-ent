"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AdminError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="p-8">
      <div className="border border-neutral-200 bg-white p-8">
        <p className="text-xs font-bold uppercase tracking-widest text-gold">Admin</p>
        <h1 className="mt-2 text-2xl font-black uppercase">Dashboard could not load</h1>
        <p className="mt-2 max-w-xl text-sm text-muted">
          The admin area is available, but a catalog or settings request failed.
          You can retry or add products once Supabase keys are valid.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" onClick={reset} className={cn(buttonVariants({ size: "sm" }))}>
            Try again
          </button>
          <Link href="/admin/products/new" className={cn(buttonVariants({ variant: "outlineDark", size: "sm" }))}>
            Add product
          </Link>
        </div>
      </div>
    </div>
  );
}
