import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { listQuotes, saveQuote } from "@/lib/local-db";

const schema = z.object({
  name: z.string().min(2),
  company: z.string().optional(),
  phone: z.string().min(6),
  email: z.string().email(),
  products: z.string().min(3),
  quantity: z.string().optional(),
  projectType: z.string().optional(),
  location: z.string().optional(),
  message: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());
    const quote = await saveQuote(body);
    return NextResponse.json({ ok: true, id: quote.id });
  } catch {
    return NextResponse.json({ error: "Invalid quote request" }, { status: 400 });
  }
}

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const quotes = await listQuotes();
  return NextResponse.json({ quotes });
}
