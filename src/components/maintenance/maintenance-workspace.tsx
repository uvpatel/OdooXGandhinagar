"use client";

import { useEffect, useState } from "react";
import { PenTool, Plus, Search, CheckCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

type MaintenanceRequest = {
  id: string;
  assetId: string;
  issueDescription: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "approved" | "in_progress" | "resolved" | "rejected";
  raisedByEmployeeId: string;
};

export function MaintenanceWorkspace() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [assetId, setAssetId] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [issueDescription, setIssueDescription] = useState("");

  const fetchData = async () => {
    try {
      const res = await fetch("/api/maintenance");
      if (res.ok) {
        const { data } = await res.json();
        setRequests(data || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = requests.filter((r) =>
    `${r.assetId} ${r.issueDescription}`.toLowerCase().includes(query.toLowerCase())
  );

  const handleRaise = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/maintenance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assetId, priority, issueDescription }),
    });

    if (!res.ok) {
      const err = await res.json();
      alert(`Request failed: ${err.error || "Unknown error"}`);
      return;
    }

    setShowForm(false);
    setAssetId("");
    setPriority("medium");
    setIssueDescription("");
    fetchData();
  };

  const handleReview = async (id: string, status: "approved" | "rejected") => {
    const res = await fetch(`/api/maintenance/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    
    if (res.ok) {
       fetchData();
    } else {
       const err = await res.json();
       alert(`Failed: ${err.error}`);
    }
  };

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Asset Servicing</p>
          <h1 className="text-3xl font-semibold tracking-tight">Maintenance</h1>
          <p className="mt-1 text-muted-foreground">Route repairs through approval before work starts.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}><Plus className="size-4 mr-2" /> Raise Request</Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Raise Maintenance Request</CardTitle>
            <CardDescription>Report an issue with an asset.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRaise} className="grid gap-3 md:grid-cols-2">
              <Input placeholder="Asset ID (UUID)" value={assetId} onChange={e => setAssetId(e.target.value)} required />
              <select className="h-9 rounded-md border bg-background px-3 text-sm" required value={priority} onChange={e => setPriority(e.target.value as any)}>
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <div className="md:col-span-2">
                <Textarea placeholder="Describe the issue..." value={issueDescription} onChange={e => setIssueDescription(e.target.value)} required />
              </div>
              <div className="md:col-span-2 flex gap-2">
                <Button type="submit">Submit Request</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="gap-3 sm:flex sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Maintenance Requests</CardTitle>
            <CardDescription>Track repairs and approvals</CardDescription>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
              placeholder="Search description..."
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset UUID</TableHead>
                <TableHead>Issue</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((req) => (
                <TableRow key={req.id}>
                  <TableCell className="font-medium text-xs">{req.assetId.substring(0,8)}...</TableCell>
                  <TableCell>{req.issueDescription}</TableCell>
                  <TableCell>
                    <Badge variant={req.priority === "high" ? "destructive" : "secondary"}>
                      {req.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {req.status === "pending" && <Clock className="mr-1 size-3" />}
                      {req.status === "resolved" && <CheckCircle className="mr-1 size-3 text-green-500" />}
                      {(req.status === "in_progress" || req.status === "approved") && <PenTool className="mr-1 size-3 text-blue-500" />}
                      {req.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {req.status === "pending" && (
                      <>
                        <Button variant="ghost" size="sm" onClick={() => handleReview(req.id, "approved")}>Approve</Button>
                        <Button variant="ghost" size="sm" onClick={() => handleReview(req.id, "rejected")}>Reject</Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell className="py-8 text-center text-muted-foreground" colSpan={5}>
                    No maintenance requests found.
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
