import { and, eq } from "drizzle-orm";
import { db } from "@/index";
import { allocations, assets, transfers, employees, departments } from "@/db/schema";
import { requestTransferSchema, resolveTransferSchema } from "@/lib/validations/transfers";
import { DomainError } from "@/server/http";
import { logActivity, notify } from "./activity";

export async function listTransfers() {
  return db
    .select({
      id: transfers.id,
      assetTag: assets.assetTag,
      assetName: assets.name,
      requestedBy: employees.name,
      status: transfers.status,
      requestedAt: transfers.requestedAt,
    })
    .from(transfers)
    .innerJoin(assets, eq(transfers.assetId, assets.id))
    .innerJoin(employees, eq(transfers.requestedByEmployeeId, employees.id));
}

export async function requestTransfer(input: unknown, actorEmployeeId: string) {
  const parsed = requestTransferSchema.safeParse(input);
  if (!parsed.success) {
    throw new DomainError("INVALID_INPUT", "Provide a target employee or department.", {
      fields: parsed.error.flatten().fieldErrors,
    });
  }

  // Check if asset is actively allocated
  const [activeAllocation] = await db
    .select()
    .from(allocations)
    .where(and(eq(allocations.assetId, parsed.data.assetId), eq(allocations.status, "active")))
    .limit(1);

  if (!activeAllocation) {
    throw new DomainError("NOT_ALLOCATED", "Asset is not currently allocated.");
  }

  // Check if there is already a pending transfer
  const [pending] = await db
    .select()
    .from(transfers)
    .where(and(eq(transfers.assetId, parsed.data.assetId), eq(transfers.status, "requested")))
    .limit(1);

  if (pending) {
    throw new DomainError("TRANSFER_PENDING", "A transfer is already pending for this asset.");
  }

  const [transfer] = await db
    .insert(transfers)
    .values({
      assetId: parsed.data.assetId,
      fromAllocationId: activeAllocation.id,
      requestedByEmployeeId: actorEmployeeId,
      toEmployeeId: parsed.data.toEmployeeId,
      toDepartmentId: parsed.data.toDepartmentId,
    })
    .returning();

  await logActivity(actorEmployeeId, "transfer.requested", "transfer", transfer.id, {
    assetId: transfer.assetId,
  });

  return transfer;
}

export async function resolveTransfer(transferId: string, input: unknown, actorEmployeeId: string) {
  const parsed = resolveTransferSchema.safeParse(input);
  if (!parsed.success) throw new DomainError("INVALID_INPUT", "Provide an approval status.");

  const [transfer] = await db
    .select()
    .from(transfers)
    .where(eq(transfers.id, transferId))
    .limit(1);

  if (!transfer || transfer.status !== "requested") {
    throw new DomainError("NOT_FOUND", "Pending transfer request not found.");
  }

  await db
    .update(transfers)
    .set({
      status: parsed.data.status,
      approvedByEmployeeId: actorEmployeeId,
      resolvedAt: new Date(),
    })
    .where(eq(transfers.id, transferId));

  if (parsed.data.status === "approved") {
    // End old allocation
    await db
      .update(allocations)
      .set({ status: "returned", returnedAt: new Date(), returnConditionNotes: "Transferred" })
      .where(eq(allocations.id, transfer.fromAllocationId));

    // Create new allocation
    const [newAlloc] = await db
      .insert(allocations)
      .values({
        assetId: transfer.assetId,
        employeeId: transfer.toEmployeeId,
        departmentId: transfer.toDepartmentId,
      })
      .returning();
      
    if (transfer.toEmployeeId) {
       await notify(
         transfer.toEmployeeId,
         "asset_assigned",
         "An asset has been transferred to you.",
         "allocation",
         newAlloc.id
       );
    }
  }

  await notify(
    transfer.requestedByEmployeeId,
    parsed.data.status === "approved" ? "transfer_approved" : "transfer_rejected",
    `Your transfer request for asset has been ${parsed.data.status}.`,
    "transfer",
    transferId
  );

  await logActivity(actorEmployeeId, `transfer.${parsed.data.status}`, "transfer", transferId, {
    assetId: transfer.assetId,
  });
}
