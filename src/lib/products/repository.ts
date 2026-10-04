import { aliasCategorySlug } from "@/data/categories";
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

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  sort_order?: number;
};

function client(admin = false) {
  if (admin) {
    try {
      return createSupabaseAdmin();
    } catch {
      return createSupabasePublic();
    }
  }
  return createSupabasePublic();
}

function configured() {
  return isSupabaseConfigured();
}

export async function resolveCategorySlug(slug?: string | null): Promise<string> {
  const incoming = slug?.trim() ?? "";
  if (!incoming) return "";
  const fallback = aliasCategorySlug(incoming);
  if (!configured()) return fallback;
  try {
    const supabase = client();
    const { data: direct } = await supabase
      .from("categories")
      .select("slug")
      .eq("slug", incoming)
      .maybeSingle();
    if (direct?.slug) return direct.slug as string;

    const { data: alias } = await supabase
      .from("category_aliases")
      .select("categories(slug)")
      .eq("slug", incoming)
      .maybeSingle();
    const related = alias?.categories as { slug: string } | { slug: string }[] | null;
    if (Array.isArray(related) && related[0]?.slug) return related[0].slug;
    if (related && !Array.isArray(related) && related.slug) return related.slug;
  } catch {
    // Use the local URL alias only when the alias table is unreachable.
  }
  return fallback;
}

export async function listProducts(options?: {
  admin?: boolean;
  featured?: boolean;
  limit?: number;
}): Promise<Product[]> {
  if (!configured()) return [];
  const supabase = client(options?.admin);
  let q = supabase.from("products").select(productSelect).order("created_at", {
    ascending: false,
  });
  if (!options?.admin) q = q.eq("is_available", true);
  if (options?.featured) q = q.eq("is_featured", true);
  if (options?.limit) q = q.limit(options.limit);
  const { data, error } = await q;
  if (error) throw error;
  return ((data ?? []) as DbProductRow[]).map(mapRowToProduct);
}

export async function getProductBySlug(
  categorySlug: string,
  slug: string,
  admin = false,
): Promise<Product | null> {
  if (!configured()) return null;
  const wanted = await resolveCategorySlug(categorySlug);
  const supabase = client(admin);
  let q = supabase.from("products").select(productSelect).eq("slug", slug);
  if (!admin) q = q.eq("is_available", true);
  const { data, error } = await q.maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const product = mapRowToProduct(data as DbProductRow);
  if (wanted && product.categorySlug !== wanted) return null;
  return product;
}

export async function getProductsByBrand(brandSlug: string): Promise<Product[]> {
  const all = await listProducts();
  return all.filter((p) => p.brandSlug === brandSlug);
}

export async function searchProducts(query: string, limit = 12): Promise<Product[]> {
  if (!query.trim() || !configured()) return [];
  const q = query.trim();
  const supabase = client();
  const { data, error } = await supabase
    .from("products")
    .select(productSelect)
    .eq("is_available", true)
    .or(`name.ilike.%${q}%,sku.ilike.%${q}%,short_description.ilike.%${q}%`)
    .limit(limit);
  if (error) throw error;
  return ((data ?? []) as DbProductRow[]).map(mapRowToProduct);
}

function applyShopFilters(products: Product[], filters: ShopFilters) {
  let next = [...products];
  if (filters.inStock) next = next.filter((p) => p.stock > 0);
  if (filters.onSale) next = next.filter((p) => p.compareAtPrice != null);
  if (filters.isNew) next = next.filter((p) => p.isNew);
  if (filters.minPrice != null) next = next.filter((p) => p.price >= filters.minPrice!);
  if (filters.maxPrice != null) next = next.filter((p) => p.price <= filters.maxPrice!);
  if (filters.minRating != null) next = next.filter((p) => p.rating >= filters.minRating!);
  if (filters.search) {
    const s = filters.search.toLowerCase();
    next = next.filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        p.brand.toLowerCase().includes(s) ||
        p.sku.toLowerCase().includes(s) ||
        p.category.toLowerCase().includes(s),
    );
  }
  if (filters.category) {
    const wanted = aliasCategorySlug(filters.category);
    next = next.filter((p) => p.categorySlug === wanted);
  }
  if (filters.brand) {
    next = next.filter((p) => p.brandSlug === filters.brand);
  }
  return next;
}

