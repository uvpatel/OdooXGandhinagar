import { AuditWorkspace } from "@/components/audits/audit-workspace"
import { getCurrentEmployee } from "@/lib/auth/session"

export default async function AuditsPage() {
  const employee = await getCurrentEmployee()
  return <AuditWorkspace role={employee?.role || "employee"} />
}
