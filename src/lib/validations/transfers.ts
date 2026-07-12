import { z } from "zod";

export const requestTransferSchema = z.object({
  assetId: z.string().uuid(),
  toEmployeeId: z.string().uuid().optional(),
  toDepartmentId: z.string().uuid().optional(),
}).refine((data) => data.toEmployeeId || data.toDepartmentId, {
  message: "Provide either a target employee or department.",
});

export const resolveTransferSchema = z.object({
  status: z.enum(["approved", "rejected"]),
});