export async function filterProducts(filters: ShopFilters): Promise<Product[]> {
  if (!configured()) return [];
  const supabase = client();
  const { data, error } = await supabase
    .from("products")
    .select(productSelect)
    .eq("is_available", true);
  if (error) throw error;
  let products = ((data ?? []) as DbProductRow[]).map(mapRowToProduct);
  if (filters.category) {
    filters = { ...filters, category: await resolveCategorySlug(filters.category) };
  }
  products = applyShopFilters(products, filters);

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

export async function listCategories(): Promise<CategoryRow[]> {
  if (!configured()) return [];
  const { data, error } = await client()
    .from("categories")
    .select("id, name, slug, image, sort_order")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  if (error) throw error;
  return (data ?? []) as CategoryRow[];
}

export async function listCategoriesWithCounts(): Promise<Category[]> {
  const [remote, products] = await Promise.all([
    listCategories(),
    listProducts({ admin: true }).catch(() => [] as Product[]),
  ]);
  return remote.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    image: c.image || DEFAULT_CATEGORY_IMAGE,
    productCount: products.filter((p) => p.categorySlug === c.slug).length,
  }));
}

export async function getBrandBySlug(slug: string): Promise<Brand | null> {
  if (!configured()) return null;
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
  const rows = await listBrands();
  return rows.map((b) => ({
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
  if (!configured()) return [];
  let q = client().from("subcategories").select("*").order("name");
  if (categoryId) q = q.eq("category_id", categoryId);
  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}

export async function listBrands() {
  if (!configured()) return [];
  const { data, error } = await client().from("brands").select("*").order("name");
  if (error) throw error;
  return data ?? [];
}

export async function createCategory(input: {
  name: string;
  slug?: string;
  image?: string;
}) {
  const supabase = createSupabaseAdmin();
  const { data: last } = await supabase
    .from("categories")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const { data, error } = await supabase
    .from("categories")
    .insert({
      name: input.name,
      slug: input.slug?.trim() || slugify(input.name),
      image: input.image || null,
      sort_order: ((last?.sort_order as number | undefined) ?? 0) + 1,
    })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function createBrand(input: { name: string; slug?: string }) {
  const { data, error } = await createSupabaseAdmin()
    .from("brands")
    .insert({
      name: input.name,
      slug: input.slug?.trim() || slugify(input.name),
    })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function createSubcategory(input: {
  name: string;
  slug?: string;
  categoryId: string;
}) {
  const { data, error } = await createSupabaseAdmin()
    .from("subcategories")
    .insert({
      name: input.name,
      slug: input.slug?.trim() || slugify(input.name),
      category_id: input.categoryId,
    })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function createProduct(input: ProductInput) {
  const supabase = createSupabaseAdmin();
  const slug = input.slug?.trim() || slugify(input.name);
  const sku =
    input.sku?.trim() ||
    `${slug.slice(0, 12).replace(/-/g, "").toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
  const { data, error } = await supabase
    .from("products")
    .insert({
      name: input.name,
      slug,
      sku,
      category_id: input.categoryId,
      subcategory_id: input.subcategoryId ?? null,
      brand_id: input.brandId ?? null,
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
  if (!ids.length || !configured()) return [];
  const { data, error } = await client()
    .from("products")
    .select(productSelect)
    .in("id", ids)
    .eq("is_available", true);
  if (error) throw error;
  return ((data ?? []) as DbProductRow[]).map(mapRowToProduct);
}

export async function countProducts(admin = false) {
  if (!configured()) return 0;
  let q = client(admin).from("products").select("*", { count: "exact", head: true });
  if (!admin) q = q.eq("is_available", true);
  const { count, error } = await q;
  if (error) throw error;
  return count ?? 0;
}
