import { and, eq, gt, lt, or } from "drizzle-orm";
import { db } from "@/index";
import { allocations, assets, bookings, maintenanceRequests, transfers } from "@/db/schema";

export async function getDashboardSnapshot() {
  const today = new Date().toISOString().slice(0, 10);
  const [availableAssets, allocatedAssets, maintenance, activeBookings, pendingTransfers, overdueRows, upcomingRows] = await Promise.all([
    db.select().from(assets).where(eq(assets.status, "available")),
    db.select().from(assets).where(eq(assets.status, "allocated")),
    db.select().from(maintenanceRequests).where(or(eq(maintenanceRequests.status, "pending"), eq(maintenanceRequests.status, "in_progress"))),
    db.select().from(bookings).where(or(eq(bookings.status, "upcoming"), eq(bookings.status, "ongoing"))),
    db.select().from(transfers).where(eq(transfers.status, "requested")),
    db.select({ id: allocations.id, assetTag: assets.assetTag, assetName: assets.name, expectedReturnDate: allocations.expectedReturnDate }).from(allocations).innerJoin(assets, eq(allocations.assetId, assets.id)).where(and(eq(allocations.status, "active"), lt(allocations.expectedReturnDate, today))),
    db.select({ id: allocations.id, assetTag: assets.assetTag, assetName: assets.name, expectedReturnDate: allocations.expectedReturnDate }).from(allocations).innerJoin(assets, eq(allocations.assetId, assets.id)).where(and(eq(allocations.status, "active"), gt(allocations.expectedReturnDate, today))),
  ]);

  const tableData = [
    ...overdueRows.map((row) => ({ ...row, type: "overdue" as const })),
    ...upcomingRows.map((row) => ({ ...row, type: "upcoming" as const })),
  ].sort((left, right) => (left.expectedReturnDate ?? "").localeCompare(right.expectedReturnDate ?? ""));

  return {
    stats: { assetsAvailable: availableAssets.length, assetsAllocated: allocatedAssets.length, maintenanceToday: maintenance.length, activeBookings: activeBookings.length, pendingTransfers: pendingTransfers.length, upcomingReturns: upcomingRows.length, overdueReturns: overdueRows.length },
    tableData,
  };
}
