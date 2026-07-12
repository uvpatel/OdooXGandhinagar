import { NextResponse } from "next/server";
import { requireApiEmployee } from "@/server/auth";
import { apiError } from "@/server/http";
import { db } from "@/index";
import { notifications } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const employee = await requireApiEmployee(request);
    const data = await db
      .select()
      .from(notifications)
      .where(eq(notifications.employeeId, employee.id))
      .orderBy(desc(notifications.createdAt));
      
    return NextResponse.json({ data });
  } catch (error) {
    return apiError(error);
  }
}
