import { NextResponse } from "next/server";
import { requireApiEmployee } from "@/server/auth";
import { apiError } from "@/server/http";
import { createAuditCycle, listAuditCycles } from "@/server/services/audits";

export async function GET(request: Request) {
  try {
    await requireApiEmployee(request, ["admin", "asset_manager", "department_head", "employee"]);
    return NextResponse.json({ data: await listAuditCycles() });
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const employee = await requireApiEmployee(request, ["admin", "asset_manager"]);
    return NextResponse.json(
      { data: await createAuditCycle(await request.json(), employee.id) },
      { status: 201 }
    );
  } catch (error) {
    return apiError(error);
  }
}
