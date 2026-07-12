"use client";

import { useEffect, useState } from "react";
import { BookOpenCheck, Plus, RefreshCw, Search, ArrowRightLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

type Allocation = {
  id: string;
  assetTag: string;
  assetName: string;
  holder: string; // Employee or Department name
  allocatedAt: string;
  expectedReturnDate: string | null;
  status: string;
};

export function AllocationWorkspace() {
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [assetId, setAssetId] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [expectedReturnDate, setExpectedReturnDate] = useState("");

  const fetchData = async () => {
    try {
      const res = await fetch("/api/allocations");
      if (res.ok) {
        const { data } = await res.json();
        setAllocations(data || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = allocations.filter((a) =>
    `${a.assetTag} ${a.assetName} ${a.holder}`.toLowerCase().includes(query.toLowerCase())
  );

  const handleAllocate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/allocations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assetId, employeeId, expectedReturnDate: expectedReturnDate ? new Date(expectedReturnDate).toISOString() : undefined }),
    });

    if (!res.ok) {
      const err = await res.json();
      if (err.error?.includes("ALREADY_ALLOCATED") || err.code === "ALREADY_ALLOCATED") {
        if (confirm("Asset is already allocated. Create a Transfer Request instead?")) {
           const transferRes = await fetch("/api/transfers", {
             method: "POST",
             headers: { "Content-Type": "application/json" },
             body: JSON.stringify({ assetId, toEmployeeId: employeeId })
           });
           if (transferRes.ok) {
             alert("Transfer requested successfully!");
           } else {
             const tErr = await transferRes.json();
             alert(`Transfer failed: ${tErr.error}`);
           }
        }
      } else {
        alert(`Allocation failed: ${err.error || "Unknown error"}`);
      }
      return;
    }
    
    setShowForm(false);
    setAssetId("");
    setEmployeeId("");
    setExpectedReturnDate("");
    fetchData();
  };

  const handleReturn = async (id: string) => {
    const res = await fetch(`/api/allocations/${id}/return`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ returnConditionNotes: "Returned in good condition" })
    });
    if (res.ok) {
      fetchData();
    } else {
      const err = await res.json();
      alert(`Return failed: ${err.error}`);
    }
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
              <Input placeholder="Asset ID (UUID)" value={assetId} onChange={e => setAssetId(e.target.value)} required />
              <Input placeholder="Assign to Employee ID (UUID)" value={employeeId} onChange={e => setEmployeeId(e.target.value)} required />
              <Input type="date" placeholder="Expected Return Date" value={expectedReturnDate} onChange={e => setExpectedReturnDate(e.target.value)} />
              <div className="md:col-span-2 flex gap-2">
                <Button type="submit">Allocate Asset</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
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
                  <TableCell>{allocation.holder}</TableCell>
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
                    <Button variant="ghost" size="sm" onClick={() => handleReturn(allocation.id)}>Return</Button>
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
