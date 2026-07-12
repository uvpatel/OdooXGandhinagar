"use client";

import { useState } from "react";
import { PenTool, Plus, Search, CheckCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

type MaintenanceRequest = {
  id: string;
  assetTag: string;
  issueDescription: string;
  priority: string;
  status: string;
  raisedBy: string;
};

const mockRequests: MaintenanceRequest[] = [
  { id: "1", assetTag: "AF-0114", issueDescription: "Screen flickering randomly", priority: "high", status: "pending", raisedBy: "Priya Singh" },
  { id: "2", assetTag: "AF-0045", issueDescription: "Lamp replacement needed", priority: "medium", status: "in-progress", raisedBy: "Engineering Dept" },
];

export function MaintenanceWorkspace() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>(mockRequests);
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);

  const filtered = requests.filter((r) =>
    `${r.assetTag} ${r.issueDescription} ${r.raisedBy}`.toLowerCase().includes(query.toLowerCase())
  );

  const handleRaise = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Request Raised! It is pending approval.");
    setShowForm(false);
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
              <Input placeholder="Asset Tag (e.g. AF-0114)" required />
              <select className="h-9 rounded-md border bg-background px-3 text-sm" required defaultValue="medium">
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <div className="md:col-span-2">
                <Textarea placeholder="Describe the issue..." required />
              </div>
              <div className="md:col-span-2">
                <Button type="submit">Submit Request</Button>
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
              placeholder="Search tag, description..."
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset Tag</TableHead>
                <TableHead>Issue</TableHead>
                <TableHead>Raised By</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((req) => (
                <TableRow key={req.id}>
                  <TableCell className="font-medium">{req.assetTag}</TableCell>
                  <TableCell>{req.issueDescription}</TableCell>
                  <TableCell>{req.raisedBy}</TableCell>
                  <TableCell>
                    <Badge variant={req.priority === "high" ? "destructive" : "secondary"}>
                      {req.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {req.status === "pending" && <Clock className="mr-1 size-3" />}
                      {req.status === "resolved" && <CheckCircle className="mr-1 size-3 text-green-500" />}
                      {req.status === "in-progress" && <PenTool className="mr-1 size-3 text-blue-500" />}
                      {req.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {req.status === "pending" && (
                      <Button variant="outline" size="sm">Review</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell className="py-8 text-center text-muted-foreground" colSpan={6}>
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
