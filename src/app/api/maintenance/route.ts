import { NextResponse } from "next/server";
import { requireApiEmployee } from "@/server/auth";
import { apiError } from "@/server/http";
import { listMaintenanceRequests, raiseMaintenanceRequest } from "@/server/services/maintenance";

export async function GET(request: Request) { try { const employee = await requireApiEmployee(request, ["admin", "asset_manager", "department_head", "employee"]); return NextResponse.json({ data: await listMaintenanceRequests(employee) }); } catch (error) { return apiError(error); } }
export async function POST(request: Request) { try { const employee = await requireApiEmployee(request, ["admin", "asset_manager", "department_head", "employee"]); return NextResponse.json({ data: await raiseMaintenanceRequest(await request.json(), employee.id) }, { status: 201 }); } catch (error) { return apiError(error); } }
