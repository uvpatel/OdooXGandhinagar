import { z } from "zod";

export const createAuditCycleSchema = z.object({
  name: z.string().min(1, "Name is required"),
  scopeDepartmentId: z.string().uuid().optional(),
  scopeLocation: z.string().optional(),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date"),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date"),
  auditorEmployeeIds: z.array(z.string().uuid()).min(1, "Assign at least one auditor"),
});

export const updateAuditItemSchema = z.object({
  result: z.enum(["verified", "missing", "damaged"]),
  notes: z.string().optional(),
});
