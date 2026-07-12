import { z } from "zod";

export const createMaintenanceSchema = z.object({ assetId: z.uuid(), issueDescription: z.string().trim().min(5).max(2000), priority: z.enum(["low", "medium", "high", "critical"]).default("medium"), photoUrl: z.string().optional() });
export const maintenanceTransitionSchema = z.object({ status: z.enum(["approved", "rejected", "technician_assigned", "in_progress", "resolved"]), technicianName: z.string().trim().min(2).max(120).optional() });
