"use client";

import { useMemo, useState } from "react";
import { Building2, Layers3, Plus, Search, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Department = { id: number; name: string; head: string; parent: string; status: "Active" | "Inactive" };
type Category = { id: number; name: string; fields: string; assets: number };
type Employee = { id: number; name: string; email: string; department: string; role: "Employee" | "Department Head" | "Asset Manager"; status: "Active" | "Inactive" };

const initialDepartments: Department[] = [
  { id: 1, name: "Operations", head: "Aarav Shah", parent: "—", status: "Active" },
  { id: 2, name: "Engineering", head: "Meera Patel", parent: "Operations", status: "Active" },
  { id: 3, name: "Facilities", head: "Unassigned", parent: "Operations", status: "Active" },
];
const initialCategories: Category[] = [
  { id: 1, name: "Electronics", fields: "Warranty period, model", assets: 42 },
  { id: 2, name: "Furniture", fields: "Material, seating capacity", assets: 18 },
  { id: 3, name: "Vehicles", fields: "Registration, service date", assets: 6 },
];
const initialEmployees: Employee[] = [
  { id: 1, name: "Aarav Shah", email: "aarav@assetflow.io", department: "Operations", role: "Department Head", status: "Active" },
  { id: 2, name: "Meera Patel", email: "meera@assetflow.io", department: "Engineering", role: "Asset Manager", status: "Active" },
  { id: 3, name: "Riya Mehta", email: "riya@assetflow.io", department: "Engineering", role: "Employee", status: "Active" },
];

function StatusBadge({ value }: { value: "Active" | "Inactive" }) {
  return <Badge variant={value === "Active" ? "secondary" : "outline"}>{value}</Badge>;
}

export function OrganizationWorkspace() {
  const [departments, setDepartments] = useState(initialDepartments);
  const [categories, setCategories] = useState(initialCategories);
  const [employees, setEmployees] = useState(initialEmployees);
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();

  const filteredDepartments = useMemo(() => departments.filter((department) => department.name.toLowerCase().includes(normalizedQuery)), [departments, normalizedQuery]);
  const filteredCategories = useMemo(() => categories.filter((category) => category.name.toLowerCase().includes(normalizedQuery)), [categories, normalizedQuery]);
  const filteredEmployees = useMemo(() => employees.filter((employee) => `${employee.name} ${employee.email} ${employee.department}`.toLowerCase().includes(normalizedQuery)), [employees, normalizedQuery]);

  const addDepartment = () => {
    const name = window.prompt("Department name");
    if (name?.trim()) setDepartments((items) => [...items, { id: Date.now(), name: name.trim(), head: "Unassigned", parent: "—", status: "Active" }]);
  };
  const addCategory = () => {
    const name = window.prompt("Category name");
    if (name?.trim()) setCategories((items) => [...items, { id: Date.now(), name: name.trim(), fields: "No custom fields", assets: 0 }]);
  };
  const addEmployee = () => {
    const name = window.prompt("Employee name");
    if (name?.trim()) setEmployees((items) => [...items, { id: Date.now(), name: name.trim(), email: "pending@assetflow.io", department: "Unassigned", role: "Employee", status: "Active" }]);
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
        <SummaryCard icon={<Building2 />} label="Active departments" value={departments.filter((item) => item.status === "Active").length} description="Structured ownership and hierarchy" />
        <SummaryCard icon={<Layers3 />} label="Asset categories" value={categories.length} description="Flexible fields for every asset type" />
        <SummaryCard icon={<Users />} label="Active employees" value={employees.filter((item) => item.status === "Active").length} description="Roles assigned by administrators" />
      </div>

      <Tabs defaultValue="departments">
        <TabsList className="w-full justify-start overflow-x-auto sm:w-fit">
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="categories">Asset categories</TabsTrigger>
          <TabsTrigger value="employees">Employee directory</TabsTrigger>
        </TabsList>
        <TabsContent value="departments" className="mt-4"><DirectoryCard title="Department management" description="Create teams, assign department heads, and maintain reporting lines." action="Add department" onAction={addDepartment}><Table><TableHeader><TableRow><TableHead>Department</TableHead><TableHead>Department head</TableHead><TableHead>Parent department</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody>{filteredDepartments.map((item) => <TableRow key={item.id}><TableCell className="font-medium">{item.name}</TableCell><TableCell>{item.head}</TableCell><TableCell>{item.parent}</TableCell><TableCell><StatusBadge value={item.status} /></TableCell></TableRow>)}</TableBody></Table></DirectoryCard></TabsContent>
        <TabsContent value="categories" className="mt-4"><DirectoryCard title="Asset category management" description="Define reusable categories and their category-specific information." action="Add category" onAction={addCategory}><Table><TableHeader><TableRow><TableHead>Category</TableHead><TableHead>Category-specific fields</TableHead><TableHead className="text-right">Assets</TableHead></TableRow></TableHeader><TableBody>{filteredCategories.map((item) => <TableRow key={item.id}><TableCell className="font-medium">{item.name}</TableCell><TableCell>{item.fields}</TableCell><TableCell className="text-right">{item.assets}</TableCell></TableRow>)}</TableBody></Table></DirectoryCard></TabsContent>
        <TabsContent value="employees" className="mt-4"><DirectoryCard title="Employee directory" description="New accounts are employees by default. Only an admin can promote a role here." action="Add employee" onAction={addEmployee}><Table><TableHeader><TableRow><TableHead>Employee</TableHead><TableHead>Department</TableHead><TableHead>Role</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody>{filteredEmployees.map((item) => <TableRow key={item.id}><TableCell><p className="font-medium">{item.name}</p><p className="text-xs text-muted-foreground">{item.email}</p></TableCell><TableCell>{item.department}</TableCell><TableCell><Badge variant={item.role === "Employee" ? "outline" : "secondary"}>{item.role}</Badge></TableCell><TableCell><StatusBadge value={item.status} /></TableCell></TableRow>)}</TableBody></Table></DirectoryCard></TabsContent>
      </Tabs>
    </section>
  );
}

function SummaryCard({ icon, label, value, description }: { icon: React.ReactNode; label: string; value: number; description: string }) {
  return <Card><CardHeader><CardDescription className="flex items-center gap-2">{icon}{label}</CardDescription><CardTitle className="text-3xl">{value}</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">{description}</CardContent></Card>;
}

function DirectoryCard({ title, description, action, onAction, children }: { title: string; description: string; action: string; onAction: () => void; children: React.ReactNode }) {
  return <Card><CardHeader className="gap-3 sm:flex sm:flex-row sm:items-start sm:justify-between"><div><CardTitle>{title}</CardTitle><CardDescription>{description}</CardDescription></div><Button onClick={onAction}><Plus />{action}</Button></CardHeader><CardContent>{children}</CardContent></Card>;
}
