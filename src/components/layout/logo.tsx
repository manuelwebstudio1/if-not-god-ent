import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  variant = "full",
  onDark = true,
}: {
  className?: string;
  variant?: "full" | "mark";
  onDark?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center gap-3", className)}
      aria-label="IF NOT GOD ENT — Home"
    >
      <span
        className={cn(
          "relative block overflow-hidden",
          variant === "mark" ? "h-11 w-[4.75rem]" : "h-12 w-[6.75rem]",
        )}
      >
        <Image
          src="/images/brand/ing-logo.png"
          alt="ING"
          fill
          sizes="140px"
          priority
          className={cn(
            "object-contain object-center scale-[1.85]",
            onDark && "invert",
          )}
        />
      </span>
      {variant === "full" ? (
        <span className="hidden text-[10px] font-medium uppercase tracking-[0.28em] text-neutral-400 sm:block">
          IF NOT GOD ENT
        </span>
      ) : null}
    </Link>
  );
}
