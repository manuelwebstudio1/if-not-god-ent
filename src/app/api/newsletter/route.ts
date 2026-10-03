import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const form = await request.formData();
  const email = String(form.get("email") ?? "").trim();
  if (!email || !email.includes("@")) {
    return NextResponse.redirect(new URL("/contact?newsletter=invalid", request.url));
  }
  return NextResponse.redirect(new URL("/contact?newsletter=success", request.url));
}
