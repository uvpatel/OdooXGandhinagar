import { count, desc, eq } from "drizzle-orm";
import { db } from "@/index";
import { assets, assetCategories, departments } from "@/db/schema";
import { createAssetSchema } from "@/lib/validations/assets";
import { DomainError } from "@/server/http";
import { logActivity } from "./activity";

export async function listAssets() {
  return db.select({ id: assets.id, assetTag: assets.assetTag, name: assets.name, serialNumber: assets.serialNumber, status: assets.status, condition: assets.condition, location: assets.location, isBookable: assets.isBookable, categoryName: assetCategories.name, departmentName: departments.name }).from(assets).innerJoin(assetCategories, eq(assets.categoryId, assetCategories.id)).leftJoin(departments, eq(assets.departmentId, departments.id)).orderBy(desc(assets.createdAt));
}

export async function createAsset(input: unknown, actorEmployeeId: string) {
  const parsed = createAssetSchema.safeParse(input);
  if (!parsed.success) throw new DomainError("INVALID_INPUT", "Please provide valid asset details.", { fields: parsed.error.flatten().fieldErrors });
  const [{ total }] = await db.select({ total: count() }).from(assets);
  const assetTag = `AF-${String(Number(total) + 1).padStart(4, "0")}`;
  const [asset] = await db.insert(assets).values({ ...parsed.data, assetTag, qrCodeValue: assetTag }).returning();
  await logActivity(actorEmployeeId, "asset.created", "asset", asset.id, { assetTag });
  return asset;
}
