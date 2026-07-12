"use client";

import { useState } from "react";
import { Plus, Search, ClipboardCheck, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

type AuditCycle = {
  id: string;
  name: string;
  scope: string;
  startDate: string;
  endDate: string;
  status: string;
  assignedAuditors: string;
};

const mockAudits: AuditCycle[] = [
  { id: "1", name: "Q3 IT Assets Audit", scope: "Engineering Dept", startDate: "2026-07-01T00:00:00Z", endDate: "2026-07-15T00:00:00Z", status: "active", assignedAuditors: "Aarav Shah" },
  { id: "2", name: "Annual Facility Audit", scope: "All Locations", startDate: "2025-12-01T00:00:00Z", endDate: "2025-12-31T00:00:00Z", status: "completed", assignedAuditors: "Meera Patel" },
];

export function AuditWorkspace() {
  const [audits, setAudits] = useState<AuditCycle[]>(mockAudits);
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);

  const filtered = audits.filter((a) =>
    `${a.name} ${a.scope} ${a.assignedAuditors}`.toLowerCase().includes(query.toLowerCase())
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Audit cycle created!");
    setShowForm(false);
  };

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Verification</p>
          <h1 className="text-3xl font-semibold tracking-tight">Asset Audits</h1>
          <p className="mt-1 text-muted-foreground">Run scheduled audit cycles with auto-generated discrepancy reports.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}><Plus className="size-4 mr-2" /> New Audit Cycle</Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create Audit Cycle</CardTitle>
            <CardDescription>Define the scope and assign auditors.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="grid gap-3 md:grid-cols-2">
              <Input placeholder="Cycle Name (e.g. Q4 Asset Verification)" required />
              <Input placeholder="Scope (Department or Location)" required />
              <div className="flex gap-2">
                <Input type="date" placeholder="Start Date" required />
                <Input type="date" placeholder="End Date" required />
              </div>
              <Input placeholder="Assign Auditors (Email or ID)" required />
              <div className="md:col-span-2">
                <Button type="submit">Create Cycle</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="gap-3 sm:flex sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Audit Cycles</CardTitle>
            <CardDescription>Track verification progress across the organization</CardDescription>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
              placeholder="Search audits..."
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cycle Name</TableHead>
                <TableHead>Scope</TableHead>
                <TableHead>Timeline</TableHead>
                <TableHead>Auditors</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((audit) => (
                <TableRow key={audit.id}>
                  <TableCell className="font-medium">{audit.name}</TableCell>
                  <TableCell>{audit.scope}</TableCell>
                  <TableCell>
                    {format(new Date(audit.startDate), "MMM d, yy")} - {format(new Date(audit.endDate), "MMM d, yy")}
                  </TableCell>
                  <TableCell>{audit.assignedAuditors}</TableCell>
                  <TableCell>
                    <Badge variant={audit.status === "active" ? "default" : "secondary"}>
                      {audit.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">View Details</Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell className="py-8 text-center text-muted-foreground" colSpan={6}>
                    No audit cycles found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
}
