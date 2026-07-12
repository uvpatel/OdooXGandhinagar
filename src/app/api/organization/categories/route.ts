import { NextResponse } from "next/server";
import { requireApiEmployee } from "@/server/auth";
import { apiError } from "@/server/http";
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
}
