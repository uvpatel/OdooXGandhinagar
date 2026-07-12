import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db, assertDatabaseConfigured } from "@/index";
import { employees, type roleEnum } from "@/db/schema";
import { DomainError } from "./http";

export type Role = (typeof roleEnum.enumValues)[number];

export async function requireApiEmployee(request: Request, allowed?: readonly Role[]) {
  assertDatabaseConfigured();
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) throw new DomainError("UNAUTHORIZED", "Sign in is required.");

  const [employee] = await db.select().from(employees).where(eq(employees.userId, session.user.id)).limit(1);
  if (!employee || employee.status !== "active") throw new DomainError("FORBIDDEN", "Your employee account is inactive or unavailable.");
  if (allowed && !allowed.includes(employee.role)) throw new DomainError("FORBIDDEN", "You do not have permission for this action.");
  return employee;
}
