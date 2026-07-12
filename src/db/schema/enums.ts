import { pgEnum } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["admin", "asset_manager", "department_head", "employee"]);
export const assetStatusEnum = pgEnum("asset_status", ["available", "allocated", "reserved", "under_maintenance", "lost", "retired", "disposed"]);
export const allocationStatusEnum = pgEnum("allocation_status", ["active", "returned", "overdue"]);
export const transferStatusEnum = pgEnum("transfer_status", ["requested", "approved", "rejected", "completed"]);
export const bookingStatusEnum = pgEnum("booking_status", ["upcoming", "ongoing", "completed", "cancelled"]);
export const maintenanceStatusEnum = pgEnum("maintenance_status", ["pending", "approved", "rejected", "technician_assigned", "in_progress", "resolved"]);
export const maintenancePriorityEnum = pgEnum("maintenance_priority", ["low", "medium", "high", "critical"]);
export const auditCycleStatusEnum = pgEnum("audit_cycle_status", ["scheduled", "in_progress", "closed"]);
export const auditItemResultEnum = pgEnum("audit_item_result", ["pending", "verified", "missing", "damaged"]);
export const conditionEnum = pgEnum("condition", ["new", "good", "fair", "poor", "damaged"]);
export const notificationTypeEnum = pgEnum("notification_type", ["asset_assigned", "maintenance_approved", "maintenance_rejected", "booking_confirmed", "booking_cancelled", "booking_reminder", "transfer_approved", "transfer_rejected", "overdue_return", "audit_discrepancy", "audit_assigned", "system_alert"]);
