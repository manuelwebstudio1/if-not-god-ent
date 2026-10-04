import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const pathname = (await headers()).get("x-ing-pathname") ?? "";
  const isLogin = pathname === "/admin/login";

  if (session?.role === "ADMIN") {
    return <AdminShell userEmail={session.email}>{children}</AdminShell>;
  }

  if (pathname.startsWith("/admin") && !isLogin) {
    const login = new URL("/admin/login", "http://local");
    login.searchParams.set("redirect", pathname);
    redirect(`${login.pathname}${login.search}`);
  }

  return children;
}
