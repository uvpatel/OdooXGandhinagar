import { NextResponse } from "next/server";
import { requireApiEmployee } from "@/server/auth";
import { apiError } from "@/server/http";
import { allocateAsset, listAllocations } from "@/server/services/allocations";

export async function GET(request: Request) { try { await requireApiEmployee(request, ["admin", "asset_manager", "department_head"]); return NextResponse.json({ data: await listAllocations() }); } catch (error) { return apiError(error); } }
export async function POST(request: Request) { try { const employee = await requireApiEmployee(request, ["admin", "asset_manager"]); return NextResponse.json({ data: await allocateAsset(await request.json(), employee.id) }, { status: 201 }); } catch (error) { return apiError(error); } }
