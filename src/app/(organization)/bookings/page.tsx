import { BookingWorkspace } from "@/components/bookings/booking-workspace"
import { getCurrentEmployee } from "@/lib/auth/session"

export default async function BookingsPage() {
  const employee = await getCurrentEmployee()
  return <BookingWorkspace role={employee?.role || "employee"} departmentId={employee?.departmentId || null} />
}
