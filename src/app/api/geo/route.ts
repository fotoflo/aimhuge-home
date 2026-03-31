import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const latitude = request.headers.get("x-vercel-ip-latitude") || "40.7128";
  const longitude = request.headers.get("x-vercel-ip-longitude") || "-74.0060";
  const city = request.headers.get("x-vercel-ip-city") || "Somewhere New";

  return NextResponse.json({
    lat: parseFloat(latitude),
    lng: parseFloat(longitude),
    city,
  });
}
