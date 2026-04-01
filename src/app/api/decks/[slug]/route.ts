import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  const { slug } = await params;
  
  try {
    const { archived } = await req.json();
    
    const { error } = await supabase
      .from("decks")
      .update({ archived_at: archived ? new Date().toISOString() : null })
      .eq("deck_slug", slug);
      
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to update deck" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  const { slug } = await params;
  
  try {
    // Also delete the slides so they don't show up as legacy decks
    const { error: slideError } = await supabase
      .from("deck_slides")
      .update({ deleted_at: new Date().toISOString() })
      .eq("deck_slug", slug);
      
    if (slideError) throw slideError;

    const { error } = await supabase
      .from("decks")
      .update({ deleted_at: new Date().toISOString() })
      .eq("deck_slug", slug);
      
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to delete deck" }, { status: 500 });
  }
}
