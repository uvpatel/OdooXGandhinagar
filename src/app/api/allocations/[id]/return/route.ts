import { NextResponse } from "next/server";
import { requireApiEmployee } from "@/server/auth";
import { apiError } from "@/server/http";
import { returnAsset } from "@/server/services/allocations";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const employee = await requireApiEmployee(request, ["admin", "asset_manager"]);
    const { id } = await context.params;
    const body = await request.json().catch(() => ({}));
    await returnAsset(id, employee.id, typeof body.notes === "string" ? body.notes : undefined);
    return NextResponse.json({ data: { id, status: "returned" } });
  } catch (error) {
    return apiError(error);
  }
}
