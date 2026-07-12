"use client"

import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export type TableRowData = {
  id: string;
  assetTag: string;
  assetName: string;
  expectedReturnDate: string | null;
  type: "overdue" | "upcoming";
};

export function DataTable({ data }: { data: TableRowData[] }) {
  return (
    <Card className="mx-4 lg:mx-6 border-none shadow-none bg-transparent p-0">
      <CardHeader className="px-0">
        <CardTitle>Returns Schedule</CardTitle>
        <CardDescription>Track upcoming and overdue asset returns.</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <div className="overflow-hidden rounded-lg border bg-card">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Asset Tag</TableHead>
                <TableHead>Asset Name</TableHead>
                <TableHead>Expected Return Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length ? (
                data.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{row.assetTag}</TableCell>
                    <TableCell>{row.assetName}</TableCell>
                    <TableCell>
                      {row.expectedReturnDate ? format(new Date(row.expectedReturnDate), "MMM d, yyyy") : "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={row.type === "overdue" ? "destructive" : "secondary"}>
                        {row.type}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    No returns scheduled.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
