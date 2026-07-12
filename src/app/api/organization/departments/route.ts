import { NextResponse } from "next/server";
import { requireApiEmployee } from "@/server/auth";
import { apiError } from "@/server/http";
import { createDepartment } from "@/server/services/organization";

export async function POST(request: Request) {
  try {
    const employee = await requireApiEmployee(request, ["admin"]);
    return NextResponse.json(
      { data: await createDepartment(await request.json(), employee.id) },
      { status: 201 }
    );
  } catch (error) {
    return apiError(error);
  }
}
