import { cache } from "react";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/index";
import { auth } from "@/lib/auth";
import { departments, employees } from "@/db/schema";

export const getCurrentEmployee = cache(async () => {
  const currentSession = await auth.api.getSession({ headers: await headers() });
  if (!currentSession) return null;

  const [employee] = await db
    .select({
      id: employees.id,
      userId: employees.userId,
      name: employees.name,
      email: employees.email,
      role: employees.role,
      status: employees.status,
      departmentId: employees.departmentId,
      departmentName: departments.name,
    })
    .from(employees)
    .leftJoin(departments, eq(employees.departmentId, departments.id))
    .where(eq(employees.userId, currentSession.user.id))
    .limit(1);

  return employee ?? null;
});

export type EmployeeRole = "admin" | "asset_manager" | "department_head" | "employee";

export function assertRole(employee: Awaited<ReturnType<typeof getCurrentEmployee>>, allowed: readonly EmployeeRole[]) {
  if (!employee || !allowed.includes(employee.role)) throw new Error("Forbidden");
  return employee;
}
