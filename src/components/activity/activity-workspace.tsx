"use client";

import { useState } from "react";
import { Search, Activity, BellRing } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

type LogEntry = {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
};

const mockLogs: LogEntry[] = [
  { id: "1", actor: "Aarav Shah", action: "Approved Maintenance Request", target: "AF-0114", timestamp: "2026-07-12T10:30:00Z" },
  { id: "2", actor: "Meera Patel", action: "Registered Asset", target: "AF-0115", timestamp: "2026-07-12T09:15:00Z" },
  { id: "3", actor: "System", action: "Flagged Overdue Return", target: "AF-0045", timestamp: "2026-07-11T23:59:59Z" },
];

export function ActivityWorkspace() {
  const [logs, setLogs] = useState<LogEntry[]>(mockLogs);
  const [query, setQuery] = useState("");

  const filtered = logs.filter((log) =>
    `${log.actor} ${log.action} ${log.target}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Monitoring</p>
          <h1 className="text-3xl font-semibold tracking-tight">Activity Logs</h1>
          <p className="mt-1 text-muted-foreground">Keep every role informed without digging for updates.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="gap-3 sm:flex sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Audit Log</CardTitle>
                <CardDescription>Full history of admin, manager, and employee actions</CardDescription>
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-9"
                  placeholder="Search logs..."
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Actor</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Target</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {format(new Date(log.timestamp), "MMM d, HH:mm")}
                      </TableCell>
                      <TableCell className="font-medium">{log.actor}</TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell>{log.target}</TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell className="py-8 text-center text-muted-foreground" colSpan={4}>
                        No activity found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BellRing className="size-5" /> Recent Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="border-l-4 border-destructive pl-4 py-1">
                  <p className="text-sm font-medium">Overdue Return Alert</p>
                  <p className="text-xs text-muted-foreground mt-1">Projector X1 (AF-0045) is past due.</p>
                </div>
                <div className="border-l-4 border-primary pl-4 py-1">
                  <p className="text-sm font-medium">Maintenance Approved</p>
                  <p className="text-xs text-muted-foreground mt-1">AF-0114 screen repair approved.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
