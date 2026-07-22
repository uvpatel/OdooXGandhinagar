import { NextResponse } from "next/server";
import { requireApiEmployee } from "@/server/auth";
import { apiError } from "@/server/http";
import { db } from "@/index";
import { notifications } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const employee = await requireApiEmployee(request);
    const { id } = await context.params;
    
    await db.update(notifications)
      .set({ isRead: true })
      .where(and(eq(notifications.id, id), eq(notifications.employeeId, employee.id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    return apiError(error);
  }
}
