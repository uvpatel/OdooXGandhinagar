import { AllocationWorkspace } from "@/components/allocations/allocation-workspace"
import { getCurrentEmployee } from "@/lib/auth/session"

export default async function AllocationsPage() {
  const employee = await getCurrentEmployee()
  return <AllocationWorkspace role={employee?.role || "employee"} />
}
