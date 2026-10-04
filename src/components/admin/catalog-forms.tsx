"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Category = { id: string; name: string; slug: string };
type Subcategory = {
  id: string;
  name: string;
  slug: string;
  category_id: string;
};

export function CatalogForms({
  categories,
  subcategories,
}: {
  categories: Category[];
  subcategories: Subcategory[];
}) {
  const router = useRouter();
  const [error, setError] = useState("");

  async function submit(payload: Record<string, unknown>) {
    setError("");
    const res = await fetch("/api/admin/catalog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Save failed");
      return;
    }
    router.refresh();
  }

  const input = "mt-1 w-full border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-gold";

  return (
    <div className="space-y-8">
      {error && <p className="text-sm text-red-600">{error}</p>}

      <section className="grid gap-6 lg:grid-cols-2">
        <form
          className="border border-neutral-200 bg-white p-4"
          onSubmit={(e) => {
            e.preventDefault();
            const form = new FormData(e.currentTarget);
            void submit({
              type: "category",
              name: String(form.get("name") ?? ""),
            });
            e.currentTarget.reset();
          }}
        >
          <h2 className="text-sm font-black uppercase">Add category</h2>
          <input name="name" required placeholder="Name" className={input} />
          <button type="submit" className="mt-3 bg-black px-3 py-2 text-xs font-bold uppercase text-white">
            Save
          </button>
        </form>

        <form
          className="border border-neutral-200 bg-white p-4"
          onSubmit={(e) => {
            e.preventDefault();
            const form = new FormData(e.currentTarget);
            void submit({
              type: "subcategory",
              name: String(form.get("name") ?? ""),
              categoryId: String(form.get("categoryId") ?? ""),
            });
            e.currentTarget.reset();
          }}
        >
          <h2 className="text-sm font-black uppercase">Add subcategory</h2>
          <select name="categoryId" required className={input}>
            <option value="">Parent category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <input name="name" required placeholder="Name" className={input} />
          <button type="submit" className="mt-3 bg-black px-3 py-2 text-xs font-bold uppercase text-white">
            Save
          </button>
        </form>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <List title="Categories" items={categories.map((c) => c.name)} />
        <List
          title="Subcategories"
          items={subcategories.map((s) => {
            const parent = categories.find((c) => c.id === s.category_id)?.name;
            return parent ? `${parent} / ${s.name}` : s.name;
          })}
        />
      </section>
    </div>
  );
}

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="border border-neutral-200 bg-white p-4">
      <h2 className="text-sm font-black uppercase">{title}</h2>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-muted">None yet.</p>
      ) : (
        <ul className="mt-3 space-y-1 text-sm">
          {items.map((item) => (
            <li key={item} className="border-b border-neutral-100 py-1">
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
