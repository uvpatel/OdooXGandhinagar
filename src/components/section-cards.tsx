"use client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Package, BookOpenCheck, Wrench, CalendarDays, ArrowRightLeft, AlertCircle } from "lucide-react"

export type DashboardStats = {
  assetsAvailable: number;
  assetsAllocated: number;
  maintenanceToday: number;
  activeBookings: number;
  pendingTransfers: number;
  upcomingReturns: number;
  overdueReturns: number;
}

export function SectionCards({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 dark:*:data-[slot=card]:bg-card">
      {/* Assets Available */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Assets Available</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.assetsAvailable}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <Package className="mr-1 size-3" />
              Ready
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>

      {/* Assets Allocated */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Assets Allocated</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.assetsAllocated}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              <BookOpenCheck className="mr-1 size-3" />
              In Use
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>

      {/* Maintenance Today */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Maintenance Today</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.maintenanceToday}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
              <Wrench className="mr-1 size-3" />
              Pending
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>

      {/* Active Bookings */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Bookings</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.activeBookings}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
              <CalendarDays className="mr-1 size-3" />
              Ongoing
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>

      {/* Pending Transfers */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Pending Transfers</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.pendingTransfers}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              <ArrowRightLeft className="mr-1 size-3" />
              Requested
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>

      {/* Upcoming Returns */}
      <Card className="@container/card border-destructive/50">
        <CardHeader>
          <CardDescription>Upcoming Returns</CardDescription>
          <CardTitle className={`text-2xl font-semibold tabular-nums @[250px]/card:text-3xl ${stats.overdueReturns > 0 ? "text-destructive" : ""}`}>
            {stats.upcomingReturns + stats.overdueReturns}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className={stats.overdueReturns > 0 ? "bg-destructive/10 text-destructive border-destructive/20" : "bg-muted/50 text-muted-foreground border-border"}>
              <AlertCircle className="mr-1 size-3" />
              {stats.overdueReturns} Overdue
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>
    </div>
  )
}
