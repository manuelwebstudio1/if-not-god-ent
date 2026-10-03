import { createSupabaseAdmin, createSupabasePublic, isSupabaseConfigured } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import type { Product } from "@/types/commerce";
import { mapRowToProduct } from "./mapper";
import type { DbProductRow, ProductInput } from "./types";
import type { ShopFilters } from "@/lib/catalog";
import type { Brand, Category } from "@/types/commerce";
import { DEFAULT_CATEGORY_IMAGE } from "./defaults";

const productSelect = `
  *,
  categories ( name, slug ),
  subcategories ( name, slug ),
  brands ( name, slug )
`;

function client(admin = false) {
  return admin ? createSupabaseAdmin() : createSupabasePublic();
}

export async function listProducts(options?: {
  admin?: boolean;
  featured?: boolean;
  limit?: number;
}): Promise<Product[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = client(options?.admin);
  let q = supabase.from("products").select(productSelect).order("created_at", {
    ascending: false,
  });
  if (!options?.admin) q = q.eq("is_available", true);
  if (options?.featured) q = q.eq("is_featured", true);
  if (options?.limit) q = q.limit(options.limit);
  const { data, error } = await q;
  if (error) throw error;
  return (data as DbProductRow[]).map(mapRowToProduct);
}

export async function getProductBySlug(
  categorySlug: string,
  slug: string,
  admin = false,
): Promise<Product | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = client(admin);
  let q = supabase.from("products").select(productSelect).eq("slug", slug);
  if (!admin) q = q.eq("is_available", true);
  const { data, error } = await q.maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const row = data as DbProductRow;
  if (row.categories?.slug !== categorySlug) return null;
  return mapRowToProduct(row);
}

export async function getProductsByBrand(brandSlug: string): Promise<Product[]> {
  if (!isSupabaseConfigured()) return [];
  const { data, error } = await client()
    .from("products")
    .select(productSelect)
    .eq("is_available", true)
    .eq("brands.slug", brandSlug);
  if (error) {
    const { data: all } = await client().from("products").select(productSelect).eq("is_available", true);
    return (all as DbProductRow[])
      .filter((p) => p.brands?.slug === brandSlug)
      .map(mapRowToProduct);
  }
  return (data as DbProductRow[]).map(mapRowToProduct);
}

export async function searchProducts(query: string, limit = 12): Promise<Product[]> {
  if (!isSupabaseConfigured() || !query.trim()) return [];
  const q = query.trim();
  const supabase = client();
  const { data, error } = await supabase
    .from("products")
    .select(productSelect)
    .eq("is_available", true)
    .or(`name.ilike.%${q}%,sku.ilike.%${q}%,short_description.ilike.%${q}%`)
    .limit(limit);
  if (error) throw error;
  let rows = data as DbProductRow[];
  if (rows.length === 0) {
    const { data: brandHit } = await supabase
      .from("brands")
      .select("id")
      .ilike("name", `%${q}%`)
      .limit(1)
      .maybeSingle();
    if (brandHit) {
      const { data: byBrand } = await supabase
        .from("products")
        .select(productSelect)
        .eq("is_available", true)
        .eq("brand_id", brandHit.id)
        .limit(limit);
      rows = (byBrand as DbProductRow[]) ?? [];
    }
  }
  return rows.map(mapRowToProduct);
}

export async function filterProducts(filters: ShopFilters): Promise<Product[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = client();
  let q = supabase.from("products").select(productSelect).eq("is_available", true);

  if (filters.inStock) q = q.gt("stock", 0);
  if (filters.onSale) q = q.not("compare_at_price", "is", null);
  if (filters.isNew) q = q.eq("is_new", true);
  if (filters.minPrice != null) q = q.gte("price", filters.minPrice);
  if (filters.maxPrice != null) q = q.lte("price", filters.maxPrice);
  if (filters.minRating != null) q = q.gte("rating", filters.minRating);

  const { data, error } = await q;
  if (error) throw error;
  let products = (data as DbProductRow[]).map(mapRowToProduct);

  if (filters.search) {
    const s = filters.search.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        p.brand.toLowerCase().includes(s) ||
        p.sku.toLowerCase().includes(s) ||
        p.category.toLowerCase().includes(s),
    );
  }
  if (filters.category) {
    products = products.filter((p) => p.categorySlug === filters.category);
  }
  if (filters.brand) {
    products = products.filter((p) => p.brandSlug === filters.brand);
  }

  switch (filters.sort) {
    case "newest":
      products.sort((a, b) => Number(b.isNew) - Number(a.isNew));
      break;
    case "best-selling":
      products.sort((a, b) => Number(b.isBestSeller) - Number(a.isBestSeller));
      break;
    case "rating":
      products.sort((a, b) => b.rating - a.rating);
      break;
    case "price-asc":
      products.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      products.sort((a, b) => b.price - a.price);
      break;
    default:
      products.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
  }

  return products;
}

export async function getRelatedProducts(product: Product, limit = 4) {
  const all = await listProducts({ limit: 50 });
  return all
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.categorySlug === product.categorySlug ||
          p.brandSlug === product.brandSlug),
    )
    .slice(0, limit);
}

export async function listCategories() {
  if (!isSupabaseConfigured()) return [];
  const { data, error } = await client().from("categories").select("*").order("name");
  if (error) throw error;
  return data ?? [];
}

