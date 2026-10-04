import { cn } from "@/lib/utils";

export function FormSection({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "border border-neutral-200 bg-white p-6 shadow-sm",
        className,
      )}
    >
      <div className="mb-5 border-b border-neutral-100 pb-4">
        <h2 className="text-sm font-black uppercase tracking-wide text-black">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm text-muted">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}
