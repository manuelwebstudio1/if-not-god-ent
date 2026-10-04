import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth-session";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminArea = pathname === "/admin" || pathname.startsWith("/admin/");
  const isAdminLogin = pathname === "/admin/login";

  if (!isAdminArea || isAdminLogin) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) {
    const login = new URL("/admin/login", request.url);
    login.searchParams.set("redirect", pathname);
    return NextResponse.redirect(login);
  }

  try {
    const session = await verifySessionToken(token);
    if (session.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  } catch {
    const login = new URL("/admin/login", request.url);
    login.searchParams.set("redirect", pathname);
    return NextResponse.redirect(login);
  }

  const response = NextResponse.next();
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  return response;
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
