import { listCategories, listSubcategories } from "@/lib/products/repository";
import { CatalogForms } from "@/components/admin/catalog-forms";

export default async function AdminCatalogPage() {
  const [categories, subcategories] = await Promise.all([
    listCategories(),
    listSubcategories(),
  ]);

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-black uppercase">Catalog</h1>
      <p className="text-sm text-muted">
        Categories and subcategories live in Supabase. Products you add
        will appear in these groups on the shop.
      </p>
      <CatalogForms
        categories={categories as { id: string; name: string; slug: string }[]}
        subcategories={
          subcategories as {
            id: string;
            name: string;
            slug: string;
            category_id: string;
          }[]
        }
      />
    </div>
  );
}
