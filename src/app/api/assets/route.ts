import { NextResponse } from "next/server";
import { requireApiEmployee } from "@/server/auth";
import { apiError } from "@/server/http";
import { createAsset, listAssets } from "@/server/services/assets";

export async function GET(request: Request) { try { const employee = await requireApiEmployee(request); const url = new URL(request.url); const catalog = url.searchParams.get("catalog") === "true"; return NextResponse.json({ data: await listAssets(employee, catalog) }); } catch (error) { return apiError(error); } }
export async function POST(request: Request) { try { const employee = await requireApiEmployee(request, ["admin", "asset_manager"]); return NextResponse.json({ data: await createAsset(await request.json(), employee.id) }, { status: 201 }); } catch (error) { return apiError(error); } }
