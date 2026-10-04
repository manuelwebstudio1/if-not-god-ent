import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { getAdminCredentials } from "@/config/admin";
import { siteConfig } from "@/config/site";

export default function AdminSettingsPage() {
  const admin = getAdminCredentials();

  return (
    <>
      <AdminPageHeader
        title="Settings"
        description="Store contact details and administrator access."
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Settings" },
        ]}
      />
      <div className="grid gap-6 p-6 lg:grid-cols-2 lg:p-8">
        <section className="border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-black uppercase">Administrator login</h2>
          <p className="mt-2 text-sm text-muted">
            Change these in <code className="text-xs">.env.local</code>, then restart the
            app. The next sign-in updates the admin account automatically.
          </p>
          <dl className="mt-5 space-y-3 text-sm">
            <div>
              <dt className="text-xs font-bold uppercase text-muted">Email</dt>
              <dd className="mt-1 font-semibold">{admin.email}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase text-muted">Password</dt>
              <dd className="mt-1 font-mono text-sm">{admin.password}</dd>
            </div>
          </dl>
        </section>
        <section className="border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-black uppercase">Storefront contact</h2>
          <dl className="mt-5 space-y-3 text-sm">
            <div>
              <dt className="text-xs font-bold uppercase text-muted">WhatsApp</dt>
              <dd className="mt-1 font-semibold">{siteConfig.whatsapp}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase text-muted">Phone</dt>
              <dd className="mt-1 font-semibold">{siteConfig.phone}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase text-muted">Email</dt>
              <dd className="mt-1 font-semibold">{siteConfig.email}</dd>
            </div>
          </dl>
        </section>
      </div>
    </>
  );
}
