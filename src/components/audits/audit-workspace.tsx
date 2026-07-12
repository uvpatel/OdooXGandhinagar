"use client";

import { useEffect, useState } from "react";
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
  scopeLocation: string | null;
  departmentName: string | null;
  startDate: string;
  endDate: string;
  status: string;
};

export function AuditWorkspace({ role }: { role: string }) {
  const [audits, setAudits] = useState<AuditCycle[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [scopeDepartmentId, setScopeDepartmentId] = useState("");
  const [scopeLocation, setScopeLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [auditorEmployeeIds, setAuditorEmployeeIds] = useState("");

  const fetchData = async () => {
    try {
      const [res, empRes, deptRes] = await Promise.all([
        fetch("/api/audits"),
        fetch("/api/organization/employees"),
        fetch("/api/organization/departments")
      ]);
      if (res.ok) {
        const { data } = await res.json();
        setAudits(data || []);
      }
      if (empRes.ok) {
        const { data } = await empRes.json();
        setEmployees(data || []);
      }
      if (deptRes.ok) {
        const { data } = await deptRes.json();
        setDepartments(data || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = audits.filter((a) =>
    `${a.name} ${a.scopeLocation} ${a.departmentName}`.toLowerCase().includes(query.toLowerCase())
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/audits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        scopeDepartmentId: scopeDepartmentId || undefined,
        scopeLocation: scopeLocation || undefined,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        auditorEmployeeIds: auditorEmployeeIds.split(",").map(s => s.trim()).filter(Boolean)
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      let errorMsg = err.error || "Unknown error";
      if (err.details && err.details.fields) {
          const fieldErrors = Object.entries(err.details.fields).map(([field, msgs]) => `${field}: ${(msgs as string[]).join(", ")}`).join(" | ");
          errorMsg += `\n\nDetails: ${fieldErrors}`;
      }
      alert(`Error creating audit: ${errorMsg}`);
      return;
    }

    setShowForm(false);
    setName("");
    setScopeDepartmentId("");
    setScopeLocation("");
    setStartDate("");
    setEndDate("");
    setAuditorEmployeeIds("");
    fetchData();
  };

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Verification</p>
          <h1 className="text-3xl font-semibold tracking-tight">Asset Audits</h1>
          <p className="mt-1 text-muted-foreground">Run scheduled audit cycles with auto-generated discrepancy reports.</p>
        </div>
        {role === "admin" && (
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="size-4 mr-2" /> New Audit Cycle
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create Audit Cycle</CardTitle>
            <CardDescription>Define the scope and assign auditors.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="grid gap-3 md:grid-cols-2">
              <Input placeholder="Cycle Name (e.g. Q4 Asset Verification)" value={name} onChange={e => setName(e.target.value)} required />
              <select className="h-9 w-full rounded-md border bg-background px-3 text-sm" value={scopeDepartmentId} onChange={e => setScopeDepartmentId(e.target.value)}>
                <option value="">All Departments (No Scope)</option>
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
              <Input placeholder="Scope Location (Optional)" value={scopeLocation} onChange={e => setScopeLocation(e.target.value)} />
              <div className="flex flex-col gap-1">
                 <span className="text-xs text-muted-foreground">Select Auditors (Ctrl/Cmd + Click for multiple)</span>
                 <select multiple className="h-24 w-full rounded-md border bg-background px-3 py-2 text-sm" value={auditorEmployeeIds ? auditorEmployeeIds.split(",") : []} onChange={e => {
                   const selected = Array.from(e.target.selectedOptions, option => option.value);
                   setAuditorEmployeeIds(selected.join(","));
                 }} required>
                   {employees.map(emp => (
                     <option key={emp.id} value={emp.id}>{emp.name} ({emp.role})</option>
                   ))}
                 </select>
              </div>
              <div className="flex gap-2 md:col-span-2">
                <Input type="date" placeholder="Start Date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
                <Input type="date" placeholder="End Date" value={endDate} onChange={e => setEndDate(e.target.value)} required />
              </div>
              <div className="md:col-span-2 flex gap-2">
                <Button type="submit">Create Cycle</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
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
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((audit) => (
                <TableRow key={audit.id}>
                  <TableCell className="font-medium">{audit.name}</TableCell>
                  <TableCell>{audit.departmentName || audit.scopeLocation || "All Assets"}</TableCell>
                  <TableCell>
                    {format(new Date(audit.startDate), "MMM d, yy")} - {format(new Date(audit.endDate), "MMM d, yy")}
                  </TableCell>
                  <TableCell>
                    <Badge variant={audit.status === "scheduled" ? "default" : "secondary"}>
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
                  <TableCell className="py-8 text-center text-muted-foreground" colSpan={5}>
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
