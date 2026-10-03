import { ProductForm } from "@/components/admin/product-form";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="text-xl font-black uppercase">Add product</h1>
      <div className="mt-6 border border-neutral-200 bg-white p-6">
        <ProductForm />
      </div>
    </div>
  );
}
