import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set("x-ing-pathname", request.nextUrl.pathname);

  const response = NextResponse.next({
    request: { headers },
  });
  if (request.nextUrl.pathname.startsWith("/admin")) {
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  }
  return response;
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
