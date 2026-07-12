import { NextResponse } from "next/server";
import { requireApiEmployee } from "@/server/auth";
import { apiError, DomainError } from "@/server/http";
import { db } from "@/index";
import { allocations } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { logActivity, notify } from "@/server/services/activity";

export async function POST(request: Request, context: { params: { id: string } }) {
  try {
    const employee = await requireApiEmployee(request, ["admin", "asset_manager", "department_head", "employee"]);
    
    // Find the allocation
    const [allocation] = await db.select().from(allocations).where(and(eq(allocations.id, context.params.id), eq(allocations.status, "active"))).limit(1);
    
    if (!allocation) {
      throw new DomainError("NOT_FOUND", "Active allocation not found.");
    }
    
    if (allocation.employeeId !== employee.id && employee.role === "employee") {
      throw new DomainError("FORBIDDEN", "You can only request return for your own allocations.");
    }

    if (allocation.returnRequestedAt) {
      throw new DomainError("ALREADY_REQUESTED", "Return already requested.");
    }

    await db.update(allocations)
      .set({ returnRequestedAt: new Date() })
      .where(eq(allocations.id, context.params.id));

    await logActivity(employee.id, "allocation.return_requested", "allocation", allocation.id, { assetId: allocation.assetId });

    return NextResponse.json({ success: true });
  } catch (error) {
    return apiError(error);
  }
}
