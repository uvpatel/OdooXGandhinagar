import { NextResponse } from "next/server";
import { requireApiEmployee } from "@/server/auth";
import { apiError } from "@/server/http";
import { createBooking, listBookings } from "@/server/services/bookings";

export async function GET(request: Request) { try { await requireApiEmployee(request); return NextResponse.json({ data: await listBookings() }); } catch (error) { return apiError(error); } }
export async function POST(request: Request) { try { const employee = await requireApiEmployee(request); return NextResponse.json({ data: await createBooking(await request.json(), employee.id) }, { status: 201 }); } catch (error) { return apiError(error); } }
