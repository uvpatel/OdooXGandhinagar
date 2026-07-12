import { AnyPgColumn, index, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { roleEnum } from "./enums";
import { user } from "./auth";

export const departments = pgTable("departments", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
  parentDepartmentId: uuid("parent_department_id").references((): AnyPgColumn => departments.id),
  headEmployeeId: uuid("head_employee_id"),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
});

export const employees = pgTable("employees", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull().unique().references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(), email: text("email").notNull().unique(),
  departmentId: uuid("department_id").references(() => departments.id),
  role: roleEnum("role").notNull().default("employee"), status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
}, (table) => [index("employees_department_id_idx").on(table.departmentId)]);

export const assetCategories = pgTable("asset_categories", {
  id: uuid("id").defaultRandom().primaryKey(), name: text("name").notNull().unique(),
  extraFieldsSchema: jsonb("extra_fields_schema").notNull().default({}), createdAt: timestamp("created_at").defaultNow().notNull(),
});
