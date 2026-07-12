import { CalendarDays } from "lucide-react";
import { ModulePage } from "@/components/app/module-page";
export default function BookingsPage() { return <ModulePage title="Resource bookings" description="Reserve shared rooms, vehicles, and equipment in time slots with overlap prevention." icon={CalendarDays} primaryAction="Book resource" metrics={[{ label: "Active bookings", value: "8", detail: "Across bookable resources" }, { label: "Today", value: "4", detail: "Upcoming and ongoing slots" }, { label: "Available resources", value: "11", detail: "Ready to reserve" }]} />; }
