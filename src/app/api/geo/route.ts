import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const latitude = request.headers.get("x-vercel-ip-latitude") || "35.6762";
  const longitude = request.headers.get("x-vercel-ip-longitude") || "139.6503";
  const city = request.headers.get("x-vercel-ip-city") || "Tokyo";

  return NextResponse.json({
    lat: parseFloat(latitude),
    lng: parseFloat(longitude),
    city,
  });
}
