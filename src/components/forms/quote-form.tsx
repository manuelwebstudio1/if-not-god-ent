"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  company: z.string().optional(),
  phone: z.string().min(6, "Phone is required"),
  email: z.string().email("Valid email required"),
  products: z.string().min(3, "Describe products required"),
  quantity: z.string().optional(),
  projectType: z.string().optional(),
  location: z.string().optional(),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function QuoteForm() {
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    const res = await fetch("/api/quotes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = (await res.json()) as { id?: string; error?: string };
    if (!res.ok) throw new Error(data.error ?? "Submission failed");
    setSubmittedId(data.id ?? "confirmed");
    reset();
  }

  if (submittedId) {
    return (
      <div className="border border-green-200 bg-green-50 p-8 text-center">
        <h2 className="text-xl font-black uppercase text-green-900">
          Quote Request Received
        </h2>
        <p className="mt-3 text-sm text-green-800">
          Reference: <strong>{submittedId}</strong>. Our team will contact you
          within one business day with pricing and availability.
        </p>
        <button
          type="button"
          className="mt-6 text-sm font-semibold underline"
          onClick={() => setSubmittedId(null)}
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full Name" error={errors.name?.message}>
          <input {...register("name")} className={inputClass} />
        </Field>
        <Field label="Company" error={errors.company?.message}>
          <input {...register("company")} className={inputClass} />
        </Field>
        <Field label="Phone" error={errors.phone?.message}>
          <input {...register("phone")} className={inputClass} />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <input type="email" {...register("email")} className={inputClass} />
        </Field>
      </div>
      <Field label="Products Required" error={errors.products?.message}>
        <textarea {...register("products")} rows={3} className={inputClass} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Quantity" error={errors.quantity?.message}>
          <input {...register("quantity")} className={inputClass} />
        </Field>
        <Field label="Project Type" error={errors.projectType?.message}>
          <input {...register("projectType")} className={inputClass} />
        </Field>
      </div>
      <Field label="Delivery Location" error={errors.location?.message}>
        <input {...register("location")} className={inputClass} />
      </Field>
      <Field label="Additional Message" error={errors.message?.message}>
        <textarea {...register("message")} rows={4} className={inputClass} />
      </Field>
      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto")}
      >
        {isSubmitting ? "Submitting…" : "Submit Quote Request"}
      </button>
    </form>
  );
}

const inputClass =
  "mt-1 w-full border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-gold";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-xs font-bold uppercase tracking-wide text-neutral-700">
      {label}
      {children}
      {error && <span className="mt-1 block text-xs font-normal normal-case text-red-600">{error}</span>}
    </label>
  );
}
