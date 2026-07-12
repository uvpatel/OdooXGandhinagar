import { Package } from "lucide-react";
import { ModulePage } from "@/components/app/module-page";

export default function AssetsPage() {
  return <ModulePage title="Asset directory" description="Register, search, and track every physical asset across its lifecycle—from available to allocated, maintained, retired, or disposed." icon={Package} primaryAction="Register asset" metrics={[{ label: "Available assets", value: "24", detail: "Ready for allocation or booking" }, { label: "Allocated", value: "13", detail: "Tracked with current holders" }, { label: "Under maintenance", value: "3", detail: "Awaiting repair workflow completion" }]} />;
}
