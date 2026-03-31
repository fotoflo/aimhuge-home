import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });

  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (slug) {
    const { data, error } = await supabase.from("brands").select("*").eq("slug", slug).single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ brand: data });
  }

  // Fetch all brands
  const { data, error } = await supabase.from("brands").select("*").order("name");
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ brands: data });
}

export async function POST(req: NextRequest) {
  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });

  try {
    const brandData = await req.json();
    const { data, error } = await supabase.from("brands").upsert({
      ...brandData,
      updated_at: new Date().toISOString()
    }).select().single();

    if (error) throw error;
    return NextResponse.json({ brand: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
