import { NextResponse } from "next/server";
import { requireApiEmployee } from "@/server/auth";
import { apiError } from "@/server/http";
import { updateEmployeeRole } from "@/server/services/organization";
import { z } from "zod";

export async function POST(request: Request) {
  try {
    const employee = await requireApiEmployee(request, ["admin"]);
    const input = await request.json();
    const { employeeId, role } = z.object({ employeeId: z.string(), role: z.string() }).parse(input);
    await updateEmployeeRole(employeeId, { role }, employee.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return apiError(error);
  }
}
