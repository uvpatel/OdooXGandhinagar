import { and, eq } from "drizzle-orm";
import { db } from "@/index";
import { allocations, assets, employees } from "@/db/schema";
import { createAllocationSchema } from "@/lib/validations/allocations";
import { DomainError } from "@/server/http";
import { logActivity, notify } from "./activity";

export async function listAllocations(employee: { id: string; role: string; departmentId: string | null }) {
  let query = db.select({ 
    id: allocations.id, 
    assetTag: assets.assetTag, 
    assetName: assets.name, 
    holder: employees.name, 
    expectedReturnDate: allocations.expectedReturnDate, 
    status: allocations.status,
    returnRequestedAt: allocations.returnRequestedAt
  })
  .from(allocations)
  .innerJoin(assets, eq(allocations.assetId, assets.id))
  .leftJoin(employees, eq(allocations.employeeId, employees.id))
  .$dynamic();

  if (employee.role === "employee") {
    query = query.where(eq(allocations.employeeId, employee.id));
  } else if (employee.role === "department_head") {
    // Show allocations where the employee's department matches OR the asset's department matches
    query = query.where(eq(employees.departmentId, employee.departmentId!));
  }

  return query;
}

export async function allocateAsset(input: unknown, actorEmployeeId: string) {
  const parsed = createAllocationSchema.safeParse(input);
  if (!parsed.success) throw new DomainError("INVALID_INPUT", "Choose an asset and a holder.", { fields: parsed.error.flatten().fieldErrors });
  const [existing] = await db.select({ allocationId: allocations.id, holder: employees.name }).from(allocations).leftJoin(employees, eq(allocations.employeeId, employees.id)).where(and(eq(allocations.assetId, parsed.data.assetId), eq(allocations.status, "active"))).limit(1);
  if (existing) throw new DomainError("ALREADY_ALLOCATED", `This asset is already allocated to ${existing.holder ?? "a department"}. Submit a transfer request instead.`, { allocationId: existing.allocationId, currentHolder: existing.holder });
  const [asset] = await db.select().from(assets).where(eq(assets.id, parsed.data.assetId)).limit(1);
  if (!asset || asset.status !== "available") throw new DomainError("ASSET_UNAVAILABLE", "Only available assets can be allocated.");
  const [allocation] = await db.insert(allocations).values({ ...parsed.data, expectedReturnDate: parsed.data.expectedReturnDate?.toISOString().slice(0, 10) }).returning();
  await db.update(assets).set({ status: "allocated" }).where(eq(assets.id, parsed.data.assetId));
  if (parsed.data.employeeId) await notify(parsed.data.employeeId, "asset_assigned", `${asset.assetTag} has been assigned to you.`, "allocation", allocation.id);
  await logActivity(actorEmployeeId, "asset.allocated", "allocation", allocation.id, { assetId: parsed.data.assetId });
  return allocation;
}

export async function returnAsset(allocationId: string, actorEmployeeId: string, returnConditionNotes?: string) {
  const [allocation] = await db.select().from(allocations).where(and(eq(allocations.id, allocationId), eq(allocations.status, "active"))).limit(1);
  if (!allocation) throw new DomainError("NOT_FOUND", "No active allocation was found.");
  await db.update(allocations).set({ status: "returned", returnedAt: new Date(), returnConditionNotes }).where(eq(allocations.id, allocationId));
  await db.update(assets).set({ status: "available" }).where(eq(assets.id, allocation.assetId));
  await logActivity(actorEmployeeId, "asset.returned", "allocation", allocationId, { assetId: allocation.assetId });
}
