import { NextResponse } from "next/server";
import { requireApiEmployee } from "@/server/auth";
import { apiError } from "@/server/http";
import { transitionMaintenanceRequest } from "@/server/services/maintenance";

export async function PATCH(request: Request, context: { params: Promise<{ requestId: string }> }) { try { const employee = await requireApiEmployee(request, ["admin", "asset_manager"]); const { requestId } = await context.params; await transitionMaintenanceRequest(requestId, await request.json(), employee.id); return NextResponse.json({ data: { id: requestId, updated: true } }); } catch (error) { return apiError(error); } }
