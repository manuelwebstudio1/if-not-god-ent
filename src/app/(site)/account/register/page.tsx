import { RegisterForm } from "@/components/account/auth-forms";

export default function RegisterPage() {
  return (
    <div className="ing-container flex min-h-[60vh] max-w-md flex-col justify-center py-12">
      <h1 className="text-2xl font-black uppercase">Create Account</h1>
      <div className="mt-6 border border-neutral-200 bg-white p-6">
        <RegisterForm />
      </div>
    </div>
  );
}
