"use client";

import { useEffect, useState } from "react";
import { Search, PackagePlus, Clock, CheckCircle, XCircle, ArrowRightLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AssetRequestWorkspace({ role, employeeId }: { role: string; employeeId: string }) {
  const [assets, setAssets] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [query, setQuery] = useState("");

  const fetchData = async () => {
    try {
      const [assetsRes, requestsRes] = await Promise.all([
        fetch("/api/assets?catalog=true"),
        fetch("/api/asset-requests")
      ]);
      if (assetsRes.ok) {
        const { data } = await assetsRes.json();
        setAssets(data.filter((a: any) => (a.status === "available" || a.status === "allocated") && !a.isBookable));
      }
      if (requestsRes.ok) {
        const { data } = await requestsRes.json();
        setRequests(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRequest = async (assetId: string) => {
    const res = await fetch("/api/asset-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assetId }),
    });

    if (res.ok) {
      alert("Asset requested successfully.");
      fetchData();
    } else {
      const err = await res.json();
      alert(`Request failed: ${err.error}`);
    }
  };

  const handleTransferRequest = async (assetId: string) => {
    const res = await fetch("/api/transfers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assetId, toEmployeeId: employeeId }),
    });

    if (res.ok) {
      alert("Transfer requested successfully.");
      fetchData();
    } else {
      const err = await res.json();
      alert(`Transfer request failed: ${err.error}`);
    }
  };

  const handleReview = async (id: string, status: "approved" | "rejected") => {
    const res = await fetch(`/api/asset-requests/${id}`, {
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

  const filteredAssets = assets.filter((a) =>
    `${a.assetTag} ${a.name} ${a.categoryName}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Self Service</p>
          <h1 className="text-3xl font-semibold tracking-tight">Asset Requests</h1>
          <p className="mt-1 text-muted-foreground">Request available assets for allocation.</p>
        </div>
      </div>

      <Tabs defaultValue="catalog">
        <TabsList className="mb-4">
          <TabsTrigger value="catalog">Asset Catalog</TabsTrigger>
          <TabsTrigger value="requests">My Requests</TabsTrigger>
          {(role === "admin" || role === "asset_manager" || role === "department_head") && (
            <TabsTrigger value="approvals">Approvals</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="catalog">
          <Card>
            <CardHeader className="gap-3 sm:flex sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Asset Catalog</CardTitle>
                <CardDescription>Browse and request available assets, or request a transfer for allocated ones</CardDescription>
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
                <Input value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" placeholder="Search tag, name, category..." />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tag</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssets.map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell className="font-medium">{asset.assetTag}</TableCell>
                      <TableCell>{asset.name}</TableCell>
                      <TableCell>{asset.categoryName}</TableCell>
                      <TableCell>{asset.location}</TableCell>
                      <TableCell>
                        <Badge variant={asset.status === "available" ? "default" : "secondary"}>{asset.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {asset.status === "available" ? (
                          <Button size="sm" onClick={() => handleRequest(asset.id)}>
                            <PackagePlus className="size-4 mr-2" /> Request
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => handleTransferRequest(asset.id)}>
                            <ArrowRightLeft className="size-4 mr-2" /> Request Transfer
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredAssets.length === 0 && (
                    <TableRow>
                      <TableCell className="py-8 text-center text-muted-foreground" colSpan={6}>
                        No assets found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle>My Asset Requests</CardTitle>
              <CardDescription>Track the status of your requested items.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Requested On</TableHead>
                    <TableHead>Asset Tag</TableHead>
                    <TableHead>Asset Name</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.filter(r => r.employeeId === employeeId).map((req) => (
                    <TableRow key={req.id}>
                      <TableCell>{new Date(req.requestedAt).toLocaleDateString()}</TableCell>
                      <TableCell className="font-medium">{req.assetTag}</TableCell>
                      <TableCell>{req.assetName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {req.status === "pending" && <Clock className="mr-1 size-3 text-blue-500" />}
                          {req.status === "approved" && <CheckCircle className="mr-1 size-3 text-green-500" />}
                          {req.status === "rejected" && <XCircle className="mr-1 size-3 text-red-500" />}
                          {req.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {(role === "admin" || role === "asset_manager" || role === "department_head") && (
          <TabsContent value="approvals">
            <Card>
              <CardHeader>
                <CardTitle>Pending Approvals</CardTitle>
                <CardDescription>Review employee asset requests.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Requested On</TableHead>
                      <TableHead>Employee</TableHead>
                      <TableHead>Asset Tag</TableHead>
                      <TableHead>Asset Name</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.filter(r => r.status === "pending").map((req) => (
                      <TableRow key={req.id}>
                        <TableCell>{new Date(req.requestedAt).toLocaleDateString()}</TableCell>
                        <TableCell>{req.employeeName}</TableCell>
                        <TableCell className="font-medium">{req.assetTag}</TableCell>
                        <TableCell>{req.assetName}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleReview(req.id, "approved")}>Approve (Allocate)</Button>
                          <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleReview(req.id, "rejected")}>Reject</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </section>
  );
}
