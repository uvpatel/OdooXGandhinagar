import { NextResponse } from "next/server";
import { requireApiEmployee } from "@/server/auth";
import { apiError } from "@/server/http";
import { db } from "@/index";
import { assetRequests, employees } from "@/db/schema";
import { eq } from "drizzle-orm";
import { allocateAsset } from "@/server/services/allocations";
import { logActivity } from "@/server/services/activity";

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const employee = await requireApiEmployee(request, ["admin", "asset_manager", "department_head"]);
    const body = await request.json();
    const requestId = (await context.params).id;

    if (!body.status || !["approved", "rejected"].includes(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const [req] = await db.select({
      id: assetRequests.id,
      assetId: assetRequests.assetId,
      employeeId: assetRequests.employeeId,
      status: assetRequests.status,
      employeeDepartmentId: employees.departmentId
    })
    .from(assetRequests)
    .innerJoin(employees, eq(assetRequests.employeeId, employees.id))
    .where(eq(assetRequests.id, requestId));
    if (!req) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    if (employee.role === "department_head" && req.employeeDepartmentId !== employee.departmentId) {
      return NextResponse.json({ error: "Forbidden: Not in your department" }, { status: 403 });
    }

    await db.update(assetRequests)
      .set({ status: body.status })
      .where(eq(assetRequests.id, requestId));

    if (body.status === "approved") {
      // Create allocation automatically
      await allocateAsset({
        assetId: req.assetId,
        employeeId: req.employeeId,
      }, employee.id);
    }

    await logActivity(employee.id, `asset_request.${body.status}`, "asset_request", req.id, { status: body.status });

    return NextResponse.json({ success: true });
  } catch (error) {
    return apiError(error);
  }
}
