import { eq } from "drizzle-orm";
import { db } from "@/index";
import { assets, maintenanceRequests } from "@/db/schema";
import { createMaintenanceSchema, maintenanceTransitionSchema } from "@/lib/validations/maintenance";
import { DomainError } from "@/server/http";
import { logActivity, notify } from "./activity";

export async function listMaintenanceRequests(employee: { id: string; role: string }) {
  let query = db.select().from(maintenanceRequests).$dynamic();
  if (employee.role === "employee" || employee.role === "department_head") {
    query = query.where(eq(maintenanceRequests.raisedByEmployeeId, employee.id));
  }
  return query;
}

export async function raiseMaintenanceRequest(input: unknown, actorEmployeeId: string) {
  const parsed = createMaintenanceSchema.safeParse(input);
  if (!parsed.success) throw new DomainError("INVALID_INPUT", "Please provide a valid maintenance request.", { fields: parsed.error.flatten().fieldErrors });
  const [request] = await db.insert(maintenanceRequests).values({ ...parsed.data, raisedByEmployeeId: actorEmployeeId }).returning();
  await logActivity(actorEmployeeId, "maintenance.raised", "maintenance", request.id, { assetId: request.assetId });
  return request;
}

export async function transitionMaintenanceRequest(requestId: string, input: unknown, actorEmployeeId: string) {
  const parsed = maintenanceTransitionSchema.safeParse(input);
  if (!parsed.success) throw new DomainError("INVALID_INPUT", "Invalid maintenance transition.");
  const [request] = await db.select().from(maintenanceRequests).where(eq(maintenanceRequests.id, requestId)).limit(1);
  if (!request) throw new DomainError("NOT_FOUND", "Maintenance request not found.");
  const updates: { status: typeof parsed.data.status; technicianName?: string; reviewedByEmployeeId?: string; approvedAt?: Date; resolvedAt?: Date } = { status: parsed.data.status };
  if (parsed.data.technicianName) updates.technicianName = parsed.data.technicianName;
  if (parsed.data.status === "approved" || parsed.data.status === "rejected") updates.reviewedByEmployeeId = actorEmployeeId;
  if (parsed.data.status === "approved") updates.approvedAt = new Date();
  if (parsed.data.status === "resolved") updates.resolvedAt = new Date();
  await db.update(maintenanceRequests).set(updates).where(eq(maintenanceRequests.id, requestId));
  if (parsed.data.status === "approved") { await db.update(assets).set({ status: "under_maintenance" }).where(eq(assets.id, request.assetId)); await notify(request.raisedByEmployeeId, "maintenance_approved", "Your maintenance request was approved.", "maintenance", requestId); }
  if (parsed.data.status === "resolved") { await db.update(assets).set({ status: "available" }).where(eq(assets.id, request.assetId)); }
  await logActivity(actorEmployeeId, `maintenance.${parsed.data.status}`, "maintenance", requestId, { assetId: request.assetId });
}
