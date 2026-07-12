"use client";

import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ReportsWorkspace() {
  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Analytics</p>
          <h1 className="text-3xl font-semibold tracking-tight">Reports & Analytics</h1>
          <p className="mt-1 text-muted-foreground">Actionable operational insight for managers.</p>
        </div>
        <Button variant="outline"><Download className="size-4 mr-2" /> Export Reports</Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Asset Utilization Trends</CardTitle>
            <CardDescription>Most-used vs. idle assets over the past 3 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartAreaInteractive />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
