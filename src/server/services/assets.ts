import { count, desc, eq } from "drizzle-orm";
import { db } from "@/index";
import { assets, assetCategories, departments, allocations, resources } from "@/db/schema";
import { createAssetSchema } from "@/lib/validations/assets";
import { DomainError } from "@/server/http";
import { logActivity } from "./activity";

export async function listAssets(employee: { id: string; role: string; departmentId: string | null }, catalog: boolean = false) {
  let query = db.select({ 
    id: assets.id, assetTag: assets.assetTag, name: assets.name, 
    serialNumber: assets.serialNumber, status: assets.status, condition: assets.condition, 
    location: assets.location, isBookable: assets.isBookable, 
    categoryName: assetCategories.name, departmentName: departments.name 
  }).from(assets)
  .innerJoin(assetCategories, eq(assets.categoryId, assetCategories.id))
  .leftJoin(departments, eq(assets.departmentId, departments.id))
  .$dynamic();

  if (catalog) {
    query = query.where(eq(assets.status, "available"));
  } else if (employee.role === "employee") {
    // Only assets allocated to the employee
    query = query.innerJoin(allocations, eq(assets.id, allocations.assetId))
      .where(eq(allocations.employeeId, employee.id));
  } else if (employee.role === "department_head") {
    // Only assets allocated to the department (either by departmentId or employee in department)
    query = query.leftJoin(allocations, eq(assets.id, allocations.assetId))
      .where(eq(assets.departmentId, employee.departmentId!));
  }
  
  return query.orderBy(desc(assets.createdAt));
}

export async function createAsset(input: unknown, actorEmployeeId: string) {
  const parsed = createAssetSchema.safeParse(input);
  if (!parsed.success) throw new DomainError("INVALID_INPUT", "Please provide valid asset details.", { fields: parsed.error.flatten().fieldErrors });
  const [{ total }] = await db.select({ total: count() }).from(assets);
  const assetTag = `AF-${String(Number(total) + 1).padStart(4, "0")}`;
  const [asset] = await db.insert(assets).values({ ...parsed.data, assetTag, qrCodeValue: assetTag }).returning();
  
  if (asset.isBookable) {
    const [category] = await db.select({ name: assetCategories.name }).from(assetCategories).where(eq(assetCategories.id, asset.categoryId)).limit(1);
    await db.insert(resources).values({
      assetId: asset.id,
      name: asset.name,
      type: category ? category.name : "Asset",
      location: asset.location
    });
  }

  await logActivity(actorEmployeeId, "asset.created", "asset", asset.id, { assetTag });
  return asset;
}
