"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import type { Product } from "@/types/commerce";
import { buttonVariants } from "@/components/ui/button";
import { cn, slugify } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  sku: z.string().min(2),
  categoryId: z.string().uuid(),
  subcategoryId: z.string().optional(),
  brandId: z.string().uuid(),
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
  brands: { id: string; name: string; slug: string }[];
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
    brandId: string;
    images: string[];
  };
}) {
  const router = useRouter();
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [images, setImages] = useState<string[]>(productDb?.images ?? product?.images ?? []);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: {
      name: product?.name ?? "",
      slug: product?.slug ?? "",
      sku: product?.sku ?? "",
      categoryId: productDb?.categoryId ?? "",
      subcategoryId: productDb?.subcategoryId ?? "",
      brandId: productDb?.brandId ?? "",
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
      warranty: product?.warranty ?? "",
      shippingInfo: product?.shippingInfo ?? "",
      isFeatured: product?.isFeatured ?? false,
      isAvailable: product?.isAvailable ?? true,
      isNew: product?.isNew ?? false,
      isBestSeller: product?.isBestSeller ?? false,
    },
  });

  const categoryId = form.watch("categoryId");

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

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
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
      setError("Add at least one product image");
      return;
    }
    const payload = {
      name: values.name,
      slug: values.slug || slugify(values.name),
      sku: values.sku,
      categoryId: values.categoryId,
      subcategoryId: values.subcategoryId || null,
      brandId: values.brandId,
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
    "w-full border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-gold";

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-3xl space-y-6">
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-xs font-bold uppercase">
          Name
          <input {...form.register("name")} className={cn(input, "mt-1")} />
        </label>
        <label className="block text-xs font-bold uppercase">
          SKU
          <input {...form.register("sku")} className={cn(input, "mt-1")} />
        </label>
        <label className="block text-xs font-bold uppercase">
          URL Slug
          <input {...form.register("slug")} className={cn(input, "mt-1")} />
        </label>
        <label className="block text-xs font-bold uppercase">
          Category
          <select {...form.register("categoryId")} className={cn(input, "mt-1")}>
            <option value="">Select…</option>
            {catalog?.categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-xs font-bold uppercase">
          Subcategory
          <select {...form.register("subcategoryId")} className={cn(input, "mt-1")}>
            <option value="">None</option>
            {catalog?.subcategories.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-xs font-bold uppercase">
          Brand
          <select {...form.register("brandId")} className={cn(input, "mt-1")}>
            <option value="">Select…</option>
            {catalog?.brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-xs font-bold uppercase">
          Price (GH₵)
          <input type="number" step="0.01" {...form.register("price")} className={cn(input, "mt-1")} />
        </label>
        <label className="block text-xs font-bold uppercase">
          Discount price
          <input type="number" step="0.01" {...form.register("compareAtPrice")} className={cn(input, "mt-1")} />
        </label>
        <label className="block text-xs font-bold uppercase">
          Stock
          <input type="number" {...form.register("stock")} className={cn(input, "mt-1")} />
        </label>
      </div>

      <div className="flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" {...form.register("isFeatured")} /> Featured
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" {...form.register("isAvailable")} /> Available
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" {...form.register("isNew")} /> New
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" {...form.register("isBestSeller")} /> Best seller
        </label>
      </div>

      <div>
        <p className="text-xs font-bold uppercase">Images</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {images.map((url) => (
            <div key={url} className="relative h-20 w-20 border bg-neutral-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                className="absolute right-0 top-0 bg-black px-1 text-xs text-white"
                onClick={() => setImages((i) => i.filter((x) => x !== url))}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <input type="file" accept="image/*" className="mt-2 text-sm" onChange={onUpload} disabled={uploading} />
      </div>

      <label className="block text-xs font-bold uppercase">
        Short description
        <textarea {...form.register("shortDescription")} rows={2} className={cn(input, "mt-1")} />
      </label>
      <label className="block text-xs font-bold uppercase">
        Description
        <textarea {...form.register("description")} rows={5} className={cn(input, "mt-1")} />
      </label>
      <label className="block text-xs font-bold uppercase">
        Features (one per line)
        <textarea {...form.register("featuresText")} rows={4} className={cn(input, "mt-1")} />
      </label>
      <label className="block text-xs font-bold uppercase">
        Specifications (Key: Value per line)
        <textarea {...form.register("specificationsText")} rows={4} className={cn(input, "mt-1")} />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-xs font-bold uppercase">
          Warranty
          <input {...form.register("warranty")} className={cn(input, "mt-1")} />
        </label>
        <label className="block text-xs font-bold uppercase">
          Shipping info
          <input {...form.register("shippingInfo")} className={cn(input, "mt-1")} />
        </label>
      </div>

      <button type="submit" className={cn(buttonVariants(), "px-10")}>
        {product ? "Update product" : "Create product"}
      </button>
    </form>
  );
}
