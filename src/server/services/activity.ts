import { db } from "@/index";
import { activityLogs, notifications, type notificationTypeEnum } from "@/db/schema";

export async function logActivity(actorEmployeeId: string, action: string, entityType: string, entityId: string, metadata: Record<string, unknown> = {}) {
  await db.insert(activityLogs).values({ actorEmployeeId, action, entityType, entityId, metadata });
}

export async function notify(employeeId: string, type: (typeof notificationTypeEnum.enumValues)[number], message: string, entityType: string, entityId: string) {
  await db.insert(notifications).values({ employeeId, type, message, entityType, entityId });
}
