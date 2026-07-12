import { AssetDirectory } from "@/components/assets/asset-directory"
import { getCurrentEmployee } from "@/lib/auth/session"

export default async function AssetsPage() {
  const employee = await getCurrentEmployee()
  return <AssetDirectory role={employee?.role || "employee"} />
}
