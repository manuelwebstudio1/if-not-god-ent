import { LoginForm } from "@/components/account/auth-forms";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <div className="ing-container flex min-h-[60vh] max-w-md flex-col justify-center py-12">
      <h1 className="text-2xl font-black uppercase">Sign In</h1>
      <p className="mt-2 text-sm text-muted">
        Access orders, wishlist and account settings.
      </p>
      <p className="mt-2 text-xs text-muted">
        Staff? Use the{" "}
        <a href="/admin/login" className="font-semibold text-gold-dark hover:underline">
          admin sign-in
        </a>
        .
      </p>
      <div className="mt-6 border border-neutral-200 bg-white p-6">
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
