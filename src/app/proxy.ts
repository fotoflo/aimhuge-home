import { NextRequest, NextResponse } from "next/server";

const PROTECTED_ROUTES: Record<string, { username: string; password: string }> =
  {
    "/workshop/pulsetech": { username: "pulsetech", password: "workshop" },
    "/workshop/priyoshop": { username: "priyoshop", password: "workshop" },
  };

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const match = Object.entries(PROTECTED_ROUTES).find(([route]) =>
    path.startsWith(route)
  );

  if (!match) return NextResponse.next();

  const [, creds] = match;
  const auth = request.headers.get("authorization");

  if (auth) {
    const [scheme, encoded] = auth.split(" ");
    if (scheme === "Basic" && encoded) {
      const decoded = atob(encoded);
      const [username, password] = decoded.split(":");
      if (username === creds.username && password === creds.password) {
        return NextResponse.next();
      }
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": `Basic realm="Workshop Access"`,
    },
  });
}

export const config = {
  matcher: ["/workshop/pulsetech/:path*", "/workshop/priyoshop/:path*"],
};
