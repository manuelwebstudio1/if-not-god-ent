"use client";

import { useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AdminLoginForm({ defaultEmail }: { defaultEmail: string }) {
  const [email, setEmail] = useState(defaultEmail || "ifnotgod@ent.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setPending(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });
      const data = (await res.json()) as { error?: string; role?: string };
      if (!res.ok) {
        setError(data.error ?? "Invalid admin credentials");
        setPending(false);
        return;
      }
      if (data.role !== "ADMIN") {
        setError("This account is not an administrator.");
        setPending(false);
        return;
      }
      window.location.href = "/admin";
    } catch {
      setError("Could not reach the server. Restart npm run dev and try again.");
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="block text-xs font-bold uppercase tracking-wide text-neutral-400">
        Email
        <input
          type="text"
          inputMode="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={input}
          autoComplete="username"
          required
        />
      </label>
      <label className="block text-xs font-bold uppercase tracking-wide text-neutral-400">
        Password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={input}
          autoComplete="current-password"
          required
        />
      </label>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className={cn(buttonVariants({ size: "lg" }), "w-full")}
      >
        {pending ? "Signing in…" : "Enter dashboard"}
      </button>
    </form>
  );
}

const input =
  "mt-1.5 w-full border border-neutral-700 bg-neutral-950 px-3 py-3 text-sm text-white outline-none focus:border-gold";
