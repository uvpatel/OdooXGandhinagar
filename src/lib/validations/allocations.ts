import { z } from "zod";

export const createAllocationSchema = z.object({
  assetId: z.uuid(),
  employeeId: z.uuid().optional(),
  departmentId: z.uuid().optional(),
  expectedReturnDate: z.coerce.date().optional(),
}).refine((value) => value.employeeId || value.departmentId, {
  message: "Allocate to an employee or department.",
});

export type CreateAllocationInput = z.infer<typeof createAllocationSchema>;
