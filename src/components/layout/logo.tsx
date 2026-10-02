import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  variant = "full",
}: {
  className?: string;
  variant?: "full" | "mark";
}) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex flex-col leading-none", className)}
      aria-label="IF NOT GOD ENT — Home"
    >
      {variant === "mark" ? (
        <span className="font-black tracking-tighter text-white text-2xl">
          ING
        </span>
      ) : (
        <>
          <span className="font-black tracking-[0.2em] text-white text-lg sm:text-xl">
            ING
          </span>
          <span className="mt-0.5 hidden text-[10px] font-medium uppercase tracking-[0.35em] text-neutral-400 sm:block">
            IF NOT GOD ENT
          </span>
        </>
      )}
    </Link>
  );
}
