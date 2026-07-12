import { z } from "zod";

export const createDepartmentSchema = z.object({
  name: z.string().min(1, "Department name is required"),
});

export const updateEmployeeRoleSchema = z.object({
  role: z.enum(["admin", "asset_manager", "department_head", "employee"]),
});
