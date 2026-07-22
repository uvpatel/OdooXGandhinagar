import { AssetRequestWorkspace } from "@/components/assets/asset-request-workspace";
import { getCurrentEmployee } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function RequestsPage() {
  const employee = await getCurrentEmployee();
  if (!employee) return redirect("/login");

  return <AssetRequestWorkspace role={employee.role} employeeId={employee.id} />;
}
