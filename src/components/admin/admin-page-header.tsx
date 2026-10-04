import Link from "next/link";
import { cn } from "@/lib/utils";

type Breadcrumb = { label: string; href?: string };

type AdminPageHeaderProps = {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  actions?: React.ReactNode;
};

export function AdminPageHeader({
  title,
  description,
  breadcrumbs,
  actions,
}: AdminPageHeaderProps) {
  return (
    <header className="border-b border-neutral-200 bg-white px-6 py-5 lg:px-8">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="mb-2 text-xs text-muted" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, i) => (
            <span key={crumb.label}>
              {i > 0 && <span className="mx-2 text-neutral-300">/</span>}
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-gold-dark">
                  {crumb.label}
                </Link>
              ) : (
                <span className="font-medium text-black">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-black uppercase tracking-tight text-black sm:text-2xl">
            {title}
          </h1>
          {description && (
            <p className="mt-1 max-w-2xl text-sm text-muted">{description}</p>
          )}
        </div>
        {actions && (
          <div className={cn("flex shrink-0 flex-wrap items-center gap-2")}>
            {actions}
          </div>
        )}
      </div>
    </header>
  );
}
