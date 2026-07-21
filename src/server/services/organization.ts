import { eq } from "drizzle-orm";
import { db } from "@/index";
import { assetCategories, departments, employees } from "@/db/schema";
import { createAssetCategorySchema, createDepartmentSchema, updateEmployeeRoleSchema } from "@/lib/validations/organization";
import { DomainError } from "@/server/http";
import { logActivity, notify } from "./activity";

export async function createDepartment(input: unknown, actorEmployeeId: string) {
  const parsed = createDepartmentSchema.safeParse(input);
  if (!parsed.success) {
    throw new DomainError("INVALID_INPUT", "Invalid department name.");
  }

  const [existing] = await db
    .select()
    .from(departments)
    .where(eq(departments.name, parsed.data.name))
    .limit(1);

  if (existing) {
    throw new DomainError("CONFLICT", "Department already exists.");
  }

  const [dept] = await db
    .insert(departments)
    .values({ name: parsed.data.name })
    .returning();

  await logActivity(actorEmployeeId, "organization.department_created", "department", dept.id);
  return dept;
}

export async function createAssetCategory(input: unknown, actorEmployeeId: string) {
  const parsed = createAssetCategorySchema.safeParse(input);
  if (!parsed.success) throw new DomainError("INVALID_INPUT", "Invalid asset category.");
  const [existing] = await db.select().from(assetCategories).where(eq(assetCategories.name, parsed.data.name)).limit(1);
  if (existing) throw new DomainError("CONFLICT", "Asset category already exists.");
  const [category] = await db.insert(assetCategories).values(parsed.data).returning();
  await logActivity(actorEmployeeId, "organization.category_created", "asset_category", category.id);
  return category;
}

export async function updateEmployeeRole(employeeId: string, input: unknown, actorEmployeeId: string) {
  const parsed = updateEmployeeRoleSchema.safeParse(input);
  if (!parsed.success) {
    throw new DomainError("INVALID_INPUT", "Invalid role.");
  }

  const [employee] = await db
    .select()
    .from(employees)
    .where(eq(employees.id, employeeId))
    .limit(1);

  if (!employee) throw new DomainError("NOT_FOUND", "Employee not found.");

  await db
    .update(employees)
    .set({ role: parsed.data.role })
    .where(eq(employees.id, employeeId));

  await logActivity(actorEmployeeId, "organization.role_updated", "employee", employeeId, {
    newRole: parsed.data.role,
  });
  
  await notify(
    employeeId,
    "system_alert",
    `Your role has been updated to ${parsed.data.role}.`,
    "employee",
    employeeId
  );
}
