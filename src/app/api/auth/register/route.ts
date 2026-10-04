import { NextResponse } from "next/server";
import { z } from "zod";
import { attachSessionCookie, registerUser, signSessionToken } from "@/lib/auth";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());
    const user = await registerUser(body);
    const token = await signSessionToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
    const response = NextResponse.json({ ok: true });
    attachSessionCookie(response, token, request);
    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Registration failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
