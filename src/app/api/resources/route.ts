import { NextResponse } from "next/server";
import { requireApiEmployee } from "@/server/auth";
import { apiError } from "@/server/http";
import { listResources } from "@/server/services/bookings";

export async function GET(request: Request) {
  try {
    await requireApiEmployee(request);
    return NextResponse.json({ data: await listResources() });
  } catch (error) {
    return apiError(error);
  }
}
