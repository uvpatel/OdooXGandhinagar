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
  technicianName?: string;
};

export function MaintenanceWorkspace({ role }: { role: string }) {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const convertToBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => { const reader = new FileReader(); reader.readAsDataURL(file); reader.onload = () => resolve(reader.result as string); reader.onerror = (err) => reject(err); });
  
  // Form State
  const [assetId, setAssetId] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [issueDescription, setIssueDescription] = useState("");

  const fetchData = async () => {
    try {
      const [reqRes, assetRes] = await Promise.all([
        fetch("/api/maintenance"),
        fetch("/api/assets")
      ]);
      if (reqRes.ok) {
        const { data } = await reqRes.json();
        setRequests(data || []);
      }
      if (assetRes.ok) {
        const { data } = await assetRes.json();
        setAssets(data || []);
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

  const handleRaise = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formElement = e.currentTarget;
    const form = new FormData(formElement);
    let photoUrl = undefined;
    const photoFile = form.get("photo") as File | null;
    if (photoFile && photoFile.size > 0) { photoUrl = await convertToBase64(photoFile); }

    const res = await fetch("/api/maintenance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assetId, priority, issueDescription, photoUrl }),
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
    let technicianName = undefined;
    if (status === "approved") {
      technicianName = prompt("Assign Technician Name (e.g. John Doe):");
      if (!technicianName) {
        alert("Technician assignment is required to approve.");
        return;
      }
    }
    const res = await fetch(`/api/maintenance/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, technicianName })
    });
    
    if (res.ok) {
       fetchData();
    } else {
       const err = await res.json();
       alert(`Failed: ${err.error}`);
    }
  };

  const handleResolve = async (id: string) => {
    const res = await fetch(`/api/maintenance/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "resolved" })
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
              <select className="h-9 w-full rounded-md border bg-background px-3 text-sm" required value={assetId} onChange={e => setAssetId(e.target.value)}>
                {assets.length === 0 ? (
                  <option value="" disabled>No assets allocated to you</option>
                ) : (
                  <option value="" disabled>Select an Asset</option>
                )}
                {assets.map(a => (
                  <option key={a.id} value={a.id}>{a.assetTag} - {a.name}</option>
                ))}
              </select>
              <select className="h-9 w-full rounded-md border bg-background px-3 text-sm" required value={priority} onChange={e => setPriority(e.target.value as any)}>
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <div className="md:col-span-2">
                <Textarea placeholder="Describe the issue..." value={issueDescription} onChange={e => setIssueDescription(e.target.value)} required />
              </div>
              <div className="md:col-span-2 flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">Upload Damage Photo (Optional)</span>
                <Input name="photo" type="file" accept="image/*" className="cursor-pointer" />
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
                  <TableCell>
                    <div className="text-sm font-medium">{req.issueDescription}</div>
                    {req.technicianName && <div className="text-xs text-muted-foreground mt-1">Tech: {req.technicianName}</div>}
                  </TableCell>
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
                  <TableCell className="text-right flex items-center justify-end gap-2">
                    {req.status === "pending" && (role === "admin" || role === "asset_manager") && (
                      <>
                        <Button variant="ghost" size="sm" onClick={() => handleReview(req.id, "approved")}>Approve</Button>
                        <Button variant="ghost" size="sm" onClick={() => handleReview(req.id, "rejected")} className="text-red-500">Reject</Button>
                      </>
                    )}
                    {(req.status === "approved" || req.status === "in_progress") && (role === "admin" || role === "asset_manager") && (
                      <Button variant="outline" size="sm" onClick={() => handleResolve(req.id)}>Mark Completed</Button>
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
