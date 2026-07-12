import { OrganizationWorkspace } from "@/components/organization/organization-workspace"
import { getCurrentEmployee } from "@/lib/auth/session"

export default async function OrganizationPage() {
  const employee = await getCurrentEmployee()
  return <OrganizationWorkspace role={employee?.role || "employee"} />
}
