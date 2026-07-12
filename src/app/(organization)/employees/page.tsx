import { OrganizationWorkspace } from "@/components/organization/organization-workspace";
import { getCurrentEmployee } from "@/lib/auth/session";

export default async function EmployeesPage() { 
  const employee = await getCurrentEmployee();
  return <OrganizationWorkspace role={employee?.role || "employee"} />; 
}
