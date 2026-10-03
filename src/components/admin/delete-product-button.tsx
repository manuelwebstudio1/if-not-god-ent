"use client";

import { useRouter } from "next/navigation";

export function DeleteProductButton({ id }: { id: string }) {
  const router = useRouter();

  async function remove() {
    if (!confirm("Delete this product permanently?")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={remove}
      className="text-xs font-bold uppercase text-red-600 hover:underline"
    >
      Delete
    </button>
  );
}
