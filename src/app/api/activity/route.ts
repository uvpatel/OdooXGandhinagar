import { NextResponse } from "next/server";
import { requireApiEmployee } from "@/server/auth";
import { apiError } from "@/server/http";
import { listActivityLogs } from "@/server/services/activity";

export async function GET(request: Request) {
  try {
    await requireApiEmployee(request, ["admin", "asset_manager", "department_head"]);
    return NextResponse.json({ data: await listActivityLogs() });
  } catch (error) {
    return apiError(error);
  }
}
