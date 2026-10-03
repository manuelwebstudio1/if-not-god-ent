import { siteConfig } from "@/config/site";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-4 border border-neutral-200 bg-white p-6 text-sm">
      <h1 className="text-xl font-black uppercase">Website Settings</h1>
      <p>
        WhatsApp: <strong>{siteConfig.whatsapp}</strong> (set{" "}
        <code>NEXT_PUBLIC_WHATSAPP</code>)
      </p>
      <p>
        Phone: <strong>{siteConfig.phone}</strong>
      </p>
      <p>
        Email: <strong>{siteConfig.email}</strong>
      </p>
    </div>
  );
}
