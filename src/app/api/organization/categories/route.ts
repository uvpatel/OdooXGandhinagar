import { NextResponse } from "next/server";
import { requireApiEmployee } from "@/server/auth";
import { apiError } from "@/server/http";
<<<<<<< HEAD
import { createAssetCategory } from "@/server/services/organization";

export async function POST(request: Request) {
  try {
    const employee = await requireApiEmployee(request, ["admin"]);
    return NextResponse.json({ data: await createAssetCategory(await request.json(), employee.id) }, { status: 201 });
  } catch (error) { return apiError(error); }
=======
import { db } from "@/index";
import { assetCategories } from "@/db/schema";

export async function POST(request: Request) {
  try {
    await requireApiEmployee(request, ["admin"]);
    const body = await request.json();

    if (!body.name || typeof body.name !== "string") {
      return NextResponse.json({ error: "Invalid or missing category name" }, { status: 400 });
    }

    const [category] = await db
      .insert(assetCategories)
      .values({ name: body.name })
      .returning();

    return NextResponse.json({ data: category }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
>>>>>>> be5363df8834695bafc6c882f13ccacf9a903af4
}
