import { sql } from "drizzle-orm";
import { boolean, date, index, jsonb, numeric, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { allocationStatusEnum, assetStatusEnum, conditionEnum, transferStatusEnum } from "./enums";
import { assetCategories, departments, employees } from "./organization";

export const assets = pgTable("assets", {
  id: uuid("id").defaultRandom().primaryKey(), assetTag: text("asset_tag").notNull().unique(), name: text("name").notNull(),
  categoryId: uuid("category_id").notNull().references(() => assetCategories.id), serialNumber: text("serial_number").notNull(),
  acquisitionDate: date("acquisition_date"), acquisitionCost: numeric("acquisition_cost", { precision: 12, scale: 2 }),
  condition: conditionEnum("condition").notNull().default("good"), location: text("location").notNull(),
  status: assetStatusEnum("status").notNull().default("available"), isBookable: boolean("is_bookable").notNull().default(false),
  departmentId: uuid("department_id").references(() => departments.id), qrCodeValue: text("qr_code_value").notNull().unique(),
  photoUrl: text("photo_url"), metadata: jsonb("metadata").notNull().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(), updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
}, (table) => [index("assets_status_idx").on(table.status), index("assets_department_id_idx").on(table.departmentId)]);

export const allocations = pgTable("allocations", {
  id: uuid("id").defaultRandom().primaryKey(), assetId: uuid("asset_id").notNull().references(() => assets.id),
  employeeId: uuid("employee_id").references(() => employees.id), departmentId: uuid("department_id").references(() => departments.id),
  allocatedAt: timestamp("allocated_at").defaultNow().notNull(), expectedReturnDate: date("expected_return_date"), returnedAt: timestamp("returned_at"),
  returnConditionNotes: text("return_condition_notes"), status: allocationStatusEnum("status").notNull().default("active"), createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [index("allocations_asset_status_idx").on(table.assetId, table.status), uniqueIndex("allocations_one_active_asset_idx").on(table.assetId).where(sql`status = 'active'`)]);

export const transfers = pgTable("transfers", {
  id: uuid("id").defaultRandom().primaryKey(), assetId: uuid("asset_id").notNull().references(() => assets.id),
  fromAllocationId: uuid("from_allocation_id").notNull().references(() => allocations.id), requestedByEmployeeId: uuid("requested_by_employee_id").notNull().references(() => employees.id),
  toEmployeeId: uuid("to_employee_id").references(() => employees.id), toDepartmentId: uuid("to_department_id").references(() => departments.id),
  status: transferStatusEnum("status").notNull().default("requested"), approvedByEmployeeId: uuid("approved_by_employee_id").references(() => employees.id),
  requestedAt: timestamp("requested_at").defaultNow().notNull(), resolvedAt: timestamp("resolved_at"),
});
