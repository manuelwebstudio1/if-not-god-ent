import { NextResponse } from "next/server";
import { z } from "zod";
import { createSession, loginUser } from "@/lib/auth";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());
    const user = await loginUser(body.email, body.password);
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    await createSession({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
    return NextResponse.json({ ok: true, role: user.role });
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 400 });
  }
}
