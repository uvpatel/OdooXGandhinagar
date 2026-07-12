import { and, eq, gt, inArray, lt } from "drizzle-orm";
import { db } from "@/index";
import { bookings, resources } from "@/db/schema";
import { createBookingSchema } from "@/lib/validations/bookings";
import { DomainError } from "@/server/http";
import { logActivity, notify } from "./activity";

export async function listBookings() { return db.select({ id: bookings.id, resourceName: resources.name, startsAt: bookings.startsAt, endsAt: bookings.endsAt, status: bookings.status }).from(bookings).innerJoin(resources, eq(bookings.resourceId, resources.id)); }

export async function createBooking(input: unknown, actorEmployeeId: string) {
  const parsed = createBookingSchema.safeParse(input);
  if (!parsed.success) throw new DomainError("INVALID_INPUT", "Use a valid resource and time range.", { fields: parsed.error.flatten().fieldErrors });
  const [conflict] = await db.select({ id: bookings.id }).from(bookings).where(and(eq(bookings.resourceId, parsed.data.resourceId), inArray(bookings.status, ["upcoming", "ongoing"]), lt(bookings.startsAt, parsed.data.endsAt), gt(bookings.endsAt, parsed.data.startsAt))).limit(1);
  if (conflict) throw new DomainError("BOOKING_CONFLICT", "This resource is already booked during that time slot.", { bookingId: conflict.id });
  const [booking] = await db.insert(bookings).values({ ...parsed.data, bookedByEmployeeId: actorEmployeeId }).returning();
  await notify(actorEmployeeId, "booking_confirmed", "Your resource booking is confirmed.", "booking", booking.id);
  await logActivity(actorEmployeeId, "booking.created", "booking", booking.id, { resourceId: booking.resourceId });
  return booking;
}
