import { NextResponse } from "next/server";
import  { db }  from "@/index";
import { assets, allocations, bookings, maintenanceRequests, transfers } from "@/db/schema";
import { eq, or, and, lt, gt } from "drizzle-orm";
import { requireAuth } from "@/lib/auth-guard";

export async function GET() {
  try {
    await requireAuth();

    // Stats
    const availableAssets = await db.select().from(assets).where(eq(assets.status, "available"));
    const allocatedAssets = await db.select().from(assets).where(eq(assets.status, "allocated"));
    
    // Maintenance Today: we'll count all pending and in_progress
    const activeMaintenance = await db
      .select()
      .from(maintenanceRequests)
      .where(or(eq(maintenanceRequests.status, "pending"), eq(maintenanceRequests.status, "in_progress")));
      
    const activeBookings = await db
      .select()
      .from(bookings)
      .where(or(eq(bookings.status, "upcoming"), eq(bookings.status, "ongoing")));

    const pendingTransfers = await db
      .select()
      .from(transfers)
      .where(eq(transfers.status, "requested"));

    // Expected returns: active allocations with an expected return date
    const now = new Date();
    const nowStr = now.toISOString();
    
    const overdueReturnsQuery = await db
      .select({
        id: allocations.id,
        assetTag: assets.assetTag,
        assetName: assets.name,
        expectedReturnDate: allocations.expectedReturnDate,
        status: allocations.status
      })
      .from(allocations)
      .leftJoin(assets, eq(allocations.assetId, assets.id))
      .where(
        and(
          eq(allocations.status, "active"),
          lt(allocations.expectedReturnDate, nowStr)
        )
      );

    const upcomingReturnsQuery = await db
      .select({
        id: allocations.id,
        assetTag: assets.assetTag,
        assetName: assets.name,
        expectedReturnDate: allocations.expectedReturnDate,
        status: allocations.status
      })
      .from(allocations)
      .leftJoin(assets, eq(allocations.assetId, assets.id))
      .where(
        and(
          eq(allocations.status, "active"),
          gt(allocations.expectedReturnDate, nowStr)
        )
      );

    // Prepare table data for the frontend
    const tableData = [
      ...overdueReturnsQuery.map(r => ({
        id: r.id,
        assetTag: r.assetTag,
        assetName: r.assetName,
        expectedReturnDate: r.expectedReturnDate,
        type: "overdue"
      })),
      ...upcomingReturnsQuery.map(r => ({
        id: r.id,
        assetTag: r.assetTag,
        assetName: r.assetName,
        expectedReturnDate: r.expectedReturnDate,
        type: "upcoming"
      }))
    ];
    
    // Sort table data by expectedReturnDate ascending
    tableData.sort((a, b) => {
       if (!a.expectedReturnDate) return 1;
       if (!b.expectedReturnDate) return -1;
       return new Date(a.expectedReturnDate).getTime() - new Date(b.expectedReturnDate).getTime();
    });

    return NextResponse.json({
      data: {
        stats: {
          assetsAvailable: availableAssets.length,
          assetsAllocated: allocatedAssets.length,
          maintenanceToday: activeMaintenance.length,
          activeBookings: activeBookings.length,
          pendingTransfers: pendingTransfers.length,
          upcomingReturns: upcomingReturnsQuery.length,
          overdueReturns: overdueReturnsQuery.length,
        },
        tableData
      },
    });
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard data." }, { status: 500 });
  }
}
