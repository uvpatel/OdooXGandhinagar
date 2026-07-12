import { NextResponse } from "next/server";
import { asc } from "drizzle-orm";
import { assetCategories, departments, employees } from "@/db/schema";
import { db } from "@/index";
import { requireApiEmployee } from "@/server/auth";
import { apiError } from "@/server/http";

export async function GET(request: Request) {
  try {
    await requireApiEmployee(request);
    const [departmentRows, categoryRows, employeeRows] = await Promise.all([
      db.select().from(departments).orderBy(asc(departments.name)),
      db.select().from(assetCategories).orderBy(asc(assetCategories.name)),
      db.select().from(employees).orderBy(asc(employees.name)),
    ]);
    return NextResponse.json({ data: { departments: departmentRows, categories: categoryRows, employees: employeeRows } });
  } catch (error) { return apiError(error); }
}
