import { z } from "zod";

export const createAssetSchema = z.object({
  name: z.string().trim().min(2).max(120),
  categoryId: z.uuid(),
  serialNumber: z.string().trim().min(1).max(120),
  acquisitionDate: z.string().date().optional(),
  acquisitionCost: z.string().regex(/^\d+(\.\d{1,2})?$/).optional(),
  condition: z.enum(["new", "good", "fair", "poor", "damaged"]).default("good"),
  location: z.string().trim().min(2).max(160),
  departmentId: z.uuid().optional(),
  isBookable: z.boolean().default(false),
  photoUrl: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).default({}),
});
