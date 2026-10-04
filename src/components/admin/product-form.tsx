"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import { FormSection } from "@/components/admin/form-section";
import type { Product } from "@/types/commerce";
import { buttonVariants } from "@/components/ui/button";
import { cn, slugify } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2, "Product name is required"),
  slug: z.string().min(2),
  categoryId: z.string().uuid("Select a category"),
  subcategoryId: z.string().optional(),
  price: z.coerce.number().nonnegative(),
  compareAtPrice: z.preprocess(
    (v) => (v === "" || v == null ? undefined : v),
    z.coerce.number().nonnegative().optional(),
  ),
  stock: z.coerce.number().int().nonnegative(),
  shortDescription: z.string(),
  description: z.string(),
  featuresText: z.string(),
  specificationsText: z.string(),
  warranty: z.string(),
  shippingInfo: z.string(),
  isFeatured: z.boolean(),
  isAvailable: z.boolean(),
  isNew: z.boolean(),
  isBestSeller: z.boolean(),
});

type FormValues = z.output<typeof schema>;

type Catalog = {
  categories: { id: string; name: string; slug: string }[];
  subcategories: { id: string; name: string; slug: string; category_id: string }[];
};

export function ProductForm({
  product,
  productDb,
}: {
  product?: Product;
  productDb?: {
    categoryId: string;
    subcategoryId: string | null;
    images: string[];
  };
}) {
  const router = useRouter();
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [images, setImages] = useState<string[]>(productDb?.images ?? product?.images ?? []);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [slugTouched, setSlugTouched] = useState(Boolean(product?.slug));

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: {
      name: product?.name ?? "",
      slug: product?.slug ?? "",
      categoryId: productDb?.categoryId ?? "",
      subcategoryId: productDb?.subcategoryId ?? "",
      price: product?.price ?? 0,
      compareAtPrice: product?.compareAtPrice ?? undefined,
      stock: product?.stock ?? 0,
      shortDescription: product?.shortDescription ?? "",
      description: product?.description ?? "",
      featuresText: product?.features?.join("\n") ?? "",
      specificationsText: product
        ? Object.entries(product.specifications)
            .map(([k, v]) => `${k}: ${v}`)
            .join("\n")
        : "",
      warranty: product?.warranty ?? "12 months manufacturer warranty",
      shippingInfo:
        product?.shippingInfo ?? "Nationwide delivery within 2–5 business days",
      isFeatured: product?.isFeatured ?? false,
      isAvailable: product?.isAvailable ?? true,
      isNew: product?.isNew ?? false,
      isBestSeller: product?.isBestSeller ?? false,
    },
  });

  const categoryId = form.watch("categoryId");
  const productName = form.watch("name");

  useEffect(() => {
    fetch("/api/admin/catalog")
      .then((r) => r.json())
      .then((data) => setCatalog(data));
  }, []);

  useEffect(() => {
    if (!categoryId) return;
    fetch(`/api/admin/catalog?categoryId=${categoryId}`)
      .then((r) => r.json())
      .then((data) =>
        setCatalog((c) =>
          c ? { ...c, subcategories: data.subcategories ?? [] } : c,
        ),
      );
  }, [categoryId]);

  useEffect(() => {
    if (slugTouched || product) return;
    if (productName.length >= 2) {
      form.setValue("slug", slugify(productName), { shouldValidate: true });
    }
  }, [productName, slugTouched, product, form]);

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/products/upload", { method: "POST", body: fd });
    const data = await res.json();
    setUploading(false);
    if (!res.ok) {
      setError(data.error ?? "Upload failed");
      return;
    }
    setImages((prev) => [...prev, data.url]);
  }

  function parseSpecs(text: string) {
    const specs: Record<string, string> = {};
    text.split("\n").forEach((line) => {
      const idx = line.indexOf(":");
      if (idx > 0) {
        specs[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
      }
    });
    return specs;
  }

  async function onSubmit(values: FormValues) {
    setError("");
    if (images.length === 0) {
      setError("Add at least one product image before saving.");
      return;
    }
    const payload = {
      name: values.name,
      slug: values.slug || slugify(values.name),
      categoryId: values.categoryId,
      subcategoryId: values.subcategoryId || null,
      price: values.price,
      compareAtPrice:
        values.compareAtPrice === undefined ? null : values.compareAtPrice,
      stock: values.stock,
      images,
      shortDescription: values.shortDescription,
      description: values.description,
      features: values.featuresText.split("\n").filter(Boolean),
      specifications: parseSpecs(values.specificationsText),
      warranty: values.warranty,
      shippingInfo: values.shippingInfo,
      isFeatured: values.isFeatured,
      isAvailable: values.isAvailable,
      isNew: values.isNew,
      isBestSeller: values.isBestSeller,
    };

    const url = product
      ? `/api/admin/products/${product.id}`
      : "/api/admin/products";
    const method = product ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Save failed");
      return;
    }
    router.push("/admin/products");
    router.refresh();
  }

  const input =
    "w-full border border-neutral-300 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-gold focus:ring-1 focus:ring-gold/30";
  const labelClass = "block text-xs font-bold uppercase tracking-wide text-neutral-700";
  const fieldError = (name: keyof FormValues) =>
    form.formState.errors[name]?.message as string | undefined;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <FormSection
        title="Product identity"
        description="Name and catalog placement shown on the storefront."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelClass}>
              Product name *
              <input {...form.register("name")} className={cn(input, "mt-1.5")} placeholder="INGCO Impact Drill 850W" />
            </label>
            {fieldError("name") && (
              <p className="mt-1 text-xs text-red-600">{fieldError("name")}</p>
            )}
          </div>
          <div>
            <label className={labelClass}>
              URL slug
              <input
                {...form.register("slug")}
                className={cn(input, "mt-1.5")}
                onFocus={() => setSlugTouched(true)}
                placeholder="ingco-impact-drill-850w"
              />
            </label>
          </div>
          <div>
            <label className={labelClass}>
              Category *
              <select {...form.register("categoryId")} className={cn(input, "mt-1.5")}>
                <option value="">Select category…</option>
                {catalog?.categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            {fieldError("categoryId") && (
              <p className="mt-1 text-xs text-red-600">{fieldError("categoryId")}</p>
            )}
          </div>
          <div>
            <label className={labelClass}>
              Subcategory
              <select {...form.register("subcategoryId")} className={cn(input, "mt-1.5")}>
                <option value="">None</option>
                {catalog?.subcategories.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </FormSection>

      <FormSection
        title="Pricing & inventory"
        description="Prices in Ghana cedis (GH₵). Set stock to zero to mark out of stock on the site."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className={labelClass}>
              Price (GH₵) *
              <input type="number" step="0.01" min={0} {...form.register("price")} className={cn(input, "mt-1.5")} />
            </label>
          </div>
          <div>
            <label className={labelClass}>
              Compare at price
              <input type="number" step="0.01" min={0} {...form.register("compareAtPrice")} className={cn(input, "mt-1.5")} placeholder="Optional" />
            </label>
            <p className="mt-1 text-[11px] text-muted">Shows as strikethrough when higher than sale price.</p>
          </div>
          <div>
            <label className={labelClass}>
              Stock quantity *
              <input type="number" min={0} {...form.register("stock")} className={cn(input, "mt-1.5")} />
            </label>
          </div>
        </div>
      </FormSection>

      <FormSection
        title="Product images"
        description="Upload clear photos. The first image is used as the main thumbnail."
      >
        <div className="flex flex-wrap gap-3">
          {images.map((url, i) => (
            <div key={url} className="relative h-24 w-24 border border-neutral-200 bg-neutral-50">
              {i === 0 && (
                <span className="absolute left-0 top-0 z-10 bg-black px-1.5 py-0.5 text-[9px] font-bold uppercase text-gold">
                  Main
                </span>
              )}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                className="absolute right-0 top-0 bg-black/80 px-1.5 py-0.5 text-xs text-white hover:bg-red-700"
                onClick={() => setImages((imgs) => imgs.filter((x) => x !== url))}
                aria-label="Remove image"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <label className="mt-4 flex cursor-pointer flex-col items-center justify-center border-2 border-dashed border-neutral-300 bg-neutral-50 px-6 py-8 text-center transition-colors hover:border-gold hover:bg-white">
          <span className="text-sm font-semibold text-black">
            {uploading ? "Uploading…" : "Click to upload image"}
          </span>
          <span className="mt-1 text-xs text-muted">PNG, JPG or WebP</span>
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={onUpload}
            disabled={uploading}
          />
        </label>
      </FormSection>

      <FormSection title="Descriptions" description="Used on product pages and search results.">
        <div className="space-y-4">
          <label className={labelClass}>
            Short description
            <textarea {...form.register("shortDescription")} rows={2} className={cn(input, "mt-1.5")} placeholder="One-line summary for cards and listings" />
          </label>
          <label className={labelClass}>
            Full description
            <textarea {...form.register("description")} rows={5} className={cn(input, "mt-1.5")} />
          </label>
          <label className={labelClass}>
            Features (one per line)
            <textarea {...form.register("featuresText")} rows={4} className={cn(input, "mt-1.5")} />
          </label>
          <label className={labelClass}>
            Specifications (Key: Value per line)
            <textarea
              {...form.register("specificationsText")}
              rows={4}
              className={cn(input, "mt-1.5 font-mono text-xs")}
              placeholder={"Power: 850W\nWeight: 2.1 kg"}
            />
          </label>
        </div>
      </FormSection>

      <FormSection title="Fulfillment">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelClass}>
            Warranty
            <input {...form.register("warranty")} className={cn(input, "mt-1.5")} />
          </label>
          <label className={labelClass}>
            Shipping information
            <input {...form.register("shippingInfo")} className={cn(input, "mt-1.5")} />
          </label>
        </div>
      </FormSection>

      <FormSection title="Storefront visibility">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {(
            [
              ["isFeatured", "Featured on homepage"],
              ["isAvailable", "Available for purchase"],
              ["isNew", "Show “New” badge"],
              ["isBestSeller", "Best seller"],
            ] as const
          ).map(([key, text]) => (
            <label
              key={key}
              className="flex cursor-pointer items-start gap-3 border border-neutral-200 p-3 hover:border-gold/50"
            >
              <input type="checkbox" {...form.register(key)} className="mt-0.5" />
              <span className="text-sm font-medium text-neutral-800">{text}</span>
            </label>
          ))}
        </div>
      </FormSection>

      <div className="sticky bottom-0 z-10 flex flex-wrap items-center justify-between gap-3 border border-neutral-200 bg-white p-4 shadow-lg">
        <Link
          href="/admin/products"
          className={cn(buttonVariants({ variant: "outlineDark", size: "sm" }))}
        >
          Cancel
        </Link>
        <button type="submit" className={cn(buttonVariants({ size: "default" }), "min-w-[160px]")}>
          {product ? "Save changes" : "Publish product"}
        </button>
      </div>
    </form>
  );
}
