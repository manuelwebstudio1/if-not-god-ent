import { AdminShell } from "@/components/admin/admin-shell";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (session?.role === "ADMIN") {
    return <AdminShell userEmail={session.email}>{children}</AdminShell>;
  }
  return children;
}
