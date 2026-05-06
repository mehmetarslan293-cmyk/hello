import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "influencer-pazaryeri-api",
    ts: new Date().toISOString(),
  });
}
