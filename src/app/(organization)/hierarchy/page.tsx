import { Network } from "lucide-react";
import { ModulePage } from "@/components/app/module-page";

export default function HierarchyPage() {
  return <ModulePage title="Department hierarchy" description="Review the organization’s reporting structure and department ownership." icon={Network} primaryAction="Add department" metrics={[{ label: "Top-level departments", value: "3", detail: "Operations, Engineering, Facilities" }, { label: "Department heads", value: "2", detail: "Assigned to active departments" }, { label: "Unassigned", value: "1", detail: "Needs a department head" }]} />;
}
