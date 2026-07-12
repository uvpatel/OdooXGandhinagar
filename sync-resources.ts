import { eq } from "drizzle-orm";
import { db } from "./src/index";
import { assets, assetCategories, resources } from "./src/db/schema";

async function main() {
  const bookableAssets = await db.select().from(assets).where(eq(assets.isBookable, true));
  console.log(`Found ${bookableAssets.length} bookable assets.`);
  for (const asset of bookableAssets) {
    const existing = await db.select().from(resources).where(eq(resources.assetId, asset.id));
    if (existing.length === 0) {
      const [cat] = await db.select().from(assetCategories).where(eq(assetCategories.id, asset.categoryId));
      await db.insert(resources).values({
        assetId: asset.id,
        name: asset.name,
        type: cat ? cat.name : "Asset",
        location: asset.location
      });
      console.log(`Synced ${asset.name}`);
    }
  }
  console.log("Done syncing resources!");
}

main().catch(console.error).then(() => process.exit(0));
