import { NextResponse } from "next/server";

// Legacy endpoint retained only to avoid breaking old clients. AssetFlow does not use tweets.
export function GET() {
  return NextResponse.json({ message: "This legacy endpoint is no longer available." }, { status: 410 });
}
