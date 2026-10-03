"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") ?? "/account";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = (await res.json()) as { error?: string; role?: string };
    if (!res.ok) {
      setError(data.error ?? "Login failed");
      return;
    }
    router.push(data.role === "ADMIN" && redirect === "/account" ? "/admin" : redirect);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className={input}
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className={input}
        required
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" className={cn(buttonVariants(), "w-full")}>
        Sign In
      </button>
      <p className="text-center text-xs text-muted">
        No account?{" "}
        <Link href="/account/register" className="font-semibold text-gold-dark">
          Create one
        </Link>
      </p>
    </form>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setError(data.error ?? "Registration failed");
      return;
    }
    router.push("/account");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {(["name", "email", "phone", "password"] as const).map((field) => (
        <input
          key={field}
          type={field === "password" ? "password" : field === "email" ? "email" : "text"}
          value={form[field]}
          onChange={(e) => setForm({ ...form, [field]: e.target.value })}
          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
          className={input}
          required={field !== "phone"}
        />
      ))}
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" className={cn(buttonVariants(), "w-full")}>
        Create Account
      </button>
    </form>
  );
}

const input =
  "w-full border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-gold";
