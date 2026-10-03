import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/require-admin";
import { createSupabaseAdmin } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    await requireAdminSession();
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file" }, { status: 400 });
    }
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const supabase = createSupabaseAdmin();
    const { error } = await supabase.storage
      .from("product-images")
      .upload(path, buffer, { contentType: file.type, upsert: false });
    if (error) throw error;
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    return NextResponse.json({ url: data.publicUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
