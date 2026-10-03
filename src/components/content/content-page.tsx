export function ContentPage({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="ing-container max-w-3xl py-12 lg:py-16">
      <h1 className="text-3xl font-black uppercase tracking-tight">{title}</h1>
      {subtitle && (
        <p className="mt-3 text-sm leading-relaxed text-muted">{subtitle}</p>
      )}
      <div className="prose prose-neutral mt-8 max-w-none text-sm leading-relaxed [&_h2]:mt-8 [&_h2]:text-base [&_h2]:font-black [&_h2]:uppercase">
        {children}
      </div>
    </div>
  );
}
