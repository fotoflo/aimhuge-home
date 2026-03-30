import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  let next = searchParams.get("next") ?? "/";

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          },
        },
      },
    );
    const { data: { session } } = await supabase.auth.exchangeCodeForSession(code);
    
    if (session?.user && next === "/") {
      if (session.user.email?.toLowerCase() === 'fotoflo@gmail.com') {
        next = "/dashboard";
      } else if (session.user.email?.endsWith('@priyoshop.com')) {
        next = "/clients/priyoshop/exec-deck/edit";
      }
    }
  }

  return NextResponse.redirect(new URL(next, req.url));
}
