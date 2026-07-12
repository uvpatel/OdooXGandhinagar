"use client";

import { useEffect, useState } from "react";
import { Search, BellRing } from "lucide-react";
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

export function ActivityWorkspace() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [query, setQuery] = useState("");

  const fetchData = async () => {
    try {
      const res = await fetch("/api/activity");
      if (res.ok) {
        const { data } = await res.json();
        setLogs(data || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
                    <TableHead>Target ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {format(new Date(log.timestamp), "MMM d, HH:mm")}
                      </TableCell>
                      <TableCell className="font-medium">{log.actor}</TableCell>
                      <TableCell>{log.action.replace(/\./g, " ")}</TableCell>
                      <TableCell className="text-xs">{log.target.substring(0,8)}...</TableCell>
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
              <CardTitle className="flex items-center gap-2"><BellRing className="size-5" /> Notifications Context</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="border-l-4 border-muted pl-4 py-1">
                  <p className="text-sm font-medium">Real-time alerts pending</p>
                  <p className="text-xs text-muted-foreground mt-1">Check individual workspaces for specific actions.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
