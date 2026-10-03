import { getSession } from "@/lib/auth";

export async function requireAdminSession() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session;
}
