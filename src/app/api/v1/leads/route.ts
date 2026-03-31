import { getSupabaseServer } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const email = json.email;
    const message = json.message || "";
    
    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const supabase = await getSupabaseServer();
    
    const { error } = await supabase.from("leads").insert({
      contact_info: email.trim(),
      source_page: `api/v1/leads - ${message.substring(0, 100)}`,
    });

    if (error) {
      console.error("API /leads insert error:", error);
      return NextResponse.json({ error: "Failed to save lead." }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Lead captured. We speak computer too." }, { status: 201 });
  } catch (err) {
    console.error("API /leads parsing error:", err);
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }
}
