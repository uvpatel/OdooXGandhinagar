import { NextResponse } from "next/server";
import { requireApiEmployee } from "@/server/auth";
import { apiError } from "@/server/http";
import { getDashboardSnapshot } from "@/server/services/dashboard";

export async function GET(request: Request) {
  try {
    await requireApiEmployee(request);
    return NextResponse.json({ data: await getDashboardSnapshot() });
  } catch (error) {
    return apiError(error);
  }
}
