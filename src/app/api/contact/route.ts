import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const form = await request.formData();
  const name = String(form.get("name") ?? "").trim();
  const email = String(form.get("email") ?? "").trim();
  if (!name || !email.includes("@")) {
    return NextResponse.redirect(new URL("/contact?error=1", request.url));
  }
  return NextResponse.redirect(new URL("/contact?sent=1", request.url));
}
