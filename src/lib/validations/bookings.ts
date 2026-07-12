import { z } from "zod";

export const createBookingSchema = z.object({
  resourceId: z.uuid(),
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date(),
  departmentId: z.uuid().optional(),
}).refine((value) => value.endsAt > value.startsAt, { message: "End must be after start." });

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
