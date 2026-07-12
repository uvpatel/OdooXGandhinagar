import { db } from "@/index";
import { activityLogs, notifications, type notificationTypeEnum } from "@/db/schema";

export async function logActivity(actorEmployeeId: string, action: string, entityType: string, entityId: string, metadata: Record<string, unknown> = {}) {
  await db.insert(activityLogs).values({ actorEmployeeId, action, entityType, entityId, metadata });
}

export async function notify(employeeId: string, type: (typeof notificationTypeEnum.enumValues)[number], message: string, entityType: string, entityId: string) {
  await db.insert(notifications).values({ employeeId, type, message, entityType, entityId });
}

export async function listActivityLogs() {
  const { employees } = await import("@/db/schema");
  const { desc, eq } = await import("drizzle-orm");
  return db
    .select({
      id: activityLogs.id,
      actor: employees.name,
      action: activityLogs.action,
      target: activityLogs.entityId,
      timestamp: activityLogs.createdAt,
    })
    .from(activityLogs)
    .innerJoin(employees, eq(activityLogs.actorEmployeeId, employees.id))
    .orderBy(desc(activityLogs.createdAt))
    .limit(100);
}
