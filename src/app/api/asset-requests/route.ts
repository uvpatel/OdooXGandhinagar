import { NextResponse } from "next/server";
import { requireApiEmployee } from "@/server/auth";
import { apiError } from "@/server/http";
import { db } from "@/index";
import { assetRequests, assets, employees } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

import { logActivity } from "@/server/services/activity";

export async function GET(request: Request) {
  try {
    const employee = await requireApiEmployee(request);
    let query = db
      .select({
        id: assetRequests.id,
        assetId: assetRequests.assetId,
        employeeId: assetRequests.employeeId,
        status: assetRequests.status,
        requestedAt: assetRequests.requestedAt,
        assetTag: assets.assetTag,
        assetName: assets.name,
        employeeName: employees.name,
      })
      .from(assetRequests)
      .innerJoin(assets, eq(assetRequests.assetId, assets.id))
      .innerJoin(employees, eq(assetRequests.employeeId, employees.id))
      .$dynamic();

    if (employee.role === "employee") {
      query = query.where(eq(assetRequests.employeeId, employee.id));
    } else if (employee.role === "department_head") {
      query = query.where(eq(employees.departmentId, employee.departmentId!));
    }

    const requests = await query.orderBy(desc(assetRequests.requestedAt));

    return NextResponse.json({ data: requests });
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const employee = await requireApiEmployee(request);
    const body = await request.json();

    if (!body.assetId) {
      return NextResponse.json({ error: "Asset ID is required" }, { status: 400 });
    }

    const [newRequest] = await db.insert(assetRequests).values({
      assetId: body.assetId,
      employeeId: employee.id,
      status: "pending"
    }).returning();

    await logActivity(employee.id, "asset_request.created", "asset_request", newRequest.id, { assetId: body.assetId });

    return NextResponse.json({ data: newRequest }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
