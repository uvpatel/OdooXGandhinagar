import { MaintenanceWorkspace } from "@/components/maintenance/maintenance-workspace"
import { getCurrentEmployee } from "@/lib/auth/session"

export default async function MaintenancePage() {
  const employee = await getCurrentEmployee()
  return <MaintenanceWorkspace role={employee?.role || "employee"} />
}
