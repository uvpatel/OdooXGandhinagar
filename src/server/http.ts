import { NextResponse } from "next/server";

export class DomainError extends Error {
  constructor(public readonly code: string, message: string, public readonly details?: Record<string, unknown>) {
    super(message);
  }
}

export function apiError(error: unknown) {
  if (error instanceof DomainError) return NextResponse.json({ error: error.message, code: error.code, details: error.details }, { status: error.code === "FORBIDDEN" ? 403 : error.code === "UNAUTHORIZED" ? 401 : 409 });
  console.error(error);
  return NextResponse.json({ error: "Unable to complete this request." }, { status: 500 });
}
