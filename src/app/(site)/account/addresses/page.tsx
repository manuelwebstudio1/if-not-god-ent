import Link from "next/link";

export default function AddressesPage() {
  return (
    <div className="ing-container max-w-xl py-12">
      <h1 className="text-2xl font-black uppercase">Saved Addresses</h1>
      <p className="mt-3 text-sm text-muted">
        Address book syncs with your profile when PostgreSQL is connected. Add
        addresses at checkout for now.
      </p>
      <Link href="/account" className="mt-6 inline-block text-sm font-semibold text-gold-dark">
        ← Back to account
      </Link>
    </div>
  );
}
