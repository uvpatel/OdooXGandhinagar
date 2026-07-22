"use client";

import { useEffect, useMemo, useState } from "react";
import { Building2, Layers3, Plus, Search, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Department = { id: string; name: string; parentDepartmentId: string | null; headEmployeeId: string | null; status: "active" | "inactive" };
type Category = { id: string; name: string; extraFieldsSchema: Record<string, string> };
type Employee = { id: string; name: string; email: string; departmentId: string | null; role: "employee" | "department_head" | "asset_manager" | "admin"; status: "active" | "inactive" };

export function OrganizationWorkspace({ role }: { role: string }) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();

  const fetchData = async () => {
    try {
      const res = await fetch("/api/organization");
      if (res.ok) {
        const { data } = await res.json();
        setDepartments(data.departments);
        setCategories(data.categories);
        setEmployees(data.employees);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredDepartments = useMemo(() => departments.filter((department) => department.name.toLowerCase().includes(normalizedQuery)), [departments, normalizedQuery]);
  const filteredCategories = useMemo(() => categories.filter((category) => category.name.toLowerCase().includes(normalizedQuery)), [categories, normalizedQuery]);
  const filteredEmployees = useMemo(() => employees.filter((employee) => `${employee.name} ${employee.email}`.toLowerCase().includes(normalizedQuery)), [employees, normalizedQuery]);

  const addDepartment = async () => {
    const name = window.prompt("Department name");
    if (!name?.trim()) return;
    const res = await fetch("/api/organization/departments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim() })
    });
    if (!res.ok) {
      const err = await res.json();
      alert(`Error: ${err.error || "Failed to create department"}`);
      return;
    }
    fetchData();
  };

  const addCategory = async () => {
    const name = window.prompt("Asset category name");
    if (!name?.trim()) return;
    const res = await fetch("/api/organization/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim() }),
    });
    if (!res.ok) {
      const err = await res.json();
      alert(`Error: ${err.error || "Failed to create asset category"}`);
      return;
    }
    fetchData();
  };

  const addEmployee = () => {
    alert("Employee creation requires authentication/invite flow.");
  };

  const promoteEmployee = async (employeeId: string, role: string) => {
    const res = await fetch("/api/organization/roles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employeeId, role })
    });
    if (!res.ok) {
      const err = await res.json();
      alert(`Error: ${err.error || "Failed to update role"}`);
      return;
    }
    fetchData();
  };

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Administration</p>
          <h1 className="text-3xl font-semibold tracking-tight">Organization setup</h1>
          <p className="mt-1 text-muted-foreground">Manage the departments, categories, and people that power every AssetFlow workflow.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute top-2.5 left-3 size-4 text-muted-foreground" />
          <Input value={query} onChange={(event) => setQuery(event.target.value)} className="pl-9" placeholder="Search organization" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard icon={<Building2 />} label="Active departments" value={departments.length} description="Structured ownership and hierarchy" />
        <SummaryCard icon={<Layers3 />} label="Asset categories" value={categories.length} description="Flexible fields for every asset type" />
        <SummaryCard icon={<Users />} label="Active employees" value={employees.length} description="Roles assigned by administrators" />
      </div>

      <Tabs defaultValue="departments">
        <TabsList className="w-full justify-start overflow-x-auto sm:w-fit">
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="categories">Asset categories</TabsTrigger>
          <TabsTrigger value="employees">Employee directory</TabsTrigger>
        </TabsList>
        <TabsContent value="departments" className="mt-4">
          <DirectoryCard title="Department management" description="Create teams, assign department heads, and maintain reporting lines." action={role === "admin" ? "Add department" : undefined} onAction={addDepartment}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department</TableHead>
                  <TableHead>Department head</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDepartments.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{employees.find((e) => e.id === item.headEmployeeId)?.name || "Unassigned"}</TableCell>
                    <TableCell><Badge variant="secondary">{item.status}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DirectoryCard>
        </TabsContent>
        <TabsContent value="categories" className="mt-4">
          <DirectoryCard title="Asset category management" description="Define reusable categories and their category-specific information." action={role === "admin" ? "Add category" : undefined} onAction={addCategory}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DirectoryCard>
        </TabsContent>
        <TabsContent value="employees" className="mt-4">
          <DirectoryCard title="Employee directory" description="New accounts are employees by default. Only an admin can promote a role here." action={role === "admin" ? "Add employee" : undefined} onAction={addEmployee}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.email}</p>
                    </TableCell>
                    <TableCell>{departments.find((d) => d.id === item.departmentId)?.name || "—"}</TableCell>
                    <TableCell>
                      {role === "admin" ? (
                        <Select defaultValue={item.role} onValueChange={(val) => promoteEmployee(item.id, val)}>
                          <SelectTrigger className="w-[160px] h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="employee">Employee</SelectItem>
                            <SelectItem value="department_head">Department Head</SelectItem>
                            <SelectItem value="asset_manager">Asset Manager</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge variant={item.role === "employee" ? "outline" : "secondary"}>{item.role.replace("_", " ")}</Badge>
                      )}
                    </TableCell>
                    <TableCell><Badge variant="secondary">{item.status}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DirectoryCard>
        </TabsContent>
      </Tabs>
    </section>
  );
}

function SummaryCard({ icon, label, value, description }: { icon: React.ReactNode; label: string; value: number; description: string }) {
  return (
    <Card>
      <CardHeader>
        <CardDescription className="flex items-center gap-2">{icon}{label}</CardDescription>
        <CardTitle className="text-3xl">{value}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">{description}</CardContent>
    </Card>
  );
}

function DirectoryCard({ title, description, action, onAction, children }: { title: string; description: string; action?: string; onAction?: () => void; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="gap-3 sm:flex sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        {action && <Button onClick={onAction}><Plus className="mr-2 h-4 w-4" />{action}</Button>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