export async function listCategoriesWithCounts(): Promise<Category[]> {
  if (!isSupabaseConfigured()) return [];
  const cats = await listCategories();
  if (!cats.length) return [];
  const { data: rows, error } = await client()
    .from("products")
    .select("category_id")
    .eq("is_available", true);
  if (error) throw error;
  const counts = new Map<string, number>();
  for (const row of rows ?? []) {
    const id = row.category_id as string;
    counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  return cats.map((c) => ({
    id: c.id as string,
    name: c.name as string,
    slug: c.slug as string,
    image: (c.image as string | null) || DEFAULT_CATEGORY_IMAGE,
    productCount: counts.get(c.id as string) ?? 0,
  }));
}

export async function getBrandBySlug(slug: string): Promise<Brand | null> {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await client()
    .from("brands")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    id: data.id as string,
    name: data.name as string,
    slug: data.slug as string,
    logo: (data.logo as string | null) ?? undefined,
  };
}

export async function listBrandsForStore(): Promise<Brand[]> {
  if (!isSupabaseConfigured()) return [];
  const { data, error } = await client().from("brands").select("*").order("name");
  if (error) throw error;
  return (data ?? []).map((b) => ({
    id: b.id as string,
    name: b.name as string,
    slug: b.slug as string,
    logo: (b.logo as string | null) ?? undefined,
  }));
}

export async function listProductsForAdminInventory() {
  return listProducts({ admin: true });
}

export async function listLowStockProducts(threshold = 5) {
  const all = await listProducts({ admin: true });
  return all.filter((p) => p.stock > 0 && p.stock <= threshold);
}

export async function listSubcategories(categoryId?: string) {
  if (!isSupabaseConfigured()) return [];
  let q = client().from("subcategories").select("*").order("name");
  if (categoryId) q = q.eq("category_id", categoryId);
  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}

export async function listBrands() {
  if (!isSupabaseConfigured()) return [];
  const { data, error } = await client().from("brands").select("*").order("name");
  if (error) throw error;
  return data ?? [];
}

export async function createProduct(input: ProductInput) {
  const supabase = createSupabaseAdmin();
  const slug = input.slug?.trim() || slugify(input.name);
  const { data, error } = await supabase
    .from("products")
    .insert({
      name: input.name,
      slug,
      sku: input.sku,
      category_id: input.categoryId,
      subcategory_id: input.subcategoryId ?? null,
      brand_id: input.brandId,
      price: input.price,
      compare_at_price: input.compareAtPrice ?? null,
      stock: input.stock,
      images: input.images,
      short_description: input.shortDescription,
      description: input.description,
      features: input.features,
      specifications: input.specifications,
      warranty: input.warranty ?? "",
      shipping_info: input.shippingInfo ?? "",
      is_featured: input.isFeatured,
      is_available: input.isAvailable,
      is_new: input.isNew ?? false,
      is_best_seller: input.isBestSeller ?? false,
    })
    .select(productSelect)
    .single();
  if (error) throw error;
  return mapRowToProduct(data as DbProductRow);
}

export async function updateProduct(id: string, input: Partial<ProductInput>) {
  const supabase = createSupabaseAdmin();
  const payload: Record<string, unknown> = {};
  if (input.name != null) payload.name = input.name;
  if (input.slug != null) payload.slug = input.slug;
  if (input.sku != null) payload.sku = input.sku;
  if (input.categoryId != null) payload.category_id = input.categoryId;
  if (input.subcategoryId !== undefined) payload.subcategory_id = input.subcategoryId;
  if (input.brandId != null) payload.brand_id = input.brandId;
  if (input.price != null) payload.price = input.price;
  if (input.compareAtPrice !== undefined) payload.compare_at_price = input.compareAtPrice;
  if (input.stock != null) payload.stock = input.stock;
  if (input.images != null) payload.images = input.images;
  if (input.shortDescription != null) payload.short_description = input.shortDescription;
  if (input.description != null) payload.description = input.description;
  if (input.features != null) payload.features = input.features;
  if (input.specifications != null) payload.specifications = input.specifications;
  if (input.warranty != null) payload.warranty = input.warranty;
  if (input.shippingInfo != null) payload.shipping_info = input.shippingInfo;
  if (input.isFeatured != null) payload.is_featured = input.isFeatured;
  if (input.isAvailable != null) payload.is_available = input.isAvailable;
  if (input.isNew != null) payload.is_new = input.isNew;
  if (input.isBestSeller != null) payload.is_best_seller = input.isBestSeller;

  const { data, error } = await supabase
    .from("products")
    .update(payload)
    .eq("id", id)
    .select(productSelect)
    .single();
  if (error) throw error;
  return mapRowToProduct(data as DbProductRow);
}

export async function deleteProduct(id: string) {
  const { error } = await createSupabaseAdmin().from("products").delete().eq("id", id);
  if (error) throw error;
}

export async function getProductById(id: string) {
  const { data, error } = await createSupabaseAdmin()
    .from("products")
    .select(productSelect)
    .eq("id", id)
    .single();
  if (error) throw error;
  return mapRowToProduct(data as DbProductRow);
}

export async function getProductsByIds(ids: string[]) {
  if (!ids.length || !isSupabaseConfigured()) return [];
  const { data, error } = await client()
    .from("products")
    .select(productSelect)
    .in("id", ids)
    .eq("is_available", true);
  if (error) throw error;
  return (data as DbProductRow[]).map(mapRowToProduct);
}

export async function countProducts(admin = false) {
  if (!isSupabaseConfigured()) return 0;
  let q = client(admin).from("products").select("*", { count: "exact", head: true });
  if (!admin) q = q.eq("is_available", true);
  const { count, error } = await q;
  if (error) throw error;
  return count ?? 0;
}
