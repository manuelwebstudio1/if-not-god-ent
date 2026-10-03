import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? "dev-only-change-in-production-ing-secret",
);

export async function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const token = request.cookies.get("ing_session")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/account/login?redirect=/admin", request.url));
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    if (payload.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/account", request.url));
    }
  } catch {
    return NextResponse.redirect(new URL("/account/login?redirect=/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
