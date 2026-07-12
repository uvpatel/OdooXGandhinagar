import "dotenv/config";
import { db, assertDatabaseConfigured } from "@/index";
import { assets, assetCategories, departments, employees, resources, user } from "@/db/schema";

const ids = {
  operations: "00000000-0000-4000-8000-000000000001",
  engineering: "00000000-0000-4000-8000-000000000002",
  electronics: "00000000-0000-4000-8000-000000000011",
  furniture: "00000000-0000-4000-8000-000000000012",
  adminEmployee: "00000000-0000-4000-8000-000000000021",
  managerEmployee: "00000000-0000-4000-8000-000000000022",
  laptop: "00000000-0000-4000-8000-000000000031",
  monitor: "00000000-0000-4000-8000-000000000032",
  meetingRoom: "00000000-0000-4000-8000-000000000041",
};

async function seed() {
  assertDatabaseConfigured();

  await db.insert(user).values([
    { id: "seed-admin", name: "Aarav Shah", email: "admin@assetflow.demo", emailVerified: true },
    { id: "seed-manager", name: "Meera Patel", email: "manager@assetflow.demo", emailVerified: true },
  ]).onConflictDoNothing({ target: user.id });

  await db.insert(departments).values([
    { id: ids.operations, name: "Operations", status: "active" },
    { id: ids.engineering, name: "Engineering", parentDepartmentId: ids.operations, status: "active" },
  ]).onConflictDoNothing({ target: departments.name });

  await db.insert(employees).values([
    { id: ids.adminEmployee, userId: "seed-admin", name: "Aarav Shah", email: "admin@assetflow.demo", departmentId: ids.operations, role: "admin" },
    { id: ids.managerEmployee, userId: "seed-manager", name: "Meera Patel", email: "manager@assetflow.demo", departmentId: ids.engineering, role: "asset_manager" },
  ]).onConflictDoNothing({ target: employees.userId });

  await db.insert(assetCategories).values([
    { id: ids.electronics, name: "Electronics", extraFieldsSchema: { warrantyPeriodMonths: "number", model: "string" } },
    { id: ids.furniture, name: "Furniture", extraFieldsSchema: { material: "string" } },
  ]).onConflictDoNothing({ target: assetCategories.name });

  await db.insert(assets).values([
    { id: ids.laptop, assetTag: "AF-0001", name: "MacBook Pro 14", categoryId: ids.electronics, serialNumber: "MBP-DEMO-001", acquisitionDate: "2026-01-15", acquisitionCost: "1799.00", condition: "good", location: "Engineering", status: "available", departmentId: ids.engineering, qrCodeValue: "AF-0001", isBookable: false },
    { id: ids.monitor, assetTag: "AF-0002", name: "Dell 27-inch Monitor", categoryId: ids.electronics, serialNumber: "DELL-DEMO-002", acquisitionDate: "2025-11-02", acquisitionCost: "420.00", condition: "good", location: "Operations", status: "available", departmentId: ids.operations, qrCodeValue: "AF-0002", isBookable: true },
  ]).onConflictDoNothing({ target: assets.assetTag });

  await db.insert(resources).values({ id: ids.meetingRoom, name: "Meeting Room B2", type: "room", location: "Floor 2" }).onConflictDoNothing({ target: resources.id });

  console.log("AssetFlow demo data seeded successfully.");
}

seed().catch((error: unknown) => {
  console.error("Unable to seed AssetFlow demo data:", error);
  process.exitCode = 1;
});
