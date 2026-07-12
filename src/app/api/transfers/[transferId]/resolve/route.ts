import { NextResponse } from "next/server";
import { requireApiEmployee } from "@/server/auth";
import { apiError } from "@/server/http";
import { resolveTransfer } from "@/server/services/transfers";

export async function POST(request: Request, props: { params: Promise<{ transferId: string }> }) {
  const params = await props.params;
  try {
    const employee = await requireApiEmployee(request, ["admin", "asset_manager", "department_head"]);
    await resolveTransfer(params.transferId, await request.json(), employee.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return apiError(error);
  }
}
