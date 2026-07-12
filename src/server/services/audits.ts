import { and, eq } from "drizzle-orm";
import { db } from "@/index";
import { assets, auditCycles, auditCycleAuditors, auditItems, departments } from "@/db/schema";
import { createAuditCycleSchema, updateAuditItemSchema } from "@/lib/validations/audits";
import { DomainError } from "@/server/http";
import { logActivity, notify } from "./activity";

export async function listAuditCycles() {
  return db
    .select({
      id: auditCycles.id,
      name: auditCycles.name,
      scopeLocation: auditCycles.scopeLocation,
      departmentName: departments.name,
      startDate: auditCycles.startDate,
      endDate: auditCycles.endDate,
      status: auditCycles.status,
    })
    .from(auditCycles)
    .leftJoin(departments, eq(auditCycles.scopeDepartmentId, departments.id));
}

export async function listAuditItems(cycleId: string) {
  return db
    .select({
      id: auditItems.id,
      assetTag: assets.assetTag,
      assetName: assets.name,
      result: auditItems.result,
      notes: auditItems.notes,
      checkedAt: auditItems.checkedAt,
    })
    .from(auditItems)
    .innerJoin(assets, eq(auditItems.assetId, assets.id))
    .where(eq(auditItems.auditCycleId, cycleId));
}

export async function createAuditCycle(input: unknown, actorEmployeeId: string) {
  const parsed = createAuditCycleSchema.safeParse(input);
  if (!parsed.success) {
    throw new DomainError("INVALID_INPUT", "Invalid audit cycle data.", {
      fields: parsed.error.flatten().fieldErrors,
    });
  }

  const [cycle] = await db
    .insert(auditCycles)
    .values({
      name: parsed.data.name,
      scopeDepartmentId: parsed.data.scopeDepartmentId,
      scopeLocation: parsed.data.scopeLocation,
      startDate: parsed.data.startDate,
      endDate: parsed.data.endDate,
      createdByEmployeeId: actorEmployeeId,
    })
    .returning();

  const auditorInserts = parsed.data.auditorEmployeeIds.map((empId) => ({
    auditCycleId: cycle.id,
    employeeId: empId,
  }));
  await db.insert(auditCycleAuditors).values(auditorInserts);

  // Auto-generate audit items based on scope
  let conditions = [];
  if (parsed.data.scopeDepartmentId) {
    conditions.push(eq(assets.departmentId, parsed.data.scopeDepartmentId));
  }
  if (parsed.data.scopeLocation) {
    conditions.push(eq(assets.location, parsed.data.scopeLocation));
  }
  
  const scopedAssets = await db
    .select({ id: assets.id })
    .from(assets)
    .where(conditions.length > 0 ? and(...conditions) : undefined);

  if (scopedAssets.length > 0) {
    const itemInserts = scopedAssets.map((a) => ({
      auditCycleId: cycle.id,
      assetId: a.id,
    }));
    await db.insert(auditItems).values(itemInserts);
  }

  for (const empId of parsed.data.auditorEmployeeIds) {
    await notify(
      empId,
      "audit_assigned",
      `You have been assigned to audit cycle: ${cycle.name}.`,
      "audit_cycle",
      cycle.id
    );
  }

  await logActivity(actorEmployeeId, "audit.cycle_created", "audit_cycle", cycle.id, {
    assetCount: scopedAssets.length,
  });

  return cycle;
}

export async function updateAuditItem(itemId: string, input: unknown, actorEmployeeId: string) {
  const parsed = updateAuditItemSchema.safeParse(input);
  if (!parsed.success) {
    throw new DomainError("INVALID_INPUT", "Invalid audit result.");
  }

  const [item] = await db
    .select()
    .from(auditItems)
    .where(eq(auditItems.id, itemId))
    .limit(1);

  if (!item) throw new DomainError("NOT_FOUND", "Audit item not found.");

  await db
    .update(auditItems)
    .set({
      result: parsed.data.result,
      notes: parsed.data.notes,
      checkedByEmployeeId: actorEmployeeId,
      checkedAt: new Date(),
    })
    .where(eq(auditItems.id, itemId));

  await logActivity(actorEmployeeId, "audit.item_checked", "audit_item", itemId, {
    result: parsed.data.result,
  });
}
