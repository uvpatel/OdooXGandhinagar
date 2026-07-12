"use client";

import { useEffect, useState } from "react";
import { BookOpenCheck, Plus, RefreshCw, Search, ArrowRightLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";

type Allocation = {
  id: string;
  assetTag: string;
  assetName: string;
  allocatedTo: string; // Employee or Department name
  allocatedAt: string;
  expectedReturnDate: string | null;
  status: string;
};

// Mock data for UI demonstration
const mockAllocations: Allocation[] = [
  { id: "1", assetTag: "AF-0012", assetName: "MacBook Pro M3", allocatedTo: "Meera Patel", allocatedAt: "2026-06-15T10:00:00Z", expectedReturnDate: null, status: "active" },
  { id: "2", assetTag: "AF-0114", assetName: "Dell UltraSharp Monitor", allocatedTo: "Priya Singh", allocatedAt: "2026-06-20T09:30:00Z", expectedReturnDate: "2026-12-31T00:00:00Z", status: "active" },
  { id: "3", assetTag: "AF-0045", assetName: "Projector X1", allocatedTo: "Engineering Dept", allocatedAt: "2026-07-01T14:15:00Z", expectedReturnDate: "2026-07-15T00:00:00Z", status: "overdue" },
];

export function AllocationWorkspace() {
  const [allocations, setAllocations] = useState<Allocation[]>(mockAllocations);
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);

  const filtered = allocations.filter((a) =>
    `${a.assetTag} ${a.assetName} ${a.allocatedTo}`.toLowerCase().includes(query.toLowerCase())
  );

  const handleAllocate = (e: React.FormEvent) => {
    e.preventDefault();
    alert("This would trigger a backend check. If asset is already allocated, the system blocks it and offers a Transfer Request.");
    setShowForm(false);
  };

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Asset Assignment</p>
          <h1 className="text-3xl font-semibold tracking-tight">Allocations & Transfers</h1>
          <p className="mt-1 text-muted-foreground">Manage who holds what, with explicit conflict rules.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline"><ArrowRightLeft className="size-4 mr-2"/>Transfer Requests</Button>
            <Button onClick={() => setShowForm((curr) => !curr)}><Plus className="size-4 mr-2"/>New Allocation</Button>
        </div>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Allocate Asset</CardTitle>
            <CardDescription>Assign an asset to an employee or department.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAllocate} className="grid gap-3 md:grid-cols-2">
              <Input placeholder="Asset Tag (e.g. AF-0114)" required />
              <Input placeholder="Assign to (Employee or Dept ID)" required />
              <Input type="date" placeholder="Expected Return Date" />
              <div className="md:col-span-2">
                <Button type="submit">Allocate Asset</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="gap-3 sm:flex sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Current Allocations</CardTitle>
            <CardDescription>All active and overdue assignments</CardDescription>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
              placeholder="Search tag, name, person..."
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset Tag</TableHead>
                <TableHead>Asset Name</TableHead>
                <TableHead>Allocated To</TableHead>
                <TableHead>Expected Return</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((allocation) => (
                <TableRow key={allocation.id}>
                  <TableCell className="font-medium">{allocation.assetTag}</TableCell>
                  <TableCell>{allocation.assetName}</TableCell>
                  <TableCell>{allocation.allocatedTo}</TableCell>
                  <TableCell>
                    {allocation.expectedReturnDate
                      ? format(new Date(allocation.expectedReturnDate), "MMM d, yyyy")
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={allocation.status === "active" ? "secondary" : "destructive"}>
                      {allocation.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Return</Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell className="py-8 text-center text-muted-foreground" colSpan={6}>
                    No allocations found.
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
