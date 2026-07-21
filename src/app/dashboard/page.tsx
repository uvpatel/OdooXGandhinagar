import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { PlusCircle, CalendarPlus, PenTool } from "lucide-react"
import Link from "next/link"

import { requireAuth } from "@/lib/auth-guard"
import { getDashboardSnapshot } from "@/server/services/dashboard"

export default async function Page() {
  await requireAuth()
  
  const { stats, tableData } = await getDashboardSnapshot()

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6 flex flex-wrap items-center gap-4">
                <h2 className="text-xl font-semibold tracking-tight mr-auto">Dashboard Overview</h2>
                <div className="flex items-center gap-2">
                  <Link href="/assets">
                    <Button className="gap-2"><PlusCircle className="size-4"/> Register Asset</Button>
                  </Link>
                  <Link href="/bookings">
                    <Button variant="outline" className="gap-2"><CalendarPlus className="size-4"/> Book Resource</Button>
                  </Link>
                  <Link href="/maintenance">
                    <Button variant="outline" className="gap-2"><PenTool className="size-4"/> Raise Maintenance Request</Button>
                  </Link>
                </div>
              </div>
              <SectionCards stats={stats} />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <DataTable data={tableData} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
