import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
  const supabase = getSupabase();
  if (!supabase)
    return NextResponse.json({ error: "Not configured" }, { status: 500 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const folder = (formData.get("folder") as string) ?? "general";

  if (!file)
    return NextResponse.json({ error: "No file" }, { status: 400 });
  if (!ALLOWED_TYPES.includes(file.type))
    return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
  if (file.size > MAX_SIZE)
    return NextResponse.json(
      { error: "File too large (max 5MB)" },
      { status: 400 },
    );

  const ext = file.name.split(".").pop() ?? "png";
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from("deck-assets")
    .upload(path, buffer, { contentType: file.type, upsert: false });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  const {
    data: { publicUrl },
  } = supabase.storage.from("deck-assets").getPublicUrl(path);

  return NextResponse.json({ url: publicUrl, path });
}

export async function GET() {
  const supabase = getSupabase();
  if (!supabase)
    return NextResponse.json({ error: "Not configured" }, { status: 500 });

  const { data, error } = await supabase.storage.from("deck-assets").list("", {
    limit: 100,
    sortBy: { column: "created_at", order: "desc" },
  });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  const assets = (data ?? []).map((f) => ({
    name: f.name,
    url: supabase.storage.from("deck-assets").getPublicUrl(f.name).data
      .publicUrl,
  }));

  return NextResponse.json(assets);
}
