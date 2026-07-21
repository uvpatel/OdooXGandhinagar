import { z } from "zod";

export const createDepartmentSchema = z.object({
  name: z.string().min(1, "Department name is required"),
});

export const createAssetCategorySchema = z.object({
  name: z.string().trim().min(1, "Category name is required").max(80),
  extraFieldsSchema: z.record(z.string(), z.string()).default({}),
});

export const updateEmployeeRoleSchema = z.object({
  role: z.enum(["admin", "asset_manager", "department_head", "employee"]),
});
